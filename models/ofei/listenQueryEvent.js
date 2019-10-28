"use strict";
const fs = require('fs');
const config = require('../../configs/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const request = require('request');

module.exports = async function listenQueryEvent() {
    let OFEI_QueryRegistry_Abi = config.OFEI_QueryRegistry.abi;
    //取得目前geth中第一個account
    let OFEI_QueryRegistry_Address = fs.readFileSync('./OFEI_QueryRegistry_Address.txt').toString();
    let OFEI_QueryRegistry = new web3.eth.Contract(OFEI_QueryRegistry_Abi, OFEI_QueryRegistry_Address);
    let i = 0 ;


    OFEI_QueryRegistry.events.offchainQueryInfo({})
        .on('data', function (event) {
            //let result = {};
            //result = event.returnValues;
            //fs.writeFileSync('./Edge_publicKey.txt', event.returnValues.whisperPK);
            console.log(`成功監聽到offchainQueryInfo\nwhisperPK:${event.returnValues.whisperPK}\n向Edge發出whisper`);
            let info ={};
            info.whisperPK= event.returnValues.whisperPK;
            info.msg = `${event.returnValues.queryTopic}`;
            request.post({
                url: "http://localhost:3002/ofei/dataCallbackByWhisper",
                body: info,
                json: true,
            }, function (err, httpResponse, body) {
                if (err) {
                    console.error(err)
                } else {
                    console.log(body);

                }
            });
        })
        .on('error', function (error) {
            let result = {};
            result.info = `智能合約事件監聽操作失敗`;
            result.error = error.toString();
            result.status = false;
            console.log(result);
        });

    return `start listen offchainQueryInfo event/responsed from Edge server`;
};
