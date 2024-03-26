const cleanCode = (code: string) => {
  const doctypeStartIndex = code.indexOf("<!DOCTYPE html>");
  const htmlEndIndex = code.indexOf("</html>") + "</html>".length;

  const htmlContent = code.substring(doctypeStartIndex, htmlEndIndex).trim();

  return htmlContent;
};

// vanha, ei toimi jos komponentti on stailattu
// (koska leikkaa style-määreeseen tullessa elementin kokonaan pois)
/*
const getComponentFromCode = (code: string, component: string) => {
  const startIndex = code.indexOf(`<${component}>`);
  const endIndex = code.indexOf(`</${component}>`) + `</${component}>`.length;

  const componentContent = code.substring(startIndex, endIndex).trim();
  return componentContent;
};
*/

// uus, joka toivottavasti ei leikkaa stylen takia pois
const getComponentFromCode = (code: string, component: string) => {
  const startIndex = code.indexOf(`<${component}>`);
  if (startIndex === -1) {
    // Component not found
    return "";
  }

  // Find the endIndex dynamically based on startIndex and component tag
  const endIndex =
    code.indexOf(`</${component}>`, startIndex) + `</${component}>`.length;

  // Extract the component content
  const componentContent = code.substring(startIndex, endIndex).trim();
  return componentContent;
};

const getBannerContentWithTags = (html: string): string | null => {
  const startTag = '<div id="banner">';
  const endTag = "</div>";

  const startIndex = html.indexOf(startTag);
  if (startIndex === -1) return null; // If start tag not found

  const endIndex = html.indexOf(endTag, startIndex);
  if (endIndex === -1) return null; // If end tag not found

  // Extract the content including the start and end tags
  const bannerContent = html
    .substring(startIndex, endIndex + endTag.length)
    .trim();
  return bannerContent;
};

const getStyleComponent = (html: string): string | null => {
  const startTag = "<style>";
  const endTag = "</style>";

  const startIndex = html.indexOf(startTag);
  if (startIndex === -1) return null; // If start tag not found

  const endIndex = html.indexOf(endTag, startIndex);
  if (endIndex === -1) return null; // If end tag not found

  // Extract the content including the start and end tags
  const styleContent = html
    .substring(startIndex, endIndex + endTag.length)
    .trim();
  return styleContent;
};

export {
  cleanCode,
  getComponentFromCode,
  getBannerContentWithTags,
  getStyleComponent,
};
