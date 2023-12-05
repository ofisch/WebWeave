import React, { useRef, useEffect } from "react";
import style from "../assets/style";

interface AutoResizeIframeProps {
  contentSrc: string;
}

const AutoResizeIframe: React.FC<AutoResizeIframeProps> = ({ contentSrc }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;

      const adjustIframeSize = () => {
        if (iframe.contentWindow && iframe.contentWindow.document) {
          iframe.style.height = `${
            iframe.contentWindow.document.body.scrollHeight + 200
          }px`;
          iframe.style.width = "100%"; // Optionally, adjust the width as needed
          iframe.style.resize = "vertical";
        }
      };

      if (contentSrc != null) {
        iframe.srcdoc = contentSrc;
      } else {
        iframe.srcdoc = "";
      }
      iframe.onload = adjustIframeSize;
      adjustIframeSize();
    }
  }, [contentSrc]);

  return (
    <iframe
      className={style.iframe}
      ref={iframeRef}
      title="Auto-resizing iframe"
    />
  );
};

export default AutoResizeIframe;
