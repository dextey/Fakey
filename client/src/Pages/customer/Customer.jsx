import React, { useEffect, useState } from "react";
import Add from "../../Components/Add";
import Dashboard from "../../Components/Dashboard";
import Listproducts from "../../Components/Listproducts";
import Navbar from "../../Components/Navbar";
import Sale from "../../Components/Sale";

import { Firebase, db } from "../../firebaseConfig";

import { doc, getDoc } from "@firebase/firestore";

function Customer({ account, nft, marketplace, setProduct, user }) {
  const [dash, setDash] = useState("add");

  const [userData, setuserData] = useState(null);

  useEffect(async () => {
    if (user) {
      const data = await getDoc(doc(db, "userData", user));
      setuserData(data.data());
    }
  }, [user]);

  return (
    <>
      <Navbar userData={userData} />
      <div>
        <div className="flex">
          <Dashboard setDash={setDash} />
          <div className="w-10/12 ">
            <div className="p-4">
              {(() => {
                switch (dash) {
                  case "add":
                    return (
                      <Add
                        nft={nft}
                        marketplace={marketplace}
                        account={account}
                        userData={userData}
                      />
                    );
                  case "list":
                    return (
                      <Listproducts
                        marketplace={marketplace}
                        nft={nft}
                        account={account}
                        setProduct={setProduct}
                      />
                    );
                  case "sale":
                    return <Sale />;
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Customer;
