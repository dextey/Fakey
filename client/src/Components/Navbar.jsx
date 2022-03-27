import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Firebase } from "../firebaseConfig";
import { getAuth, signOut } from "firebase/auth";

function Navbar({ userData }) {
  const navigate = useNavigate();

  const logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        window.location.reload();
      })
      .catch((error) => {
        console.log("error logging out");
      });
  };

  return (
    <div className="flex h-[4rem] justify-between bg-black text-white items-center  px-4">
      <Link to="/" className="text-3xl font-extrabold">
        Fakey
      </Link>
      {userData ? (
        <span className="flex items-center">
          <span
            onClick={() => {
              logout();
            }}
            className="text-yellow-200 text-2xl  font-bold p-2 m-2 "
          >
            {userData.seller ? userData.brand : userData.username}
          </span>

          {userData.seller && (
            <Link
              to="/customer"
              className="bg-yellow-200 text-black font-bold px-2 p-1 m-2 rounded-md "
            >
              console
            </Link>
          )}
        </span>
      ) : (
        <Link
          to="/signIn"
          className="bg-yellow-200 text-black font-bold p-2 m-2 rounded-md "
        >
          hello, Sign in
        </Link>
      )}
    </div>
  );
}

export default Navbar;
