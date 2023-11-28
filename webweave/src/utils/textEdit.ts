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
    box-shadow: 5px 5px #96ADC5;
  }

  

</style>
  
  <script>
  // don't touch this!
  // this is the script that allows you to edit text on the page

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
        handleTextEdit(targetElement, editableElement.value);
      });
  
      // Handle the "Enter" key press to save changes
      editableElement.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          handleTextEdit(targetElement, editableElement.value);
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
    const textElements = document.querySelectorAll('h1, h2, h3, p, li, span');
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
