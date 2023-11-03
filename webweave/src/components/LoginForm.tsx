import { useRef } from "react";
import style from "../assets/style";
import { auth } from "../firebase";

export const LoginForm = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

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

  return (
    <>
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
      </form>
    </>
  );
};
