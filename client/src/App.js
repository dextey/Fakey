import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Customer from "./Pages/customer/Customer";
import Product from "./Pages/user/Product";

import Homepage from "./Pages/user/Homepage";
import SignIn from "./Pages/user/SignIn";
import SignUp from "./Pages/user/SignUp";

import NFT from "./Contracts/NFT.json";
import Marketplace from "./Contracts/Marketplace.json";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Firebase, db } from "./firebaseConfig";

const Web3 = require("web3");

function App() {
  const [account, setAccount] = useState(null);
  const [nft, setNft] = useState(null);
  const [marketplace, setMarketplace] = useState(null);

  const [user, setUser] = useState(null);

  const web3Handler = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Accounts now exposed
      } catch (error) {
        console.log("user rejected the request");
      }

      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      loadContracts(web3);
    }
  };

  const loadContracts = async (web3) => {
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
      // console.log(contract);
      setNft(nftContract);
      setMarketplace(marketplaceContract);
    }
  };

  useEffect(() => {
    const auth = getAuth(Firebase);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user.uid);
      } else {
        console.log("logged out");
      }
    });

    web3Handler();
  }, []);

  const [product, setProduct] = useState(null);

  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <Homepage
            user={user}
            account={account}
            marketplace={marketplace}
            nft={nft}
            setProduct={setProduct}
          />
        }
      />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/signUp" element={<SignUp />} />

      <Route
        path="/customer/"
        element={
          <Customer
            account={account}
            marketplace={marketplace}
            nft={nft}
            setProduct={setProduct}
            user={user}
          />
        }
      />
      <Route
        path="/product"
        element={
          <Product
            account={account}
            marketplace={marketplace}
            product={product}
            user={user}
          />
        }
      />
    </Routes>
  );
}

export default App;
