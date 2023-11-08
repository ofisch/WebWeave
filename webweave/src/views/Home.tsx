import React, { useEffect, useState } from "react";
import style from "../assets/style";
import { Heading } from "../components/Heading";
import { makeApiRequest, exportToJSONFile } from "../utils/openai";

export const Home = () => {
  const [prompt, setPrompt] = React.useState<string>("");
  const [response, setResponse] = useState<string>("");

  // asetetaan prompt stateen
  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPrompt(event.target.value);
  };

  // asetetaan vastaus responseen-stateen
  const handleResponseChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setResponse(event.target.value);
  };

  // lähetetään prompt openai-API:lle ja asetetaan vastaus responseen-stateen
  const handleApiRequest = async () => {
    const apiResponse = await makeApiRequest(prompt);
    setResponse(apiResponse);
    localStorage.setItem("htmlResponse", apiResponse);
  };

  return (
    <>
      <div className={style.container}>
        <div className={style.top}>
          <header className={style.headerNav}>
            <Heading></Heading>
          </header>
          <textarea
            className={style.prompt}
            value={prompt}
            onChange={handlePromptChange}
          ></textarea>
          <div className={style.nav}>
            <button className={style.buttonPage} onClick={handleApiRequest}>
              api testi
            </button>
            <button className={style.buttonPage} onClick={exportToJSONFile}>
              testi log
            </button>
          </div>

          <textarea
            className={style.settings}
            value={response}
            onChange={handleResponseChange}
          ></textarea>
          <button className={style.button}>css framework</button>
        </div>
        <div className={style.secondary}>
          <div className={style.editorPreview}>
            <iframe
              srcDoc={localStorage.getItem("htmlResponse")}
              className={style.iframe}
            ></iframe>
          </div>
          <button className={style.button}>tallenna sivu</button>
        </div>
      </div>
    </>
  );
};
