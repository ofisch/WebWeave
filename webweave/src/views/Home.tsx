import React, { useContext, useEffect, useState } from "react";
import style from "../assets/style";
import { Heading } from "../components/Heading";
import { makeApiRequest, exportToJSONFile } from "../utils/openai";
import { firestore } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import { SketchPicker } from "react-color";

export const Home = () => {
  const [color, setColor] = useState('#ffffff');
  const [currentColor, setCurrentColor] = useState(1);
  const [color1, setColor1] = useState('#ffffff');
  const [color2, setColor2] = useState('#ffffff');
  const [color3, setColor3] = useState('#ffffff');
  const [framework, setFrameworkSettings] = React.useState<string>("");
  const [font, setFontSettings] = React.useState<string>("");
  const [prompt, setPrompt] = React.useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [requestTime, setRequestTime] = useState<string>("");
  const [requestStatus, setRequestStatus] = useState<string>("");
  const [formToggle, setFormToggle] = useState(true);
  const user = useContext(AuthContext);
  const usersCollection = firestore.collection("users");
  const usersDocRef = usersCollection.doc(user?.uid);
  const pagesSubCollection = usersDocRef.collection("pages");

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
  // asetetaan font stateen
  const handleFontSettingsChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFontSettings(event.target.value)
  }
  // asetetaan css framework stateen
  const handleFrameworkSettingsChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFrameworkSettings(event.target.value)
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
    setFrameworkSettings("none selected");
    setFontSettings("none selected");
  }, []);
  // luodaan prompt openai-API:lle
  const colorSwitch = (id: string) => {
      if (id === "Main") {
        setCurrentColor(1);
        setColor(color1);
      }
      if (id === "Accent") {
        setCurrentColor(2);
        setColor(color2);
      }
      if (id === "Action") {
        setCurrentColor(3);
        setColor(color3);
      }
  }
  const makePrompt = () => {
    let finalPrompt = "";
    let frameworkPrompt = framework;
    let fontPrompt = font;
    let colorPrompt = "";
    if (framework === "none selected") {
      frameworkPrompt = "";
    }
    else {
      frameworkPrompt = " Use " + framework + " css framework.";
    }
    console.log("framework = " + framework);
    console.log("fontti = " + font);
    if (font === "none selected") {
      fontPrompt = "";
    }
    else {
      fontPrompt = " Use " + font + " font.";
    }
    finalPrompt = prompt + " Use " + color + " as main color." + frameworkPrompt + fontPrompt + " Use " + color1 + " as main color." + " Use " + color2 + " as accent color." + " Use " + color3 + " as action color.";
    return finalPrompt;
  }
  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
    const main = document.getElementById('MainColorCode');
    const accent = document.getElementById('AccentColorCode');
    const action = document.getElementById('ActionColorCode');
    if (currentColor === 1) {
      setColor1(newColor.hex);
      main.innerHTML = newColor.hex;
    }
    if (currentColor === 2) {
      setColor2(newColor.hex);
      accent.innerHTML = newColor.hex;
    }
    if (currentColor === 3) { 
      setColor3(newColor.hex);
      action.innerHTML = newColor.hex;
    }
  };
  // lähetetään prompt openai-API:lle ja asetetaan vastaus responseen-stateen
  const handleApiRequest = async () => {
    // ajastetaan API-pyynnön kesto ja tulostetaan se requestStatusiin
    const startTime = performance.now();
    setRequestStatus("API request in progress");
    setFormToggle(false);
    // lähetetään prompt openai-API:lle ja asetetaan vastaus responseen-stateen
    const settingPrompt = makePrompt();
    const apiResponse = await makeApiRequest(settingPrompt);
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
            placeholder="kuvaile sivua tähän"
            spellCheck="false"
            className={style.prompt}
            value={prompt}
            onChange={handlePromptChange}
          ></textarea>
          <div className={style.secondary}>
            <h1>css framework:</h1>
            <select name="cssframeworkSelect" className={style.select} onChange={handleFrameworkSettingsChange}>
              <option className={style.selectOption}>
                none selected
              </option>
              <option className={style.selectOption}>
                tailwindcss
              </option>
              <option className={style.selectOption}>
                materialui
              </option>
            </select>
            <h1>font style:</h1>
            <select name="fontSelect" className={style.select} onChange={handleFontSettingsChange}>
              <option className={style.selectOption}>
                none selected
              </option>
              <option className={style.selectOption}>
                Arial
              </option>
              <option className={style.selectOption}>
                Verdana 
              </option>
              <option className={style.selectOption}>
                Tahoma
              </option>
              <option className={style.selectOption}>
                Trebuchet MS
              </option>
              <option className={style.selectOption}>
                Times New Roman
              </option>
              <option className={style.selectOption}>
                Georgia
              </option>
              <option className={style.selectOption}>
                Garamond
              </option>
              <option className={style.selectOption}>
                Courier New
              </option>
              <option className={style.selectOption}>
                Brush Script MT
              </option>
            </select>

            <div>
              <SketchPicker
                color={color}
                onChangeComplete={(newColor) => handleColorChange(newColor)}
              />
            <ul>
              <li id="Main" className={style.colorListItem} onClick={() => colorSwitch("Main")}>
              <p>Main</p>
              <div className={style.colorDisplayBox} style={{ backgroundColor: color1 }}>
              </div>
              <p id="MainColorCode" style={{ color: color1 }}>#FFFFFF</p>
              </li>

              <li id="Accent" className={style.colorListItem} onClick={() => colorSwitch("Accent")}>
              <p>Accent</p>
              <div className={style.colorDisplayBox} style={{ backgroundColor: color2 }}>
              </div>
              <p id="AccentColorCode" style={{ color: color2 }}>#FFFFFF</p>
              </li>

              <li id="Action" className={style.colorListItem} onClick={() => colorSwitch("Action")}>
              <p>Action</p>
              <div className={style.colorDisplayBox} style={{ backgroundColor: color3 }}>
              </div>
              <p id="ActionColorCode" style={{ color: color3 }}>#FFFFFF</p>
              </li>
            </ul>
            </div>
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
      </div>
    </>
  );
};
