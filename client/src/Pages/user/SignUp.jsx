import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Firebase, db } from "../../firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { PulseLoader } from "react-spinners";

import { collection, setDoc, doc } from "@firebase/firestore";
import { async } from "@firebase/util";

function SignUp() {
  const [loading, setLoading] = useState(false);

  const [seller, setSeller] = useState(false);

  const [username, setUsername] = useState(" ");
  const [email, setEmail] = useState(" ");
  const [password, setPassword] = useState(" ");
  const [confirmPassword, setConfirmPassword] = useState(" ");

  const [brand, setBrand] = useState(" ");
  const navigate = useNavigate();
  function checkpassword(password, confirmPassword) {
    if (password === confirmPassword) {
      return true;
    }
    return false;
  }

  const signUp = () => {
    setLoading(true);
    const auth = getAuth(Firebase);
    // if (username && password && confirmPassword && email) {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in

        const user = userCredential.user;
        let result;
        seller
          ? (result = await setDoc(
              doc(db, "userData", userCredential.user.uid),
              {
                brand: brand,
                seller: true,
              }
            ))
          : (result = await setDoc(
              doc(db, "userData", userCredential.user.uid),
              {
                username: username,
                seller: false,
              }
            ));
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <div className="text-9xl font-extrabold font-sans m-5">Fakey</div>

      {seller ? (
        <div className="bg-[#226b704d] rounded-md w-4/12 mt-6">
          <input
            type="text"
            className="px-5 text-[1.2rem] my-3 bg-transparent outline-none w-full placeholder-white"
            placeholder="Brand name"
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
      ) : (
        <div className="bg-[#226b704d] rounded-md w-4/12 mt-6">
          <input
            type="text"
            className="px-5 text-[1.2rem] my-3 bg-transparent outline-none w-full placeholder-white"
            placeholder="username "
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      )}
      <div className="bg-[#226b704d] rounded-md w-4/12 mt-6">
        <input
          type="email"
          className="px-5 text-[1.2rem] my-3 bg-transparent outline-none w-full placeholder-white"
          placeholder="email "
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="bg-[#226b704d] rounded-md w-4/12 mt-6">
        <input
          type="password"
          className="px-5 text-[1.2rem] my-3 bg-transparent outline-none w-full placeholder-white "
          placeholder="password "
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="bg-[#226b704d] rounded-md w-4/12 mt-6">
        <input
          type="password"
          className="px-5 text-[1.2rem] my-3 bg-transparent outline-none w-full placeholder-white "
          placeholder="confirm password "
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div className="flex flex-col justify-between items-center">
        <div className="flex justify-between items-center">
          <span></span>
          {seller ? (
            <span
              onClick={() => {
                signUp();
              }}
              className="px-10 m-3 text-[1.2rem] bg-[#ae2bf0] hover:bg-[#67e997] hover:text-black rounded-md p-3  "
            >
              {loading ? (
                <PulseLoader size={6} color={"yellow"} />
              ) : (
                "SignUp as seller"
              )}
            </span>
          ) : (
            <span
              onClick={() => {
                signUp();
              }}
              className="px-10 m-3 text-[1.2rem] bg-[#ae2bf0] hover:bg-[#67e997] hover:text-black rounded-md p-3  "
            >
              {loading ? <PulseLoader size={6} color={"yellow"} /> : "Sign Up"}
            </span>
          )}
          <span
            onClick={() => {
              setSeller(!seller);
            }}
            className="font-bold m-3 p-2 bg-black rounded-md hover:bg-yellow-200 hover:text-black"
          >
            {seller ? "signup as user" : "be a seller"}
          </span>
        </div>
        <span className="text-black m-3">
          Already have an account?{" "}
          <Link to="/signIn" className="font-bold">
            Sign in
          </Link>{" "}
          here
        </span>
      </div>
    </div>
  );
}

export default SignUp;
