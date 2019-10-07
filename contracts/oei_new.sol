//目前此內嵌的表達式solidity尚未支持
pragma solidity ^0.5.2;

contract Oracle {
  struct Request {
    bytes data;
    function(uint) external callback;
  }
  Request[] requests;
  event NewRequest(uint);
  function query(bytes memory data, function(uint) external callback) public {
    requests.push(Request(data, callback));
    emit NewRequest(requests.length - 1);
  }
  function reply(uint requestID, uint response) public {
    // Here goes the check that the reply comes from a trusted source
    requests[requestID].callback(response);
  }
}

contract OracleUser {
  //Oracle constant oracle = Oracle(0x1234567); // known contract
  address public oracle;
  uint exchangeRate;
  
  event callbackResponse(uint exchangeRate);
  
  constructor(address _oracleAddress) public{
      oracle = _oracleAddress;
  }
  
  function buySomething() public {
    Oracle _oracle = Oracle(oracle);
    _oracle.query("USD", this.oracleResponse);
  }
  
  function oracleResponse(uint response) public {
    require(
        msg.sender == address(oracle),
        "Only oracle can call this."
    );
    exchangeRate = response;
    emit callbackResponse(exchangeRate);
  }
}
