import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import QRCode from "react-qr-code";
function Listproducts({ marketplace, nft, setProduct }) {
  const navigate = useNavigate();
  const axios = require("axios");
  const [items, setItems] = useState([]);
  let data = [];
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
          return response.data;
        })
        .then((value) => {
          data = [...data, value];
          setItems(data);
        });
      i = i + 1;
    }
  };
  useEffect(() => {
    loadMarketplaceitem();
  }, []);

  return (
    <div className="flex flex-col ">
      {items.map((item) => {
        console.log(JSON.stringify(item, null, 4));
        return (
          <div
            className="flex  w-full bg-[#5f5f5f56] rounded-lg p-2 m-2"
            onClick={() => {
              navigate("/product");
              setProduct(item);
            }}
          >
            <div className="m-2">
              <img
                src={item.image}
                alt={item.image.name}
                style={{ width: 100 }}
              />
            </div>
            <div className=" flex text-[1rem] flex-col p-2 ml-3">
              <span>
                <span className="mx-2 font-bold">{item.brand}</span>
                <span>{item.name}</span>
              </span>
              <span>{item.description}</span>
              <span>{item.price}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Listproducts;
