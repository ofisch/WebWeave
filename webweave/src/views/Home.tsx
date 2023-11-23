import React, { useContext, useEffect, useState } from "react";
import style from "../assets/style";
import { Heading } from "../components/Heading";
import { firestore } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import { SketchPicker } from "react-color";
import AutoResizeIframe from "../components/AutoResizeIframe";
import { loadingAnimation, typePlaceholder } from "../utils/animation";
import SaveModal from "../components/modals/SaveModal";
import SendIcon from "@mui/icons-material/Send";
import DownloadIcon from "@mui/icons-material/Download";
import SaveIcon from "@mui/icons-material/Save";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import DownloadModal from "../components/modals/DownloadModal";
import { makeApiRequest, roles } from "../utils/openai";
import NotSignedInModal from "../components/modals/NotSignedInModal";

export const Home = () => {
  const [promptExplanation, setPromptExplanation] = useState<string>("");
  const [settingsMode, setSettingsMode] = useState(false);
  const [color, setColor] = useState("#2C3E50");
  const [currentColor, setCurrentColor] = useState(1);
  const [color1, setColor1] = useState("#2C3E50");
  const [color2, setColor2] = useState("#CCCCCC");
  const [color3, setColor3] = useState("#00BFFF");
  const [framework, setFrameworkSettings] = React.useState<string>("");
  const [font, setFontSettings] = React.useState<string>("");
  const [prompt, setPrompt] = React.useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [requestTime, setRequestTime] = useState<string>("");
  const [requestStatus, setRequestStatus] = useState<string>("");
  const [formToggle, setFormToggle] = useState(true);
  const [loading, setLoading] = useState(false);
  const [roleContent, setRoleContent] = useState<string>("");

  const user = useContext(AuthContext);

  const usersCollection = firestore.collection("users");
  const usersDocRef = usersCollection.doc(user?.uid);
  const pagesSubCollection = usersDocRef.collection("pages");

  const promptAreaRef = React.useRef<HTMLTextAreaElement>(null);

  // tallennetaan sivu firestoreen
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isNotSignedInModalOpen, setIsNotSignedInModalOpen] = useState(false);
  const [content, setContent] = useState("");

  const savePage = async (content: string) => {
    if (user === null) {
      setIsNotSignedInModalOpen(true);
    } else {
      setContent(content);
      setIsSaveModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsSaveModalOpen(false);
    setIsDownloadModalOpen(false);
    setIsNotSignedInModalOpen(false);
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
        const savedPagesItem = localStorage.getItem("pages");
        if (savedPagesItem !== null) {
          const savedPages = JSON.parse(savedPagesItem);
          savedPages.push(pageNameInput);
          localStorage.setItem("pages", JSON.stringify(savedPages));
        }
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

  const hideSettings = () => {
    if (document.getElementById("settingsDiv")!.style.display === "none") {
      document.getElementById("settingsDiv")!.style.display = "block";
      setSettingsMode(true);
    } else {
      document.getElementById("settingsDiv")!.style.display = "none";
      setSettingsMode(false);
    }
  };
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

  // skaalataan iframe sen sisällä olevan sivun kokoiseksi, kun sivu ladataan
  window.onload = () => {
    //resizeIframeToFiContent(iFrame);
  };

  useEffect(() => {
    if (promptAreaRef.current) {
      typePlaceholder(promptAreaRef.current, "describe the page here...");
    }
    const interval = setInterval(() => {
      if (promptAreaRef.current) {
        typePlaceholder(promptAreaRef.current, "describe the page here...");
      }
    }, 3500);

    return () => clearInterval(interval);
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
      document.getElementById("MainColor")!.style.border = "2px solid #486584";
      document.getElementById("AccentColor")!.style.border =
        "2px solid #96ADC5";
      document.getElementById("ActionColor")!.style.border =
        "2px solid #96ADC5";
    }
    if (id === "Accent") {
      setCurrentColor(2);
      setColor(color2);
      document.getElementById("MainColor")!.style.border = "2px solid #96ADC5";
      document.getElementById("AccentColor")!.style.border =
        "2px solid #486584";
      document.getElementById("ActionColor")!.style.border =
        "2px solid #96ADC5";
    }
    if (id === "Action") {
      setCurrentColor(3);
      setColor(color3);
      document.getElementById("MainColor")!.style.border = "2px solid #96ADC5";
      document.getElementById("AccentColor")!.style.border =
        "2px solid #96ADC5";
      document.getElementById("ActionColor")!.style.border =
        "2px solid #486584";
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
    colorPrompt =
      " Use " +
      color1 +
      " as main color." +
      " Use " +
      color2 +
      " as accent color." +
      " Use " +
      color3 +
      " as action color. implement the colors using the 60 30 10 rule. Use every color in the ratio of 60 30 10.";
    finalPrompt = prompt + fontPrompt + frameworkPrompt + colorPrompt;
    if (settingsMode === false) {
      return prompt;
    } else if (settingsMode === true) {
      return finalPrompt;
    } else {
      return prompt;
    }
  };
  const handleColorChange = (newColor: { hex: string }) => {
    console.log("color: ", newColor);
    console.log("colorHex: ", newColor.hex);
    setColor(newColor.hex);
    const main = document.getElementById("MainColorCode");
    const accent = document.getElementById("AccentColorCode");
    const action = document.getElementById("ActionColorCode");
    if (currentColor === 1) {
      setColor1(newColor.hex);
      if (main !== null) {
        main.innerHTML = newColor.hex;
      }
    }
    if (currentColor === 2) {
      setColor2(newColor.hex);
      if (accent !== null) {
        accent.innerHTML = newColor.hex;
      }
    }
    if (currentColor === 3) {
      setColor3(newColor.hex);
      if (action !== null) {
        action.innerHTML = newColor.hex;
      }
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
    const apiResponse = await makeApiRequest(settingPrompt, roleContent);
    //const apiResponse = await makeApiRequest(settingPrompt);

    setResponse(apiResponse);
    console.log(apiResponse);

    // Find the indices of <!DOCTYPE html> and </html>
    const doctypeStartIndex = apiResponse.indexOf("<!DOCTYPE html>");
    const htmlEndIndex = apiResponse.indexOf("</html>") + "</html>".length;

    // Extract the HTML content
    const htmlContent = apiResponse
      .substring(doctypeStartIndex, htmlEndIndex)
      .trim();

    // Extract the rest of the content
    let nonHtmlContent =
      apiResponse.substring(0, doctypeStartIndex) +
      apiResponse.substring(htmlEndIndex).trim();
    // Remove "```html ```"
    nonHtmlContent = nonHtmlContent.replace("```html", " ");
    nonHtmlContent = nonHtmlContent.replace("```", " ");
    // Replace ":" with "."
    nonHtmlContent = nonHtmlContent.replace(/:/g, ".");

    // Print the results (you can use these variables as needed in your project)
    console.log("HTML Content:", htmlContent);
    console.log("\nNon-HTML Content:", nonHtmlContent);
    setPromptExplanation(nonHtmlContent);
    localStorage.setItem("htmlResponse", htmlContent);
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

    setRoleContent("");
  };

  const handleOptimizeApiRequest = async () => {
    // lähetetään prompt openai-API:lle ja asetetaan vastaus responseen-stateen
    const settingPrompt = makePrompt();
    const apiResponse = await makeApiRequest(settingPrompt, roleContent);
    //const apiResponse = await makeApiRequest(settingPrompt);

    setPrompt(apiResponse);
    localStorage.setItem("userPrompt", prompt);

    setRoleContent("");
  };

  const handleGenerate = async () => {
    await setRoleContent(roles.webdev);
  };

  const handleOptimize = async () => {
    await setRoleContent(roles.optimizer);
  };

  useEffect(() => {
    const handleEffect = async () => {
      if (roleContent === roles.webdev) {
        await handleApiRequest();
      } else if (roleContent === roles.optimizer) {
        await handleOptimizeApiRequest();
      }
    };

    handleEffect();
  }, [roleContent]);

  const clearPrompt = () => {
    if (window.confirm("Are you sure you want to clear the prompt?")) {
      localStorage.removeItem("userPrompt");
      localStorage.removeItem("htmlResponse");
      setPrompt("");
      setResponse("");
      setRequestStatus("");
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
      <div className={style.pageContainer}>
        <SaveModal
          isOpen={isSaveModalOpen}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          content={content}
        />
      </div>

      <div className={style.pageContainer}>
        <DownloadModal
          isOpen={isDownloadModalOpen}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
        />
      </div>

      <div className={style.pageContainer}>
        <NotSignedInModal
          isOpen={isNotSignedInModalOpen}
          onClose={closeModal}
        />
      </div>

      <div className={style.container}>
        <div className={style.top}>
          <header className={style.headerNav}>
            <Heading></Heading>
          </header>
          <div className={style.promptBlock}>
            <h2 className={style.promptHeader}>Prompt</h2>
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
          {settingsMode ? (
            <button className={"text-action"} onClick={() => hideSettings()}>
              Advanced settings <ArrowDropUpIcon />
            </button>
          ) : (
            <button className={"text-action"} onClick={() => hideSettings()}>
              Advanced settings <ArrowDropDownIcon />
            </button>
          )}

          <div
            id="settingsDiv"
            style={{ display: "none" }}
            className={style.secondary}
          >
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
                    id="MainColor"
                    className={style.colorDisplayBox}
                    style={{ backgroundColor: color1 }}
                  ></div>
                  <p
                    id="MainColorCode"
                    className={style.colorText}
                    style={{ color: color1 }}
                  >
                    #2C3E50
                  </p>
                </li>

                <li
                  id="Accent"
                  className={style.colorListItem}
                  onClick={() => colorSwitch("Accent")}
                >
                  <p>Accent</p>
                  <div
                    id="AccentColor"
                    className={style.colorDisplayBox}
                    style={{ backgroundColor: color2 }}
                  ></div>
                  <p
                    id="AccentColorCode"
                    className={style.colorText}
                    style={{ color: color2 }}
                  >
                    #CCCCCC
                  </p>
                </li>

                <li
                  id="Action"
                  className={style.colorListItem}
                  onClick={() => colorSwitch("Action")}
                >
                  <p>Action</p>
                  <div
                    id="ActionColor"
                    className={style.colorDisplayBox}
                    style={{ backgroundColor: color3 }}
                  ></div>
                  <p
                    id="ActionColorCode"
                    className={style.colorText}
                    style={{ color: color3 }}
                  >
                    #00BFFF
                  </p>
                </li>
              </ul>
              <SketchPicker
                color={color}
                className={style.sketchPicker}
                onChangeComplete={(newColor) => handleColorChange(newColor)}
              />
              <div className={style.drop}>
                <div>
                  <h1>Css framework:</h1>
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
                  <h1>Font style:</h1>
                  <select
                    name="fontSelect"
                    className={style.select}
                    onChange={handleFontSettingsChange}
                  >
                    <option className={style.selectOption}>
                      none selected
                    </option>
                    <option className={style.selectOptionArial}>Arial</option>
                    <option className={style.selectOptionVerdana}>
                      Verdana
                    </option>
                    <option className={style.selectOptionTahoma}>Tahoma</option>
                    <option className={style.selectOptionTrebuchet}>
                      Trebuchet MS
                    </option>
                    <option className={style.selectOptionTimes}>
                      Times New Roman
                    </option>
                    <option className={style.selectOptionGeorgia}>
                      Georgia
                    </option>
                    <option className={style.selectOptionGaramond}>
                      Garamond
                    </option>
                    <option className={style.selectOptionCourier}>
                      Courier New
                    </option>
                    <option className={style.selectOptionBrush}>
                      Brush Script MT
                    </option>
                    <option className={style.selectOptionComic}>
                      Comic Sans MS
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className={style.navHomePrompt}>
            {response !== "" ? (
              <button className={style.buttonClear} onClick={clearPrompt}>
                Clear
              </button>
            ) : (
              <button className={style.buttonClearDisabled}>Clear</button>
            )}

            <button
              className={style.buttonLog}
              onClick={() => handleOptimize()}
            >
              Optimize prompt
            </button>
            <button
              className={`${
                loading
                  ? `${style.buttonGenerate} pointer-events-none disabled`
                  : style.buttonGenerate
              }`}
              onClick={() => handleGenerate()}
            >
              <p className={loading ? style.textGenerate : "flex-auto"}>
                Generate <SendIcon />
              </p>
            </button>
          </div>
          <div>
            <p className={style.p}>{requestStatus}</p>
            {loading ? <p id="loading" className={style.p}></p> : null}
          </div>
        </div>

        {response !== "" ? (
          <div className={style.secondary}>
            <div className={style.previewBlock}>
              <h2 className={style.previewHeader}>Preview</h2>
              <h2 className={style.previewHeader}>Explanation</h2>
              <div>
                <p className={style.p}>{promptExplanation}</p>
              </div>
              <div className={style.editorPreview}>
                {localStorage.getItem("htmlResponse") !== null ? (
                  <AutoResizeIframe
                    contentSrc={localStorage.getItem("htmlResponse") || ""}
                  ></AutoResizeIframe>
                ) : (
                  <p className={style.p}>No preview available</p>
                )}
              </div>
              <div className={style.navHomePrompt}>
                <button
                  className={style.buttonDownload}
                  onClick={() => setIsDownloadModalOpen(true)}
                >
                  <p className="flex-auto">
                    Download page <DownloadIcon />
                  </p>
                </button>
                <button
                  className={style.buttonSave}
                  onClick={() => savePage(response)}
                >
                  <p className="flex-auto">
                    Save page to profile <SaveIcon />
                  </p>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};
