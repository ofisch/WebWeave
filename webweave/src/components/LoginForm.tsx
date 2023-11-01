import { useRef } from "react";
import style from "../assets/style";

export const LoginForm = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  return (
    <>
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
      </form>
    </>
  );
};
