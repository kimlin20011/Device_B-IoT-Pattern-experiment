"use strict";
//const fs = require('fs');
const config = require('../../configs/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const unlockAccount = require('../unlock');

module.exports = async function callback(data) {
    let QueryRegistry_Abi = config.QueryRegistry.abi;
    //取得目前geth中第一個account
    //let password = config.geth.password;
    //let QueryRegistry_Address = fs.readFileSync('./QueryRegistry_Address.txt').toString();
    let QueryRegistry_Address = config.QueryRegistry.address;
    let QueryRegistry = new web3.eth.Contract(QueryRegistry_Abi, QueryRegistry_Address);

    //取得目前geth中第一個account
    let nowAccount = config.geth.account;
    /*let nowAccount = "";
    await web3.eth.getAccounts((err, res) => { nowAccount = res[0] });*/
    // 解鎖


    return new Promise((resolve, reject) => {
        //console.log(data);
        let result = {};
        

        QueryRegistry.methods
            .callback(`index${data.callbackData}`, data.identifier)
            .send({
                from: nowAccount,
                gas: 3000000
            })
            .on("receipt", function (receipt) {
                result = receipt.events.UploadEvent.returnValues;
                result.status = true;
                let result_event = JSON.stringify(result);
                //fs.writeFileSync('./callbackResult.json', result_event);
                //console.log(`callback交易成功`)
                resolve(result);
            })
            .on("error", function (error) {
                result.info = `智能合約callback操作失敗`;
                result.error = error.toString();
                result.status = false;
                reject(result);
            });
    });
};
