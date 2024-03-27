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
  // Construct regex pattern to match opening and closing tags with any attributes
  const regex = new RegExp(
    `(<${component}\\b[^>]*>[\\s\\S]*?<\\/${component}>)`,
    "i"
  );
  const match = code.match(regex);

  if (!match || match.length < 1) {
    // Component not found
    return "";
  }

  // Extract the entire matched tag including its content
  const componentContent = match[0].trim();
  return componentContent;
};

const getBannerContentWithTags = (html: string): string | null => {
  // Define the start and end tags
  const startTag = '<div id="banner"';
  const endTag = "</div>";

  // Find the index of the start tag
  const startIndex = html.indexOf(startTag);
  if (startIndex === -1) return null; // If start tag not found

  // Find the index of the end tag starting from the startIndex
  const endIndex = html.indexOf(endTag, startIndex);
  if (endIndex === -1) return null; // If end tag not found

  // Extract the content including the start and end tags
  const bannerContentWithTags = html
    .substring(startIndex, endIndex + endTag.length)
    .trim();
  return bannerContentWithTags;
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

const getScriptComponent = (html: string): string | null => {
  const startTag = "<script>";
  const endTag = "</script>";

  const startIndex = html.indexOf(startTag);
  if (startIndex === -1) return null; // If start tag not found

  const endIndex = html.indexOf(endTag, startIndex);
  if (endIndex === -1) return null; // If end tag not found

  // Extract the content including the start and end tags
  const scriptContent = html
    .substring(startIndex, endIndex + endTag.length)
    .trim();
  return scriptContent;
};

export {
  cleanCode,
  getComponentFromCode,
  getBannerContentWithTags,
  getStyleComponent,
  getScriptComponent,
};
