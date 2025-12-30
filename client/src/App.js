import React, { useState } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import * as XLSX from 'xlsx';
import sha256 from 'js-sha256';
require('dotenv').config();

const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "certId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "studentName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "courseName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "schoolName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "issueDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "issueCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "certIds",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "studentNames",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "courseNames",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "schoolNames",
        "type": "string[]"
      },
      {
        "internalType": "uint256[]",
        "name": "issueDates",
        "type": "uint256[]"
      },
      {
        "internalType": "string[]",
        "name": "ipfsHashes",
        "type": "string[]"
      }
    ],
    "name": "bulkIssue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "certId",
        "type": "string"
      }
    ],
    "name": "verifyCertificate",
    "outputs": [
      {
        "internalType": "string",
        "name": "studentName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "courseName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "schoolName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "issueDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "certId",
        "type": "string"
      }
    ],
    "name": "CertificateIssued",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "certificates",
    "outputs": [
      {
        "internalType": "string",
        "name": "studentName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "courseName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "schoolName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "issueDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET = process.env.REACT_APP_PINATA_SECRET;

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    certId: '', studentName: '', courseName: '', schoolName: '', issueDate: ''
  });
  const [singleFile, setSingleFile] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);
  const [viewCertId, setViewCertId] = useState('');
  const [verifyCertId, setVerifyCertId] = useState('');
  const [verifyFile, setVerifyFile] = useState(null);
  const [certDetails, setCertDetails] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3Instance.eth.getAccounts();
      setWeb3(web3Instance);
      setAccount(accounts[0]);
    } else {
      alert('Please install MetaMask!');
    }
  };

  const updateFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const issueCert = async (e) => {
    e.preventDefault();
    if (!singleFile) return alert('Please upload a file');
    const { certId, studentName, courseName, schoolName, issueDate } = formData;
    // Upload to IPFS
    const formDataUpload = new FormData();
    formDataUpload.append('file', singleFile);
    const ipfsRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formDataUpload, {
      headers: { pinata_api_key: PINATA_API_KEY, pinata_secret_api_key: PINATA_SECRET }
    });
    const ipfsHash = ipfsRes.data.IpfsHash;
    // Issue
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    await contract.methods.issueCertificate(certId, studentName, courseName, schoolName, parseInt(issueDate), ipfsHash)
      .send({ from: account });
    alert('Certificate issued!');
  };

  const bulkIssueCerts = async () => {
    if (!bulkFile) return alert('Please upload Excel');
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: ['CertID', 'StudentName', 'CourseName', 'SchoolName', 'IssueDate'] }).slice(1);
      const certIds = [];
      const studentNames = [];
      const courseNames = [];
      const schoolNames = [];
      const issueDates = [];
      const ipfsHashes = [];
      for (const row of rows) {
        const certJson = JSON.stringify({
          studentName: row.StudentName,
          courseName: row.CourseName,
          schoolName: row.SchoolName,
          issueDate: row.IssueDate
        });
        const formData = new FormData();
        formData.append('file', new Blob([certJson], { type: 'application/json' }), `${row.CertID}.json`);
        const ipfsRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
          headers: { pinata_api_key: PINATA_API_KEY, pinata_secret_api_key: PINATA_SECRET }
        });
        ipfsHashes.push(ipfsRes.data.IpfsHash);
        certIds.push(row.CertID);
        studentNames.push(row.StudentName);
        courseNames.push(row.CourseName);
        schoolNames.push(row.SchoolName);
        issueDates.push(parseInt(row.IssueDate));
      }
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      await contract.methods.bulkIssue(certIds, studentNames, courseNames, schoolNames, issueDates, ipfsHashes)
        .send({ from: account });
      alert('Bulk issued!');
    };
    reader.readAsArrayBuffer(bulkFile);
  };

  const viewCert = async () => {
    if (!viewCertId) return alert('Enter Cert ID');
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    try {
      const { studentName, courseName, schoolName, issueDate, ipfsHash } = await contract.methods.verifyCertificate(viewCertId).call();
      setCertDetails({ studentName, courseName, schoolName, issueDate: new Date(issueDate * 1000).toLocaleDateString(), ipfsHash });
    } catch (e) {
      alert('Certificate not found');
    }
  };

  const verifyCert = async (e) => {
    e.preventDefault();
    if (!verifyCertId || !verifyFile) return alert('Enter ID and upload file');
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    try {
      const { ipfsHash } = await contract.methods.verifyCertificate(verifyCertId).call();
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = new Uint8Array(e.target.result);
        const uploadedHash = sha256(fileContent);
        alert(`Verification: ${uploadedHash === ipfsHash ? 'Valid' : 'Invalid'}`);
      };
      reader.readAsArrayBuffer(verifyFile);
    } catch (e) {
      alert('Certificate not found');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Certificate Credentialing System</h1>
      {!account ? (
        <button onClick={connectWallet} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mb-4">
          Connect Wallet
        </button>
      ) : (
        <>
          <p className="mb-4">Connected: {account.slice(0,6)}...{account.slice(-4)}</p>
          <div className="mb-4">
            <label className="mr-2 text-lg">Select Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="border rounded px-2 py-1">
              <option value="">Select...</option>
              <option value="issuer">Issuer (School)</option>
              <option value="owner">Owner (Student)</option>
              <option value="verifier">Verifier (HR)</option>
            </select>
          </div>
          {role === 'issuer' && (
            <div className="bg-white p-6 rounded shadow w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Issuer Dashboard</h2>
              <h3 className="text-lg font-medium mb-2">Single Certificate Issuance</h3>
              <form onSubmit={issueCert} className="space-y-3">
                <input type="text" name="certId" placeholder="Certificate ID" value={formData.certId} onChange={updateFormData} className="w-full border rounded px-2 py-1" />
                <input type="text" name="studentName" placeholder="Student Name" value={formData.studentName} onChange={updateFormData} className="w-full border rounded px-2 py-1" />
                <input type="text" name="courseName" placeholder="Course Name" value={formData.courseName} onChange={updateFormData} className="w-full border rounded px-2 py-1" />
                <input type="text" name="schoolName" placeholder="School Name" value={formData.schoolName} onChange={updateFormData} className="w-full border rounded px-2 py-1" />
                <input type="number" name="issueDate" placeholder="Issue Date (Unix Timestamp)" value={formData.issueDate} onChange={updateFormData} className="w-full border rounded px-2 py-1" />
                <input type="file" accept=".pdf" onChange={(e) => setSingleFile(e.target.files[0])} className="w-full" />
                <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Issue Certificate
                </button>
              </form>
              <h3 className="text-lg font-medium mt-6 mb-2">Bulk Issuance</h3>
              <input type="file" accept=".xlsx" onChange={(e) => setBulkFile(e.target.files[0])} className="w-full mb-2" />
              <button onClick={bulkIssueCerts} className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Issue Bulk
              </button>
              <p className="text-sm text-gray-600">Upload Excel with columns: CertID, StudentName, CourseName, SchoolName, IssueDate (Unix)</p>
            </div>
          )}
          {role === 'owner' && (
            <div className="bg-white p-6 rounded shadow w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Student Dashboard</h2>
              <input type="text" placeholder="Enter Certificate ID" value={viewCertId} onChange={(e) => setViewCertId(e.target.value)} className="w-full border rounded px-2 py-1 mb-3" />
              <button onClick={viewCert} className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                View Certificate
              </button>
              {certDetails && (
                <div className="mt-4 text-sm">
                  <p><strong>Certificate Details:</strong></p>
                  <p>Student: {certDetails.studentName}</p>
                  <p>Course: {certDetails.courseName}</p>
                  <p>School: {certDetails.schoolName}</p>
                  <p>Issued: {certDetails.issueDate}</p>
                  <p>IPFS Hash: {certDetails.ipfsHash}</p>
                </div>
              )}
            </div>
          )}
          {role === 'verifier' && (
            <div className="bg-white p-6 rounded shadow w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">HR Verifier Dashboard</h2>
              <form onSubmit={verifyCert} className="space-y-3">
                <input type="text" placeholder="Enter Certificate ID" value={verifyCertId} onChange={(e) => setVerifyCertId(e.target.value)} className="w-full border rounded px-2 py-1" />
                <input type="file" accept=".pdf,.json" onChange={(e) => setVerifyFile(e.target.files[0])} className="w-full" />
                <button type="submit" className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                  Verify Certificate
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;