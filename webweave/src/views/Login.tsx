import React, { useContext, useRef, useState } from "react";
import style from "../assets/style";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import { firestore } from "../firebase";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const user = useContext(AuthContext);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const addUserToDatabase = async (id: string, email: string) => {
    try {
      await firestore.collection("users").doc(id).set({
        email: email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createAccount = async () => {
    if (passwordRef.current!.value !== passwordConfRef.current!.value) {
      alert("Password does not match");
      return;
    }

    try {
      await auth.createUserWithEmailAndPassword(
        emailRef.current!.value,
        passwordRef.current!.value
      );
      //lisätään käyttäjä firestore-dokumenttiin sivujen tallennusta varten
      auth.onAuthStateChanged((user) => {
        if (user) {
          const uid = user.uid;
          addUserToDatabase(uid, emailRef.current!.value);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const signIn = async () => {
    try {
      await auth.signInWithEmailAndPassword(
        emailRef.current!.value,
        passwordRef.current!.value
      );
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    await auth.signOut();
  };

  const goTo = (endpoint: string) => {
    navigate(endpoint);
  };

  const [formToggle, setFormToggle] = useState(true);
  const toggle = () => {
    setFormToggle(!formToggle);
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
              <h1>&lt;Webweave/&gt;</h1>
            </header>
            <form className={style.form}>
              <h2 className={style.h2}>{formToggle ? "Login" : "Sign up"}</h2>
              <input
                className={style.input}
                ref={emailRef}
                type="email"
                placeholder="email"
              />
              <input
                className={style.input}
                ref={passwordRef}
                type="password"
                placeholder="password"
              />
              {formToggle ? null : (
                <input
                  className={style.input}
                  ref={passwordConfRef}
                  type="password"
                  placeholder="confirm password"
                />
              )}
              {formToggle ? (
                <div className={style.form}>
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
              <h1>&lt;Webweave/&gt;</h1>
            </header>
            <main className={style.profile}>
              <h2 className={style.h2}>Welcome {user.email}</h2>
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
