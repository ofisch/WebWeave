const frontPageStyle = {
  container: "w-screen mx-auto text-white bg-gray-100",

  header: "hidden",
  headerSticky: "sticky top-0 left-0 font-sometype mx-4 z-10 h-20",
  headerContent: "ease-in-out duration-300 rounded-b-md flex flex-row gap-4",
  headerContentContrast:
    "ease-in-out duration-300 bg-gray-100 rounded-b-md flex flex-row gap-4",
  headerH1: "text-4xl text-left text-action font-sourcecode p-4",
  headerContents: "items-center text-left flex gap-10 p-4",
  headerA:
    "text-white relative cursor-pointer transition-all duration-500 before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 before:rounded-md before:opacity-0 before:transition-all before:duration-500 before:bg-white hover:before:w-full hover:before:opacity-100",
  headerAContrast:
    "text-gray-700 text-white relative cursor-pointer transition-all duration-500 before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 before:rounded-md before:opacity-0 before:transition-all before:duration-500 before:bg-gray-700 hover:before:w-full hover:before:opacity-100",
  headerButtons: "space-x-4 justify-self-end ml-auto p-4",
  startCreatingButton: "text-white bg-action px-4 py-2 rounded-full shadow-md",

  bgImage: "w-screen h-screen bg-cover bg-center bg-no-repeat font-sometype",
  imgContent: "bg-black bg-opacity-50 h-screen grid grid-cols-1 gap-4",
  imgContentTitle: "h-20 pt-20 text-6xl text-center text-action",
  imgContentSlogan: "h-20 text-center self-center",
  sloganContent: "text-4xl font-bold text-white",
  imgContentButtons:
    "h-20 pb-20 self-center justify-self-center grid grid-cols-1 gap-4",
  imgContentCreateButton:
    "mx-2 p-4 w-80 text-white text-xl bg-action rounded-full shadow-md ",
  imgContentSignButton:
    "w-fit mx-auto text-white relative cursor-pointer transition-all duration-500 before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-1 before:rounded-md before:opacity-0 before:transition-all before:duration-500 before:bg-white hover:before:w-full hover:before:opacity-100",

  infoSection: "mx-auto text-gray-700",
  infoContainer:
    "h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden",
  infoImg: "bg-cover bg-top bg-no-repeat w-full h-96",
  infoText: "self-center text-left text-md",

  tutorialSection: "mx-auto text-gray-700",
  moveButtonL:
    "text-white bg-action px-4 py-2 mx-2 rounded-full shadow-md w-20 h-12 self-center justify-self-end",
  moveButtonR:
    "text-white bg-action px-4 py-2 mx-2 rounded-full shadow-md w-20 h-12 self-center justify-self-start",
  dotIndicators: "flex justify-center items-center mb-4",
  activeDot: "ease-in-out duration-300 bg-action w-4 h-4 rounded-full mx-1",
  dot: "ease-in-out duration-300 w-4 h-4 bg-action bg-opacity-40 rounded-full mx-1",
  tutorialText: "text-left text-md h-96 grid grid-cols-1",
  explanationH4: "text-2xl text-left pb-4",
  explanation: "",
  tutorialPrompt: "self-end",
  promptH4: "text-2xl text-left font-sourcecode p-4",
  prompt: "h-32 bg-blue-500 w-full bg-secondary rounded-lg text-black",
  iframeContainer: "w-full",
  iframe: "min-w-full h-full max-w-full rounded-lg shadow-lg",

  iframeVideo: "w-2/3 aspect-video justify-self-center rounded-lg shadow-lg",

  teamSection: "max-w-5xl mx-auto text-gray-700",
  teamContainer: "container px-5 py-24 mx-auto",
  teamHeading: "text-3xl p-12 text-gray-900",
  memberContainer:
    "h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden hover:border-action transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110",
  teamImg:
    "bg-cover bg-center bg-no-repeat w-full lg:h-48 md:h-36 w-full object-cover object-center",
  name: "text-sm title-font font-medium text-gray-900 tracking-widest",
  email: "leading-relaxed mb-3 text-xs",
  info: "leading-relaxed mb-3",

  imgDarken:
    "ease-in-out duration-300 bg-black bg-opacity-20 hover:bg-opacity-0 h-full w-full",
};

export default frontPageStyle;
