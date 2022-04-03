import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import QRCode from "react-qr-code";
const Web3 = require("web3");
function Listproducts({ marketplace, nft, setProduct }) {
  const web3 = new Web3(window.ethereum);

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
    <div className="flex w-full flex-col ">
      <table className="w-full m-3 ">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-2  text-gray-500">Image</th>
            <th className="px-6 py-2  text-gray-500">Product name</th>
            <th className="px-6 py-2  text-gray-500">Description</th>
            <th className="px-6 py-2  text-gray-500">category</th>
            <th className="px-6 py-2  text-gray-500">Price</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {items.map((item) => {
            console.log(JSON.stringify(item, null, 4));
            return (
              <tr className="text-center text-[1.1rem]">
                <td className="px-6 py-4 pl-4  text-gray-500">
                  <div>
                    <img
                      className="rounded"
                      src={item.image}
                      style={{ width: 100 }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className=" text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 ">
                  <div className=" text-gray-900 ">{item.description}</div>
                </td>
                <td className="px-6 py-4  text-gray-900">{item.category}</td>
                <td className="px-6 py-4">
                  <div className=" text-gray-900">
                    {parseFloat(web3.utils.fromWei(item.price, "ether"))} MATIC
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Listproducts;
