import React, { useContext, useEffect, useState } from "react";
import style from "../assets/style";
import { firestore } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import { Profile } from "./Profile";
import { pageToEdit, setPageToEdit } from "../context/PageEditContext";
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Heading } from "../components/Heading";
import AutoResizeIframe from "../components/AutoResizeIframe";
import { loadingAnimation, typePlaceholder } from "../utils/animation";
import { makeApiRequest } from "../utils/openai";

export const Edit = () => {
  const user = useContext(AuthContext);

  const navigate = useNavigate();

  const [htmlEdit, setHtmlEdit] = useState<string>(
    localStorage.getItem("html") || ""
  );
  const [prompt, setPrompt] = React.useState<string>("");
  const promptAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const [response, setResponse] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const usersCollection = firestore.collection("users");
  const userDocRef = usersCollection.doc(user?.uid);
  const pagesSubcollectionRef = userDocRef.collection("pages");

  let currentPage: string;

  //tyhjennetään localStorage, jotta käyttäjä ei näe vilausta edellisestä muokatusta sivusta
  //debugia varten kommentoitu
  localStorage.setItem("html", "");

  const checkPageName = () => {
    if (pageToEdit === undefined) {
      currentPage = localStorage.getItem("pageToEdit");
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

        // Set the content of the iframe
        document.querySelector("iframe").srcdoc = localStorage.getItem("html")!;
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

        console.log("Tallennus onnistui");
      } else {
        console.log("Dokumenttia ei löydy sivulle:", currentPage);
      }
    } catch (error) {
      console.error("Tallennus epäonnistui", error);
    }
  };

  // ai-editori
  const handleApiRequest = async () => {
    const editPrompt = `edit this code: "${htmlEdit}" ${prompt}`;
    console.log("editPrompt", editPrompt);
    setLoading(true);
    const apiResponse = await makeApiRequest(editPrompt);
    console.log("apiResponse", apiResponse);
    setResponse(apiResponse);
    setHtmlEdit(apiResponse);
    setLoading(false);
    localStorage.setItem("html", apiResponse);
    localStorage.setItem("editPrompt", prompt);
  };

  useEffect(() => {
    if (promptAreaRef.current) {
      typePlaceholder(
        promptAreaRef.current,
        "ehdota muutoksia sivuun tähän..."
      );
    }
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
  };

  checkPageName();
  useEffect(() => {
    getPageContent();
  }, []);

  return (
    <>
      <div className={style.container}>
        <div className={style.top}>
          <header className={style.headerNav}>
            <Heading></Heading>
          </header>
          <h2 className={style.editTitle}>{currentPage}</h2>
          <nav className={style.navEdit}>
            <button className={style.button} onClick={goToProfile}>
              <ArrowBackIcon />
              omat sivut
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
            <button className={style.button} onClick={handleApiRequest}>
              generoi muutokset
            </button>
          )}

          <textarea
            className={style.settings}
            placeholder="html-editori (?) sivun muokkaukseen"
            spellCheck="false"
            value={htmlEdit}
            onChange={handleHtmlEditChange}
          ></textarea>
          <button className={style.button} onClick={handlePageSave}>
            tallenna
          </button>
        </div>
      </div>
    </>
  );
};
