import React, { useEffect } from "react";
import AutoResizeIframe from "../AutoResizeIframe";

export const Preview = ({
  response,
  setResponse,
}: {
  response: string;
  setResponse: (value: string) => void;
}) => {
  useEffect(() => {
    setResponse(localStorage.getItem("htmlResponse") ?? "");
  }, []);

  return (
    <>
      <div className="flex w-[1000px] m-auto flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
        <h5 className="mb-2 mt-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
          Esikatselu
        </h5>
        {localStorage.getItem("htmlResponse") !== null ? (
          <AutoResizeIframe contentSrc={response}></AutoResizeIframe>
        ) : (
          <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
            Virhe esikatselussa
          </p>
        )}

        <div className="p-6">
          <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
            Tallenna sivu muokataksesi sitä myöhemmin.
          </p>
        </div>
        <div className="p-6 pt-0">
          <button
            data-ripple-light="true"
            type="button"
            className="select-none rounded-lg bg-blue-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Tallenna
          </button>
        </div>
      </div>
    </>
  );
};
