import React, { useContext, useEffect, useState, ChangeEvent } from "react";
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
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import DownloadModal from "../components/modals/DownloadModal";
import { makeApiRequest, roles } from "../utils/openai";
import NotSignedInModal from "../components/modals/NotSignedInModal";
import ClearModal from "../components/modals/ClearModal";
import RemoveImageModal from "../components/modals/RemoveImageModal";

// Generaattori-sivu
export const Home = () => {
  const [fontSizeSettings, setFontSizeSettings] =
    React.useState<string>("normal (16px)");
  const [settingsToggleMode, setSettingsToggleMode] = useState(false);
  const [currentColor, setCurrentColor] = useState(1);
  const [color1, setColor1] = useState(
    localStorage.getItem("color1") || "#2C3E50"
  );
  const [color2, setColor2] = useState(
    localStorage.getItem("color2") || "#CCCCCC"
  );
  const [color3, setColor3] = useState(
    localStorage.getItem("color3") || "#00BFFF"
  );
  const [settingsMode, setSettingsMode] = useState(false);
  const [color, setColor] = useState("#2C3E50");
  const [framework, setFrameworkSettings] = React.useState<string>("");
  const [font, setFontSettings] = React.useState<string>("");

  const [prompt, setPrompt] = React.useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [requestTime, setRequestTime] = useState<string>("");
  const [requestStatus, setRequestStatus] = useState<string>("");
  const [formToggle, setFormToggle] = useState(true);
  const [loading, setLoading] = useState(false);
  const [roleContent, setRoleContent] = useState<string>("");
  const promptAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");

  const user = useContext(AuthContext);
  const usersCollection = firestore.collection("users");
  const usersDocRef = usersCollection.doc(user?.uid);
  const pagesSubCollection = usersDocRef.collection("pages");

  const [toggleImageBank, setToggleImageBank] = useState<boolean>(false);
  const [imageName, setImageName] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [imageList, setImageList] = useState<{ name: string; link: string }[]>(
    []
  );
  const [selectedImageName, setSelectedImageName] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");

  const [clearModalIsOpen, setClearModalIsOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isNotSignedInModalOpen, setIsNotSignedInModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [isTooltipImageVisible, setTooltipImageVisible] = useState(false);

  // tallennetaan sivun sisältö stateen
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
    setIsRemoveModalOpen(false);
  };

  // tallennetaan sivu tietokantaan modalin kautta
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

  const handleDownloadModalSubmit = async () => {
    closeModal();
  };

  // asetetaan prompt stateen
  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPrompt(event.target.value);
  };
  const hideSettings = () => {
    if (document.getElementById("settingsDiv")!.style.display === "none") {
      setSettingsMode(true);
      document.getElementById("settingsDiv")!.style.display = "block";
    } else {
      setSettingsMode(false);
      document.getElementById("settingsDiv")!.style.display = "none";
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

  // Fontin koon valinta settingsissä
  const handleFontSizeSettingsChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFontSizeSettings(event.target.value);
  };
  useEffect(() => {
    if (loading) {
      loadingAnimation(document.getElementById("loading")!, "action");
    }
  }, [loading]);

  useEffect(() => {
    setPrompt(localStorage.getItem("userPrompt") || "");
    setResponse(localStorage.getItem("htmlResponse") || "");
    setFrameworkSettings("none selected");
    setFontSettings("none selected");
  }, []);

  // Vaihdetaan valittu väri
  const colorSwitch = (id: string) => {
    if (id === "Main") {
      setCurrentColor(1);
      setColor(color1);
      localStorage.setItem("color1", color1);
      document.getElementById("MainColor")!.style.border = "2px solid #486584";
      document.getElementById("AccentColor")!.style.border =
        "2px solid #96ADC5";
      document.getElementById("ActionColor")!.style.border =
        "2px solid #96ADC5";
    }
    if (id === "Accent") {
      setCurrentColor(2);
      setColor(color2);
      localStorage.setItem("color2", color2);
      document.getElementById("MainColor")!.style.border = "2px solid #96ADC5";
      document.getElementById("AccentColor")!.style.border =
        "2px solid #486584";
      document.getElementById("ActionColor")!.style.border =
        "2px solid #96ADC5";
    }
    if (id === "Action") {
      setCurrentColor(3);
      setColor(color3);
      localStorage.setItem("color3", color3);
      document.getElementById("MainColor")!.style.border = "2px solid #96ADC5";
      document.getElementById("AccentColor")!.style.border =
        "2px solid #96ADC5";
      document.getElementById("ActionColor")!.style.border =
        "2px solid #486584";
    }
  };

  // Tehdään muokattu versio promptista asetuksien kanssa
  const makePrompt = () => {
    let finalPrompt = "";
    let frameworkPrompt = framework;
    let fontPrompt = font;
    let colorPrompt = "";
    let mainColorPrompt = "";
    let accentColorPrompt = "";
    let actionColorPrompt = "";
    if (framework === "none selected") {
      frameworkPrompt = "";
    } else {
      frameworkPrompt = " Use " + framework + " css framework.";
    }
    if (font === "none selected") {
      fontPrompt = "";
    } else {
      fontPrompt = " Use " + fontSizeSettings + " " + font + " font.";
    }
    if (document.getElementById("Main")!.style.display === "grid") {
      mainColorPrompt = " Use " + color1 + " as main color.";
    }
    if (document.getElementById("Accent")!.style.display === "grid") {
      accentColorPrompt = " Use " + color2 + " as accent color.";
    }
    if (document.getElementById("Action")!.style.display === "grid") {
      actionColorPrompt = " Use " + color3 + " as action color.";
    }
    colorPrompt = mainColorPrompt + accentColorPrompt + actionColorPrompt;
    finalPrompt = prompt + fontPrompt + frameworkPrompt + colorPrompt;
    if (settingsToggleMode === false) {
      return prompt;
    } else if (settingsToggleMode === true) {
      return finalPrompt;
    } else {
      return prompt;
    }
  };

  // Vaihdetaan väriä colorpickerillä
  const handleColorChange = (newColor: { hex: string }) => {
    setColor(newColor.hex);
    const main = document.getElementById("MainColorCode");
    const accent = document.getElementById("AccentColorCode");
    const action = document.getElementById("ActionColorCode");
    if (currentColor === 1) {
      setColor1(newColor.hex);
      localStorage.setItem("color1", newColor.hex);
      if (main !== null) {
        main.innerHTML = newColor.hex;
      }
    }
    if (currentColor === 2) {
      localStorage.setItem("color2", newColor.hex);
      setColor2(newColor.hex);
      if (accent !== null) {
        accent.innerHTML = newColor.hex;
      }
    }
    if (currentColor === 3) {
      localStorage.setItem("color3", newColor.hex);
      setColor3(newColor.hex);
      if (action !== null) {
        action.innerHTML = newColor.hex;
      }
    }
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue === "Main") {
      document.getElementById("Main")!.style.display = "grid";
      colorSwitch("Main");
    }
    if (selectedValue === "Accent") {
      document.getElementById("Accent")!.style.display = "grid";
      colorSwitch("Accent");
    }
    if (selectedValue === "Action") {
      document.getElementById("Action")!.style.display = "grid";
      colorSwitch("Action");
    }
    event.target.value = "Add new color";
  };

  // Valitaan avoinna oleva colorpicker
  const selectOpenColor = () => {
    if (document.getElementById("Main")!.style.display === "grid") {
      colorSwitch("Main");
    } else if (document.getElementById("Accent")!.style.display === "grid") {
      colorSwitch("Accent");
    } else if (document.getElementById("Action")!.style.display === "grid") {
      colorSwitch("Action");
    }
  };

  interface Color {
    hex: string;
  }

  // Suljetaan valittu väri
  const closeColor = (id: string) => {
    if (id === "Main") {
      document.getElementById("Main")!.style.display = "none";
    } else if (id === "Accent") {
      document.getElementById("Accent")!.style.display = "none";
    } else if (id === "Action") {
      document.getElementById("Action")!.style.display = "none";
    }
    selectOpenColor();
  };

  // lähetetään prompt openai-API:lle ja asetetaan vastaus responseen
  const handleApiRequest = async () => {
    // ajastetaan API-pyynnön kesto ja tulostetaan se requestStatusiin
    const startTime = performance.now();
    setRequestStatus("Request in progress");
    setFormToggle(false);
    setLoading(true);

    // lähetetään prompt openai-API:lle ja asetetaan vastaus responseen
    const settingPrompt = makePrompt();
    const apiResponse = await makeApiRequest(settingPrompt, roleContent);

    const doctypeStartIndex = apiResponse.indexOf("<!DOCTYPE html>");
    const htmlEndIndex = apiResponse.indexOf("</html>") + "</html>".length;

    // haetaan API-pyynnön vastauksesta html-sisältö ja tallennetaan se htmlResponse-stateen
    const htmlContent = apiResponse
      .substring(doctypeStartIndex, htmlEndIndex)
      .trim();

    let nonHtmlContent =
      apiResponse.substring(0, doctypeStartIndex) +
      apiResponse.substring(htmlEndIndex).trim();
    nonHtmlContent = nonHtmlContent.replace("```html", " ");
    nonHtmlContent = nonHtmlContent.replace("```", " ");
    nonHtmlContent = nonHtmlContent.replace(/:/g, ".");
    localStorage.setItem("explanation", nonHtmlContent);
    localStorage.setItem("htmlResponse", htmlContent);
    localStorage.setItem("userPrompt", prompt);

    setResponse(localStorage.getItem("htmlResponse") || "");

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

    // jos log.json-tiedosto on olemassa, lisätään siihen API-pyynnön kesto
    if (existingData) {
      try {
        const dataArray = JSON.parse(existingData);

        // haetaan log.json tiedostosta viimeinen objekti ja lisätään siihen requestTime
        if (Array.isArray(dataArray) && dataArray.length > 0) {
          const lastObject = dataArray[dataArray.length - 1];
          lastObject.requestTime = formattedTime;

          const updatedData = JSON.stringify(dataArray);

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

  // Optimointi API-pyynnön käsittely
  const handleOptimizeApiRequest = async () => {
    // ajastetaan API-pyynnön kesto ja tulostetaan se requestStatusiin
    const startTime = performance.now();
    setRequestStatus("Request in progress");
    setFormToggle(false);
    setLoading(true);

    // lähetetään prompt openai-API:lle ja asetetaan vastaus responseen-stateen
    const settingPrompt = makePrompt();
    const apiResponse = await makeApiRequest(settingPrompt, roleContent);

    setPrompt(apiResponse);
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

  const closeClearModal = () => {
    setClearModalIsOpen(false);
  };

  const clearPrompt = () => {
    setClearModalIsOpen(true);
  };

  const handleClearModalSubmit = async () => {
    setClearModalIsOpen(false);
    localStorage.removeItem("userPrompt");
    localStorage.removeItem("htmlResponse");
    setPrompt("");
    setResponse("");
    setRequestStatus("");
  };

  useEffect(() => {
    if (formToggle) {
      setRequestStatus(requestTime ? "Request Time: " + requestTime : "");
      setLoading(false);
    } else {
      setRequestStatus("Request in progress");
    }
  }, [formToggle, requestTime]);

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  const handleMouseEnterImage = () => {
    setTooltipImageVisible(true);
  };

  const handleMouseLeaveImage = () => {
    setTooltipImageVisible(false);
  };

  const handleImageBankToggle = () => {
    setToggleImageBank(!toggleImageBank);
  };

  useEffect(() => {
    const storedImages = localStorage.getItem("imageList");
    if (storedImages) {
      setImageList(
        JSON.parse(storedImages) as { name: string; link: string }[]
      );
    }
  }, []);

  // Tallennetaan uusi kuva imageListiin
  const handleAddImage = () => {
    const newImage = { name: imageName, link: imageLink };
    const updatedList = [...imageList, newImage];
    setImageList(updatedList);

    const imagePrompt = `Add this image to the site: ${imageLink}`;

    setPrompt((prevPrompt) => `${prevPrompt}\n\n${imagePrompt}`);

    localStorage.setItem("imageList", JSON.stringify(updatedList));

    setImageName("");
    setImageLink("");
  };

  // Lisätään valittu kuva promptiin
  const handleAddSelectedImage = () => {
    if (selectedImage) {
      const imagePrompt = `Add this image to the site: ${selectedImage}`;
      setPrompt((prevPrompt) => `${prevPrompt}\n\n${imagePrompt}`);
    } else {
      console.error("No image selected");
    }
  };

  // Poistetaan valittu kuva imageLististä
  const handleRemoveSelectedImage = () => {
    if (selectedImage) {
      const updatedImageList = imageList.filter(
        (image) => image.link !== selectedImage
      );
      setImageList(updatedImageList);

      localStorage.setItem("imageList", JSON.stringify(updatedImageList));
      setSelectedImage("");
      setIsRemoveModalOpen(false);
    } else {
      console.error("No image selected");
    }
  };

  // Valitaan kuva imageLististä
  const handleImageSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedImageName = e.target.value;
    setSelectedImageName(selectedImageName);
    const selectedImage = imageList.find(
      (image) => image.name === selectedImageName
    );
    if (selectedImage) {
      setSelectedImage(selectedImage.link);
    } else {
      setSelectedImage("");
    }
  };

  return (
    <>
      <div className={style.pageContainer}>
        <SaveModal
          isOpen={isSaveModalOpen}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          content={content}
        />

        <DownloadModal
          isOpen={isDownloadModalOpen}
          onClose={closeModal}
          onSubmit={handleDownloadModalSubmit}
        />

        <RemoveImageModal
          open={isRemoveModalOpen}
          onClose={closeModal}
          onConfirm={handleRemoveSelectedImage}
          imageName={selectedImageName}
        />

        <NotSignedInModal
          isOpen={isNotSignedInModalOpen}
          onClose={closeModal}
        />

        <ClearModal
          isOpen={clearModalIsOpen}
          onClose={closeClearModal}
          onConfirm={handleClearModalSubmit}
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

          <div className={style.ternanryContainer}>
            <div className={style.ternarySetting}>
              {settingsToggleMode ? (
                <div className={style.advSettings}>
                  <button
                    className={style.advSettingsToggleOff}
                    onClick={() => setSettingsToggleMode(false)}
                  >
                    <ToggleOnIcon />
                  </button>
                  <button
                    className={style.advSettingsText}
                    onClick={() => hideSettings()}
                  >
                    Advanced settings
                    {settingsMode ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </button>
                </div>
              ) : (
                <div className={style.advSettings}>
                  <button
                    className={style.advSettingsToggleOn}
                    onClick={() => setSettingsToggleMode(true)}
                  >
                    <ToggleOffIcon />
                  </button>
                  <button
                    className={style.advSettingsText}
                    onClick={() => hideSettings()}
                  >
                    Advanced settings
                    {settingsMode ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </button>
                </div>
              )}
            </div>

            <div className={style.ternaryImage}>
              {toggleImageBank ? (
                <button
                  className={"text-action"}
                  onClick={() => handleImageBankToggle()}
                >
                  Image bank <ArrowDropUpIcon />
                </button>
              ) : (
                <button
                  className={"text-action"}
                  onClick={() => handleImageBankToggle()}
                >
                  Image bank <ArrowDropDownIcon />
                </button>
              )}
            </div>
          </div>

          <div
            id="settingsDiv"
            style={{ display: "none" }}
            className="p-4 max-w-5xl rounded-lg bg-primarylight"
          >
            <h2 className={style.settingsHeader}>Settings</h2>
            <div className="grid gap-4 grid-cols-4 xs:grid-cols-1">
              <div className="flex col-span-4 flex-col md:col-span-1">
                <select
                  name="colorpicker"
                  className={style.colorSelect}
                  onChange={handleSelectChange}
                >
                  <option className={style.selectOption}>Add new color</option>
                  <option className={style.selectOption}>Main</option>
                  <option className={style.selectOption}>Accent</option>
                  <option className={style.selectOption}>Action</option>
                </select>
                <ul className={style.colors}>
                  <li
                    id="Main"
                    className={style.colorListItem}
                    style={{ display: "none" }}
                  >
                    <div
                      id="MainColor"
                      className={style.colorDisplayBox}
                      style={{ backgroundColor: color1 }}
                      onClick={() => colorSwitch("Main")}
                    ></div>
                    <div className="text-left">
                      <p>Main</p>
                      <p
                        id="MainColorCode"
                        className={style.colorText}
                        style={{ color: color1 }}
                      >
                        #2C3E50
                      </p>
                    </div>
                    <CloseIcon
                      className="text-red-500 hover:text-red-800 scale-150"
                      onClick={() => closeColor("Main")}
                    />
                  </li>
                  <li
                    id="Accent"
                    className={style.colorListItem}
                    style={{ display: "none" }}
                  >
                    <div
                      id="AccentColor"
                      className={style.colorDisplayBox}
                      style={{ backgroundColor: color2 }}
                      onClick={() => colorSwitch("Accent")}
                    ></div>
                    <div className="text-left">
                      <p>Accent</p>
                      <p
                        id="AccentColorCode"
                        className={style.colorText}
                        style={{ color: color2 }}
                      >
                        #2C3E50
                      </p>
                    </div>
                    <CloseIcon
                      className="text-red-500 hover:text-red-800 scale-150"
                      onClick={() => closeColor("Accent")}
                    />
                  </li>
                  <li
                    id="Action"
                    className={style.colorListItem}
                    style={{ display: "none" }}
                  >
                    <div
                      id="ActionColor"
                      className={style.colorDisplayBox}
                      style={{ backgroundColor: color3 }}
                      onClick={() => colorSwitch("Action")}
                    ></div>
                    <div className="text-left">
                      <p>Action</p>
                      <p
                        id="ActionColorCode"
                        className={style.colorText}
                        style={{ color: color3 }}
                      >
                        #2C3E50
                      </p>
                    </div>
                    <CloseIcon
                      className="text-red-500 hover:text-red-800 scale-150"
                      onClick={() => closeColor("Action")}
                    />
                  </li>
                </ul>
              </div>
              <SketchPicker
                color={color}
                className={style.sketchPicker}
                onChangeComplete={(newColor: Color) =>
                  handleColorChange(newColor)
                }
              />
              <div className={style.settingsDropdown}>
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
                <div>
                  <h1>Font size:</h1>
                  <select
                    name="fontSizeSelect"
                    className={style.select}
                    onChange={handleFontSizeSettingsChange}
                  >
                    <option className={style.selectOption}>small (12px)</option>
                    <option className={style.selectOption}>
                      normal (16px)
                    </option>
                    <option className={style.selectOption}>big (20px)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {toggleImageBank ? (
            <div className={style.imageBank}>
              <div className={style.imageBankHeading}>
                <h2 className={style.imageBankHeader}>Image bank</h2>
                <button
                  className={style.previewImageInfo}
                  onMouseEnter={handleMouseEnterImage}
                  onMouseLeave={handleMouseLeaveImage}
                >
                  <InfoIcon />
                  {isTooltipImageVisible && (
                    <div className={style.infoTooltip}>
                      Save images to the image bank by adding a name and a link.
                      Use the select menu to add an image to the prompt.
                    </div>
                  )}
                </button>
              </div>

              <div className={style.imageBankaInputs}>
                <input
                  type="text"
                  placeholder="Name of the image..."
                  className={style.imageNameInput}
                  value={imageName}
                  onChange={(e) => setImageName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Add a new image link..."
                  className={style.imageAddInput}
                  value={imageLink}
                  onChange={(e) => setImageLink(e.target.value)}
                />
                <button
                  className={style.buttonAddImage}
                  onClick={handleAddImage}
                >
                  Add new image
                </button>
              </div>
              <select
                name="images"
                id="imageBank"
                className={style.addImageSelect}
                onChange={handleImageSelection}
              >
                <option className={style.selectOption}>Saved images</option>
                {imageList.map((image, index) => (
                  <option key={index} value={image.name}>
                    {image.name}
                  </option>
                ))}
              </select>
              {selectedImage && (
                <>
                  <div className={style.imagePreview}>
                    <h3 className={style.imagePreviewH3}>Selected Image:</h3>
                    <div className={style.imagePreviewImgContainer}>
                      <img
                        src={selectedImage}
                        alt="Selected image"
                        className={style.imagePreviewImg}
                      />
                    </div>
                  </div>
                  <div className={style.buttonAddContainer}>
                    <button
                      className={style.buttonRemoveSelectedImage}
                      onClick={() => setIsRemoveModalOpen(true)}
                    >
                      Remove image
                    </button>
                    <button
                      className={style.buttonAddSelectedImage}
                      onClick={handleAddSelectedImage}
                    >
                      Use image
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : null}

          <div className={style.navHomePrompt}>
            {response !== "" ? (
              <button className={style.buttonClear} onClick={clearPrompt}>
                Clear
              </button>
            ) : (
              <button className={style.buttonClearDisabled}>Clear</button>
            )}

            {prompt !== "" ? (
              <button
                className={`${
                  loading
                    ? `${style.buttonLog} pointer-events-none disabled`
                    : style.buttonLog
                }`}
                onClick={() => handleOptimize()}
              >
                <p className={loading ? style.textGenerate : ""}>
                  Optimize prompt
                </p>
              </button>
            ) : (
              <button className={style.buttonClearDisabled}>
                Optimize prompt
              </button>
            )}
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
              <div className={style.previewContent}>
                <h2 className={style.previewHeader}>Preview</h2>
                <button
                  className={style.previewInfo}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <InfoIcon />
                  {isTooltipVisible && (
                    <div className={style.infoTooltip}>
                      {localStorage.getItem("explanation") === "" ? (
                        <p>No explanation available</p>
                      ) : (
                        localStorage.getItem("explanation") || ""
                      )}
                    </div>
                  )}
                </button>
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
                    Download <DownloadIcon />
                  </p>
                </button>
                <button
                  className={style.buttonSaveHome}
                  onClick={() => savePage(response)}
                >
                  <p className="flex-auto">
                    Save to profile <SaveIcon />
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
