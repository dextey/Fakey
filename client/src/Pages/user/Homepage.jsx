import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import { db } from "../../firebaseConfig";

import { doc, getDoc } from "@firebase/firestore";
import { useNavigate } from "react-router-dom";
function Homepage({ user, marketplace, nft, setProduct }) {
  let data = [];

  const navigate = useNavigate();
  const axios = require("axios");
  const [items, setItems] = useState([]);
  const [userData, setuserData] = useState(null);

  const loadMarketplaceitem = async () => {
    const itemCount = await marketplace.methods.itemCount().call();
    console.log(itemCount);
    let i = 1;
    console.log("Listing items");
    while (i <= itemCount) {
      console.log(i);
      const item = await marketplace.methods.items(i).call();

      const uri = await nft.methods.tokenURI(item.tokenId).call();
      const price = await marketplace.methods
        .getTotalPrice(item.tokenId)
        .call();

      axios
        .get(uri)
        .then((response) => {
          let metadata = response.data;
          metadata.image =
            "https://ipfs.io/ipfs" +
            metadata.image.slice(6, metadata.image.length);
          metadata.price = price;
          metadata.id = i - 1;

          return metadata;
        })
        .then((value) => {
          data = [...data, value];
          setItems(data);
        });
      i = i + 1;
    }
  };

  useEffect(async () => {
    if (user) {
      const data = await getDoc(doc(db, "userData", user));
      setuserData(data.data());
    }
    loadMarketplaceitem();
  }, [user]);

  return (
    <>
      <Navbar userData={userData} user={user} />
      <div className=" flex flex-wrap gap-4 m-2 p-3">
        {items.map((item) => {
          return (
            <div
              className="bg-[#ffffff] rounded-lg p-3"
              onClick={() => {
                navigate("/product");
                setProduct(item);
              }}
            >
              <div className="flex flex-col    text-black  m-5 p-2 ">
                <div className="m-2">
                  <img
                    src={item.image}
                    alt={item.image.name}
                    style={{ width: 100, height: 100 }}
                  />
                </div>
                <div className=" flex text-[1rem] flex-col p-2 ml-3">
                  <span className=" font-bold">{item.brand}</span>
                  <span>{item.name}</span>
                  <span>{item.description}</span>
                  <span>{item.price} ETH</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Homepage;
