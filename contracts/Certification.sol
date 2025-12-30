// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Certification{
    struct Certification{
        string studentName;
        string courseName;
        string schoolName;
        unit256 issueDate;
        string ipfsHash; // Hash of the certificate JSON/PDF on IPD
    }

    mapping(string => Certificate) public crtificates; //Keyed by unique certificate ID
    event CertificateIssued(string certId);

    //Single issuance
    function issueCertificate(
        string memory certId,
        string memory studentName,
        string memory courseName,
        string memory schoolName,
        uint256 issueDate,
        string memory ipfsHash
    ) public {
        require(bytes(certificates[certId].ipfsHash).length == 0, "Certificate ID already exists");
        Certificate memory newCert = Certificate(studentName, courseName, schoolName, issueDate, ipfsHash);
        certificates[certId] = newCert;
        emit CertificateIssued(certId);
    }

    // Bulk issuance
    function bulkIssue(
        string[] memory certIds,
        string[] memory studentNames,
        string[] memory courseNames,
        string[] memory schoolNames,
        uint256[] memory issueDates,
        string[] memory ipfsHashes
    ) public {
        require(certIds.length == studentNames.length, "Array lengths must match");
        require(certIds.length == courseNames.length, "Array lengths must match");
        require(certIds.length == schoolNames.length, "Array lengths must match");
        require(certIds.length == issueDates.length, "Array lengths must match");
        require(certIds.length == ipfsHashes.length, "Array lengths must match");

        for (uint256 i = 0; i < certIds.length; i++) {
            require(bytes(certificates[certIds[i]].ipfsHash).length == 0, "Certificate ID already exists");
            Certificate memory newCert = Certificate(
                studentNames[i],
                courseNames[i],
                schoolNames[i],
                issueDates[i],
                ipfsHashes[i]
            );
            certificates[certIds[i]] = newCert;
            emit CertificateIssued(certIds[i]);
        }
    }

    // Verification
    function verifyCertificate(string memory certId) public view returns (
        string memory studentName,
        string memory courseName,
        string memory schoolName,
        uint256 issueDate,
        string memory ipfsHash
    ) {
        Certificate memory cert = certificates[certId];
        require(bytes(cert.ipfsHash).length > 0, "Certificate not found");
        return (cert.studentName, cert.courseName, cert.schoolName, cert.issueDate, cert.ipfsHash);
    }
}

}