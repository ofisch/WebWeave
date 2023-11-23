const style = {
  container: "max-w-5xl bg-primary font-sometype mx-auto text-white ",
  header: "text-4xl text-action xs:col-span-2 xs:w-1/2 font-sourcecode",
  headerNav: "text-4xl text-action xs:col-span-2 xs:w-1/2  font-sourcecode",
  nav: "flex gap-4 justify-center",
  navEdit: "flex gap-4 flex-row justify-between items-start",
  navHomePrompt: "flex gap-4 justify-center",
  buttonGenerate:
    "p-1 text-black rounded-lg w-full h-14 font-semibold  transition-all duration-500 bg-gradient-to-tl from-emerald-500 via-cyan-300 to-action bg-size-200 bg-pos-0 hover:bg-pos-100",
  textGenerate: "flex-auto animate-pulse",
  buttonClear: "bg-action p-1 text-black rounded-lg w-1/4",
  buttonClearDisabled:
    "bg-primarylight p-1 text-black rounded-lg w-1/4 pointer-events-none opacity-60",
  buttonLog: "bg-action p-1 text-black rounded-lg w-1/4",
  buttonSave: "p-1 bg-action text-black rounded-lg w-3/4 h-12",
  buttonDownload: "p-1 bg-action text-black rounded-lg w-1/4 h-12",
  top: "py-4 max-w-5xl grid gap-4 xs:grid-cols-2",
  secondary:
    "p-4 max-w-5xl grid gap-4 xs:grid-cols-2 bg-primarylight rounded-lg",
  main: "",
  select: "text-black p-2 rounded-md w-44",

  selectOption: "text-black font-sometype",
  selectOptionArial: "text-black font-arial",
  selectOptionVerdana: "text-black font-verdana",
  selectOptionTahoma: "text-black font-tahoma",
  selectOptionTrebuchet: "text-black font-trebuchet",
  selectOptionTimes: "text-black font-times",
  selectOptionGeorgia: "text-black font-georgia",
  selectOptionGaramond: "text-black font-garamond",
  selectOptionCourier: "text-black font-courier",
  selectOptionBrush: "text-black font-brush",
  selectOptionComic: "text-black font-comic",

  colorText: "drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]",
  profile: "mx-auto xs:w-full",
  colorDisplayBox: "w-8 h-8 rounded-lg mx-auto",
  colors: "grid grid-cols-1 gap-4",
  colorListItem: "rounded-lg",
  colorList: "flex gap-4",
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
  editBlock: "flex flex-col gap-4 mb-8",
  editHeader: "font-sometype text-white text-2xl  self-start",
  previewBlock: "flex flex-col gap-4",
  previewHeader: "font-sometype text-white text-2xl self-start",

  pageContainer: "flex items-center justify-center h-screen hidden",
  modal: "flex align-center justify-center",
  modalOverlay: "fixed inset-0 bg-black bg-opacity-40 z-50",
  modalAlert: "text-green-500 text-2xl text-center m-2 mb-4",
  modalH1: "text-white text-2xl text-center m-2 mb-4",
  modalInput: "border p-2 mb-3 w-full rounded-md",
  modalButtons: "grid gap-4 mt-3 grid-cols-2",
  modalSaveButton: "grid gap-4 mt-3 grid-cols-1",
  cancelButtonModal: "bg-secondary p-1 text-black rounded-lg w-full p-2",
  saveButtonModal: "bg-action p-1 text-black rounded-lg w-full p-2",
  deleteButtonModal: "bg-red-500 p-1 text-black rounded-lg w-full p-2",
  modalContainer:
    "bg-primary bg-opacity-90 rounded-lg overflow-hidden w-300p p-2 max-w-full mx-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  modalContent: "w-full p-4",

  sites: "grid grid-cols-3 gap-4",
  sitesEdit: "grid grid-cols-3 gap-8 mt-8",
  editH2: "text-white text-2xl col-start-2 my-10",
  sitesButton:
    "bg-action p-2 text-black rounded-lg w-full col-start-2 col-span-1 transition-all duration-500 bg-gradient-to-tl from-emerald-500 via-cyan-300 to-action bg-size-200 bg-pos-0 hover:bg-pos-100",
  iconContainer: "justify-center flex flex-col",
  sitesIconButton:
    "justify-self-start transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-125 hover:cursor-pointer hover:opacity-75 duration-70",
  sitesIcon: "scale-150 text-red-500",
  sitesEditIcon: "scale-150 text-action",
  editInfoIcon: "relative text-action",
  editTooltip:
    "absolute right-1/3 top-1/2 w-32 bg-primary rounded-lg shadow-lg p-2 text-white border-2 border-primarylight z-10",

  settingsHeader: "font-sometype text-white text-2xl text-left mb-4",
  picker: "grid grid-cols-3 gap-4",
  drop: "grid grid-cols-1 gap-4",
  sketchPicker: "mx-auto",

  profileTop: "py-4 max-w-5xl grid gap-4 xs:grid-cols-2 mb-32",
  editSection:
    "bg-primary h-32 fixed inset-x-0 bottom-0 grid grid-cols-3 gap-8 mt-8",
  editButton:
    "bg-red-500 w-32 h-fit m-auto self-center p-2 text-black rounded-lg col-start-2 col-span-1",

  logsTop: "py-4 max-w-5xl grid gap-4 xs:grid-cols-2 mb-8",
  logsH1: "text-white text-3xl text-center m-2 mb-4",
  logData: "my-20",
  logsH2: "text-white text-2xl text-center m-2 my-4",
  logsUl: "grid gap-4 grid-cols-3",
  logsCharts: "grid gap-20 grid-cols-1 mb-32",
  downloadSection:
    "bg-primary h-32 fixed inset-x-0 bottom-0 grid grid-cols-3 gap-8 mt-8",
  logsButton:
    "bg-action w-40 h-fit m-auto self-center p-2 text-black rounded-lg col-start-2 col-span-1",

  buttonSanitize: "p-4 bg-action text-black rounded-lg w-44",
};

export default style;
