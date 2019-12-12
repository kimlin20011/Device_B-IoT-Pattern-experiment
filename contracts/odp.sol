pragma solidity ^0.5.2;
contract Observer {

    event updateEvent (address indexed senderEoA, string indexed topic, string signature, uint timestamp);
        
    function updateData(string memory _topicName, string memory _signature) public {
        //...access control code
        emit updateEvent(msg.sender,_topicName, _signature,now);
    }
}
