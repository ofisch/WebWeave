import React, { useContext, useEffect, useState } from "react";
import style from "../assets/style";
import { firestore } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { Profile } from "./Profile";
import { pageToEdit, setPageToEdit } from "../context/PageEditContext";
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Heading } from "../components/Heading";

export const Edit = () => {
  const user = useContext(AuthContext);

  const navigate = useNavigate();

  const usersCollection = firestore.collection("users");
  const userDocRef = usersCollection.doc(user?.uid);
  const pagesSubcollectionRef = userDocRef.collection("pages");

  let currentPage: string;

  const checkPageName = () => {
    if (pageToEdit === undefined) {
      currentPage = localStorage.getItem("pageToEdit");
    } else {
      currentPage = pageToEdit;
      localStorage.setItem("pageToEdit", pageToEdit);
    }
  };

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
          console.log(doc.data().content);
          localStorage.setItem("html", doc.data().content);
        }
      });
    } catch (error) {
      //return null;
      console.log("hehe");
    }
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
            <iframe
              srcDoc={localStorage.getItem("html")}
              className={style.iframe}
            ></iframe>
          </div>
          <textarea
            className={style.settings}
            placeholder="html-editori (?) sivun muokkaukseen"
          ></textarea>
          <button className={style.button}>css framework</button>
        </div>
      </div>
    </>
  );
};
