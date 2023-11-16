import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
// tyylikirjasto
import style from "../assets/style";
// ikonit
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";

import { auth, firestore } from "../utils/firebase";
import { useNavigate } from "react-router";
import { pageToEdit, setPageToEdit } from "../context/PageEditContext";
import { Heading } from "../components/Heading";
import DeleteModal from "../components/modals/DeleteModal";

export const Profile = () => {
  const user = useContext(AuthContext);

  const [username, setUsername] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();

  const usersCollection = firestore.collection("users");
  const userDocRef = usersCollection.doc(user?.uid);
  const pagesSubCollectionRef = userDocRef.collection("pages");

  const [pages, setPages] = useState<string[]>([]);
  const [pagesLoaded, setPagesLoaded] = useState<boolean>(false);

  // haetaan sivut firestoresta ja lisätään pages-statetaulukoon
  // TEHTY: tarkista, onko pages-taulukossa jo sisältöä, jos on, ei tarvitse hakea uudestaan
  // TEHTY: tee haku kuitenkin uudestaan, kun käyttäjä tallentaa uuden sivun
  useEffect(() => {
    const getPages = async () => {
      try {
        const querySnapshot = await pagesSubCollectionRef.get();
        const pageNames = querySnapshot.docs.map((doc) => doc.data().pageName);
        setPagesLoaded(true);
        setPages(pageNames);
        localStorage.setItem("pages", JSON.stringify(pageNames));
        console.log("pages:", pages);
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };
    const storedPagesJson = localStorage.getItem("pages");
    const localPages: string | null = storedPagesJson
      ? JSON.parse(storedPagesJson)
      : null;
    if (!localPages || localPages.length === 0) {
      getPages();
    } else {
      setPages(localPages);
    }
  }, [pagesLoaded]);

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

  const toggleEditMode = () => {
    setIsEditMode((prevMode) => !prevMode);
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState("");

  const handleDelete = (pageName: string) => {
    setPageToDelete(pageName);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteModalOpen(false);

    try {
      // Query the Firestore to find the document with the given pageName
      const docRef = await pagesSubCollectionRef
        .where("pageName", "==", pageToDelete)
        .get();

      if (!docRef.empty) {
        // Delete the document from Firestore
        const docSnapshot = docRef.docs[0];
        await pagesSubCollectionRef.doc(docSnapshot.id).delete();

        // Update state to reflect the changes only if Firestore deletion is successful
        const updatedPages = pages.filter((page) => page !== pageToDelete);
        setPages(updatedPages);
        localStorage.setItem("pages", JSON.stringify(updatedPages));

        console.log(`Page "${pageToDelete}" deleted successfully.`);
      } else {
        console.log("Document not found for page:", pageToDelete);
      }
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  pages.sort();

  // tulostetaan sivut listaksi
  const listPages = pages.map((item, index) => (
    <li key={index} className={style.sites}>
      <button className={style.sitesButton} onClick={() => goEdit(item)}>
        {item}
      </button>

      {isEditMode && (
        <button
          className={style.sitesIconButton}
          onClick={() => handleDelete(item)}
        >
          <DeleteIcon className={style.sitesIcon} />
        </button>
      )}
    </li>
  ));

  const signOut = async () => {
    localStorage.removeItem("pages");
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
      <div className={style.pageContainer}>
        <DeleteModal
          open={deleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          pageName={pageToDelete}
        />
      </div>

      <div className={style.container}>
        <div className={style.top}>
          <header className={style.header}>
            <div onClick={() => goTo("/")}>
              <h1>&lt;Webweave/&gt;</h1>{" "}
              <button className="transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-125 hover:cursor-pointer hover:opacity-75 duration-70">
                <HomeIcon />
              </button>
            </div>
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
            <div className={style.sitesEdit}>
              <h2 className={style.editH2}>tallennetut sivut</h2>
              <button className={style.editButton} onClick={toggleEditMode}>
                {isEditMode ? "Done" : "Edit"}
              </button>
            </div>
            <ul className={style.list}>{listPages}</ul>
          </main>
        </div>
      </div>
    </>
  );
};
