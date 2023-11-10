import React, { useContext, useEffect, useState } from "react";
import style from "../assets/style";
import { Heading } from "../components/Heading";
import { makeApiRequest, exportToJSONFile } from "../utils/openai";
import { firestore } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import { resizeIframeToFiContent } from "../utils/iframeFit";
import AutoResizeIframe from "../components/AutoResizeIframe";
import { loadingAnimation, typePlaceholder } from "../utils/animation";

export const Home = () => {
  const [prompt, setPrompt] = React.useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [requestTime, setRequestTime] = useState<string>("");
  const [requestStatus, setRequestStatus] = useState<string>("");
  const [formToggle, setFormToggle] = useState(true);
  const [loading, setLoading] = useState(false);

  const user = useContext(AuthContext);

  const usersCollection = firestore.collection("users");
  const usersDocRef = usersCollection.doc(user?.uid);
  const pagesSubCollection = usersDocRef.collection("pages");

  const promptAreaRef = React.useRef<HTMLTextAreaElement>(null);

  //const iFrame = document.querySelector("iframe");

  // tyhjennetään localstorage
  //localStorage.setItem("htmlResponse", "");

  // tallennetaan sivu firestoreen
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
    // skaalataan iframe sen sisällä olevan sivun kokoiseksi, kun api palauttaa uuden sivun
    //resizeIframeToFiContent(iFrame);
  };

  // skaalataan iframe sen sisällä olevan sivun kokoiseksi, kun sivu ladataan
  window.onload = () => {
    //resizeIframeToFiContent(iFrame);
  };

  useEffect(() => {
    if (promptAreaRef.current) {
      typePlaceholder(promptAreaRef.current, "kuvaile sivua tähän...");
    }
  }, []);

  useEffect(() => {
    if (loading) {
      loadingAnimation(document.getElementById("loading")!);
    }
  }, [loading]);

  useEffect(() => {
    setPrompt(localStorage.getItem("userPrompt") || "");
    setResponse(localStorage.getItem("htmlResponse") || "");
  }, []);

  // lähetetään prompt openai-API:lle ja asetetaan vastaus responseen-stateen
  const handleApiRequest = async () => {
    // ajastetaan API-pyynnön kesto ja tulostetaan se requestStatusiin
    const startTime = performance.now();
    setRequestStatus("API request in progress");
    setFormToggle(false);
    setLoading(true);

    // lähetetään prompt openai-API:lle ja asetetaan vastaus responseen-stateen
    const apiResponse = await makeApiRequest(prompt);
    setResponse(apiResponse);
    localStorage.setItem("htmlResponse", apiResponse);
    localStorage.setItem("userPrompt", prompt);

    // lasketaan API-pyynnön kesto ja asetetaan se requestTime-stateen
    const endTime = performance.now();
    const elapsedTime = (endTime - startTime) / 1000;

    // jos API-pyynnön kesto on yli minuutin, tulostetaan se minuutteina ja sekunteina
    const formattedTime =
      elapsedTime >= 60
        ? `${Math.floor(elapsedTime / 60)}:${Math.floor(elapsedTime % 60)} min`
        : `${Math.floor(elapsedTime)} sec`;

    setRequestTime(formattedTime);
    setFormToggle(true);

    // lisätään API-pyynnön kesto log.json-tiedostoon
    const existingData = localStorage.getItem("log.json");
    console.log(existingData);

    // jos log.json-tiedosto on olemassa, lisätään siihen API-pyynnön kesto
    if (existingData) {
      try {
        const dataArray = JSON.parse(existingData);

        // haetaan log.json tiedostosta viimeinen objekti ja lisätään siihen requestTime
        if (Array.isArray(dataArray) && dataArray.length > 0) {
          const lastObject = dataArray[dataArray.length - 1];
          lastObject.requestTime = formattedTime;

          const updatedData = JSON.stringify(dataArray);
          console.log("updated json: " + updatedData);

          localStorage.setItem("log.json", updatedData);
        } else {
          console.error("Existing data is not a valid array or is empty.");
        }
      } catch (error) {
        console.error("Error parsing or updating existing data:", error);
      }
    } else {
      console.error("No existing data found in localStorage");
    }
  };

  // päivitetään requestStatusiin API-pyynnön kesto
  useEffect(() => {
    if (formToggle) {
      setRequestStatus(requestTime ? "API Request Time: " + requestTime : "");
      setLoading(false);
    } else {
      setRequestStatus("API request in progress");
    }
  }, [formToggle, requestTime]);

  return (
    <>
      <div className={style.container}>
        <div className={style.top}>
          <header className={style.headerNav}>
            <Heading></Heading>
          </header>
          <div className={style.promptBlock}>
            <h2 className={style.promptHeader}>prompt</h2>
            <textarea
              id="promptArea"
              placeholder=""
              spellCheck="false"
              ref={promptAreaRef}
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
          </div>
          <div>
            <p className={style.p}>{requestStatus}</p>
            {loading ? <p id="loading" className={style.p}></p> : null}
          </div>

          <div className={style.editBlock}>
            <h2 className={style.editHeader}>muokkaa</h2>
            <textarea
              spellCheck="false"
              className={style.settings}
              value={response}
              onChange={handleResponseChange}
            ></textarea>
            <button className={style.button}>css framework</button>
          </div>
        </div>
        <div className={style.secondary}>
          <div className={style.previewBlock}>
            <h2 className={style.previewHeader}>esikatselu</h2>
            <div className={style.editorPreview}>
              <AutoResizeIframe
                contentSrc={localStorage.getItem("htmlResponse")}
              ></AutoResizeIframe>
            </div>
            <button className={style.button} onClick={() => savePage(response)}>
              tallenna sivu
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
