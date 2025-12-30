```markdown
# CertiChain: Blockchain-Based Vocational Certificate Credentialing System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Polygon](https://img.shields.io/badge/Polygon-%238250F5.svg?style=for-the-badge&logo=polygon&logoColor=white)](https://polygon.technology/)
[![IPFS](https://img.shields.io/badge/IPFS-%2365C2A5.svg?style=for-the-badge&logo=ipfs&logoColor=white)](https://ipfs.tech/)
[![MetaMask](https://img.shields.io/badge/MetaMask-%23F6851B.svg?style=for-the-badge&logo=metamask&logoColor=white)](https://metamask.io/)
[![Pinata](https://img.shields.io/badge/Pinata-%23007ACC.svg?style=for-the-badge&logo=pinata&logoColor=white)](https://pinata.cloud/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**A tamper-proof, decentralized platform for issuing, owning, and verifying vocational certificates.**  
Built for **Smart India Hackathon** – Eliminating fake certificates with blockchain immutability.




### Key Features
- **Single & Bulk Issuance** – Schools issue certificates (PDF or batch via Excel) in one transaction.
- **Student Ownership** – View certificate details instantly using unique CertID.
- **Instant HR Verification** – Upload certificate file → SHA-256 hash comparison → "Valid/Invalid" result (no issuer needed).
- **Decentralized Storage** – Full files on IPFS (pinned via Pinata), metadata + hash on-chain.
- **Low Cost & Fast** – Deployed on Polygon (high throughput, low fees).

### Tech Stack

<div align="center">
























</div>

### System Architecture




1. **Issuer** uploads certificate → Pinata pins to IPFS → Gets CID (hash).
2. CID + metadata stored on-chain via smart contract.
3. **Student** queries contract with CertID → Views details.
4. **Verifier** uploads file → Local hash computed → Compared with on-chain CID → Instant result.

### Quick Setup & Run

#### Prerequisites
- Node.js v18+
- MetaMask (with Polygon network added)
- Test MATIC from [Polygon Faucet](https://faucet.polygon.technology/)
- Pinata account

#### Steps
```bash
# 1. Clone & install
git clone <your-repo-url>
cd cert-mvp
npm install
npm install -g truffle
npm install @truffle/hdwallet-provider

# 2. Deploy Smart Contract (use Polygon Amoy Testnet - recommended as Mumbai is deprecated)
# Update truffle-config.js with your mnemonic & Amoy RPC: https://rpc-amoy.polygon.technology/
truffle migrate --network amoy

# Note the deployed contract address

# 3. Frontend
cd client
cp .env.example .env
# Edit .env:
# REACT_APP_CONTRACT_ADDRESS=0xYourContractAddress
# REACT_APP_PINATA_API_KEY=your_key
# REACT_APP_PINATA_SECRET=your_secret

npm install
npm start
```

Open `http://localhost:3000` → Connect MetaMask → Start issuing/verifying!

### Bulk Issuance Excel Format
| CertID   | StudentName | CourseName          | SchoolName             | IssueDate     |
|----------|-------------|---------------------|------------------------|---------------|
| CERT001  | John Doe    | Welding Technician  | ABC Vocational Institute | 1735689600   |
*(IssueDate = Unix timestamp → use https://www.unixtimestamp.com/)*

### Demo Video / Screenshots
(Add your demo GIFs or screenshots here for hackathon submission)

### Future Roadmap
- Access control (only registered schools can issue)
- Certificate revocation
- NFT representation for ownership
- Mainnet deployment
- Integration with job portals

### Contributing
Contributions welcome! Fork, create a feature branch, and submit a PR.

### License
MIT License © 2025

**Secure Credentials for a Digital India** 🇮🇳
```

This custom README is visually rich with badges, tech logos, and architecture diagrams as "widgets" (rendered images). It's professional, hackathon-optimized, and updated for 2025 (noting Mumbai deprecation, recommending Amoy). Replace placeholders like repo URL and add your demo media for final submission!
