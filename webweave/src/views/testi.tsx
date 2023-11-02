import React, { useContext, useEffect, useState } from "react";
import style from "../assets/style";
import { auth } from "../firebase";

export const Login = () => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({});

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    }, []);
  });

  const register = async () => {
    try {
      const newUser = await auth.createUserWithEmailAndPassword(
        registerEmail,
        registerPassword
      );
      console.log(newUser);
    } catch (error) {
      let errorMessage = "";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);
    }
  };

  const login = async () => {
    try {
      const loggedInUser = await auth.signInWithEmailAndPassword(
        loginEmail,
        loginPassword
      );
      console.log(loggedInUser);
    } catch (error) {
      let errorMessage = "";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      let errorMessage = "";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);
    }
  };

  return (
    <>
      {user && (
        <button className={style.button} onClick={logout}>
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
              <h2 className={style.h2}>Login</h2>
              <input
                className={style.input}
                onChange={(event) => {
                  setLoginEmail(event.target.value);
                }}
                type="email"
                placeholder="email"
              />
              <input
                className={style.input}
                onChange={(event) => {
                  setLoginPassword(event.target.value);
                }}
                type="password"
                placeholder="password"
              />
              <button className={style.button} onClick={login} type="button">
                Login
              </button>
            </form>

            <form>
              <p className={style.p}>
                Don't have an account?{" "}
                <button className={style.link} onClick={register} type="button">
                  Sign up
                </button>
              </p>
            </form>

            <form className={style.form}>
              <h2 className={style.h2}>Sign up</h2>
              <input
                className={style.input}
                onChange={(event) => {
                  setRegisterEmail(event.target.value);
                }}
                type="email"
                placeholder="email"
              />
              <input
                className={style.input}
                onChange={(event) => {
                  setRegisterPassword(event.target.value);
                }}
                type="password"
                placeholder="password"
              />
              <button className={style.button} onClick={register} type="button">
                Sign up
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className={style.container}>
          <div className={style.top}>
            <header className={style.header}>
              <h1>&lt;Webweave/&gt;</h1>
            </header>
            <h2 className={style.h2}>Welcome {user.email}</h2>
            <button className={style.button}>Start creating!</button>
          </div>
        </div>
      )}
    </>
  );
};
