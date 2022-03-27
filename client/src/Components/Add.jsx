import React, { useEffect, useState } from "react";

import { NFTStorage, File } from "nft.storage/dist/bundle.esm.min.js";
import { BounceLoader } from "react-spinners";

import { db } from "../firebaseConfig";

import {
  collection,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "@firebase/firestore";

function Add({ nft, marketplace, account, userData }) {
  useEffect(() => {
    userData && setBrand(userData.brand);
  }, []);

  const [productName, setProductName] = useState(null);
  const [category, setCategory] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

          description: "description",
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
    await nft.methods.mint(uri).send({ from: account }, (error) => {
      console.log(error);
    });

    const id = await nft.methods.tokenId().call();

    await nft.methods
      .setApprovalForAll(marketplace._address, true)
      .send({ from: account }, (error) => {
        if (error) {
          setError("product not minted");
        }
      });

    await marketplace.methods
      .makeItem(nft._address, id, 1)
      .send({ from: account }, (error) => {
        if (error) {
          setError("product not minted");
        }
      });

    console.log("====================================");
    console.log("product minted");
    console.log("====================================");
    setLoading(false);
  };

  return (
    <div className="m-3">
      <div className="text-2xl my-3"> Add product to fakey</div>
      {error && (
        <div className=" rounded-md p-3 py-2  mt-6 bg-[#ff00003d]">
          <span className="px-2 text-[1.2rem] text-red-400 ">{error}</span>
        </div>
      )}
      <div className="bg-[#226b704d] rounded-md  mt-6 p-4">
        <label className="text-1xl font-bold" htmlFor="category">
          Category
        </label>

        <select
          id="category "
          className="text-white bg-[#a0a0f543] rounded-md outline-none p-2 mx-4"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="books">books</option>
          <option value="computer">computer</option>
          <option value="mobiles">mobiles</option>
          <option value="fashion">fashion</option>
        </select>
      </div>
      <div className="bg-[#226b704d] rounded-md p-3 py-5  mt-6">
        <span className="px-2 text-[1.2rem] ">
          {userData && userData.brand}
        </span>
      </div>
      <div className="bg-[#226b704d] rounded-md  mt-6">
        <input
          type="text"
          className="p-3 px-5 text-[1.2rem] my-3 bg-transparent placeholder-emerald-50 outline-none w-full"
          placeholder="product name"
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div className="bg-[#226b704d] rounded-md  mt-6">
        <input
          type="file"
          className="p-3 px-5 text-[1.2rem] my-3 bg-transparent outline-none w-full"
          placeholder="Image url (please provide image of your product) "
          onChange={(e) => setImage(e.target.files)}
        />
      </div>
      <div className=" flex justify-center py-5  mt-6 text-center">
        {loading ? (
          <span className="flex text-[1.2rem] bg-[#735ff5]  rounded-md p-3 px-10">
            <BounceLoader size={25} color={"yellow"} />
          </span>
        ) : (
          <span
            onClick={() => {
              addItem();
            }}
            className="px-10 m-3 text-[1.2rem] bg-[#735ff5] hover:bg-[#e3e967] hover:text-black rounded-md p-3  "
          >
            Add
          </span>
        )}
      </div>
    </div>
  );
}

export default Add;
