const removeTextEdit = (commentText: string, htmlCode: string) => {
  const htmlContent = htmlCode;

  const commentIndex = htmlContent.indexOf(commentText);

  if (commentIndex !== -1) {
    const updatedHtml = htmlContent.substring(0, commentIndex);

    const updatedHtmlWithCursor = updatedHtml.replace(
      /(<a\b[^>]*?)>/gi,
      '$1 style="cursor: pointer;">'
    );

    return updatedHtmlWithCursor.replace(
      /(<(?!a\b)[^>]*?)\s*style\s*=\s*['"]([^'"]*cursor:\s*pointer[^'"]*)['"]([^>]*?>)/gi,
      "$1$3"
    );
  }

  return htmlContent;
};

export default removeTextEdit;
