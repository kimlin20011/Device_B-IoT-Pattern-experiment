//solcjs -o ../migrates --bin --abi ofei.sol
pragma solidity ^0.5.2; 
contract QueryRegistry{
    
    uint nonce; 
    
    struct QueryInfo{ 
        uint deviceID;
        string whisperPK; 
        string queryTopic; 
        uint timestamp; 
        bool queryState;
    }
    
    mapping(bytes32 => QueryInfo) queryInfo;
    event offchainQueryInfo(uint indexed deviceID,string queryTopic,string whisperPK,uint timestamp,bytes32 identifier);
    event deleteQuery(bytes32 identifier, uint timestamp);

    //Registry new off-chain query request by Edge server.
    function offchainQueryRegistry(uint _deviceID,string memory _queryTopic,string memory _whisperPK) public{
        nonce++;
        if (nonce == 10000) {
            nonce = 0;
        }
        bytes32 identifier = (keccak256(abi.encodePacked(now, msg.sender, _deviceID , nonce))); 
        QueryInfo storage q = queryInfo[identifier]; 
        q.deviceID=_deviceID; 
        q.whisperPK=_whisperPK; 
        q.queryTopic=_queryTopic; 
        q.timestamp =now;
        q.queryState=true;
        emit offchainQueryInfo(q.deviceID,q.queryTopic, q.whisperPK,q.timestamp,identifier);
    }
    
    //End the query request by Edge server
    function endQuery(bytes32 _identifier) public{
        require(queryInfo[_identifier].queryState==true,"There are no matching request");
        delete queryInfo[_identifier]; 
        emit deleteQuery(_identifier,now);
    }
}