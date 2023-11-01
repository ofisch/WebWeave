import React, { useContext, useRef } from "react";
import style from "../assets/style";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import { useState } from "react";

export const Login = () => {
  const user = useContext(AuthContext);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const createAccount = async () => {
    try {
      await auth.createUserWithEmailAndPassword(
        emailRef.current!.value,
        passwordRef.current!.value
      );
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
              <h2 className={style.h2}>Login</h2>
              <form id="formEmail">
                <input
                  className={style.input}
                  ref={emailRef}
                  type="email"
                  placeholder="email"
                />
              </form>
              <form id="formPassword">
                <input
                  className={style.input}
                  ref={passwordRef}
                  type="password"
                  placeholder="password"
                />
              </form>
              <form>
                <button className={style.button} onClick={signIn} type="button">
                  Login
                </button>

                <p className={style.p}>
                  Already have an account?{" "}
                  <button className={style.link} onClick={createAccount}>
                    Sign up
                  </button>
                </p>
              </form>
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
          </div>
        </div>
      )}
    </>
  );
};
