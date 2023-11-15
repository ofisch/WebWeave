const style = {
  container: "max-w-5xl bg-primary font-sometype mx-auto text-white ",
  header: "text-4xl text-action xs:col-span-2 xs:w-1/2 font-sourcecode",
  headerNav:
    "text-4xl text-action xs:col-span-2 xs:w-1/2 flex justify-between font-sourcecode",
  nav: "flex gap-4 justify-center",
  navEdit: "flex gap-4 flex-col justify-center items-start",
  navHomePrompt: "flex gap-4 justify-center",
  buttonGenerate:
    "p-1 text-black rounded-lg w-full h-14 font-semibold  transition-all duration-500 bg-gradient-to-tl from-emerald-500 via-cyan-300 to-action bg-size-200 bg-pos-0 hover:bg-pos-100",
  textGenerate: "animate-pulse",
  buttonClear: "bg-action p-1 text-black rounded-lg w-1/4",
  buttonLog: "bg-action p-1 text-black rounded-lg w-1/4",
  buttonSave: "bg-action p-1 text-black rounded-lg w-3/4 h-12",
  buttonDownload: "bg-action p-1 text-black rounded-lg w-1/4 h-12",
  top: "py-4 max-w-5xl grid gap-4 xs:grid-cols-2",
  secondary:
    "p-4 max-w-5xl grid gap-4 xs:grid-cols-2 bg-primarylight rounded-lg",
  main: "",
  profile: "mx-auto xs:w-full",
  prompt: "h-32 bg-blue-500 w-full bg-secondary rounded-lg text-black",
  settings: "h-56 bg-blue-500 bg-secondary rounded-lg text-black",
  preview: "relative h-72 bg-blue-500 bg-secondary rounded-lg text-black",
  editorPreview: "relative bg-blue-500 bg-secondary rounded-lg text-black",
  editorPrompt: "h-56 bg-blue-500 bg-secondary rounded-lg text-black",
  iframe: "min-w-full h-96 max-w-full rounded-lg shadow-lg",
  button: "bg-action p-1 text-black rounded-lg",
  buttonPage: "bg-action p-1 text-black rounded-lg w-full",
  userInfo: "flex flex-col items-center gap-3 text-xl",
  element: "h-16 bg-blue-500",
  list: "grid gap-4",
  form: "grid gap-4 mx-auto",
  username: "text-white text-2xl",
  h2: "text-white text-2xl my-10",
  editTitle: "text-white text-2xl underline my-5",
  input: "p-2 rounded-md text-black",
  p: "text-white",
  error: "text-red-500",
  link: "text-action",
  icon: "scale-175 text-action",

  promptBlock: "flex flex-col gap-4",
  promptHeader: "font-sometype text-white text-2xl  self-start",
  editBlock: "flex flex-col gap-4",
  editHeader: "font-sometype text-white text-2xl  self-start",
  previewBlock: "flex flex-col gap-4",
  previewHeader: "font-sometype text-white text-2xl self-start",

  pageContainer: "flex items-center justify-center h-screen hidden",
  modal: "flex align-center justify-center",
  modalOverlay: "bg-action bg-opacity-50 flex align-center justify-center",
  modalH1: "text-white text-2xl m-2 mb-4",
  modalInput: "border p-2 mb-6 w-full rounded-md",
  modalButtons: "grid gap-4 grid-cols-2",
  cancelButtonModal: "bg-secondary p-1 text-black rounded-lg w-full p-2",
  saveButtonModal: "bg-action p-1 text-black rounded-lg w-full p-2",
  modalContainer:
    "bg-primary bg-opacity-90 rounded-lg overflow-hidden w-300p p-2 max-w-full mx-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  modalContent: "w-full p-4",

  sites: "grid grid-cols-3 gap-4",
  sitesEdit: "grid grid-cols-3 gap-4 mt-8",
  editH2: "text-white text-2xl col-start-2 my-10",
  editButton:
    "bg-red-500 w-1/2 m-auto p-2 text-black rounded-lg w-full col-start-3 col-span-1",
  sitesButton:
    "bg-action p-2 text-black rounded-lg w-full col-start-2 col-span-1 transition-all duration-500 bg-gradient-to-tl from-emerald-500 via-cyan-300 to-action bg-size-200 bg-pos-0 hover:bg-pos-100",
  iconContainer: "justify-center flex flex-col",
  sitesIconButton:
    "transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-125 hover:cursor-pointer hover:opacity-75 duration-70",
  sitesIcon: "scale-150 text-red-500",
};

export default style;
