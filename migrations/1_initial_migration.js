const Migrations = artifacts.require("Migrations");

MediaSourceHandle.exports = function(deployer){
    deployer.deploy(Migration);
};