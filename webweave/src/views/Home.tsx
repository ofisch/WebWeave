import React, { useEffect, useState } from "react";
import style from "../assets/style";
import { Heading } from "../components/Heading";
import { makeApiRequest, exportToJSONFile } from "../utils/openai";

export const Home = () => {
  const [prompt, setPrompt] = React.useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [requestTime, setRequestTime] = useState<string>("");
  const [requestStatus, setRequestStatus] = useState<string>("");
  const [formToggle, setFormToggle] = useState(true);

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
    // ajastetaan API-pyynnön kesto ja tulostetaan se requestStatusiin
    const startTime = performance.now();
    setRequestStatus("API request in progress");
    setFormToggle(false);

    // lähetetään prompt openai-API:lle ja asetetaan vastaus responseen-stateen
    const apiResponse = await makeApiRequest(prompt);
    setResponse(apiResponse);
    localStorage.setItem("htmlResponse", apiResponse);

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
          <p className={style.p}>{requestStatus}</p>

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
