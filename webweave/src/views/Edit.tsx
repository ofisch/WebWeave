import React, { useContext, useEffect, useState } from "react";
import style from "../assets/style";
import { firestore } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import { pageToEdit } from "../context/PageEditContext";
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Heading } from "../components/Heading";
import AutoResizeIframe from "../components/AutoResizeIframe";
import { loadingAnimation, typePlaceholder } from "../utils/animation";
import { makeApiRequest } from "../utils/openai";
import SaveModal from "../components/modals/SaveModal";
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
      currentPage = ""; // Provide a default value when pageToEdit is undefined or null
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

        localStorage.setItem("html", content);
        setHtmlEdit(localStorage.getItem("html")!);
      } else {
        // Handle the case when the document is not found
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
    const editPrompt = `edit this code: "${htmlEdit}" ${prompt} do not do any other changes.`;
    console.log("editPrompt", editPrompt);
    setLoading(true);
    const apiResponse = await makeApiRequest(editPrompt, roleContent);
    console.log("apiResponse", apiResponse);
    setHtmlEdit(apiResponse);
    setLoading(false);
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

  //
  const handleOptimizeApiRequest = async () => {
    // lähetetään prompt openai-API:lle ja asetetaan vastaus responseen-stateen
    const settingPrompt = prompt;
    const apiResponse = await makeApiRequest(settingPrompt, roleContent);
    //const apiResponse = await makeApiRequest(settingPrompt);

    setPrompt(apiResponse);
    localStorage.setItem("editPrompt", prompt);

    setRoleContent("");
  };

  const handleGenerate = async () => {
    await setRoleContent(
      `You are an AI tool that creates HTML pages from the user's prompt. You don't add any explanations or additional text, only the HTML code. Don't add any markdown. Add modern styling to the page. Add CSS and JavaScript to the same file. Link to CDN libraries if needed.`
    );
  };

  const handleOptimize = async () => {
    await setRoleContent(
      `As an expert writer skilled in crafting concise and clear text, your task is to expand the given website specification, emphasizing the most important points and removing any unnecessary information. Be as verbose as you want. Please do not change the meaning of the text. You can add or remove words, but do not change the meaning of the text. HTML must be valid and respect the HTML5 specification. Design must be responsive. Use simple words and short sentences. Focus on the most important points. The input is from a novice and non-technical person, so you must explain everything in detail and fill in any missing information. Do not create HTML code, just the specification.`
    );
  };

  useEffect(() => {
    const handleEffect = async () => {
      if (
        roleContent ===
        `You are an AI tool that creates HTML pages from the user's prompt. You don't add any explanations or additional text, only the HTML code. Don't add any markdown. Add modern styling to the page. Add CSS and JavaScript to the same file. Link to CDN libraries if needed.`
      ) {
        await handleApiRequest();
      } else if (
        roleContent ===
        `As an expert writer skilled in crafting concise and clear text, your task is to expand the given website specification, emphasizing the most important points and removing any unnecessary information. Be as verbose as you want. Please do not change the meaning of the text. You can add or remove words, but do not change the meaning of the text. HTML must be valid and respect the HTML5 specification. Design must be responsive. Use simple words and short sentences. Focus on the most important points. The input is from a novice and non-technical person, so you must explain everything in detail and fill in any missing information. Do not create HTML code, just the specification.`
      ) {
        await handleOptimizeApiRequest();
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
    if (loading) {
      loadingAnimation(document.getElementById("loading")!);
    }
  }, [loading]);

  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPrompt(event.target.value);
  };

  // todo: tallenna muokattu sivu firestoreen (tallenna-nappi)

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
  }, []);

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
        <SaveChangesModal isOpen={isChangeModalOpen} onClose={closeModal} />
      </div>

      <div className={style.container}>
        <div className={style.top}>
          <header className={style.headerNav}>
            <Heading></Heading>
          </header>
          <h2 className={style.editTitle}>{currentPage}</h2>
          <nav className={style.navEdit}>
            <button className={style.button} onClick={goToProfile}>
              <ArrowBackIcon /> My sites
            </button>
          </nav>
          <div className={style.editorPreview}>
            <AutoResizeIframe contentSrc={htmlEdit}></AutoResizeIframe>
          </div>
          <textarea
            placeholder="ehdota muutoksia sivuun tähän..."
            spellCheck="false"
            ref={promptAreaRef}
            className={style.prompt}
            value={prompt}
            onChange={handlePromptChange}
          ></textarea>
          {loading ? (
            <p id="loading" className={style.p}></p>
          ) : (
            <>
              <button
                className={style.buttonLog}
                onClick={() => handleOptimize()}
              >
                Optimize prompt
              </button>
              <button
                className={style.buttonGenerate}
                onClick={() => handleGenerate()}
              >
                Generate changes
              </button>
            </>
          )}

          <textarea
            className={style.settings}
            placeholder="html-editori (?) sivun muokkaukseen"
            spellCheck="false"
            value={htmlEdit}
            onChange={handleHtmlEditChange}
          ></textarea>
          <div className={style.navHomePrompt}>
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
        </div>
      </div>
    </>
  );
};
