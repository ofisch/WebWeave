import React, { useState } from "react";
import { GeneratorBox } from "../components/componentGenerator/GeneratorBox";
import { Preview } from "../components/componentGenerator/Preview";
import { makeApiRequestWithBusiness } from "../utils/openai";
// import cleanCode from "../utils/codeCleaner";
import "../utils/cssAnimations/generateLoading.css";

export const ComponentGenerator = () => {
  // prompt ja response -statet
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  // Ref prompt-kentälle
  const promptAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const [loading, setLoading] = useState(false);

  // API-pyynnön käsittely
  const handleApiRequest = async () => {
    setLoading(true);
    const apiResponse = await makeApiRequestWithBusiness(prompt);

    /*
    cleanCode(apiResponse);
    setResponse(apiResponse);
    localStorage.setItem("htmlResponse", apiResponse);
    */

    setPrompt(prompt);
    localStorage.setItem("userPrompt", prompt);

    console.log("apiResponse", apiResponse);

    setResponse(apiResponse || "");
    localStorage.setItem("htmlResponse", apiResponse || "");

    console.log(apiResponse);
    setLoading(false);
  };

  // Promptin muuttaminen
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  return (
    <>
      <div className="mt-12 px-14">
        <div className="mb-12">
          <GeneratorBox
            prompt={prompt}
            setPrompt={setPrompt}
            handlePromptChange={handlePromptChange}
            promptAreaRef={promptAreaRef}
            handleApiRequest={handleApiRequest}
            loading={loading}
          />
        </div>

        {loading ? (
          <div className="mb-4">
            <div className="three-body">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        ) : null}

        <div>
          {response.length > 0 ? (
            <Preview response={response} setResponse={setResponse} />
          ) : null}
        </div>
      </div>
    </>
  );
};
