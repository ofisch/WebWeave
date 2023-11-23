const textEdit = {
  script: `<script>document.addEventListener('DOMContentLoaded', function () {
    // Function to handle click events on text elements
    function handleTextClick(event) {
      const targetElement = event.target;

      // Prompt the user for input
      const userInput = prompt('Enter new text:', targetElement.innerText);

      // If the user provided input and clicked OK
      if (userInput !== null) {
        // Apply the user input to the text content
        targetElement.innerText = userInput;
      }
    }

    // Add click event listeners to all text elements
    const textElements = document.querySelectorAll('h1, h2, h3, p, li, span');
    textElements.forEach(function (element) {
      element.addEventListener('dblclick', handleTextClick);
      element.style.cursor = 'pointer'; // Optional: Change cursor to indicate clickability
    });
  });
</script>`,
};

export { textEdit };
