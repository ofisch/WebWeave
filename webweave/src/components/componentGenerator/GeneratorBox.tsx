import React, { useEffect } from "react";
import { typePlaceholder } from "../../utils/animation";

export const GeneratorBox = ({
  promptAreaRef,
  handleApiRequest,
  prompt,
  handlePromptChange,
}: {
  promptAreaRef: React.RefObject<HTMLTextAreaElement>;
  handleApiRequest: () => void;
  prompt: string;
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
    </>
  );
};
