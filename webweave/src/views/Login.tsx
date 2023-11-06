import React, { useContext, useEffect, useRef, useState } from "react";
import style from "../assets/style";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import { firestore } from "../firebase";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";

export const Login = () => {
  //haetaan käyttäjä
  const user = useContext(AuthContext);

  //käyttäjänimi
  const [username, setUsername] = useState("");

  //input-kenttien arvot
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfRef = useRef<HTMLInputElement>(null);

  //virheviestit
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");

  //sähköpostin tarkistus
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const navigate = useNavigate();

  //lisätään käyttäjä firestoreen
  const addUserToDatabase = async (
    id: string,
    username: string,
    email: string
  ) => {
    try {
      await firestore.collection("users").doc(id).set({
        username: username,
        email: email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  //käyttäjän luomis funktio
  const createAccount = async () => {
    //haetaan input-kenttien arvot
    const usernameValue = usernameRef.current!.value;
    const emailValue = emailRef.current!.value;
    const passwordValue = passwordRef.current!.value;
    const passwordConfValue = passwordConfRef.current!.value;

    //haetaan firestore-kokoelma
    const usersCollection = firestore.collection("users");

    //virheet talteen
    const errors = [];

    //tarkistetaan onko kentät tyhjiä
    if (!emailValue || !passwordValue || !passwordConfValue) {
      errors.push("Please fill in all of the fields");
    }

    //tarkistetaan käyttäjänimen pituus
    if (usernameValue.length < 3) {
      errors.push("Username should be atleast 3 characters");
    }

    //tarkistetaan onko käyttäjänimi jo käytössä
    if (usernameValue.length > 3) {
      const querySnapshot = await usersCollection
        .where("username", "==", usernameValue)
        .get();

      if (querySnapshot.size > 0) {
        errors.push("Username already taken");
      }
    }

    //tarkistetaan onko sähköposti oikeassa muodossa
    if (!emailPattern.test(emailValue)) {
      errors.push("Invalid email format");
    }

    //tarkistetaan onko salasanat samat
    if (passwordValue !== passwordConfValue) {
      errors.push("Password doesn't match");
    }

    //tarkistetaan onko salasana vähintään 6 merkkiä pitkä
    if (passwordValue.length < 6) {
      errors.push("Password should be at least 6 charachters");
    }

    //tulostetaan virheet
    if (errors.length > 0) {
      setErrorMessage(errors.join(", "));
      return;
    }

    //luodaan käyttäjä
    try {
      await auth.createUserWithEmailAndPassword(emailValue, passwordValue);
      //lisätään käyttäjä firestore-dokumenttiin sivujen tallennusta varten
      auth.onAuthStateChanged((user) => {
        if (user) {
          const uid = user.uid;
          addUserToDatabase(uid, usernameValue, emailValue);
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        const errorCode: string = error.code;

        //tarkistetaan onko sähköposti jo käytössä
        if (errorCode == "auth/email-already-in-use") {
          errors.push("Email already in use");

          if (errors.length > 0) {
            setErrorMessage(errors.join(", "));
            return;
          }
        } else {
          console.log(error);
        }
      }
    }
  };

  //sisäänkirjautumis funktio
  const signIn = async () => {
    const emailValue = emailRef.current!.value;
    const passwordValue = passwordRef.current!.value;

    const errors: string[] = [];
    const passwordMessage: string = "Forgot your password?";

    //tarkistetaan onko kentät tyhjiä
    if (!emailValue || !passwordValue) {
      errors.push("Please fill in all of the fields");
    }

    //tarkistetaan onko salasana vähintään 6 merkkiä pitkä
    if (!passwordValue.length) {
      errors.push("Password should be at least 6 characters");
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(", "));
      return;
    }

    //tarkistetaan onko sähköposti oikeassa muodossa
    const isEmail = emailPattern.test(emailValue);

    //kirjaudutaan sisään sähköpostilla tai käyttäjänimellä
    try {
      if (isEmail) {
        await auth.signInWithEmailAndPassword(emailValue, passwordValue);
      } else {
        //haetaan käyttäjä firestoresta
        const querySnapshot = await firestore
          .collection("users")
          .where("username", "==", emailValue)
          .get();

        if (querySnapshot.size === 0) {
          //jos käyttäjää ei löydy, tulostetaan virhe
          errors.push("Incorrect email, username, or password");
          setErrorMessage(errors.join(", "));
          setPasswordMessage(passwordMessage);
        } else {
          //jos käyttäjä löytyy, kirjaudutaan sisään
          querySnapshot.forEach(async (doc) => {
            const user = doc.data();
            try {
              await auth.signInWithEmailAndPassword(user.email, passwordValue);
            } catch (error) {
              errors.push("Incorrect email, username, or password");
            }
          });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        errors.push("Incorrect email, username, or password");
        console.log(error);
      }
    }

    //tulostetaan virheet
    if (errors.length > 0) {
      setErrorMessage(errors.join(", "));
      setPasswordMessage(passwordMessage);
    }
  };

  //uloskirjautuminen
  const signOut = async () => {
    await auth.signOut();
    setErrorMessage("");
  };

  //haetaan käyttäjänimi firestoresta
  useEffect(() => {
    if (user) {
      const userRef = firestore.collection("users").doc(user.uid);
      userRef.get().then((doc) => {
        if (doc.exists) {
          setUsername(doc.data().username);
        }
      });
    }
  }, [user]);

  //salasanan resetointi sähköpostilla
  const sendPasswordResetEmail = () => {
    if (emailRef) {
      const email: string = emailRef.current!.value;

      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          console.log("Password reset email sent!");
        })
        .catch((error: any) => {
          console.error(error.message);
        });
    } else {
      console.error("Email input element not found");
    }
  };

  //siirrytään sivulle
  const goTo = (endpoint: string) => {
    navigate(endpoint);
  };

  //kirjautumis- ja rekisteröitymisnäkymän vaihtaminen
  const [formToggle, setFormToggle] = useState(true);
  const toggle = () => {
    setFormToggle(!formToggle);
    setErrorMessage("");
  };

  return (
    <>
      {user && (
        <button className={style.button} onClick={signOut}>
          Sign Out
        </button>
      )}
      {!user ? (
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
            <form className={style.form}>
              <h2 className={style.h2}>{formToggle ? "Login" : "Sign up"}</h2>
              {formToggle ? null : (
                <input
                  className={style.input}
                  ref={usernameRef}
                  placeholder="username"
                />
              )}
              <input
                className={style.input}
                ref={emailRef}
                type="email"
                placeholder={formToggle ? "username or email" : "email"}
              />
              <input
                className={style.input}
                ref={passwordRef}
                type="password"
                placeholder="password"
              />

              <button className={style.link} onClick={sendPasswordResetEmail}>
                {passwordMessage}
              </button>

              {formToggle ? (
                <div className={style.form}>
                  <p className={style.error}>{errorMessage}</p>
                  <button
                    className={style.button}
                    onClick={signIn}
                    type="button"
                  >
                    Login
                  </button>
                  <p className={style.p}>
                    Don't have an account?{" "}
                    <button
                      className={style.link}
                      onClick={toggle}
                      type="button"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              ) : (
                <div className={style.form}>
                  <p className={style.error}>{errorMessage}</p>
                  <button
                    className={style.button}
                    onClick={createAccount}
                    type="button"
                  >
                    Sign up
                  </button>
                  <p className={style.p}>
                    Already have an account?{" "}
                    <button
                      className={style.link}
                      onClick={toggle}
                      type="button"
                    >
                      Login
                    </button>
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      ) : (
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
              <h2 className={style.h2}>Welcome {username}</h2>
              <ul className={style.list}>
                <li>
                  <button
                    className={style.buttonPage}
                    onClick={() => goTo("/")}
                  >
                    Start creating!
                  </button>
                </li>
                <li>
                  <button
                    className={style.buttonPage}
                    onClick={() => goTo("/profile")}
                  >
                    My profile
                  </button>
                </li>
              </ul>
            </main>
          </div>
        </div>
      )}
    </>
  );
};
