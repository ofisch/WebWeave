import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import { AuthContext } from "../context/AuthContext";

// Komponentti joka renderöi sivun yläreunan navigaatiopalkin
export const Heading = () => {
  const user = useContext(AuthContext);

  const navigate = useNavigate();

  const goToIndex = () => {
    navigate("/generator");
  };

  const goToLanding = () => {
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

  return (
    <>
      {location.pathname === "/generator" ? (
        <div className="flex justify-between">
          <div className="w-6"></div>
          <div onClick={goToLanding} style={{ cursor: "pointer" }}>
            <h1>&lt;Webweave/&gt;</h1>
          </div>
          <button
            onClick={goToProfile}
            className="transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-125 hover:cursor-pointer hover:opacity-75 duration-70"
          >
            <AccountCircleIcon />
          </button>
        </div>
      ) : location.pathname === "/profile" ? (
        <div className="flex justify-between">
          <div className="w-6"></div>
          <div onClick={goToLanding} style={{ cursor: "pointer" }}>
            <h1>&lt;Webweave/&gt;</h1>
          </div>
          <button
            onClick={goToIndex}
            className="transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-125 hover:cursor-pointer hover:opacity-75 duration-70"
          >
            <HomeIcon />
          </button>
        </div>
      ) : location.pathname === "/login" ? (
        <div className="flex justify-between">
          <div className="w-6"></div>
          <div onClick={goToLanding} style={{ cursor: "pointer" }}>
            <h1>&lt;Webweave/&gt;</h1>
          </div>
          <button
            onClick={goToIndex}
            className="transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-125 hover:cursor-pointer hover:opacity-75 duration-70"
          >
            <HomeIcon />
          </button>
        </div>
      ) : (
        <div className="flex justify-between">
          <div className="w-14"></div>
          <div onClick={goToLanding} style={{ cursor: "pointer" }}>
            <h1>&lt;Webweave/&gt;</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={goToIndex}
              className="transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-125 hover:cursor-pointer hover:opacity-75 duration-70"
            >
              <HomeIcon />
            </button>
            <button
              onClick={goToProfile}
              className="transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-125 hover:cursor-pointer hover:opacity-75 duration-70"
            >
              <AccountCircleIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
