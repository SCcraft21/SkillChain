const Certification = artifacts.require("Certificate");

MediaSourceHandle.exports = function(deployer){
    deployer.deploy(Certification);
};
