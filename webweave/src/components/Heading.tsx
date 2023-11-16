import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import { AuthContext } from "../context/AuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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

  const location = useLocation();
  console.log("location:", location);

  return (
    <>
      <div className="w-6"></div>
      <div onClick={goToIndex}>
        {location.pathname === "/" ? (
          <h1>&lt;Webweave/&gt;</h1>
        ) : (
          <>
            <h1>&lt;Webweave/&gt;</h1>{" "}
            <button className="transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-125 hover:cursor-pointer hover:opacity-75 duration-70">
              <HomeIcon />
            </button>
          </>
        )}
      </div>
      <button
        onClick={goToProfile}
        className="transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-125 hover:cursor-pointer hover:opacity-75 duration-70"
      >
        <AccountCircleIcon />
      </button>
    </>
  );
};
