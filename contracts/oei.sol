//solcjs -o ../migrates --bin --abi oei.sol
pragma solidity ^0.5.2;
contract QueryRegistry {
    uint nonce;
    event QueryEvent(uint indexed deviceID,uint timestamp,address callbackAddress, bytes32 identifier);

    function query(uint _deviceID, address _invokeAddress) public returns(bytes32){
        nonce++;
        if (nonce == 10000) {
        nonce = 0;
        }
        bytes32 identifier = (keccak256(abi.encodePacked(now, _invokeAddress, _deviceID , nonce))); 
        emit QueryEvent(_deviceID,now,msg.sender,identifier);  //callbackAddress means the contract who call QueryRegistry
        return identifier;
    }
}

contract Consumer{
    address public queryRegistryAddress;
    
    event UploadEvent(string data,uint callbackTimestamp, bytes32 identifier);
    event _query(bytes32 identifier);
    mapping(bytes32 => bool)validateQueries;
    
    constructor(address _queryRegistryAddress) public{
        queryRegistryAddress = _queryRegistryAddress;
    }

    //customer has to query from this function
    function queryData(uint _deviceID) public {
        QueryRegistry queryRegistry = QueryRegistry(queryRegistryAddress);
        bytes32 queryIdentifer = queryRegistry.query(_deviceID,address(this));
        validateQueries[queryIdentifer]=true; //To avoid repeatedly invoke
        emit _query(queryIdentifer);
    }
    
    //the device has to callback from this function
    function callback(string memory _data,bytes32 _identifier) public {
        require(validateQueries[_identifier],"invaild identifier");
        //to ensure the right of trusted user
        delete validateQueries[_identifier];
        emit UploadEvent(_data,now,_identifier);
    }
}
