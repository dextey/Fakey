import React, { useEffect, useState } from "react";
import { QRCode } from "react-qr-svg";
import Navbar from "../../Components/Navbar";

import { Firebase, db } from "../../firebaseConfig";

import { doc, getDoc } from "@firebase/firestore";
const Web3 = require("web3");

function Product({ product, account, marketplace, user }) {
  const [productDetails, setProductDetails] = useState("");

  const [userData, setuserData] = useState(null);

  useEffect(async () => {
    if (user) {
      const data = await getDoc(doc(db, "userData", user));
      setuserData(data.data());
    }
    const item = await marketplace.methods.items(product.id).call();
    console.log(item);
    setProductDetails(item);
  }, [user]);

  if (product && productDetails) {
    product.nft = productDetails.nft;
    product.seller = productDetails.seller;
    product.owner = productDetails.owner;
    product.sold = productDetails.sold;
    // console.log(product);
  }

  const buyProduct = async (id) => {
    const web3 = new Web3(window.ethereum);
    const result = await marketplace.methods.purchaseItem(id).send({
      from: window.ethereum.selectedAddress,
      value: web3.utils.toWei(product.price, "ether"),
    });

    window.location.replace("/");
  };

  return (
    <>
      <Navbar userData={userData} />
      {product && (
        <div className="container mx-auto">
          <div className="flex justify-between p-2 my-4  items-center">
            <div className="flex items-center text-[1rem] m-2 mx-5">
              <img
                src={product.image}
                alt={product.image.value}
                style={{ width: 200, height: 200 }}
              />
              <div className="flex flex-col mx-4">
                <span className="font-bold text-3xl">{product.name}</span>
                <span className="font text-2xl">{product.brand}</span>
                <span className="font-bold text-2xl my-1">
                  Price : {product.price} ETH
                </span>
                <span className=" text-2xl">{product.description}</span>
              </div>
            </div>
            <div className="flex">
              <div className="border-8 rounded-md border-white p-2">
                <QRCode
                  level="Q"
                  style={{ width: 256 }}
                  value={JSON.stringify(product)}
                />
              </div>
            </div>
          </div>
          <div className="flex text-black m-4 w-full">
            {!product.sold && (
              <button
                onClick={() => {
                  buyProduct(product.id);
                }}
                className="bg-yellow-200 w-64 font-bold p-2 rounded-lg "
              >
                Buy
              </button>
            )}
          </div>
          <hr />
          <div className="bg-black font-bold text-3xl my-3 p-3">
            item activity
          </div>

          <div className="flex flex-col  text-2xl p-2 my-2">
            <div className="flex  justify-around">
              <div>{product.brand}</div>
              <div>{product.seller}</div>
            </div>
            <hr className="my-3" />
            <div className="flex  justify-around">
              <div>Product </div>
              <div>{product.nft}</div>
            </div>
            <hr className="my-3" />
            <div className="flex  justify-around">
              <div>Owner </div>
              <div>{product.owner}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Product;
