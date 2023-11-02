import React, { useContext, useRef, useState } from "react";
import style from "../assets/style";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";

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
              {formToggle ? (
                <form>
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
                </form>
              ) : (
                <form>
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
                </form>
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
            <h2 className={style.h2}>Welcome {user.email}</h2>
            <button className={style.button}>Start crating!</button>
          </div>
        </div>
      )}
    </>
  );
};
