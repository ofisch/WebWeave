import React, { useEffect } from "react";
import { typePlaceholder } from "../../utils/animation";

export const GeneratorBox = ({
  promptAreaRef,
  handleApiRequest,
  prompt,
  setPrompt,
  handlePromptChange,
}: {
  promptAreaRef: React.RefObject<HTMLTextAreaElement>;
  handleApiRequest: () => void;
  prompt: string;
  setPrompt: (value: string) => void;
  handlePromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  loading: boolean;
}) => {
  useEffect(() => {
    if (promptAreaRef.current) {
      typePlaceholder(promptAreaRef.current, "kuvaile sivua tähän...");
    }
    const interval = setInterval(() => {
      if (promptAreaRef.current) {
        typePlaceholder(promptAreaRef.current, "kuvaile sivua tähän...");
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setPrompt(localStorage.getItem("userPrompt") || "");
  }, []);

  /*
  const [dropDown, setDropDown] = React.useState(false);
  
  const toggleDropDown = () => {
    setDropDown(!dropDown);
  };
*/

  const [selectedOption, setSelectedOption] = React.useState("ravintola");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <>
      <div className="max-w-md mx-auto relative overflow-hidden z-10 bg-white p-8 rounded-lg shadow-md before:w-24 before:h-24 before:absolute before:bg-purple-500 before:rounded-full before:-z-10 before:blur-2xl after:w-32 after:h-32 after:absolute after:bg-sky-400 after:rounded-full after:-z-10 after:blur-xl after:top-24 after:-right-12">
        <h2 className="text-2xl text-sky-900 font-bold mb-6">Luo sivu</h2>

        <div className="mb-4 flex flex-wrap">
          <label className="block text-sm font-medium text-gray-600">
            prompt
          </label>
          <textarea
            className="mt-1 p-2 w-full border rounded-md"
            rows={3}
            name="prompt"
            id="prompt"
            onChange={handlePromptChange}
            value={prompt}
            ref={promptAreaRef}
            spellCheck="false"
          ></textarea>
        </div>

        <div className="flex justify-between">
          <div className="relative group rounded-lg w-64 bg-gray-50 overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-0 before:bg-sky-400 before:rounded-full before:blur-lg">
            <svg
              y="0"
              xmlns="http://www.w3.org/2000/svg"
              x="0"
              width="100"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              height="100"
              className="w-8 h-8 absolute right-0 -rotate-45 stroke-pink-300 top-1.5 group-hover:rotate-0 duration-300"
            >
              <path
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
                d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"
                className="svg-stroke-primary"
              ></path>
            </svg>
            <select
              value={selectedOption}
              onChange={handleSelectChange}
              className="appearance-none hover:placeholder-shown:bg-emerald-500 relative  bg-transparent ring-0 outline-none border border-neutral-500 text-neutral-900 placeholder-violet-700 text-sm font-bold rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5"
            >
              <option value="ravintola">ravintola</option>
              <option value="kahvila">kahvila</option>
              <option value="taiteet">taiteet</option>
              <option value="virkistys">virkistys</option>
              <option value="koulutus">koulutus</option>
              <option value="rakennusala">rakennusala</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              className={`[background:linear-gradient(144deg,#af40ff,#5b42f3_50%,#00ddeb)] text-white px-4 py-2 font-bold rounded-md hover:opacity-80`}
              type="submit"
              onClick={() => handleApiRequest()}
            >
              Generoi
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
