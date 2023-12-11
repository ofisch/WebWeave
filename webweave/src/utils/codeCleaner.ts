const cleanCode = (code: string) => {
  const doctypeStartIndex = code.indexOf("<!DOCTYPE html>");
  const htmlEndIndex = code.indexOf("</html>") + "</html>".length;

  const htmlContent = code.substring(doctypeStartIndex, htmlEndIndex).trim();

  return htmlContent;
};
export default cleanCode;
