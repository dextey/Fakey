import NFT from "./Contracts/NFT.json";
import Marketplace from "./Contracts/Marketplace.json";

const Web3 = require("web3");

const web3 = new Web3(window.ethereum);

export const connectWallet = async (setAccount) => {
  if (window.ethereum) {
    try {
      // Request account access if needed
      await window.ethereum.enable();
      // Accounts now exposed

      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    } catch (error) {
      console.log("user rejected the request");
    }
  }
};

export const loadContracts = () => {
  return new Promise(async (resolve, reject) => {
    const networkId = await web3.eth.net.getId();

    const nftNetworkData = NFT.networks[networkId];
    const marketplaceNetworkData = Marketplace.networks[networkId];

    if (nftNetworkData && marketplaceNetworkData) {
      const nftAbi = NFT.abi;
      const nftAddress = nftNetworkData.address;
      const nftContract = new web3.eth.Contract(nftAbi, nftAddress);

      const marketplaceAbi = Marketplace.abi;
      const marketplaceAddress = marketplaceNetworkData.address;
      const marketplaceContract = new web3.eth.Contract(
        marketplaceAbi,
        marketplaceAddress
      );
      const contracts = { nftContract, marketplaceContract };
      resolve(contracts);
    }
  });
};
