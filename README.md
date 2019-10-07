# 區塊鏈感測資料匯集樣式實驗測試

> 程式碼部分
>> Edge:https://github.com/kimlin20011/B-IoT-Pattern-experiment
>> IoT:https://github.com/kimlin20011/Device_B-IoT-Pattern-experiment

## 時程
* 先把實驗環境實作出來(OEI-OFEI-ODP)
* 按照-吞吐量/響應時間/memory與記憶體只順序做

## 下一個步驟
* 先把OEI callback回傳部分實作完成
* OEI測試（順序）
    * throughput
    * response time
    * memory

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


## 實作API


## API

### Edge端
#### API(1)-deploy QueryRegistry contract
>HTTP Method: POST 
>URL:http://localhost:3001/oei/deployQueryRegistry 

#### API(2)-deploy Authorization contract 
>HTTP Method: POST 
>URL:http://localhost:3001/oei/deployConsumer 

#### API(3)- queryData
>edge向device要求匯集資料
>
>HTTP Method: POST 
>URL:http://localhost:3001/oei/queryData
>>Body(x-www-form-urlencoded):   
>>>deviceID: string


### deivce端
#### API(1)-listenQueryEvent
>部署完成先做這步，監聽是否有來自Edge端的資料請求
>
>HTTP Method: GET 
>URL:http://localhost:3002/oei/listenQueryEvent 

#### API(2)-callback 
>監聽到資料請求後，收集資料，並回傳
>
>HTTP Method: POST 
>URL:http://localhost:3002/oei/callback 


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

        

###### tags: `區塊鏈物聯網研究`