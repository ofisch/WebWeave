import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
// tyylikirjasto
import style from "../assets/style";
// ikonit
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { firestore } from "../firebase";

export const Profile = () => {
  const user = useContext(AuthContext);

  const usersCollection = firestore.collection("users");
  const userDocRef = usersCollection.doc(user?.uid);
  const pagesSubCollectionRef = userDocRef.collection("pages");

  const [pages, setPages] = useState<string[]>([]);

  // haetaan sivut firestoresta ja lisätään pages-statetaulukoon
  useEffect(() => {
    const getPages = async () => {
      try {
        const querySnapshot = await pagesSubCollectionRef.get();
        const pageNames = querySnapshot.docs.map((doc) => doc.data().pageName);
        setPages(pageNames);
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };
    getPages();
  });

  const listPages = pages.map((item, index) => (
    <li key={index}>
      <button className={style.buttonPage}>{item}</button>
    </li>
  ));

  return (
    <>
      <div className={style.container}>
        <div className={style.top}>
          <header className={style.header}>
            <h1>&lt;Webweave/&gt;</h1>
          </header>
          <main className={style.profile}>
            <div className={style.userInfo}>
              {/*tarkistetaan, onko käyttäjää olemassa, jos on, tulostetaan sähköposti*/}
              {user !== null ? <h3>{user.email}</h3> : <h3>sähköposti</h3>}
              <AccountCircleIcon className={style.icon}></AccountCircleIcon>
            </div>
            <h2 className={style.h2}>tallennetut sivut</h2>
            <ul className={style.list}>{listPages}</ul>
          </main>
        </div>
      </div>
    </>
  );
};
