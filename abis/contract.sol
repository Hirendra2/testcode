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
    function hencode(address user,string memory NAME, string memory Email, string memory DATEOFBIRTH, string memory COUNTRY, string memory Address, string memory PANNUMBER, string memory AADHAARNUMBER ) public {
        bytes memory data = (abi.encode(user, NAME, Email,DATEOFBIRTH, COUNTRY, Address,PANNUMBER,  AADHAARNUMBER));
        datas[user] = data;
    }

    function hencodeedit(address user,string memory NAME, string memory Email, string memory DATEOFBIRTH, string memory COUNTRY, string memory Address, string memory PANNUMBER, string memory AADHAARNUMBER ) public {
        bytes memory data = abi.encode(user, NAME, Email,DATEOFBIRTH, COUNTRY, Address,PANNUMBER,  AADHAARNUMBER);
        datas[user] = data;
    }

    function hOwnerencodeedit(address user,string memory NAME, string memory Email, string memory DATEOFBIRTH, string memory COUNTRY, string memory Address, string memory PANNUMBER, string memory AADHAARNUMBER ) public validOwner {
        bytes memory data = abi.encode( user, NAME, Email,DATEOFBIRTH, COUNTRY, Address,PANNUMBER,  AADHAARNUMBER);
        datas[user] = data;
    }

    function decodedata(address user)  public   view  returns (bytes memory){
              return  datas[user];
    } 

    function decode(bytes memory data) public  pure  returns (address _user,string memory _NAME,string memory _Email, string memory _DATEOFBIRTH, string memory _COUNTRY, string memory _Address, string memory _PANNUMBER, string memory _AADHAARNUMBER ) {       
        ( _user,_NAME,_Email, _DATEOFBIRTH,_COUNTRY,_Address, _PANNUMBER, _AADHAARNUMBER) = abi.decode( data, (address,string, string, string, string, string, string, string) );
    }


    mapping(address => uint256) public getNoFFaddress;
    mapping(address => string[]) private alladdress;
    mapping(address => string[]) private alltype;

    function addaddress(address  user,string memory friends,string memory types) public { 
        alladdress[user].push(friends);
        alltype[user].push(types);
        getNoFFaddress[user] += 1;
    }

    function removeaddress(address  user,string calldata whitelistadd) public {
        uint16 length = uint16(alladdress[user].length);
        for (uint256 i=0; i < length; i++) {  
           if (keccak256(abi.encodePacked(alladdress[user][i])) == keccak256(abi.encodePacked(whitelistadd))  ){    
                delete alltype[user][i];
                delete alladdress[user][i];
                getNoFFaddress[user] -= 1;
                 break;
            }
        }
    }
  
    function getalladdress(address user)  external view  returns (string[] memory,string[] memory)  {         
        return (alladdress[user],alltype[user]);
    }
}
