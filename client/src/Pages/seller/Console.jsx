import React, { useState } from "react";
import Add from "../../Components/Add";
import Dashboard from "../../Components/Dashboard";
import Listproducts from "../../Components/Listproducts";
import Sale from "../../Components/Sale";

function Console({ account, nft, marketplace, setProduct, userData }) {
  const [dash, setDash] = useState("add");

  return (
    <>
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

export default Console;
