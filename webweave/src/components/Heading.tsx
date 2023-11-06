import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AuthContext } from "../context/AuthContext";

export const Heading = () => {
  const user = useContext(AuthContext);

  const navigate = useNavigate();

  const goToIndex = () => {
    navigate("/");
  };

  const goToProfile = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/profile");
    }
  };

  return (
    <>
      <div className="w-6"></div>
      <h1
        onClick={goToIndex}
        className="transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-125 hover:cursor-pointer hover:opacity-75 duration-70"
      >
        &lt;Webweave/&gt;
      </h1>
      <button
        onClick={goToProfile}
        className="transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-125 hover:cursor-pointer hover:opacity-75 duration-70"
      >
        <AccountCircleIcon />
      </button>
    </>
  );
};
