//solcjs -o ../migrates --bin --abi oei_new.sol
pragma solidity ^0.5.2;
contract QueryRegistry {
    uint nonce;
    //map the identifier to deviceID
    mapping (bytes32 => uint) identifier_deviceID;
    mapping(bytes32 => bool) validateQueries;
    mapping(address => bool) vaildDevices;
    
    event QueryEvent(
        uint indexed deviceID,
        uint timestamp,
        address callbackAddress,
        bytes32 identifier
        );
        
    event UploadEvent(uint indexed deviceID,string data,uint callbackTimestamp,bytes32 identifier);
    
    constructor() public{
        vaildDevices[msg.sender] = true;
    }
    
    function addVaildDevice(address _deviceAddress) public {
        vaildDevices[_deviceAddress] = true;
    }

    function query(uint _deviceID,
        address _invokeAddress) public returns(bytes32){
        nonce++;
        if (nonce == 10000) {
            nonce = 0;
        }
        bytes32 identifier = (keccak256(abi.encodePacked(now, _invokeAddress, _deviceID , nonce))); 
        //To avoid repeatedly invoke
        validateQueries[identifier] = true;
        identifier_deviceID[identifier] = _deviceID;
        emit QueryEvent(_deviceID,now,_invokeAddress,identifier);  
        return identifier;
    }
    
    //the device has to callback from this function
    function callback(string memory _data,bytes32 _identifier) public {
        require(vaildDevices[msg.sender],"invaild Device");
        require(validateQueries[_identifier],"invaild identifier");
        //to ensure the right of trusted user
        delete validateQueries[_identifier];
        emit UploadEvent(identifier_deviceID[_identifier],_data,now,_identifier);
    }
}

contract Consumer{
    address public queryRegistryAddress;
    event _query(bytes32 identifier);
    
    constructor(address _queryRegistryAddress) public{
        queryRegistryAddress = _queryRegistryAddress;
    }
    
    //implement access control function

    //customer has to query from this function
    function queryData(uint _deviceID) public {
        QueryRegistry queryRegistry = QueryRegistry(queryRegistryAddress);
        bytes32 queryIdentifer = queryRegistry.query(_deviceID,address(this));
        emit _query(queryIdentifer);
    }
}