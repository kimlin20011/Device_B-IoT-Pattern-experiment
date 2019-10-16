const config = require('../../configs/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const fs = require("fs");
//let message_content = web3.utils.utf8ToHex(`I love Percom Lab${i++}`);

//let publicKey = '0x046e967f41300036d128899d9a897598f1bac66738febf199e2a803f5450a9664a4e1ba6766a54ce54eb08cf97f28c93a21ea53fb123ac1fa7513d4c2132505ed5';
module.exports =  function post_whisper(data) {
    let publicKey = fs.readFileSync('./Edge_publicKey.txt').toString();
    let message_content = web3.utils.utf8ToHex(data.msg);
    return new Promise((resolve, reject) => {
        web3.shh.post({
            pubKey: publicKey,
            ttl: 10,
            payload: message_content,
            powTime: 3,
            powTarget: 0.5
        });
        resolve(`向Edge發出${data.msg}`);
    })
};
/*setInterval(function(){web3.shh.post({
    pubKey: publicKey,
    ttl: 10,
    //payload: message_content,
    payload: web3.utils.utf8ToHex(`I love Percom Lab${i++}`),
    powTime: 3,
    powTarget: 0.5
})},1000);*/