import React, { useEffect, useState } from "react";

import { NFTStorage, File } from "nft.storage/dist/bundle.esm.min.js";
import { BounceLoader } from "react-spinners";
const Web3 = require("web3");

function Add({ nft, marketplace, account, userData }) {
  useEffect(() => {
    userData && setBrand(userData.brand);
  }, []);
  const web3 = new Web3(window.ethereum);
  const [productName, setProductName] = useState(null);
  const [category, setCategory] = useState(null);
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState(null);
  const [desc, setDesc] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [brand, setBrand] = useState(null);
  function getAccessToken() {
    // this token is valid only valid for some period of time, this is maintained for test purpose Only
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBiZjk3NTg4QjFGOUJlMWQxZThhQjM1MDM0QjQyNjdBNDNGM0Y0NjkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0ODE4ODY5MjExNywibmFtZSI6ImZha2V5In0.dU1k_GNA4ttlhXLmTebJBRYTrXH01T3QM1aEfZbLtb8";
  }

  function makeStorageClient() {
    return new NFTStorage({ token: getAccessToken() });
  }

  const addItem = async () => {
    if (productName && category && userData.brand && image) {
      if (typeof image !== undefined) {
        console.log("clicked");
        setError(false);
        setLoading(true);
        const client = makeStorageClient();

        const result = await client.store({
          name: productName,
          brand: userData.brand,
          category: category,
          description: desc,
          image: new File(image, productName, { type: "image/png" }),
        });

        const uri = `https://ipfs.io/ipfs/${result.ipnft}/metadata.json`;
        // console.log(result);
        console.log(uri);
        mintNft(uri);
      } else {
        setError("*please provide a valid image");
      }
    } else {
      setError("*please fill all the fields");
    }
  };

  const mintNft = async (uri) => {
    console.log(nft._address);
    const fromAccount = window.ethereum.selectedAddress;
    await nft.methods
      .mint(uri)
      .send(
        { from: fromAccount, gasLimit: "1000000", gasPrice: "30000000000" },
        (error) => {
          console.log(error);
        }
      );

    const id = await nft.methods.tokenId().call();

    await nft.methods
      .setApprovalForAll(marketplace._address, true)
      .send(
        { from: fromAccount, gasLimit: "1000000", gasPrice: "30000000000" },
        (error) => {
          if (error) {
            setError("some error occoured please try again!");
          }
        }
      );

    await marketplace.methods
      .makeItem(nft._address, id, web3.utils.toWei(price, "ether"))
      .send(
        { from: fromAccount, gasLimit: "1000000", gasPrice: "30000000000" },
        (error) => {
          if (error) {
            setError("some error occoured please try again!d");
          }
        }
      );

    console.log("====================================");
    console.log("product minted");
    console.log("====================================");
    setLoading(false);
    setSuccess(true);
  };

  if (success || error) {
    setTimeout(() => {
      setSuccess(false);
      setError(false);
    }, 3000);
  }

  return (
    <div className="bg-violet-100 rounded-lg p-4">
      <div className="text-3xl font-bold my-3"> Add product to fakey</div>
      <hr className="h-[2px] bg-black" />
      {error && (
        <div className=" rounded-md p-3 py-2  mt-6 bg-[#ff00003d]">
          <span className="px-2 text-[1.2rem] text-red-400 ">{error}</span>
        </div>
      )}
      {success && (
        <div className=" rounded-md p-3 py-2  mt-6 bg-[#a5f88b75]">
          <span className="px-2 text-[1.2rem] text-[#3ea153] ">success</span>
        </div>
      )}
      <div className="flex justify-evenly ">
        <div className="flex flex-col w-full px-4">
          <span className="text-2xl py-4 font-bold text-black">
            Product details
          </span>

          <div className="border-2 border-[#48396162] rounded-md  py-2 px-4 ">
            <label className="text-1xl font-bold" htmlFor="category">
              Category
            </label>
            <select
              id="category "
              className="text-black bg-[#a0a0f543] rounded-md outline-none p-2 mx-4"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option> </option>
              <option value="computer ">computer</option>
              <option value="mobiles">mobiles</option>
              <option value="fashion">fashion</option>
              <option value="books">books</option>
            </select>
          </div>
          <div className="border-2 border-[#48396162]  rounded-md p-3 w-12/12  mt-6">
            <span className="px-2 text-[1.25rem] ">
              {userData && userData.brand}
            </span>
          </div>
          <div className="border-2 border-[#48396162]  rounded-md  mt-6">
            <input
              type="text"
              className="p-3 px-5 text-[1.2rem] bg-transparent placeholder-slate-500 outline-none w-full"
              placeholder="product name"
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="border-2 border-[#48396162]  rounded-md  mt-6">
            <input
              type="text"
              className="p-3 px-5 text-[1.2rem] bg-transparent placeholder-slate-500 outline-none w-full"
              placeholder="Desciption"
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="border-2 border-[#48396162] ] rounded-md  mt-6">
            <input
              type="number"
              className="p-3 px-5 text-[1.2rem] bg-transparent placeholder-slate-500 outline-none w-full"
              placeholder="Price"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="flex w-full flex-col mx-4 items-center">
          <div className="border-2 m-2 p-2 rounded-lg">
            <div className=" rounded-md  mt-6">
              <input
                type="file"
                className="form-control
              block
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              m-0
              focus:outline-none"
                onChange={(e) => setImage(e.target.files)}
              />
            </div>
          </div>
          {image ? (
            <div className="m-2 rounded">
              <img
                className="rounded-lg"
                src={URL.createObjectURL(image[0])}
                style={{ width: 250 }}
              />
            </div>
          ) : (
            <div className="m-2 rounded">
              <div className="flex text-2xl text-slate-400 justify-center items-center">
                + add image here
              </div>
            </div>
          )}
        </div>
      </div>
      <div className=" flex justify-center py-5  mt-6 text-center">
        {loading ? (
          <span className="flex text-[1.2rem] bg-[#735ff5]  rounded-md p-3 px-10">
            <BounceLoader size={25} color={"yellow"} />
          </span>
        ) : (
          <span>
            {window.ethereum.selectedAddress ? (
              <span
                onClick={() => {
                  addItem();
                }}
                className="px-10 m-3 text-[1.2rem] bg-[#735ff5] hover:bg-[#e3e967] hover:text-black rounded-md p-3  "
              >
                Add
              </span>
            ) : (
              <span className="font-bold text-[1.2rem] bg-pink-200 rounded-full px-4  p-3">
                Please connect your wallet
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

export default Add;
