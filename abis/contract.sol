// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract HHHHH {

    address private _owner;
    mapping(address => uint8) private _owners;

    modifier isOwner() {
        require(msg.sender == _owner);
        _;
    }

    modifier validOwner() {
        require(msg.sender == _owner || _owners[msg.sender] == 1);
        _;
    }

    constructor() public {
        _owner = msg.sender;
    }

    function addOwner(address owner) public isOwner {
        _owners[owner] = 1;
    }

    function removeOwner(address owner) public isOwner {
        _owners[owner] = 0;
    }

    mapping(address => bytes) private datas;

    function hencode(string memory NAME, string memory Email, uint256 DATEOFBIRTH, string memory COUNTRY, string memory Address, string memory PANNUMBER,  uint256 AADHAARNUMBER ) public {
        bytes memory data = (abi.encode( NAME, Email,DATEOFBIRTH, COUNTRY, Address,PANNUMBER,  AADHAARNUMBER));
        datas[msg.sender] = data;
    }

        function hencodeedit(string memory NAME, string memory Email, uint256 DATEOFBIRTH, string memory COUNTRY, string memory Address, string memory PANNUMBER,  uint256 AADHAARNUMBER ) public {
        bytes memory data = abi.encode( NAME, Email,DATEOFBIRTH, COUNTRY, Address,PANNUMBER,  AADHAARNUMBER);
        datas[msg.sender] = data;
    }

        function hOwnerencodeedit(string memory NAME, string memory Email, uint256 DATEOFBIRTH, string memory COUNTRY, string memory Address, string memory PANNUMBER,  uint256 AADHAARNUMBER ) public validOwner {
        bytes memory data = abi.encode( NAME, Email,DATEOFBIRTH, COUNTRY, Address,PANNUMBER,  AADHAARNUMBER);
        datas[msg.sender] = data;
    }

    function decodedata(address user)  public   view  returns (bytes memory){
              require(user == msg.sender);
              return  datas[user];
    }

    function decode(bytes memory data) public  pure  returns (string memory _NAME,string memory _Email, uint256 _DATEOFBIRTH, string memory _COUNTRY, string memory _Address, string memory _PANNUMBER, uint256 _AADHAARNUMBER ) {       
        ( _NAME,_Email, _DATEOFBIRTH,_COUNTRY,_Address, _PANNUMBER, _AADHAARNUMBER) = abi.decode( data, (string, string, uint256, string, string, string, uint256) );
    }
}
