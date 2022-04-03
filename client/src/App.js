import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Console from "./Pages/seller/Console";
import Product from "./Pages/user/Product";

import Homepage from "./Pages/user/Homepage";
import SignIn from "./Pages/user/SignIn";
import SignUp from "./Pages/user/SignUp";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Firebase, db } from "./firebaseConfig";
import { doc, getDoc } from "@firebase/firestore";

import { loadContracts } from "./web3Handler";
import Navbar from "./Components/Navbar";

function App() {
  const [account, setAccount] = useState(window.ethereum.selectedAddress);
  const [nft, setNft] = useState(null);
  const [marketplace, setMarketplace] = useState(null);
  const [user, setUser] = useState(null);
  const [userData, setuserData] = useState(null);
  const Web3 = require("web3");
  useEffect(async () => {
    const web3 = new Web3(window.ethereum);
    // const val = web3.utils.toWei("0.0002", "ether");
    // console.log(web3.utils.toEther(val));

    loadContracts()
      .then((contracts) => {
        setNft(contracts.nftContract);
        setMarketplace(contracts.marketplaceContract);
      })
      .catch((err) => console.log(err));

    const auth = getAuth(Firebase);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user.uid);
        const data = await getDoc(doc(db, "userData", user.uid));
        setuserData(data.data());
      } else {
        console.log("logged out");
      }
    });
  }, []);

  //for accessing data of each product loaded from contract
  const [product, setProduct] = useState(null);
  const pathname = useLocation().pathname;
  return (
    <>
      {pathname === "/signIn" || pathname === "/signUp" ? null : (
        <Navbar userData={userData} user={user} />
      )}
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Homepage
              user={user}
              setAccount={setAccount}
              marketplace={marketplace}
              nft={nft}
              setProduct={setProduct}
            />
          }
        />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />

        <Route
          path="/console/"
          element={
            <Console
              account={account}
              marketplace={marketplace}
              nft={nft}
              setProduct={setProduct}
              userData={userData}
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
              // user={user}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
