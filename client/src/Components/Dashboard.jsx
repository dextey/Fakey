import React from "react";

function Dashboard({ setDash }) {
  localStorage.setItem("Name", "Rahul");

  return (
    <div className="w-2/12 bg-[#00000056] h-[100vh] flex flex-col p-4 text-2xl  ">
      <div className="text-center">
        <span className="m-3 mx-2  text-3xl font-bold">Dashboard</span>
      </div>
      <hr className="m-4" />
      <span
        className="m-3 mx-2 rounded-md px-4 p-2 hover:bg-[#8787fa5b] "
        onClick={() => {
          setDash("add");
        }}
      >
        Add
      </span>
      <span
        className="m-3 mx-2 rounded-md px-4 p-2 hover:bg-[#8787fa5b]"
        onClick={() => {
          setDash("list");
        }}
      >
        List products
      </span>
      <span
        className="m-3 mx-2 rounded-md px-4 p-2 hover:bg-[#8787fa5b]"
        onClick={() => {
          setDash("sale");
        }}
      >
        Sale
      </span>
    </div>
  );
}

export default Dashboard;
