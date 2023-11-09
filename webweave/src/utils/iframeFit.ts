const resizeIframeToFiContent = (iframe: HTMLIFrameElement) => {
  iframe.style.height = iframe.contentWindow?.document.body.scrollHeight + "px";
  iframe.style.width = iframe.contentWindow?.document.body.scrollWidth + "px";
};

export { resizeIframeToFiContent };
