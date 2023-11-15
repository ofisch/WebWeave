import style from "../assets/style";

// typewriter
export function typePlaceholder(textArea: HTMLTextAreaElement, text: string) {
  const placeholderText = text;
  let index = 0;
  const typingSpeed = 80; // Adjust the typing speed (milliseconds per character)

  function type() {
    if (index <= placeholderText.length) {
      textArea.setAttribute("placeholder", placeholderText.slice(0, index));
      index++;
      setTimeout(type, typingSpeed);
    }
  }

  type(); // Call the function to start the typewriter animation
}

export const loadingAnimation = (element: HTMLElement) => {
  const speed = 150;

  const animationElement = document.createElement("div");
  element.appendChild(animationElement);

  function load() {
    const color = "#00BFFF";
    const dot = `<span style="color: ${color}">.</span>`;
    animationElement.innerHTML = dot;
    setTimeout(() => {
      animationElement.innerHTML = dot + dot;
      setTimeout(() => {
        animationElement.innerHTML = dot + dot + dot;
        setTimeout(() => {
          animationElement.innerHTML = dot;
          setTimeout(load, speed);
        }, speed);
      }, speed);
    }, speed);
  }
  load();
};