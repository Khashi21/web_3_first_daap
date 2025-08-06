
//SPDX-License-Identifier: MIT     
pragma solidity ^0.8.0;

contract healthcare_record{
    address owner;
    struct Record{
        uint256 recordId;
        string patientName;
        string diagnosis;
        string treatment;
        uint  timestamp;
    }

    mapping(uint256 => Record[]) private patientRecords;
    mapping(address => bool) private authorisedProviders;

    modifier onlyOwner(){
        require(msg.sender == owner,"you're not the owner");  
        _;
    }
    modifier onlyAuthorisedProviders(){
        require(authorisedProviders[msg.sender],"you're not authorised");  
        _;
    }
    
    constructor(){
        owner=msg.sender;
    }

    function getOwner()public view returns(address){
        return owner;
    }  

    function authoriseProvider(address provider)public onlyOwner {
        authorisedProviders[provider]=true;
    }

    function addRecord(uint256 patientId, string memory  patientName,string memory diagnosis,string memory treatment)public onlyAuthorisedProviders {
        uint256 recordId= patientRecords[patientId].length + 1;
        patientRecords[patientId].push(Record(recordId,patientName,diagnosis,treatment,block.timestamp));
    }
    function getPatientRecords(uint256 patientId)public view onlyAuthorisedProviders returns(Record[] memory){
        return patientRecords[patientId];
    }


}
