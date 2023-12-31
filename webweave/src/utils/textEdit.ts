// Tekstieditorin scripti, joka mahdollistaa sivun tekstisisällön muokkaamisen
const textEdit = {
  script: `



  <style>
  .input {
    border: 2px solid #e8e8e8;
    padding: 15px;
    border-radius: 10px;
    background-color: #2C3E50;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    color: #e8e8e8;
  }

  .input:focus {
    outline-color: #00BFFF;
    background-color: #2C3E50;
    box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
  }

  

</style>
  
  <script>
  // don't touch this!
  // this is the script that allows you to edit text on the page

  // Function to get the HTML content
  function getHtmlContent() {
    // Get the entire HTML content
    var htmlContent = document.documentElement.outerHTML;
  
    return htmlContent;
  }
  
  // Function to save HTML content to localStorage
  function saveHtmlToLocalStorage() {
    // Get the HTML content
    var htmlContent = getHtmlContent();

    // Save to localStorage with key 'html'
    localStorage.setItem('html', htmlContent);
  
    console.log("HTML content saved to localStorage.");
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Function to handle double-click events on text elements
    function handleTextDoubleClick(event) {
      const targetElement = event.target;
      const textContent = targetElement.innerText;
  
      // Create an input or textarea element based on text length
      const editableElement = textContent.length > 20 ? createTextareaElement(textContent) : createInputElement(textContent);
  
      // Replace the text element content with the input or textarea element
      targetElement.innerHTML = '';
      targetElement.appendChild(editableElement);
  
      // Focus on the input or textarea element
      editableElement.focus();
  
      // Handle the blur event to save changes when the input loses focus
      editableElement.addEventListener('blur', function () {
        // Check if the editableElement value is not empty
        if (editableElement.value.trim() !== "") {
          handleTextEdit(targetElement, editableElement.value);
          // Call the function to save doctype to localStorage
          saveHtmlToLocalStorage();
          console.log("saved");
        } else {
          console.log("Cannot save. Element is empty.");
          // You may want to notify the user that they cannot save an empty element.
        }
      });
      
      // Handle the "Enter" key press to save changes
      editableElement.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          // Check if the editableElement value is not empty
          if (editableElement.value.trim() !== "") {
            handleTextEdit(targetElement, editableElement.value);
            // Call the function to save doctype to localStorage
            saveHtmlToLocalStorage();
            console.log("saved");
          } else {
            console.log("Cannot save. Element is empty.");
            // You may want to notify the user that they cannot save an empty element.
          }
        }
      });
    }
  
    // Function to create an input element
    function createInputElement(value) {
      const inputElement = document.createElement('input');
      inputElement.type = 'text';
      inputElement.value = value;
      inputElement.classList.add('input');
      inputElement.spellcheck = false;
      return inputElement;
    }
  
    // Function to create a textarea element
    function createTextareaElement(value) {
      const textareaElement = document.createElement('textarea');
      textareaElement.value = value;
      textareaElement.classList.add('input');
      textareaElement.spellcheck = false;
      textareaElement.rows = 5;
      return textareaElement;
    }
  
    // Function to handle text editing
    function handleTextEdit(targetElement, newText) {
      // Apply the user input to the text content
      targetElement.innerHTML = newText;
    }
  
    // Add double-click event listeners to all text elements
    const textElements = document.querySelectorAll('h1, h2, h3, p, li, a, span');
    textElements.forEach(function (element) {
      element.addEventListener('dblclick', handleTextDoubleClick);
      element.style.cursor = 'pointer'; // Optional: Change cursor to indicate clickability
    });
  });


  const links = document.querySelectorAll('a');
  
  links.forEach(function (link) {
    link.removeAttribute('href');
  });

  
</script>`,
};

export { textEdit };
