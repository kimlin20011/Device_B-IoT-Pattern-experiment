//emit QueryEvent(_deviceID,now,msg.sender,identifier);  //callbackAddress means the contract who call QueryRegistry
"use strict";
//const fs = require('fs');
const request = require('request');
const config = require('../../configs/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);

module.exports = async function listenQueryEvent(data) {
    let result = {};
    result.signature = data.signature;
    result.topic = data.topic;
    let timestamp = Date.now();
    let str = `${timestamp}\n`;
    try {
        fs.appendFile(`./logs/${data.csvName}.csv`, str, function (err) {
            if (err) throw err;
            console.log(`${data.csvName} Log Saved!`);
        });
    } catch (e) {
        console.log(e);
        fs.writeFileSync(`./logs/${data.csvName}.csv`, str, (err) => { console.log(err); });
    }

    for (let i = 0; i < data.queryTime; i++) {
        request.post({
            url: "http://localhost:3002/odp/updateData",
            body: result,
            json: true,
        }, function (err, httpResponse, body) {
            if (err) {
                console.error(err);
            } else {
                console.log(body);
            }
        });
    }

    return `start dissminate data by device`
};
