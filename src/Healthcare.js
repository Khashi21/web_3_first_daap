import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import HealthcareABI from './abi/Healthcare.json';

const Healthcare = () => {
  const [signer, setSigner] = useState(null);
  const [provider, setprovider] = useState(null);
  const [contract, setcontract] = useState(null);
  const [account, setaccount] = useState(null);
  const [isowner, setisowner] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [providerAddress, setProviderAddress] = useState("");
  const [patientRecord,setPatientRecord]=useState([]);
  const [diagnosis,setDiagnosis]=useState("");
  const [treatment,setTreatment]=useState("");

  const contractAddress = "0x470C31a8c0fE8EBA13Fd37657a98C2ad4A872B35";
  const contractABI = HealthcareABI;

  useEffect(() => {
    const connectwallet = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        setSigner(signer);
        setprovider(provider);

        const accountAddress = await signer.getAddress();
        setaccount(accountAddress);
        
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setcontract(contract);

        const ownerAddress = await contract.getOwner();
        setisowner(accountAddress.toLowerCase() === ownerAddress.toLowerCase());
      } catch (error) {
        console.log("error connecting to wallet:", error);
      }
    };
    connectwallet();
  }, []);

  //All functions of contract and js

//1st
  const authorisedProvider = async () => {
    try{

      const tx = await contract.authoriseProvider(providerAddress);
      await tx.wait();
      alert(`Provider ${providerAddress} authorised succesfully`);

    }catch(error){
      console.log("only contract owner can authorised diffrent providers",error);
    }
  }

//2nd
  const fetchPatientRecord = async () => {
    if (isowner === null || !contract) {
      alert("Please wait for wallet and contract to load.");
      return;
    }

    if (!isowner) {
      alert("Only contract owner can fetch patient records.");
      return;
    }

    try {
      const record = await contract.getPatientRecords(patientId);
      setPatientRecord(record);
      console.log(record);
    } catch (error) {
      console.log("Error fetching patient records", error);
    }
  }

//3rd
  const addRecord = async ()=>{
    try{
      const tx=await contract.addRecord(patientId,"saurab ki dadi ",diagnosis, treatment);
      await tx.wait();
      fetchPatientRecord();
      alert("record is added can't be changed now");
    }catch(error){
      console.log("error record did't added",error);
    }
  }




  //Actual frountend starts
  return (
      <div className="container">
        <h2 className="title">Healthcare DApp</h2>
        {account && <p className="account-info">Connected wallet: {account}</p>}
        {isowner && <p className="owner-info">You are the owner ✅</p>}
        {!isowner && isowner !== null && <p className="owner-info">You are not the owner ❌</p>}

      <div className="form-section">
        <h2>Fatch Patient Record</h2>
        <input className="input-field" type='text' placeholder='Enter patientID' value={patientId} onChange={(e)=>{setPatientId(e.target.value)}} />
        <button className="action-button" onClick={fetchPatientRecord}>fetch Record</button>
      </div>

      <div className="form-section">
        <h2 >Add Patient Record</h2>
        <input className="input-field" type="text" placeholder='Diagnosis' value={diagnosis} onChange={(e=>setDiagnosis(e.target.value))} />
        <input className="input-field" type="text" placeholder='treatment' value={treatment} onChange={(e=>setTreatment(e.target.value))} />
        <button className="action-button" onClick={addRecord}> Add Record </button>
      </div>

      <div className="form-section">
        <h2>Patient's data</h2>
        {patientRecord.map((record, index) => (
          <div key={index}>
            <p>Record ID: {record.recordId.toNumber()}</p>
            <p>Diagnosis: {record.diagnosis}</p>
            <p>Treatment: {record.treatment}</p>
            <p>Timestamp: {new Date(record.timestamp.toNumber() * 1000).toLocaleString()}</p>
          </div>
        ))}

      </div>

      <div className="form-section">
        <h2>Authorise Healthcare Provider</h2>
        <input
          className="input-field" type="text" placeholder="Provider Address" value={providerAddress} onChange={(e) => setProviderAddress(e.target.value)} />
        <button className="action-button" onClick={authorisedProvider}> Authorise Provider </button>
      </div>

      
      </div>
  )

};

export default Healthcare;
