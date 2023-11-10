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

export const Edit = () => {
  const user = useContext(AuthContext);

  const navigate = useNavigate();

  let [htmlEdit, setHtmlEdit] = useState<string>(
    localStorage.getItem("html") || ""
  );

  const usersCollection = firestore.collection("users");
  const userDocRef = usersCollection.doc(user?.uid);
  const pagesSubcollectionRef = userDocRef.collection("pages");

  let currentPage: string;

  //tyhjennetään localStorage, jotta käyttäjä ei näe vilausta edellisestä muokatusta sivusta
  //debugia varten kommentoitu
  //localStorage.setItem("html", "");

  const checkPageName = () => {
    if (pageToEdit === undefined) {
      currentPage = localStorage.getItem("pageToEdit");
    } else {
      currentPage = pageToEdit;

      localStorage.setItem("pageToEdit", pageToEdit);
    }
  };

  /*
  // tehokkaampi tapa hakea sivun sisältö firestoresta, vähemmän kutsuja. 
  //  ei iteroi koko kokoelmaa läpi, vaan hakee tiettyä dokumenttia heti 
  const getPageContent = async () => {
  try {
    const docSnapshot = await pagesSubcollectionRef
      .where("pageName", "==", currentPage)
      .get();

    if (!docSnapshot.empty) {
      const docData = docSnapshot.docs[0].data();
      const content = docData.content;

      localStorage.setItem("html", content);
      setHtmlEdit(content);

      // Set the content of the iframe
      document.querySelector("iframe").srcdoc = content;
    } else {
      // Handle the case when the document is not found
      console.log("Document not found for pageName:", currentPage);
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};
  */

  const getPageContent = async () => {
    try {
      const querySnapshot = await pagesSubcollectionRef.get();

      querySnapshot.forEach((doc) => {
        /*
        const pageData = doc.data();
        const content = pageData.content;
        console.log("content", content);
        */
        if (doc.data().pageName === currentPage) {
          //return doc.data().content;
          localStorage.setItem("html", doc.data().content);
          setHtmlEdit(localStorage.getItem("html")!);
          // asetetaan uuden muokattavan sivun html-sisältö esikatseluun
          document.querySelector("iframe").srcdoc =
            localStorage.getItem("html");
        }
      });
    } catch (error) {
      //return null;
      console.log("hehe");
    }
  };

  //todo: tallenna muokattu sivu firestoreen (tallenna-nappi)

  const handleHtmlEditChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newHtml = event.target.value;
    localStorage.setItem("html", newHtml);
    setHtmlEdit((htmlEdit = newHtml));
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  checkPageName();
  getPageContent();

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
            className={style.settings}
            placeholder="html-editori (?) sivun muokkaukseen"
            value={htmlEdit}
            onChange={handleHtmlEditChange}
          ></textarea>
          <button className={style.button}>tallenna</button>
        </div>
      </div>
    </>
  );
};
