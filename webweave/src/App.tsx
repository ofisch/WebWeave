import "./App.css";

const style = {
  container: "max-w-5xl bg-primary font-sometype mx-auto",
  header: "text-4xl text-action xs:col-span-2 xs:w-1/2 font-sourcecode",
  nav: "flex gap-4 justify-center",
  top: "py-4 max-w-5xl grid gap-4 xs:grid-cols-2",
  secondary:
    "p-4 max-w-5xl grid gap-4 xs:grid-cols-2 bg-primarylight rounded-lg",
  main: "bg-pink-500",
  prompt: "h-80 bg-blue-500 bg-secondary rounded-lg ",
  settings: "h-56 bg-blue-500 bg-secondary rounded-lg",
  preview: "relative h-72 bg-blue-500 bg-secondary rounded-lg",
  iframe: "absolute top-0 left-0 w-full h-full",
  button: "bg-action p-1 text-white rounded-lg",
  element: "h-16 bg-blue-500",
};

function App() {
  return (
    <>
      <div className={style.container}>
        <div className={style.top}>
          <header className={style.header}>
            <h1>&lt;Webweave/&gt;</h1>
          </header>
          <nav className={style.nav}>
            <button className={style.button}>luo uusi</button>
            <button className={style.button}>muokkaa</button>
            <button className={style.button}>käyttäjä</button>
          </nav>
          <textarea className={style.prompt}></textarea>
          <textarea className={style.settings}></textarea>
          <button className={style.button}>css framework</button>
        </div>
        <div className={style.secondary}>
          <div className={style.preview}>
            <iframe
              className={style.iframe}
              src="https://todo-403206.lm.r.appspot.com"
            ></iframe>
          </div>
          <button className={style.button}>tallenna sivu</button>
        </div>
      </div>
    </>
  );
}

export default App;
