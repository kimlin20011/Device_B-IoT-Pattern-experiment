# 區塊鏈感測資料匯集樣式實驗測試

* 程式碼部分
    * Edge: https://github.com/kimlin20011/B-IoT-Pattern-experiment
    * IoT: https://github.com/kimlin20011/Device_B-IoT-Pattern-experiment

## 時程
* ~~先把實驗環境實作出來(OEI-OFEI-ODP)~~
* 按照-響應時間/memory/記憶體只順序做（畫圖）
* 論述安全性部分

## 下一個步驟
* OEI測試（順序）
    * memory
    * 話OEI-OFEI比較圖

## 宣稱部分
* 宣稱部分
    * 吞吐量 
        * 每筆匯集資料的時間驗證
    * 資源消耗
        * PID：資料匯集過程中，memory的消耗量
        * [PID測試模組](https://github.com/soyuka/pidusage?fbclid=IwAR0UkAYORqBGfxZ72OPglPSrZjfIShFy3PGqZz0ufXdIYkay6MGo3ui9eZE)
        * 安全性
            * 以CIA論述

![](https://i.imgur.com/umj5AfA.png)


## 實作
## 測試模組
* response time
    * 30次/100次/500次
    * Edge： experiments/oei_ReponseTime.js
## API
### OEI API呼叫順序
* Edge
    * deploy QueryRegistry contract
    * deploy Authorization contract 
    * listenCallbackEvent
* Device
    * 更改新的contract address
    * listenQueryEvent(監聽到Event後自動發出callback API)

### OFEI API呼叫順序
* Edge
    * deploy QueryRegistry contract
    * whisperSubscribe
* Device
    * 更改新的contract address
    * listenQueryEvent
* Edge
    * queryData（Device監聽到Event後自動）

### Edge端

#### OEI部分
##### API(1)-deploy QueryRegistry contract
>HTTP Method: POST 
>URL:http://localhost:3001/oei/deployQueryRegistry 

##### API(2)-deploy Authorization contract 
>HTTP Method: POST 
>URL:http://localhost:3001/oei/deployConsumer 

##### API(3)-listenCallbackEvent
>部署完成先做這步，監聽是否有來自Device端的callback資料
>
>HTTP Method: GET 
>URL:http://localhost:3001/oei/listenCallbackEvent 


##### API(4)- addVaildDevice
* 增加有權修改或新增QueryRegistry中感測資料的device address

>HTTP Method: POST 
>URL:http://localhost:3001/oei/addVaildDevice
>>Body(x-www-form-urlencoded): 
>>>deviceAddress: string


##### API(5)- queryData
>edge向device要求匯集資料
>
>HTTP Method: POST 
>URL:http://localhost:3001/oei/queryData
>>Body(x-www-form-urlencoded): 
>>>deviceID: string

#### OEI部分實驗

##### API(1)-listenCallbackEvent_PID
>部署完成先做這步，監聽是否有來自Device端的callback資料
>
>HTTP Method: GET 
>URL:http://localhost:3001/oei/listenCallbackEvent_PID 

##### API(2)- queryData_PID
>edge向device要求匯集資料
>
>HTTP Method: POST 
>URL:http://localhost:3001/oei/queryData_PID
>>Body(x-www-form-urlencoded): 
>>>deviceID: string

#### OFEI部分
##### API(1)-deploy QueryRegistry contract
* 部署合約
>HTTP Method: POST 
>URL:http://localhost:3001/ofei/deployQueryRegistry


##### API(2)-whisperSubscribe
* 先產生whisper keypair，並開始監聽whisper信息
>HTTP Method: GET 
>URL:http://localhost:3001/ofei/whisperSubscribe


##### API(3)-queryData
* Edge向Device發出感測資料呼叫請求，並將whisper 公鑰同時送上合約儲存
>HTTP Method: POST 
>URL:http://localhost:3001/ofei/queryData
>>Body(x-www-form-urlencoded):   
>>>deviceID: uint
>>>queryTopic：string


### deivce端
#### OEI
##### API(1)-listenQueryEvent
* 部署完成先做這步，監聽是否有來自Edge端的資料請求
>
>HTTP Method: GET 
>URL:http://localhost:3002/oei/listenQueryEvent 

##### API(2)-callback 
* 監聽到資料請求後，收集資料，並回傳
>
>HTTP Method: POST 
>URL:http://localhost:3002/oei/callback 


#### OFEI部分
##### API(1)-deploy QueryRegistry contract
* 在Device部署合約
>HTTP Method: POST 
>URL:http://localhost:3002/ofei/deployQueryRegistry


##### API(2)-listenQueryEvent
* 監聽智能合約query event，若有監聽到event則開始收集感測資料，並呼叫dataCallbackByWhisper API 透過whisper回傳message
>HTTP Method: GET 
>URL:http://localhost:3002/ofei/listenQueryEvent

##### API(3)-dataCallbackByWhisper
* 這個API不需要使用者來呼叫，實作利用whisper協議回傳訊息
>HTTP Method: POST 
>URL:http://localhost:3002/ofei/dataCallbackByWhisper
>>Body(x-www-form-urlencoded):   
>>>msg: string



#### autocannon嘗試
```shell=
autocannon -c 100 -d 5 -p 2  -b [deviceID:123] -m 'POST' http://localhost:3001/oei/queryData
```


## feeback
* ++
    * 要有實驗根據
* 大部分情況的寫法不太精確
* 私密性：
    * 可以用講的論述
* 安全性
    * 用論述的分析（質性分析）
    * CIA
    * C（機密性）：
        * OEI：
            * 透過智能合約中存取機制的設計，防止非授權節點請求資料存取
        * ODP
            * 無法保證所發出的資訊由誰所接受，適合傳公開的資料
        * OFEI
    * I（完整性）：
        * 由於提出的設計模式存取請求皆以智能合約為媒介，故在合約請求接受的過程中，加入時間戳可以有效防止重放攻擊，確保資料的完整性
        * OEI：
            * 透過鏈上交易可以確保所有交易過程中的資料被記錄下來，並且不受竄改。
            * OEI中所有傳輸皆透過鏈上傳輸，故能高度確保資料與傳輸過程中的完整性
            * 由於交易由本地客戶端直接向區塊鏈網路發出，故可以防止機密或加密資料在傳輸過程中被監聽
        
        * ODP：
            * 同OEI，可以確保歷史資料的正確性
        * OFEI：
            * 區塊鏈不會儲存歷史資料
            * 透過公開金鑰加密的技術(以太坊中whisper)，防止中間人（MITM）等攻擊，並驗證資料傳送者的身分
    * A（可用性）：
        * OEI：
            * 在參與區塊鏈驗證的節點數量足夠的情況下，單一節點失敗不易影響這個系統存取感測資料的可用性
        * ODP
            * 同OEI
        * OFEI:
            * 若發生單一節點失敗，或是鏈外加密金鑰的遺失，可能造成服務或資料無法存取
    * 每一種宣稱能不能反應差別？
* 資源消耗
    * 網路消耗量：偵測網路頻寬，可以估計他發了多少網路封包
    * 量memory
        * memory不代表全部的資源
        * 可以用[PID模組](https://github.com/soyuka/pidusage?fbclid=IwAR0UkAYORqBGfxZ72OPglPSrZjfIShFy3PGqZz0ufXdIYkay6MGo3ui9eZE)
    * 用作業系統呼叫量時間（linux）
        * strace —T
        * 把system call列出來
        * perf stat <檔案>
    * node有模組可以直接取CPU usage
    * 吞吐量工具
        * request per minute
        * 沒用相對工具
        * 可以用koa做(很好用)
            * 工具：[autocannon](https://github.com/mcollina/autocannon)
                * [使用方法簡介文章](https://juejin.im/post/5b827cbbe51d4538c021f2da)
                * [使用方法簡介文章2](https://zhuanlan.zhihu.com/p/72597640)
    * 響應時間
        * response time
        * 可以用koa做
        * [response-time](https://github.com/koajs/response-time)
        * [request-received](https://github.com/cabinjs/request-received)
    * gas consume
        * [eth-gas-reporter](https://www.npmjs.com/package/eth-gas-reporter)
* 其他工具
    * [node-clinic](https://github.com/nearform/node-clinic)
        * node.js性能问题的诊断工具，可以生成CPU、内存使用、事件循环（Event loop)延时和活跃


## 吞吐量量測試
* 場景分為3個
    * Device與Edge皆部署區塊鏈節點(或輕節點)
    * Edge部署區塊鏈節點，Device未部署區塊鏈節點(透過raw transaction)
    * Device與Edge皆未部署節點，透過Http或MQTT實作傳輸機制
* 驗證pattern
    * OEI
    * OFEI
* 實證環境
    * ethereum-Geth
    * 1台樹莓派？
        * Edge向樹莓派同時發10個資料請求
    * 2台I7主機作為edge
        * Edge開3個執行緒挖礦
    * Raspberry Pi 3B+
* 測試方法
    * 測試向Edge透過智能合約向Device發出交易請求(每次實驗測試不同的請求量)，到收到Http response之時間。
    * 最後以表格比較其優缺點
* 實驗證明目標
    * ==OFEI處理的時間OEI來得快、傳統的傳輸機制教OFEI來的快。==



### 參考資料
* [PID測試模組](https://github.com/soyuka/pidusage?fbclid=IwAR0UkAYORqBGfxZ72OPglPSrZjfIShFy3PGqZz0ufXdIYkay6MGo3ui9eZE)
* [[軟體效能測試] 什麼是效能測試](https://kojenchieh.pixnet.net/blog/post/463740968-%5B%E8%BB%9F%E9%AB%94%E6%95%88%E8%83%BD%E6%B8%AC%E8%A9%A6%5D-%E4%BB%80%E9%BA%BC%E6%98%AF%E6%95%88%E8%83%BD%E6%B8%AC%E8%A9%A6)
* [匯出CSV](https://dotblogs.com.tw/shihgogo/2017/05/31/090831)
* [如何測精確的發送時間](https://jj09.net/properly-measuring-http-request-time-with-node-js/)

* [測來回時間](https://stackoverflow.com/questions/29036313/node-js-measure-response-time-with-multiple-requests)
* [excel中以vlookup合併儲存格](https://support.office.com/zh-hk/article/%E6%88%91%E8%A6%81%E5%A6%82%E4%BD%95%E5%90%88%E4%BD%B5%E5%85%A9%E5%80%8B%E4%BB%A5%E4%B8%8A%E7%9A%84%E8%A1%A8%E6%A0%BC%EF%BC%9F-c80a9fce-c1ab-4425-bb96-497dd906d656)
    * ex：查詢id = a 的響應時間

```
=VLOOKUP(B1,$M$1:$O$5,2,FALSE)
```

* [node process memoryUsage](http://nodejs.cn/api/process.html#process_process_memoryusage)
        

###### tags: `區塊鏈物聯網研究`