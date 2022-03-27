import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Firebase, db } from "../../firebaseConfig";

function SignIn({ setUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = () => {
    const auth = getAuth(Firebase);

    signInWithEmailAndPassword(auth, email, password).then((userCred) => {
      // console.log(userCred);
      // setUser(userCred.user.uid);
      navigate("/");
    });
  };

  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <div className="text-9xl font-extrabold font-sans m-5">Fakey</div>

      <div className="bg-[#226b704d] rounded-md w-4/12 mt-6">
        <input
          type="text"
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

      <div className="flex flex-col justify-between items-center">
        <span
          onClick={() => {
            signIn();
          }}
          className="px-10 m-3 text-[1.2rem] bg-[#735ff5] hover:bg-[#e3e967] hover:text-black rounded-md p-3  "
        >
          Sign In
        </span>
        <span className="text-black m-3">
          Don't have an account?{" "}
          <Link to="/signUp" className="font-bold">
            SignUp
          </Link>{" "}
          here
        </span>
      </div>
    </div>
  );
}

export default SignIn;
