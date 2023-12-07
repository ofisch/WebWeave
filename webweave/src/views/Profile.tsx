import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
// tyylikirjasto
import style from "../assets/style";
// ikonit
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { auth, firestore } from "../utils/firebase";
import { useNavigate } from "react-router";
import { setPageToEdit } from "../context/PageEditContext";
import { Heading } from "../components/Heading";
import DeleteModal from "../components/modals/DeleteModal";
import EditModal from "../components/modals/EditModal";

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
    const localPages: string[] | null = storedPagesJson
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

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pageNameToEdit, setPageNameToEdit] = useState("");

  const handleEdit = (pageName: string) => {
    setPageNameToEdit(pageName);
    console.log("pageNameToEdit:", pageNameToEdit);
    setEditModalOpen(true);
  };

  const handleConfirmEdit = async (newName: string) => {
    setEditModalOpen(false);

    try {
      // haetaan sivun dokumentti
      const docRef = await pagesSubCollectionRef
        .where("pageName", "==", pageNameToEdit)
        .get();

      if (!docRef.empty) {
        // päivitetään dokumentti
        const docSnapshot = docRef.docs[0];
        await pagesSubCollectionRef.doc(docSnapshot.id).update({
          pageName: newName,
        });

        // päivitetään state vain, jos firestore-päivitys onnistuu
        const updatedPages = pages.map((page) =>
          page === pageNameToEdit ? newName : page
        );
        setPages(updatedPages);
        localStorage.setItem("pages", JSON.stringify(updatedPages));
      } else {
        console.log("Dokumenttia ei löytynyt sivulle: ", pageNameToEdit);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
  };

  pages.sort();

  // tulostetaan sivut listaksi
  const listPages = pages.map((item, index) => (
    <li key={index} className={style.sites}>
      <button className={style.sitesButton} onClick={() => goEdit(item)}>
        {item}
      </button>

      {isEditMode && (
        <div className="flex gap-4 justify-self-start self-center">
          <button
            className={style.sitesIconButton}
            onClick={() => handleEdit(item)}
          >
            <EditIcon className={style.sitesEditIcon} />
          </button>
          <button
            className={style.sitesIconButton}
            onClick={() => handleDelete(item)}
          >
            <DeleteIcon className={style.sitesIcon} />
          </button>
        </div>
      )}
    </li>
  ));

  const signOut = async () => {
    localStorage.removeItem("pages");
    await auth.signOut();
    navigate("/");
  };

  const goEdit = (page: string) => {
    setPageToEdit(page);
    navigate("/edit");
  };

  const goTo = (endpoint: string) => {
    navigate(endpoint);
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
        <EditModal
          isOpen={editModalOpen}
          onCancel={handleCancelEdit}
          onSave={handleConfirmEdit}
          initialName={pageNameToEdit}
        />
      </div>

      <div className={style.container}>
        <div className={style.profileTop}>
          <header className={style.header}>
            <Heading />
          </header>
          <main className={style.profile}>
            <div className={style.userInfo}>
              {/*tarkistetaan, onko käyttäjää olemassa, jos on, tulostetaan käyttäjänimi*/}
              {user !== null ? (
                <h2 className={style.username}>{username}</h2>
              ) : (
                <h2 className={style.username}>username</h2>
              )}
              <AccountCircleIcon className={style.icon}></AccountCircleIcon>

              {/*tarkistetaan, onko käyttäjää olemassa, jos on, tulostetaan sähköposti*/}
              {user !== null ? <h3>{user.email}</h3> : <h3>email</h3>}
              {user && (
                <>
                  <div className={style.profileLogout}>
                    <button className={style.buttonProfile} onClick={signOut}>
                      Sign Out
                    </button>
                    <button
                      className={style.buttonProfile}
                      onClick={() => goTo("/logs")}
                    >
                      Log data
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className={style.sitesEdit}>
              <h2 className={style.editH2}>My websites</h2>
            </div>
            <ul className={style.list}>{listPages}</ul>
          </main>
        </div>
        <div className={style.editSection}>
          <button className={style.editButton} onClick={toggleEditMode}>
            {isEditMode ? "Done" : "Edit"}
          </button>
        </div>
      </div>
    </>
  );
};
