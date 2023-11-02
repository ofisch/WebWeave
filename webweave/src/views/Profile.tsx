import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// tyylikirjasto
import style from "../assets/style";
// ikonit
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export const Profile = () => {
  const user = useContext(AuthContext);
  return (
    <>
      <div className={style.container}>
        <div className={style.top}>
          <header className={style.header}>
            <h1>&lt;Webweave/&gt;</h1>
          </header>
          <main className={style.profile}>
            <div className={style.userInfo}>
              {/*tarkistetaan, onko käyttäjää olemassa, jos on, tulostetaan sähköposti*/}
              {user !== null ? <h3>{user.email}</h3> : <h3>sähköposti</h3>}
              <AccountCircleIcon className={style.icon}></AccountCircleIcon>
            </div>
            <h2 className={style.h2}>tallennetut sivut</h2>
            <ul className={style.list}>
              <li>
                <button className={style.buttonPage}>kahvilasivu</button>
              </li>
              <li>
                <button className={style.buttonPage}>
                  yrityksen kotisivut
                </button>
              </li>
              <li>
                <button className={style.buttonPage}>sivupohja</button>
              </li>
              <li>
                <button className={style.buttonPage}>uusi sivu</button>
              </li>
              <li>
                <button className={style.buttonPage}>hieno sivusto</button>
              </li>
            </ul>
          </main>
        </div>
      </div>
    </>
  );
};
