"use strict";
const fs = require('fs');
const config = require('../../configs/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
//const unlockAccount = require('../unlock');

module.exports = async function updateData(data) {
    let Observer_Abi = config.Observer.abi;
    //取得目前geth中第一個account
    //let password = config.geth.password;
    let Observer_Address = fs.readFileSync('./Observer_Address.txt').toString();
    //let Observer_Address = config.Observer.address;
    let Observer = new web3.eth.Contract(Observer_Abi, Observer_Address);

    //取得目前geth中第一個account
    let nowAccount = config.geth.account;
    /*let nowAccount = "";
    await web3.eth.getAccounts((err, res) => { nowAccount = res[0] });*/
    // 解鎖


    return new Promise((resolve, reject) => {
        //console.log(data);
        let result = {};
        Observer.methods
            .updateData(data.topic, data.signature)
            .send({
                from: nowAccount,
                gas: 3000000
            })
            .on("receipt", function (receipt) {
                result.signature = receipt.events.updateEvent.returnValues.signature;
                result.status = true;
                //console.log(result)
                //let result_event = JSON.stringify(result);
                //fs.writeFileSync('./callbackResult.json', result_event);
                //console.log(`callback交易成功`)
                resolve(result);
            })
            .on("error", function (error) {
                result.info = `智能合約updateData操作失敗`;
                result.error = error.toString();
                result.status = false;
                reject(result);
            });
    });
};
