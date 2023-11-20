import React, { useContext, useEffect, useState } from "react";
import style from "../assets/style";
import { Heading } from "../components/Heading";
import { makeApiRequest, exportToJSONFile } from "../utils/openai";
import { firestore } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import { SketchPicker } from "react-color";
import { resizeIframeToFiContent } from "../utils/iframeFit";
import AutoResizeIframe from "../components/AutoResizeIframe";
import { loadingAnimation, typePlaceholder } from "../utils/animation";
import SaveModal from "../components/modals/SaveModal";
import SendIcon from "@mui/icons-material/Send";
import DownloadIcon from "@mui/icons-material/Download";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [settingsMode, setSettingsMode] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [currentColor, setCurrentColor] = useState(1);
  const [color1, setColor1] = useState("#ffffff");
  const [color2, setColor2] = useState("#ffffff");
  const [color3, setColor3] = useState("#ffffff");
  const [framework, setFrameworkSettings] = React.useState<string>("");
  const [font, setFontSettings] = React.useState<string>("");
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

  const navigate = useNavigate();

  //const iFrame = document.querySelector("iframe");

  // tyhjennetään localstorage
  //localStorage.setItem("htmlResponse", "");

  // tallennetaan sivu firestoreen
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");

  const savePage = async (content: string) => {
    if (user === null) {
      window.alert("⚠️Kirjaudu sisään tallentaaksesi sivun!");
      navigate("/login");
    } else {
      setContent(content);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = async (pageNameInput: string) => {
    const page = {
      pageName: pageNameInput,
      content: content,
    };

    if (
      pageNameInput !== undefined &&
      pageNameInput !== null &&
      pageNameInput !== ""
    ) {
      try {
        await pagesSubCollection.add(page);
        const savedPages = JSON.parse(localStorage.getItem("pages"));
        savedPages.push(pageNameInput);
        localStorage.setItem("pages", JSON.stringify(savedPages));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const downloadPage = () => {
    const fileNameInput = window.prompt("Nimeä tiedosto");

    if (fileNameInput !== null && fileNameInput !== "") {
      const html = localStorage.getItem("htmlResponse") || "";
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${fileNameInput}.html`;
      link.href = url;
      link.click();
    }
  };

  // asetetaan prompt stateen
  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPrompt(event.target.value);
  };
  const hideSettings = () => {
    if (document.getElementById("settingsDiv")!.style.display === "none") {
      document.getElementById("settingsDiv")!.style.display = "block";
      setSettingsMode(true);
    } else {
      document.getElementById("settingsDiv")!.style.display = "none";
      setSettingsMode(false);
    }
  }
  // asetetaan font stateen
  const handleFontSettingsChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFontSettings(event.target.value);
  };
  // asetetaan css framework stateen
  const handleFrameworkSettingsChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFrameworkSettings(event.target.value);
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
    setFrameworkSettings("none selected");
    setFontSettings("none selected");
  }, []);

  // luodaan prompt openai-API:lle
  const colorSwitch = (id: string) => {
    if (id === "Main") {
      setCurrentColor(1);
      setColor(color1);
      document.getElementById("Main")!.style.backgroundColor = "#486584";
      document.getElementById("Accent")!.style.backgroundColor = "#96ADC5";
      document.getElementById("Action")!.style.backgroundColor = "#96ADC5";
    }
    if (id === "Accent") {
      setCurrentColor(2);
      setColor(color2);
      document.getElementById("Main")!.style.backgroundColor = "#96ADC5";
      document.getElementById("Accent")!.style.backgroundColor = "#486584";
      document.getElementById("Action")!.style.backgroundColor = "#96ADC5";
    }
    if (id === "Action") {
      setCurrentColor(3);
      setColor(color3);
      document.getElementById("Main")!.style.backgroundColor = "#96ADC5";
      document.getElementById("Accent")!.style.backgroundColor = "#96ADC5";
      document.getElementById("Action")!.style.backgroundColor = "#486584";
    }
  };
  const makePrompt = () => {
    let finalPrompt = "";
    let frameworkPrompt = framework;
    let fontPrompt = font;
    let colorPrompt = "";
    if (framework === "none selected") {
      frameworkPrompt = "";
    } else {
      frameworkPrompt = " Use " + framework + " css framework.";
    }
    console.log("framework = " + framework);
    console.log("fontti = " + font);
    if (font === "none selected") {
      fontPrompt = "";
    } else {
      fontPrompt = " Use " + font + " font.";
    }
    colorPrompt = " Use " +
    color1 +
    " as main color." +
    " Use " +
    color2 +
    " as accent color." +
    " Use " +
    color3 +
    " as action color. implement the colors using the 60 30 10 rule. Use every color in the ratio of 60 30 10.";
    finalPrompt =
      prompt +
      fontPrompt +
      frameworkPrompt +
      colorPrompt;
    if (settingsMode === false) {
      return prompt;
    }
    else if (settingsMode === true) {
      return finalPrompt;
    } else {
      return prompt;
    }
  };
  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
    const main = document.getElementById("MainColorCode");
    const accent = document.getElementById("AccentColorCode");
    const action = document.getElementById("ActionColorCode");
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
    setLoading(true);

    // lähetetään prompt openai-API:lle ja asetetaan vastaus responseen-stateen
    const settingPrompt = makePrompt();
    const apiResponse = await makeApiRequest(settingPrompt);
    //const apiResponse = await makeApiRequest(settingPrompt);

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

  const clearPrompt = () => {
    localStorage.removeItem("userPrompt");
    localStorage.removeItem("htmlResponse");
    setPrompt("");
    setResponse("");
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
      <div className={style.pageContainer}>
        <SaveModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          content={content}
        />
      </div>

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
          </div>
          <button onClick={() => hideSettings()}>Advanced settings</button>
          <div id="settingsDiv" className={style.secondary}>
            <h2 className={style.settingsHeader}>Settings</h2>

            <div className={style.picker}>
              <ul className={style.colors}>
                <li
                  id="Main"
                  className={style.colorListItem}
                  onClick={() => colorSwitch("Main")}
                >
                  <p>Main</p>
                  <div
                    className={style.colorDisplayBox}
                    style={{ backgroundColor: color1 }}
                  ></div>
                  <p id="MainColorCode" className={style.colorText} style={{ color: color1 }}>
                    #FFFFFF
                  </p>
                </li>

                <li
                  id="Accent"
                  className={style.colorListItem}
                  onClick={() => colorSwitch("Accent")}
                >
                  <p>Accent</p>
                  <div
                    className={style.colorDisplayBox}
                    style={{ backgroundColor: color2 }}
                  ></div>
                  <p id="AccentColorCode" className={style.colorText} style={{ color: color2 }}>
                    #FFFFFF
                  </p>
                </li>

                <li
                  id="Action"
                  className={style.colorListItem}
                  onClick={() => colorSwitch("Action")}
                >
                  <p>Action</p>
                  <div
                    className={style.colorDisplayBox}
                    style={{ backgroundColor: color3 }}
                  ></div>
                  <p id="ActionColorCode" className={style.colorText} style={{ color: color3 }}>
                    #FFFFFF
                  </p>
                </li>
              </ul>
              <SketchPicker
                color={color}
                onChangeComplete={(newColor) => handleColorChange(newColor)}
              />
              <div className={style.drop}>
                <div>
                  <h1>css framework:</h1>
                  <select
                    name="cssframeworkSelect"
                    className={style.select}
                    onChange={handleFrameworkSettingsChange}
                  >
                    <option className={style.selectOption}>
                      none selected
                    </option>
                    <option className={style.selectOption}>tailwindcss</option>
                    <option className={style.selectOption}>materialui</option>
                  </select>
                </div>
                <div>
                  <h1>font style:</h1>
                  <select
                    name="fontSelect"
                    className={style.select}
                    onChange={handleFontSettingsChange}
                  >
                    <option className={style.selectOption}>
                      none selected
                    </option>
                    <option className={style.selectOption}>Arial</option>
                    <option className={style.selectOption}>Verdana</option>
                    <option className={style.selectOption}>Tahoma</option>
                    <option className={style.selectOption}>Trebuchet MS</option>
                    <option className={style.selectOption}>
                      Times New Roman
                    </option>
                    <option className={style.selectOption}>Georgia</option>
                    <option className={style.selectOption}>Garamond</option>
                    <option className={style.selectOption}>Courier New</option>
                    <option className={style.selectOption}>
                      Brush Script MT
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className={style.navHomePrompt}>
            <button className={style.buttonClear} onClick={clearPrompt}>
              tyhjennä
            </button>
            <button className={style.buttonLog} onClick={exportToJSONFile}>
              testi log
            </button>
            <button
              className={`${
                loading
                  ? `${style.buttonGenerate} pointer-events-none disabled`
                  : style.buttonGenerate
              }`}
              onClick={handleApiRequest}
            >
              <p className={loading ? style.textGenerate : "flex-auto"}>
                generoi <SendIcon />
              </p>
            </button>
          </div>
          <div>
            <p className={style.p}>{requestStatus}</p>
            {loading ? <p id="loading" className={style.p}></p> : null}
          </div>

          <div className={style.editBlock}>
            <h2 className={style.editHeader}>muokkaa</h2>
            <textarea
              spellCheck="false"
              readOnly
              className={style.settings}
              value={response}
              onChange={handleResponseChange}
            ></textarea>
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
            <div className={style.navHomePrompt}>
              <button className={style.buttonDownload} onClick={downloadPage}>
                <p className="flex-auto">
                  lataa sivu <DownloadIcon />
                </p>
              </button>
              <button
                className={style.buttonSave}
                onClick={() => savePage(response)}
              >
                <p className="flex-auto">
                  tallenna sivu profiiliin <SaveIcon />
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
