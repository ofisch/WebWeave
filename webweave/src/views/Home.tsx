import React, { useContext, useEffect, useState } from "react";
import style from "../assets/style";
import { Heading } from "../components/Heading";
import { makeApiRequest, exportToJSONFile } from "../utils/openai";
import { firestore } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";

export const Home = () => {
  const [prompt, setPrompt] = React.useState<string>("");
  const [response, setResponse] = useState<string>("");

  const user = useContext(AuthContext);

  const usersCollection = firestore.collection("users");
  const usersDocRef = usersCollection.doc(user?.uid);
  const pagesSubCollection = usersDocRef.collection("pages");

  // tyhjennetään localstorage
  //localStorage.setItem("htmlResponse", "");

  const savePage = async (content: string) => {
    const pageNameInput = window.prompt("Syötä sivun nimi");
    const page = {
      pageName: pageNameInput,
      content: content,
    };

    if (pageNameInput !== null && pageNameInput !== "") {
      try {
        await pagesSubCollection.add(page);
        window.alert("✔️Sivu tallennettu");
      } catch (error) {
        console.log(error);
      }
    }
  };

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

  useEffect(() => {
    setPrompt(localStorage.getItem("userPrompt") || "");
    setResponse(localStorage.getItem("htmlResponse") || "");
  }, []);

  // lähetetään prompt openai-API:lle ja asetetaan vastaus responseen-stateen
  const handleApiRequest = async () => {
    const apiResponse = await makeApiRequest(prompt);
    setResponse(apiResponse);
    localStorage.setItem("htmlResponse", apiResponse);
    localStorage.setItem("userPrompt", prompt);
  };

  return (
    <>
      <div className={style.container}>
        <div className={style.top}>
          <header className={style.headerNav}>
            <Heading></Heading>
          </header>
          <textarea
            placeholder="kuvaile sivua tähän"
            spellCheck="false"
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
            spellCheck="false"
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
          <button className={style.button} onClick={() => savePage(response)}>
            tallenna sivu
          </button>
        </div>
      </div>
    </>
  );
};
