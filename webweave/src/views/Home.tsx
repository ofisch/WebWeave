import React from "react";
import style from "../assets/style";
import { Heading } from "../components/Heading";
import { makeApiRequest } from "../utils/openai";

export const Home = () => {
  return (
    <>
      <div className={style.container}>
        <div className={style.top}>
          <header className={style.headerNav}>
            <Heading></Heading>
          </header>
          <textarea className={style.prompt}></textarea>
          <button className={style.buttonPage} onClick={makeApiRequest}>
            api testi
          </button>
          <textarea className={style.settings}></textarea>
          <button className={style.button}>css framework</button>
        </div>
        <div className={style.secondary}>
          <div className={style.editorPreview}>
            <iframe
              srcDoc={localStorage.getItem("html")}
              className={style.iframe}
            ></iframe>
          </div>
          <button className={style.button}>tallenna sivu</button>
        </div>
      </div>
    </>
  );
};
