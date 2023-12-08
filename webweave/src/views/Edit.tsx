import React, { useContext, useEffect, useState } from "react";
import style from "../assets/style";
import { textEdit } from "../utils/textEdit";
import { firestore } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import { pageToEdit } from "../context/PageEditContext";
import { useNavigate } from "react-router-dom";
import cleanCode from "../utils/codeCleaner";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from "@mui/icons-material/Info";
import SaveIcon from "@mui/icons-material/Save";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import DownloadIcon from "@mui/icons-material/Download";

import { Heading } from "../components/Heading";
import AutoResizeIframe from "../components/AutoResizeIframe";
import { loadingAnimation, typePlaceholder } from "../utils/animation";
import { makeApiRequest, roles } from "../utils/openai";
import SaveModal from "../components/modals/SaveModal";
import DownloadModal from "../components/modals/DownloadModal";
import SaveChangesModal from "../components/modals/SaveChangesModal";
import RemoveImageModal from "../components/modals/RemoveImageModal";
import TextGenerator from "../components/TextGenerator";
import ClearModal from "../components/modals/ClearModal";

export const Edit = () => {
  const user = useContext(AuthContext);

  const navigate = useNavigate();

  const [htmlEdit, setHtmlEdit] = useState<string>(
    localStorage.getItem("html") || ""
  );
  const [prompt, setPrompt] = React.useState<string>("");
  const promptAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState<string>("");
  const [formToggle, setFormToggle] = useState(true);
  const [requestTime, setRequestTime] = useState<string>("");

  const [toggleAdvEditor, setToggleAdvEditor] = useState<boolean>(false);
  const [toggleImageBank, setToggleImageBank] = useState<boolean>(false);
  const [toggleTextGenerator, setToggleTextGenerator] =
    useState<boolean>(false);

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const usersCollection = firestore.collection("users");
  const userDocRef = usersCollection.doc(user?.uid);
  const pagesSubcollectionRef = userDocRef.collection("pages");

  const [roleContent, setRoleContent] = useState<string>("");

  let currentPage: string = "";

  //tyhjennetään localStorage, jotta käyttäjä ei näe vilausta edellisestä muokatusta sivusta
  //debugia varten kommentoitu
  //localStorage.setItem("html", "");

  const checkPageName = () => {
    if (pageToEdit === undefined || pageToEdit === null) {
      currentPage = ""; // annetaan oletusarvo, jotta sivu ei ole null tai undefined
    } else {
      currentPage = pageToEdit;

      localStorage.setItem("pageToEdit", pageToEdit);
    }
  };

  // sivun sisällön haku firestoresta
  // tehokkaampi tapa hakea sivun sisältö firestoresta, vähemmän kutsuja.
  //  ei iteroi koko kokoelmaa läpi, vaan hakee tiettyä dokumenttia heti
  const getPageContent = async () => {
    try {
      const docSnapshot = await pagesSubcollectionRef
        .where("pageName", "==", localStorage.getItem("pageToEdit") || "")
        .get();

      if (!docSnapshot.empty) {
        const docData = docSnapshot.docs[0].data();
        console.log("docData", docData);
        const content = docData.content;

        // lisätään sivun sisältöön textEdit.script, jotta sivun tekstielementtejä voidaan muokata
        const textEditScript = textEdit.script;
        const contentWithScript = content + textEditScript;

        localStorage.setItem("html", contentWithScript);
        setHtmlEdit(localStorage.getItem("html")!);
      } else {
        // jos sivun dokumenttia ei löydy, tulostetaan virheilmoitus
        console.log("Document not found for pageName:", currentPage);
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  // sivun tallennus firestoreen
  const handlePageSave = async () => {
    try {
      // haetaan sivun dokumentti
      const docRef = await pagesSubcollectionRef
        .where("pageName", "==", localStorage.getItem("pageToEdit") || "")
        .get();

      if (!docRef.empty) {
        const docSnapshot = docRef.docs[0];
        const docId = docSnapshot.id;

        // päivitetään dokumentti
        await pagesSubcollectionRef.doc(docId).update({
          content: localStorage.getItem("html"),
        });

        setChangeModalOpen(true);
      } else {
        console.log("Dokumenttia ei löydy sivulle:", currentPage);
      }
    } catch (error) {
      console.error("Tallennus epäonnistui", error);
    }
  };

  //uuden version tallennus firestoreen
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangeModalOpen, setChangeModalOpen] = useState(false);
  const [content, setContent] = useState("");

  const savePage = async (content: string) => {
    setContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setChangeModalOpen(false);
    setIsDownloadModalOpen(false);
    setIsRemoveModalOpen(false);
  };

  const handleModalSubmit = async (pageNameInput: string) => {
    const page = {
      pageName: pageNameInput,
      content: content,
    };

    if (
      pageNameInput !== undefined &&
      pageNameInput !== null &&
      pageNameInput !== ""
    ) {
      try {
        await pagesSubcollectionRef.add(page);
        const savedPagesItem = localStorage.getItem("pages");
        if (savedPagesItem !== null) {
          const savedPages = JSON.parse(savedPagesItem);
          savedPages.push(pageNameInput);
          localStorage.setItem("pages", JSON.stringify(savedPages));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // ai-editori
  const handleApiRequest = async () => {
    const startTime = performance.now();
    setRequestStatus("Request in progress");
    setFormToggle(false);

    const editPrompt = `edit this code: "${localStorage.getItem(
      "html"
    )}" ${prompt} do not do any other changes.`;
    setLoading(true);

    const apiResponse = await makeApiRequest(editPrompt, roleContent);
    const apiResponseHtml = cleanCode(apiResponse);
    console.log(apiResponseHtml);
    // lisätään sivun sisältöön textEdit.script, jotta sivun tekstielementtejä voidaan muokata
    const textEditScript = textEdit.script;
    const contentWithScript = apiResponseHtml + textEditScript;

    console.log("apiResponse: ", apiResponseHtml);
    console.log("contentWithScript: ", contentWithScript);

    setHtmlEdit(contentWithScript);
    setLoading(false);

    const currentHtml = localStorage.getItem("html") || "";
    localStorage.setItem("undo", currentHtml);
    localStorage.setItem("redo", "");

    localStorage.setItem("html", contentWithScript);
    localStorage.setItem("editPrompt", prompt);

    // lasketaan API-pyynnön kesto ja asetetaan se requestTime-stateen
    const endTime = performance.now();
    const elapsedTime = (endTime - startTime) / 1000;

    // jos API-pyynnön kesto on yli minuutin, tulostetaan se minuutteina ja sekunteina
    const formattedTime =
      elapsedTime >= 60
        ? `${Math.floor(elapsedTime / 60)}:${Math.floor(elapsedTime % 60)} min`
        : `${Math.floor(elapsedTime)} sec`;

    setRequestTime(formattedTime);
    setFormToggle(true);

    // lisätään API-pyynnön kesto log.json-tiedostoon
    const existingData = localStorage.getItem("log.json");

    // jos log.json-tiedosto on olemassa, lisätään siihen API-pyynnön kesto
    if (existingData) {
      try {
        const dataArray = JSON.parse(existingData);

        // haetaan log.json tiedostosta viimeinen objekti ja lisätään siihen requestTime
        if (Array.isArray(dataArray) && dataArray.length > 0) {
          const lastObject = dataArray[dataArray.length - 1];
          lastObject.requestTime = formattedTime;

          const updatedData = JSON.stringify(dataArray);
          // console.log("updated json: " + updatedData);

          localStorage.setItem("log.json", updatedData);
        } else {
          console.error("Existing data is not a valid array or is empty.");
        }
      } catch (error) {
        console.error("Error parsing or updating existing data:", error);
      }
    } else {
      console.error("No existing data found in localStorage");
    }

    setRoleContent("");
  };

  const handleOptimizeApiRequest = async () => {
    // ajastetaan API-pyynnön kesto ja tulostetaan se requestStatusiin
    const startTime = performance.now();
    setRequestStatus("Request in progress");
    setFormToggle(false);
    setLoading(true);

    // lähetetään prompt openai-API:lle ja asetetaan vastaus responseen-stateen
    const settingPrompt = prompt;
    const apiResponse = await makeApiRequest(settingPrompt, roleContent);
    //const apiResponse = await makeApiRequest(settingPrompt);

    setPrompt(apiResponse);
    localStorage.setItem("userPrompt", prompt);

    // lasketaan API-pyynnön kesto ja asetetaan se requestTime-stateen
    const endTime = performance.now();
    const elapsedTime = (endTime - startTime) / 1000;

    // jos API-pyynnön kesto on yli minuutin, tulostetaan se minuutteina ja sekunteina
    const formattedTime =
      elapsedTime >= 60
        ? `${Math.floor(elapsedTime / 60)}:${Math.floor(elapsedTime % 60)} min`
        : `${Math.floor(elapsedTime)} sec`;

    setRequestTime(formattedTime);
    setFormToggle(true);

    setRoleContent("");
  };

  const handleGenerate = async () => {
    await setRoleContent(roles.editor);
  };

  const handleOptimize = async () => {
    await setRoleContent(roles.optimizer);
  };

  useEffect(() => {
    const handleEffect = async () => {
      if (roleContent === roles.editor) {
        await handleApiRequest();
        console.log("roleContent", roleContent);
      } else if (roleContent === roles.optimizer) {
        await handleOptimizeApiRequest();
        console.log("roleContent", roleContent);
      }
    };

    handleEffect();
  }, [roleContent]);

  useEffect(() => {
    if (promptAreaRef.current) {
      typePlaceholder(promptAreaRef.current, "suggest changes to the site...");
    }
    const interval = setInterval(() => {
      if (promptAreaRef.current) {
        typePlaceholder(
          promptAreaRef.current,
          "suggest changes to the site..."
        );
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (formToggle) {
      setRequestStatus(requestTime ? "Request Time: " + requestTime : "");
      setLoading(false);
    } else {
      setRequestStatus("Request in progress");
    }
  }, [formToggle, requestTime]);

  useEffect(() => {
    if (loading) {
      loadingAnimation(document.getElementById("loading")!, "action");
    }
  }, [loading]);

  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPrompt(event.target.value);
  };

  const handleUndo = () => {
    const currentHtml = localStorage.getItem("html") || "";
    localStorage.setItem("redo", currentHtml);

    const undoContent = localStorage.getItem("undo");
    if (undoContent) {
      setHtmlEdit(undoContent);
      localStorage.setItem("html", undoContent);
      localStorage.setItem("undo", "");
    }
  };

  const handleRedo = () => {
    const currentHtml = localStorage.getItem("html") || "";
    localStorage.setItem("undo", currentHtml);

    const redoContent = localStorage.getItem("redo");
    if (redoContent) {
      setHtmlEdit(redoContent);
      localStorage.setItem("html", redoContent);
      localStorage.setItem("redo", "");
    }
  };

  const handleHtmlEditChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newHtml = event.target.value;

    localStorage.setItem("html", newHtml);
    setHtmlEdit(newHtml);
  };

  const goToProfile = () => {
    navigate("/profile");
    localStorage.setItem("html", "");
    localStorage.setItem("textGeneratorResponse", "");
  };

  checkPageName();

  useEffect(() => {
    getPageContent();
    localStorage.setItem("undo", "");
    localStorage.setItem("redo", "");
  }, []);

  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [isTooltipImageVisible, setTooltipImageVisible] = useState(false);

  const handleDownloadModalSubmit = async () => {
    closeModal();
  };

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  const handleMouseEnterImage = () => {
    setTooltipImageVisible(true);
  };

  const handleMouseLeaveImage = () => {
    setTooltipImageVisible(false);
  };

  const handleAdvEditorToggle = () => {
    setToggleAdvEditor(!toggleAdvEditor);
  };

  const handleImageBankToggle = () => {
    setToggleImageBank(!toggleImageBank);
    setToggleTextGenerator(false);
  };

  const handleTextGeneratorToggle = () => {
    setToggleTextGenerator(!toggleTextGenerator);
    setToggleImageBank(false);
  };

  const [imageName, setImageName] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [imageList, setImageList] = useState<{ name: string; link: string }[]>(
    []
  );
  const [selectedImageName, setSelectedImageName] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    const storedImages = localStorage.getItem("imageList");
    if (storedImages) {
      setImageList(
        JSON.parse(storedImages) as { name: string; link: string }[]
      );
    }
  }, []);

  const handleAddImage = () => {
    const newImage = { name: imageName, link: imageLink };
    const updatedList = [...imageList, newImage];
    setImageList(updatedList);

    const imagePrompt = `Add this image to the site: ${imageLink}`;

    setPrompt((prevPrompt) => `${prevPrompt}\n\n${imagePrompt}`);

    localStorage.setItem("imageList", JSON.stringify(updatedList));

    setImageName("");
    setImageLink("");
  };

  const handleAddSelectedImage = () => {
    if (selectedImage) {
      const imagePrompt = `Add this image to the site: ${selectedImage}`;
      setPrompt((prevPrompt) => `${prevPrompt}\n\n${imagePrompt}`);
    } else {
      console.error("No image selected");
    }
  };

  const handleRemoveSelectedImage = () => {
    if (selectedImage) {
      const updatedImageList = imageList.filter(
        (image) => image.link !== selectedImage
      );
      setImageList(updatedImageList);

      localStorage.setItem("imageList", JSON.stringify(updatedImageList));
      setSelectedImage("");
      setIsRemoveModalOpen(false);
    } else {
      console.error("No image selected");
    }
  };

  const handleImageSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedImageName = e.target.value;
    setSelectedImageName(selectedImageName);
    const selectedImage = imageList.find(
      (image) => image.name === selectedImageName
    );
    if (selectedImage) {
      setSelectedImage(selectedImage.link);
    } else {
      setSelectedImage("");
    }
  };

  const [clearModalIsOpen, setClearModalIsOpen] = useState(false);

  const closeClearModal = () => {
    setClearModalIsOpen(false);
  };

  const clearPrompt = () => {
    setClearModalIsOpen(true);
  };

  const handleClearModalSubmit = async () => {
    setClearModalIsOpen(false);

    setPrompt("");
    localStorage.setItem("editPrompt", "");
  };

  return (
    <>
      <div className={style.pageContainer}>
        <SaveModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          content={content}
        />

        <RemoveImageModal
          open={isRemoveModalOpen}
          onClose={closeModal}
          onConfirm={handleRemoveSelectedImage}
          imageName={selectedImageName}
        />

        <DownloadModal
          isOpen={isDownloadModalOpen}
          onClose={closeModal}
          onSubmit={handleDownloadModalSubmit}
        />

        <ClearModal
          isOpen={clearModalIsOpen}
          onClose={closeClearModal}
          onConfirm={handleClearModalSubmit}
        />
      </div>

      <div className={style.pageContainer}>
        <SaveChangesModal isOpen={isChangeModalOpen} onClose={closeModal} />
      </div>

      <div className={style.container}>
        <div className={style.top}>
          <header className={style.headerNav}>
            <Heading></Heading>
          </header>
          <h2 className={style.editTitle}>
            {localStorage.getItem("pageToEdit") || ""}
          </h2>
          <nav className={style.navEdit}>
            <button className={style.buttonMySites} onClick={goToProfile}>
              <ArrowBackIcon /> My sites
            </button>
            <div>
              {localStorage.getItem("undo") !== "" ? (
                <button
                  className={style.buttonUndo}
                  onClick={() => handleUndo()}
                >
                  <UndoIcon />
                </button>
              ) : (
                <button
                  className={style.buttonUndoDisabled}
                  onClick={() => handleUndo()}
                >
                  <UndoIcon />
                </button>
              )}

              {localStorage.getItem("redo") !== "" ? (
                <button
                  className={style.buttonUndo}
                  onClick={() => handleRedo()}
                >
                  <RedoIcon />
                </button>
              ) : (
                <button
                  className={style.buttonUndoDisabled}
                  onClick={() => handleRedo()}
                >
                  <RedoIcon />
                </button>
              )}
            </div>
            <button
              className={style.editInfoIcon}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <InfoIcon />
              {isTooltipVisible && (
                <div className={style.editTooltip}>
                  Edit text elements by <AdsClickIcon className="text-action" />{" "}
                  double clicking!
                </div>
              )}
            </button>
          </nav>

          <div className={style.editorPreview}>
            <AutoResizeIframe contentSrc={htmlEdit}></AutoResizeIframe>
          </div>

          <div className={style.navHomePrompt}>
            <button
              className={style.buttonDownloadEdit}
              onClick={() => setIsDownloadModalOpen(true)}
            >
              <p className="flex-auto">
                Download page <DownloadIcon />
              </p>
            </button>
            <button
              className={style.buttonSaveNew}
              onClick={() => savePage(htmlEdit)}
            >
              Save as new <SaveIcon />
            </button>
            <button className={style.buttonSave} onClick={handlePageSave}>
              Save changes
            </button>
          </div>
          <div className={style.ternanryContainer}>
            <div className={style.ternarySetting}>
              {toggleImageBank ? (
                <button
                  className={"text-action"}
                  onClick={() => handleImageBankToggle()}
                >
                  Image bank <ArrowDropUpIcon />
                </button>
              ) : (
                <button
                  className={"text-action"}
                  onClick={() => handleImageBankToggle()}
                >
                  Image bank <ArrowDropDownIcon />
                </button>
              )}
            </div>
            <div className={style.textGeneratorSetting}>
              {toggleTextGenerator ? (
                <button
                  className={"text-action"}
                  onClick={() => handleTextGeneratorToggle()}
                >
                  Text generator <ArrowDropUpIcon />
                </button>
              ) : (
                <button
                  className={"text-action"}
                  onClick={() => handleTextGeneratorToggle()}
                >
                  Text generator <ArrowDropDownIcon />
                </button>
              )}
            </div>
          </div>

          {toggleImageBank ? (
            <div className={style.imageBank}>
              <div className={style.imageBankHeading}>
                <h2 className={style.imageBankHeader}>Image bank</h2>
                <button
                  className={style.previewImageInfo}
                  onMouseEnter={handleMouseEnterImage}
                  onMouseLeave={handleMouseLeaveImage}
                >
                  <InfoIcon />
                  {isTooltipImageVisible && (
                    <div className={style.infoTooltip}>
                      Save images to the image bank by adding a name and a link.
                      Use the select menu to add an image to the prompt.
                    </div>
                  )}
                </button>
              </div>

              <div className={style.imageBankaInputs}>
                <input
                  type="text"
                  placeholder="Name of the image..."
                  className={style.imageNameInput}
                  value={imageName}
                  onChange={(e) => setImageName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Add a new image link..."
                  className={style.imageAddInput}
                  value={imageLink}
                  onChange={(e) => setImageLink(e.target.value)}
                />
                <button
                  className={style.buttonAddImage}
                  onClick={handleAddImage}
                >
                  Add new image
                </button>
              </div>
              <select
                name="images"
                id="imageBank"
                className={style.addImageSelect}
                onChange={handleImageSelection}
              >
                <option className={style.selectOption}>Saved images</option>
                {imageList.map((image, index) => (
                  <option key={index} value={image.name}>
                    {image.name}
                  </option>
                ))}
              </select>
              {selectedImage && (
                <>
                  <div className={style.imagePreview}>
                    <h3 className={style.imagePreviewH3}>Selected Image:</h3>
                    <div className={style.imagePreviewImgContainer}>
                      <img
                        src={selectedImage}
                        alt="Selected image"
                        className={style.imagePreviewImg}
                      />
                    </div>
                  </div>
                  <div className={style.buttonAddContainer}>
                    <button
                      className={style.buttonRemoveSelectedImage}
                      onClick={() => setIsRemoveModalOpen(true)}
                    >
                      Remove image
                    </button>
                    <button
                      className={style.buttonAddSelectedImage}
                      onClick={handleAddSelectedImage}
                    >
                      Use image
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : null}
          {toggleTextGenerator ? <TextGenerator /> : null}
          <textarea
            placeholder="ehdota muutoksia sivuun tähän..."
            spellCheck="false"
            ref={promptAreaRef}
            className={style.prompt}
            value={prompt}
            onChange={handlePromptChange}
          ></textarea>

          <div className={style.navHomePrompt}>
            {prompt !== "" ? (
              <>
                <button className={style.buttonClear} onClick={clearPrompt}>
                  Clear
                </button>
                <button
                  className={style.buttonLog}
                  onClick={() => handleOptimize()}
                >
                  Optimize prompt
                </button>
              </>
            ) : (
              <>
                <button className={style.buttonClearDisabled}>Clear</button>
                <button className={style.buttonClearDisabled}>
                  Optimize prompt
                </button>
              </>
            )}
            <button
              className={`${
                loading
                  ? `${style.buttonGenerateEdit} pointer-events-none disabled`
                  : style.buttonGenerateEdit
              }`}
              onClick={() => handleGenerate()}
            >
              <p className={loading ? style.textGenerate : "flex-auto"}>
                Generate changes
              </p>
            </button>
          </div>
          <div>
            <p className={style.p}>{requestStatus}</p>
            {loading ? <p id="loading" className={style.p}></p> : null}
          </div>

          {toggleAdvEditor ? (
            <button
              className={"text-action"}
              onClick={() => handleAdvEditorToggle()}
            >
              Advanced editor <ArrowDropUpIcon />
            </button>
          ) : (
            <button
              className={"text-action"}
              onClick={() => handleAdvEditorToggle()}
            >
              Advanced editor <ArrowDropDownIcon />
            </button>
          )}

          {toggleAdvEditor ? (
            <textarea
              className={style.settings}
              placeholder="html-editori (?) sivun muokkaukseen"
              spellCheck="false"
              value={localStorage.getItem("html") || ""}
              onChange={handleHtmlEditChange}
            ></textarea>
          ) : null}
        </div>
      </div>
    </>
  );
};
