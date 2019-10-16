//emit QueryEvent(_deviceID,now,msg.sender,identifier);  //callbackAddress means the contract who call QueryRegistry
"use strict";
const fs = require('fs');
const request = require('request');
const config = require('../../configs/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);

module.exports = async function listenQueryEvent() {
    let QueryRegistry_Abi = config.QueryRegistry.abi;
    //取得目前geth中第一個account
    let QueryRegistry_Address = fs.readFileSync('./QueryRegistry_Address.txt').toString();
    console.log(`QueryRegistry_Address:${QueryRegistry_Address}`)
    let QueryRegistry = new web3.eth.Contract(QueryRegistry_Abi, QueryRegistry_Address);

    QueryRegistry.events.QueryEvent({})
        .on('data', function (event) {
            let result = {};
            result.deviceID = event.returnValues.deviceID;
            result.timestamp = event.returnValues.timestamp;
            result.identifier = event.returnValues.identifier;
            let result_event = JSON.stringify(result);
            fs.writeFileSync('./queryEventListen.json', result_event);
            console.log(`成功監聽到QueryRegistry event\n`);
            console.log(result);

            console.log(`執行callback函數\n`);
            result.callbackData = `callbackDataTest`
            request.post({
                url: "http://localhost:3002/oei/callback",
                body: result,
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

    return `start listen event/responsed from IOT Device`


};
