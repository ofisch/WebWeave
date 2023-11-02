import React, { useContext } from "react";
import style from "../assets/style";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";

export const Login = () => {
  const user = useContext(AuthContext);

  const signOut = async () => {
    await auth.signOut();
  };

  const [formToggle, setFormToggle] = useState<boolean>(true);
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
            <div className={style.form}>
              {formToggle ? <LoginForm /> : <RegisterForm />}
            </div>
            <form>
              <p className={style.p}>
                {formToggle
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button className={style.link} onClick={toggle}>
                  {formToggle ? "Sign up" : "Login"}
                </button>
              </p>
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
