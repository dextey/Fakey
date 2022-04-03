import React, { useEffect, useState } from "react";
import { connectWallet } from "../../web3Handler";

import { useNavigate } from "react-router-dom";

const Web3 = require("web3");
function Homepage({ marketplace, nft, setProduct, setAccount }) {
  let data = [];
  const web3 = new Web3(window.ethereum);

  const navigate = useNavigate();
  const axios = require("axios");
  const [items, setItems] = useState([]);

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
    loadMarketplaceitem();
  }, [marketplace]);

  return (
    <>
      <div className="flex flex-wrap w-full"></div>
      <div className="flex flex-wrap w-full">
        <div className="flex justify-around  p-2 px-10 text-white bg-black w-full ">
          <div className="m-4  text-left">
            <span className=" p-4 text-7xl font-sans  font-extrabold">
              <div className="">Brilliant.</div>
              <div> In every way</div>
              <span className="text-[1.3rem] font-light  text-grey">
                New Iphone 13 pro. Built right for you
              </span>
            </span>
            {!window.ethereum.selectedAddress && (
              <div className="my-4 border-2 px-3 p-2  w-max rounded-full border-white hover:bg-white hover:text-black">
                <button onClick={() => connectWallet(setAccount)}>
                  Connect wallet
                </button>
              </div>
            )}
          </div>
          <div className="image">
            <img
              src="https://www.ytechb.com/wp-content/uploads/2021/09/iphone-13-pro-pricing-1.webp"
              alt=""
              style={{ width: 350 }}
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto relative">
        <div className="bg-yellow-100 font-bold text-[1.1rem] m-2 p-4">
          Expolre the new gadgets
        </div>
        <div className="py-20 p-10 text-center rounded-3xl my-10 absolute top-40 -z-50 bg-yellow-200 w-full ">
          <span className="text-[10rem] text-white  font-extrabold">
            explore
          </span>
        </div>

        <div className=" flex  flex-wrap gap-5 justify-evenly  p-3">
          {items.map((item) => {
            console.log(JSON.stringify(item));
            return (
              <div
                className="hover:bg-[#fcfcf1]  bg-white hover:translate-y-[-3px] shadow-lg rounded-lg p-3 pb-1"
                onClick={() => {
                  navigate("/product");
                  setProduct(item);
                }}
              >
                <div className="flex flex-col text-black  m-5 p-2 ">
                  <div className="m-2">
                    <img
                      src={item.image}
                      alt={item.image.name}
                      style={{ width: 100 }}
                    />
                  </div>
                  <div className=" flex text-[1rem] flex-col p-2 ml-3">
                    <span className=" font-bold">{item.brand}</span>
                    <span>{item.name}</span>
                    <span className="text-[1rem] text-center pt-4 font-bold">
                      <span>
                        {parseFloat(web3.utils.fromWei(item.price, "ether"))}{" "}
                        MATIC
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap flex-col items-center custom">
          <div className="flex flex-wrap">
            <div className="flex relative">
              <div className="p-10 hover:bg-[#ffffff83] hover:text-black bg-transparent absolute text-transparent  flex justify-center items-center m-3 h-[25rem] w-[25rem]">
                <span className="text-7xl p-4 ">Gadgets</span>
              </div>
              <div className=" bg-black text-white  flex justify-center items-center m-3 h-[25rem] w-[25rem]">
                <img
                  src="https://data.whicdn.com/images/300878499/original.jpg"
                  alt=""
                />
              </div>
            </div>
            <div className="flex relative">
              <div className="p-10 hover:bg-[#ffffff83] hover:text-black bg-transparent absolute text-transparent  flex justify-center items-center m-3 h-[25rem] w-[25rem]">
                <span className="text-7xl p-4 ">Fashion</span>
              </div>
              <div className=" bg-black text-white  flex justify-center items-center m-3 h-[25rem] w-[25rem]">
                <img
                  src="https://thumbor.forbes.com/thumbor/400x0/smart/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5edfb8134fa9b600077960aa%2F960x0.jpg%3FcropX1%3D0%26cropX2%3D1543%26cropY1%3D0%26cropY2%3D1543"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="flex relative">
              <div className="p-10 hover:bg-[#ffffff83] hover:text-black bg-transparent absolute text-transparent  flex justify-center items-center m-3 h-[25rem] w-[25rem]">
                <span className="text-7xl p-4 ">Wearables</span>
              </div>
              <div className=" bg-black text-white  flex justify-center items-center m-3 h-[25rem] w-[25rem]">
                <img
                  src="https://www.fossilgroup.com/wp-content/uploads/2021/08/Gen6_FA21_0774-feat-1-400x400.jpg"
                  alt=""
                />
              </div>
            </div>
            <div className="flex relative">
              <div className="p-10 text-center hover:bg-[#ffffff83] hover:text-black bg-transparent absolute text-transparent  flex justify-center items-center m-3 h-[25rem] w-[25rem]">
                <span className="text-7xl p-4 ">And more</span>
              </div>
              <div className=" bg-black text-white  flex justify-center items-center m-3 h-[25rem] w-[25rem]">
                <img
                  src="https://cdn.shopify.com/s/files/1/0300/5526/8445/products/untitled-16-2_400x.jpg?v=1623940137"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage;
