import React from "react";
import style from "../assets/style";

export const Home = () => {
  return (
    <>
      <div className={style.container}>
        <div className={style.top}>
          <header className={style.header}>
            <h1>&lt;Webweave/&gt;</h1>
          </header>
          <nav className={style.nav}>
            <button className={style.button}>luo uusi</button>
            <button className={style.button}>muokkaa</button>
            <button className={style.button}>käyttäjä</button>
          </nav>
          <textarea className={style.prompt}></textarea>
          <textarea className={style.settings}></textarea>
          <button className={style.button}>css framework</button>
        </div>
        <div className={style.secondary}>
          <div className={style.preview}>
            <iframe
              className={style.iframe}
              src="https://todo-403206.lm.r.appspot.com"
            ></iframe>
          </div>
          <button className={style.button}>tallenna sivu</button>
        </div>
      </div>
    </>
  );
};
