import React, { useContext, useEffect, useRef, useState } from "react";
import style from "../assets/style";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../utils/firebase";
import { firestore } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { Heading } from "../components/Heading";

export const Login = () => {
  const user = useContext(AuthContext);

  const [username, setUsername] = useState("");

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const navigate = useNavigate();

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

  const createAccount = async () => {
    const usernameValue = usernameRef.current!.value;
    const emailValue = emailRef.current!.value;
    const passwordValue = passwordRef.current!.value;
    const passwordConfValue = passwordConfRef.current!.value;

    const usersCollection = firestore.collection("users");

    const errors = [];

    if (!emailValue || !passwordValue || !passwordConfValue) {
      errors.push("Please fill in all of the fields");
    }

    if (usernameValue.length < 3) {
      errors.push("Username should be atleast 3 characters");
    }

    if (usernameValue.length > 3) {
      const querySnapshot = await usersCollection
        .where("username", "==", usernameValue)
        .get();

      if (querySnapshot.size > 0) {
        errors.push("Username already taken");
      }
    }

    if (!emailPattern.test(emailValue)) {
      errors.push("Invalid email format");
    }

    if (passwordValue !== passwordConfValue) {
      errors.push("Password doesn't match");
    }

    if (passwordValue.length < 6) {
      errors.push("Password should be at least 6 charachters");
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(", "));
      return;
    }

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

  const signIn = async () => {
    const input = emailRef.current!.value;
    const passwordValue = passwordRef.current!.value;
    const errors = [];

    if (!input || !passwordValue) {
      errors.push("Please fill in all of the fields");
    }

    if (!passwordValue.length) {
      errors.push("Password should be at least 6 characters");
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(", "));
      return;
    }

    const isEmail = emailPattern.test(input);

    try {
      if (isEmail) {
        await auth.signInWithEmailAndPassword(input, passwordValue);
      } else {
        const querySnapshot = await firestore
          .collection("users")
          .where("username", "==", input)
          .get();

        if (querySnapshot.size === 0) {
          errors.push("Incorrect email, username, or password");
          setErrorMessage(errors.join(", "));
        } else {
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

    if (errors.length > 0) {
      setErrorMessage(errors.join(", "));
    }
  };

  const signOut = async () => {
    await auth.signOut();
    setErrorMessage("");
  };

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

  const goTo = (endpoint: string) => {
    navigate(endpoint);
  };

  const [formToggle, setFormToggle] = useState(true);
  const toggle = () => {
    setFormToggle(!formToggle);
    setErrorMessage("");
  };

  return (
    <>
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
              <h2 className={style.h2}>Welcome {username}!</h2>
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
