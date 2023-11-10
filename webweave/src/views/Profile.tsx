import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
// tyylikirjasto
import style from "../assets/style";
// ikonit
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { auth, firestore } from "../utils/firebase";
import { useNavigate } from "react-router";
import { pageToEdit, setPageToEdit } from "../context/PageEditContext";
import { Heading } from "../components/Heading";

export const Profile = () => {
  const user = useContext(AuthContext);

  const [username, setUsername] = useState<string>("");

  const navigate = useNavigate();

  const usersCollection = firestore.collection("users");
  const userDocRef = usersCollection.doc(user?.uid);
  const pagesSubCollectionRef = userDocRef.collection("pages");

  const [pages, setPages] = useState<string[]>([]);

  // haetaan sivut firestoresta ja lisätään pages-statetaulukoon
  // todo: tarkista, onko pages-taulukossa jo sisältöä, jos on, ei tarvitse hakea uudestaan
  // todo: tee haku kuitenkin uudestaan, kun käyttäjä tallentaa uuden sivun
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
  }, [pagesSubCollectionRef]);

  useEffect(() => {
    if (user) {
      const userRef = firestore.collection("users").doc(user.uid);
      userRef.get().then((doc) => {
        if (doc.exists) {
          setUsername(doc.data()?.username);
        }
      });
    }
  }, [user]);

  // tulostetaan sivut listaksi
  const listPages = pages.map((item, index) => (
    <li key={index}>
      <button className={style.buttonPage} onClick={() => goEdit(item)}>
        {item}
      </button>
    </li>
  ));

  const signOut = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const goTo = (endpoint: string) => {
    navigate(endpoint);
  };

  const goEdit = (page: string) => {
    setPageToEdit(page);
    navigate("/edit");
  };

  return (
    <>
      <div className={style.container}>
        <div className={style.top}>
          <header className={style.header}>
            <h1
              onClick={() => goTo("/")}
              className="transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-125 hover:cursor-pointer hover:opacity-75 duration-70"
            >
              &lt;Webweave/&gt;
            </h1>
          </header>
          <main className={style.profile}>
            <div className={style.userInfo}>
              {/*tarkistetaan, onko käyttäjää olemassa, jos on, tulostetaan käyttäjänimi*/}
              {user !== null ? (
                <h2 className={style.username}>{username}</h2>
              ) : (
                <h2 className={style.username}>käyttäjänimi</h2>
              )}
              <AccountCircleIcon className={style.icon}></AccountCircleIcon>
              {/*tarkistetaan, onko käyttäjää olemassa, jos on, tulostetaan sähköposti*/}
              {user !== null ? <h3>{user.email}</h3> : <h3>sähköposti</h3>}
              {user && (
                <button className={style.button} onClick={signOut}>
                  Sign Out
                </button>
              )}
            </div>
            <h2 className={style.h2}>tallennetut sivut</h2>
            <ul className={style.list}>{listPages}</ul>
          </main>
        </div>
      </div>
    </>
  );
};
