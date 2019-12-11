"use strict";
const fs = require('fs');
const pidusage = require('pidusage')

let logging = false;
let interval;
let koa_pid= process.pid;


//data.gethPID
//data.csvName
module.exports = async function getPIDusage(data) {
    let geth_pid= data.gethPID;
    let index = 0;
    console.log(`koa_pid:${koa_pid}\ngeth_pid:${geth_pid}`)
    if (!logging) {
        logging = true;
        console.log(`Start logging pidusage!!`);
        interval = setInterval(function () {
            pidusage([koa_pid, geth_pid], function (err, stats) {

                // => {
                //   cpu: 10.0,            // percentage (from 0 to 100*vcore)
                //   memory: 357306368,    // bytes
                //   ppid: 312,            // PPID
                //   pid: 727,             // PID
                //   ctime: 867000,        // ms user + system time
                //   elapsed: 6650000,     // ms since the start of the process
                //   timestamp: 864000000  // ms since epoch
                // }
                console.log(stats)
                //let timestamp = Date.now();
                let str = `${index},${stats[`${koa_pid}`].memory},${stats[`${koa_pid}`].cpu},${stats[`${geth_pid}`].memory},${stats[`${geth_pid}`].cpu},${stats[`${koa_pid}`].timestamp}\n`
                index++;
                try {
                    fs.appendFile(`./logs/PIG_usage_${data.csvName}.csv`, str, function (err) {
                        if (err) throw err;
                        console.log('PIDusage Log Saved!');
                    });
                } catch (e) {
                    console.log(e);
                    fs.writeFileSync(`./logs/PIG_usage_${data.csvName}.csv`, str, (err) => { console.log(err); });
                }
            })
        }, 500)
        return `start get pidusage`;
    } else {
        logging = false;
        clearInterval(interval);
        console.log(`Stop logging pidusage!!`);
        return `stop get pidusage`;
    }
    //return `change get pidusage state`;
}