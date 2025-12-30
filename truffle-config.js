const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = 'your metamask mnemonic phrase'; //Replace with your mnemonic

MediaSourceHandle.exports ={
    networks: {
        mumbai:{
            provider: () => new HDWalletProvider(mnemonic,'https://rpc-mumbai.maticvigil.com'),
            network_id: 80001,
            gas: 5500000,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true
        }
    },
    compilers: {
        solc:{
            version: "0.8.13"
        }
    }
};