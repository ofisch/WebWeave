import React, { useEffect } from "react";
import style from "../assets/style";
import { makeApiRequest } from "../utils/openai";
import { loadingAnimation } from "../utils/animation";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import InfoIcon from "@mui/icons-material/Info";

const TextGenerator: React.FC = () => {
  const [prompt, setPrompt] = React.useState<string>("");
  const promptAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const [response, setResponse] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState<boolean>(false);
  const [isTooltipVisible, setTooltipVisible] = React.useState<boolean>(false);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    localStorage.setItem("textGeneratorPrompt", e.target.value);
    setCopied(false);
  };

  const handleApiRequest = async (prompt: string) => {
    const role = "writer";
    setLoading(true);

    const apiResponse = await makeApiRequest(prompt, role);
    setResponse(apiResponse);
    localStorage.setItem("textGeneratorResponse", apiResponse);
    setLoading(false);
    setCopied(false);
  };

  const copyToClipboard = () => {
    // Create a textarea element to temporarily hold the text
    const textarea = document.createElement("textarea");
    textarea.value = response;

    // Set the textarea to be invisible
    textarea.style.position = "fixed";
    textarea.style.left = "0";
    textarea.style.top = "0";
    textarea.style.opacity = "0";

    // Append the textarea to the DOM
    document.body.appendChild(textarea);

    // Select and copy the text
    textarea.select();
    document.execCommand("copy");

    // Remove the textarea from the DOM
    document.body.removeChild(textarea);
    setCopied(true);
  };

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  useEffect(() => {
    const prompt = localStorage.getItem("textGeneratorPrompt");
    if (prompt) {
      setPrompt(prompt);
    }
  }, []);

  useEffect(() => {
    const textGeneratorResponse = localStorage.getItem("textGeneratorResponse");
    if (textGeneratorResponse) {
      setResponse(textGeneratorResponse);
    }
  }, []);

  useEffect(() => {
    if (loading) {
      loadingAnimation(document.getElementById("loading")!, "white");
    }
  }, [loading]);

  return (
    <div className={style.imageBank}>
      <div className={style.imageBankHeding}>
        <h2 className={style.imageBankHeader}>Text generator</h2>
        <button
          className={style.previewImageInfo}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <InfoIcon />
          {isTooltipVisible && (
            <div className={style.infoTooltip}>
              Create contextually relevant text content by entering prompts.
            </div>
          )}
        </button>
      </div>

      <textarea
        placeholder="generate text about..."
        spellCheck="false"
        className={style.textGeneratorPrompt}
        value={prompt}
        onChange={handlePromptChange}
        ref={promptAreaRef}
      ></textarea>
      <button
        className={`${
          loading
            ? `${style.textGeneratorButton} pointer-events-none disabled`
            : style.textGeneratorButton
        }`}
        onClick={() => handleApiRequest(prompt)}
      >
        Generate
      </button>
      {loading ? <p id="loading" className={style.p}></p> : null}
      {response !== "" ? (
        <>
          <textarea
            placeholder="response from ai..."
            spellCheck="false"
            className={style.textGeneratorPrompt}
            value={response}
          ></textarea>
          <button
            className={style.textGenerateCopyButton}
            onClick={copyToClipboard}
          >
            {copied === false ? (
              <span>
                Copy text <ContentCopyIcon />
              </span>
            ) : (
              <span>
                Copied! <DoneIcon />
              </span>
            )}
          </button>
        </>
      ) : null}
    </div>
  );
};

export default TextGenerator;
