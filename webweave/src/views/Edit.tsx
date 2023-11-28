import React, { useContext, useEffect, useState } from "react";
import style from "../assets/style";
import { textEdit } from "../utils/textEdit";
import { firestore } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import { pageToEdit } from "../context/PageEditContext";
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from "@mui/icons-material/Info";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import DownloadIcon from "@mui/icons-material/Download";

import { Heading } from "../components/Heading";
import AutoResizeIframe from "../components/AutoResizeIframe";
import { loadingAnimation, typePlaceholder } from "../utils/animation";
import { makeApiRequest, roles } from "../utils/openai";
import SaveModal from "../components/modals/SaveModal";
import DownloadModal from "../components/modals/DownloadModal";
import SaveChangesModal from "../components/modals/SaveChangesModal";

export const Edit = () => {
  const user = useContext(AuthContext);

  const navigate = useNavigate();

  const [htmlEdit, setHtmlEdit] = useState<string>(
    localStorage.getItem("html") || ""
  );
  const [prompt, setPrompt] = React.useState<string>("");
  const promptAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState<string>("");
  const [formToggle, setFormToggle] = useState(true);
  const [requestTime, setRequestTime] = useState<string>("");

  const [toggleAdvEditor, setToggleAdvEditor] = useState<boolean>(false);

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const usersCollection = firestore.collection("users");
  const userDocRef = usersCollection.doc(user?.uid);
  const pagesSubcollectionRef = userDocRef.collection("pages");

  const [roleContent, setRoleContent] = useState<string>("");

  let currentPage: string = "";

  //tyhjennetään localStorage, jotta käyttäjä ei näe vilausta edellisestä muokatusta sivusta
  //debugia varten kommentoitu
  //localStorage.setItem("html", "");

  const checkPageName = () => {
    if (pageToEdit === undefined || pageToEdit === null) {
      currentPage = ""; // annetaan oletusarvo, jotta sivu ei ole null tai undefined
    } else {
      currentPage = pageToEdit;

      localStorage.setItem("pageToEdit", pageToEdit);
    }
  };

  // sivun sisällön haku firestoresta
  // tehokkaampi tapa hakea sivun sisältö firestoresta, vähemmän kutsuja.
  //  ei iteroi koko kokoelmaa läpi, vaan hakee tiettyä dokumenttia heti
  const getPageContent = async () => {
    try {
      const docSnapshot = await pagesSubcollectionRef
        .where("pageName", "==", currentPage)
        .get();

      if (!docSnapshot.empty) {
        const docData = docSnapshot.docs[0].data();
        console.log("docData", docData);
        const content = docData.content;

        // lisätään sivun sisältöön textEdit.script, jotta sivun tekstielementtejä voidaan muokata
        const textEditScript = textEdit.script;
        const contentWithScript = content + textEditScript;

        localStorage.setItem("html", contentWithScript);
        setHtmlEdit(localStorage.getItem("html")!);
      } else {
        // jos sivun dokumenttia ei löydy, tulostetaan virheilmoitus
        console.log("Document not found for pageName:", currentPage);
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  // sivun tallennus firestoreen
  const handlePageSave = async () => {
    try {
      // haetaan sivun dokumentti
      const docRef = await pagesSubcollectionRef
        .where("pageName", "==", currentPage)
        .get();

      if (!docRef.empty) {
        const docSnapshot = docRef.docs[0];
        const docId = docSnapshot.id;

        // päivitetään dokumentti
        await pagesSubcollectionRef.doc(docId).update({
          content: htmlEdit,
        });

        setChangeModalOpen(true);
      } else {
        console.log("Dokumenttia ei löydy sivulle:", currentPage);
      }
    } catch (error) {
      console.error("Tallennus epäonnistui", error);
    }
  };

  //uuden version tallennus firestoreen
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangeModalOpen, setChangeModalOpen] = useState(false);
  const [content, setContent] = useState("");

  const savePage = async (content: string) => {
    setContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setChangeModalOpen(false);
    setIsDownloadModalOpen(false);
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
        await pagesSubcollectionRef.add(page);
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

  // ai-editori
  const handleApiRequest = async () => {
    const startTime = performance.now();
    setRequestStatus("Request in progress");
    setFormToggle(false);

    const editPrompt = `edit this code: "${htmlEdit}" ${prompt} do not do any other changes.`;
    console.log("editPrompt", editPrompt);
    setLoading(true);

    const apiResponse = await makeApiRequest(editPrompt, roleContent);
    console.log("apiResponse", apiResponse);
    setHtmlEdit(apiResponse);
    setLoading(false);

    const currentHtml = localStorage.getItem("html") || "";
    localStorage.setItem("undo", currentHtml);
    localStorage.setItem("redo", "");

    localStorage.setItem("html", apiResponse);
    localStorage.setItem("editPrompt", prompt);

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
          // console.log("updated json: " + updatedData);

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
    // ajastetaan API-pyynnön kesto ja tulostetaan se requestStatusiin
    const startTime = performance.now();
    setRequestStatus("Request in progress");
    setFormToggle(false);
    setLoading(true);

    // lähetetään prompt openai-API:lle ja asetetaan vastaus responseen-stateen
    const settingPrompt = prompt;
    const apiResponse = await makeApiRequest(settingPrompt, roleContent);
    //const apiResponse = await makeApiRequest(settingPrompt);

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
    await setRoleContent(roles.editor);
  };

  const handleOptimize = async () => {
    await setRoleContent(roles.optimizer);
  };

  useEffect(() => {
    const handleEffect = async () => {
      if (roleContent === roles.editor) {
        await handleApiRequest();
        console.log("roleContent", roleContent);
      } else if (roleContent === roles.optimizer) {
        await handleOptimizeApiRequest();
        console.log("roleContent", roleContent);
      }
    };

    handleEffect();
  }, [roleContent]);

  useEffect(() => {
    if (promptAreaRef.current) {
      typePlaceholder(promptAreaRef.current, "suggest changes to the site...");
    }
    const interval = setInterval(() => {
      if (promptAreaRef.current) {
        typePlaceholder(
          promptAreaRef.current,
          "suggest changes to the site..."
        );
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (formToggle) {
      setRequestStatus(requestTime ? "Request Time: " + requestTime : "");
      setLoading(false);
    } else {
      setRequestStatus("Request in progress");
    }
  }, [formToggle, requestTime]);

  useEffect(() => {
    if (loading) {
      loadingAnimation(document.getElementById("loading")!);
    }
  }, [loading]);

  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPrompt(event.target.value);
  };

  const handleUndo = () => {
    const currentHtml = localStorage.getItem("html") || "";
    localStorage.setItem("redo", currentHtml);

    const undoContent = localStorage.getItem("undo");
    if (undoContent) {
      setHtmlEdit(undoContent);
      localStorage.setItem("html", undoContent);
      localStorage.setItem("undo", "");
    }
  };

  const handleRedo = () => {
    const currentHtml = localStorage.getItem("html") || "";
    localStorage.setItem("undo", currentHtml);

    const redoContent = localStorage.getItem("redo");
    if (redoContent) {
      setHtmlEdit(redoContent);
      localStorage.setItem("html", redoContent);
      localStorage.setItem("redo", "");
    }
  };

  const handleHtmlEditChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newHtml = event.target.value;

    localStorage.setItem("html", newHtml);
    setHtmlEdit(newHtml);
  };

  const goToProfile = () => {
    navigate("/profile");
    localStorage.setItem("html", "");
  };

  checkPageName();

  useEffect(() => {
    getPageContent();
    localStorage.setItem("undo", "");
    localStorage.setItem("redo", "");
  }, []);

  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const handleDownloadModalSubmit = async () => {
    closeModal();
  };

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  const handleAdvEditorToggle = () => {
    setToggleAdvEditor(!toggleAdvEditor);
  };

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

      <div className={style.pageContainer}>
        <DownloadModal
          isOpen={isDownloadModalOpen}
          onClose={closeModal}
          onSubmit={handleDownloadModalSubmit}
        />
      </div>

      <div className={style.pageContainer}>
        <SaveChangesModal isOpen={isChangeModalOpen} onClose={closeModal} />
      </div>

      <div className={style.container}>
        <div className={style.top}>
          <header className={style.headerNav}>
            <Heading></Heading>
          </header>
          <h2 className={style.editTitle}>{currentPage}</h2>
          <nav className={style.navEdit}>
            <button className={style.buttonMySites} onClick={goToProfile}>
              <ArrowBackIcon /> My sites
            </button>
            <div>
              {localStorage.getItem("undo") !== "" ? (
                <button
                  className={style.buttonUndo}
                  onClick={() => handleUndo()}
                >
                  <UndoIcon />
                </button>
              ) : (
                <button
                  className={style.buttonUndoDisabled}
                  onClick={() => handleUndo()}
                >
                  <UndoIcon />
                </button>
              )}

              {localStorage.getItem("redo") !== "" ? (
                <button
                  className={style.buttonUndo}
                  onClick={() => handleRedo()}
                >
                  <RedoIcon />
                </button>
              ) : (
                <button
                  className={style.buttonUndoDisabled}
                  onClick={() => handleRedo()}
                >
                  <RedoIcon />
                </button>
              )}
            </div>
            <button
              className={style.editInfoIcon}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <InfoIcon />
              {isTooltipVisible && (
                <div className={style.editTooltip}>
                  Edit text elements by <AdsClickIcon className="text-action" />{" "}
                  double clicking!
                </div>
              )}
            </button>
          </nav>

          <div className={style.editorPreview}>
            <AutoResizeIframe contentSrc={htmlEdit}></AutoResizeIframe>
          </div>

          <div className={style.navHomePrompt}>
            <button
              className={style.buttonDownloadEdit}
              onClick={() => setIsDownloadModalOpen(true)}
            >
              <p className="flex-auto">
                Download page <DownloadIcon />
              </p>
            </button>
            <button
              className={style.buttonLog}
              onClick={() => savePage(htmlEdit)}
            >
              Save as new
            </button>
            <button className={style.buttonSave} onClick={handlePageSave}>
              Save changes
            </button>
          </div>
          <textarea
            placeholder="ehdota muutoksia sivuun tähän..."
            spellCheck="false"
            ref={promptAreaRef}
            className={style.prompt}
            value={prompt}
            onChange={handlePromptChange}
          ></textarea>

          <div className={style.navHomePrompt}>
            {prompt !== "" ? (
              <button
                className={style.buttonLog}
                onClick={() => handleOptimize()}
              >
                Optimize prompt
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
                Generate changes
              </p>
            </button>
          </div>
          <div>
            <p className={style.p}>{requestStatus}</p>
            {loading ? <p id="loading" className={style.p}></p> : null}
          </div>

          {toggleAdvEditor ? (
            <button
              className={"text-action"}
              onClick={() => handleAdvEditorToggle()}
            >
              Advanced editor <ArrowDropUpIcon />
            </button>
          ) : (
            <button
              className={"text-action"}
              onClick={() => handleAdvEditorToggle()}
            >
              Advanced editor <ArrowDropDownIcon />
            </button>
          )}

          {toggleAdvEditor ? (
            <textarea
              className={style.settings}
              placeholder="html-editori (?) sivun muokkaukseen"
              spellCheck="false"
              value={htmlEdit}
              onChange={handleHtmlEditChange}
            ></textarea>
          ) : null}
        </div>
      </div>
    </>
  );
};
