"use strict";
const fs = require('fs');
const config = require('../../configs/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const unlockAccount = require('../unlock');

module.exports = async function deploy_Consumer_contract() {
    let Consumer_Bytecode = config.Consumer.bytecode;
    let Consumer_Abi = config.Consumer.abi;
    let QueryRegistry_Address = fs.readFileSync('./QueryRegistry_Address.txt').toString();
    let Consumer = new web3.eth.Contract(Consumer_Abi);

    //取得目前geth中第一個account
    let nowAccount = "";
    await web3.eth.getAccounts((err, res) => { nowAccount = res[0] });

    let password = config.geth.password;
    let RM = new web3.eth.Contract(Consumer_Abi);

    // 解鎖
    let unlock = await unlockAccount(nowAccount, password);
    if (!unlock) {
        console.log(`not unlock`);
        return;
    }

    return new Promise((resolve, reject) => {
        let result = {};
        Consumer
            .deploy({
                data: Consumer_Bytecode,
                arguments: [QueryRegistry_Address],
            })
            .send({
                from: nowAccount,
                gas: 6000000
            })
            .on('error', function (error) {
                result.info = error;
                result.status = false;
                reject(result);
            })
            .on("receipt", function (receipt) {
                console.log(receipt);
                // 更新合約介面
                let Consumer_Address = receipt.contractAddress;
                result.status = true;
                result.address = Consumer_Address;
                //將新生成的RM地址寫進.txt檔案
                fs.writeFileSync('./Consumer_Address.txt', result.address);
                resolve(result);
            })
    });

};

