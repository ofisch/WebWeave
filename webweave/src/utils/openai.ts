import cleanCode, {
  getBannerContent,
  getBannerContentWithTags,
  getComponentFromCode,
  getStyleComponent,
} from "./codeCleaner.ts";
import { API_KEY } from "./secret.ts";
import axios from "axios";
const apiKey = API_KEY;
const endpoint = "https://api.openai.com/v1/chat/completions";

// Headerit jotka lähetetään jokaisen pyynnön mukana
const headers = {
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
};

// Roolit ja niiden kuvaukset
const roles = {
  // Sivun generointi
  webdev:
    "As an AI tool, your primary function is to generate HTML pages based on user prompts. Give a brief explanation of the given website before the HTML code. Ensure the HTML is enhanced with modern styling. implement the colors using the 60 30 10 rule. Use every color in the ratio of 60 30 10. Main being 60. Accent being 30. Action being 10. Customize css for the page, and ensure every element has a custom css. Incorporate CSS and JavaScript within the same html file, inside style and script tags, utilizing CDN libraries when necessary. Do not leave the page empty ever. If you are not specified content for each element, make placeholder content for the page. Ensure the text has good color contrast.",
  // Käyttäjän promptin optimointi
  optimizer:
    "Your expertise in concise writing is needed to elaborate on the provided website specification. Emphasize key points and streamline the content by eliminating unnecessary information. Feel free to expand without altering the meaning. Ensure HTML validity as per HTML5 specifications and prioritize responsive design. Remember, the audience lacks technical knowledge, so thorough explanations and additional details are crucial. Avoid creating HTML code; solely focus on detailing the specification.",
  // Editointipromptin optimointi
  optimizerEdit:
    "Your expertise in concise writing is needed to elaborate on the provided changes the customer wants on his website. Your task is to expand the given website specification, emphasizing the most important points and removing any unnecessary information. Feel free to expand without altering the meaning. Ensure HTML validity as per HTML5 specifications and prioritize responsive design. Remember, the customer who’s specifications you are translating may lack technical knowledge, so you need to translate the customer's wishes to a standard that a web developer can utilize when updating. Write the whole specification in 1st person, so that it seems the customer has written it himself. Avoid creating HTML code; solely focus on detailing the specification.",
  // Editoinnin generointi
  editor:
    "You are an AI tool that creates HTML pages from the user's prompt. You don't add any explanations or additional text, only the HTML code. Don't add any markdown. Add modern styling to the page. Add CSS and JavaScript to the same file. Link to CDN libraries if needed.",
  // Tekstin generointi
  writer:
    "You are responsible for generating high-quality and contextually relevant text content based on user prompts. The primary goal is to assist users in creating coherent and engaging written material across various domains, including but not limited to creative writing, professional communication, and information synthesis.",

  // roolit eri komponenttien generointiin:
  header:
    "You are responsible for generating high-quality and contextually relevant header html element based on users prompt. Return only the header tag, nothing else. Return only HTML code, nothing else. The element will be styled later",
  banner:
    "You are responsible for generating high-quality and contextually relevant banner html element based on users prompt. Return only the banner tag, nothing else. Return only HTML code, nothing else. The element will be styled later",
  textElement:
    "You are responsible for generating high-quality and contextually relevant text element based on users prompt. Return only HTML code, nothing else. Return only the textelement, nothing else. Don't add a header or a footer. The element will be styled later",
  footer:
    "You are responsible for generating high-quality and contextually relevant footer html element based on users prompt. Return only the footer tag, nothing else. Return only HTML code, nothing else. The element will be styled later",
  style:
    "You are responsible for generating high-quality and contextually relevant style element based on users prompt. Make a good looking and modern styling. Make the page responsive. Always add the styling html tag. Return only the style tag and css code inside it, nothing else.",
  script:
    "You are responsible for generating high-quality and contextually relevant script element based on users prompt. Return only javascript code, nothing else.",
};

// Pyyntödata
const requestData = {
  model: "gpt-3.5-turbo-1106",
  //gpt-4-32k // ei toimi tällä hetkellä
  //gpt-4-1106-preview // ei toimi tällä hetkellä
  //gpt-3.5-turbo-1106 // tää on se paras
  //gpt-3.5-turbo-0125 // vaihtoehto, jos ratelimit täynnä
  messages: [
    {
      role: "user",
      content: " ",
    },
    {
      role: "system",
      content: " ",
    },
  ],
};

// Kirjoita lokitiedostoon
const writeToLog = (
  model: string,
  tokenTotal: string,
  role: string,
  prompt: string,
  tokenPrompt: string,
  response: string,
  tokenResponse: string
) => {
  const logEntry = {
    model,
    role,
    tokenTotal,
    fullPrompt: {
      prompt,
      tokenPrompt,
    },
    fullResponse: {
      response,
      tokenResponse,
    },
  };

  let log: {
    model: string;
    role: string;
    tokenTotal: string;
    fullPrompt: {
      prompt: string;
      tokenPrompt: string;
    };
    fullResponse: {
      response: string;
      tokenResponse: string;
    };
  }[] = [];
  const logFileData = localStorage.getItem("log.json");

  if (logFileData) {
    log = JSON.parse(logFileData);
  }

  log.push(logEntry);

  localStorage.setItem("log.json", JSON.stringify(log, null, 2));
};

// Vienti lokitiedostoon
const exportToJSONFile = () => {
  const logData = localStorage.getItem("log.json");
  if (logData) {
    const logJSON = JSON.parse(logData);
    const logJSONString = JSON.stringify(logJSON, null, 2);

    const blob = new Blob([logJSONString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "log.json";
    document.body.appendChild(a);

    a.click();

    URL.revokeObjectURL(url);
  } else {
    console.error("No log data found in localStorage.");
  }
};

let responseFinal: string;

// Tee pyyntö OpenAI API:lle
const makeApiRequest = async (prompt: string, role: string) => {
  try {
    requestData.messages[1].content = role;
    requestData.messages[0].content = prompt;
    const response = await axios.post(endpoint, requestData, { headers });
    const responseModel = response.data.model;
    const tokenTotal = response.data.usage.total_tokens;
    const tokenPrompt = response.data.usage.prompt_tokens;
    const tokenResponse = response.data.usage.completion_tokens;
    const responseRole = response.data.choices[0].message.role;
    const responseText = response.data.choices[0].message.content;
    const promptText = requestData.messages[0].content;

    writeToLog(
      responseModel,
      tokenTotal,
      responseRole,
      promptText,
      tokenPrompt,
      responseText,
      tokenResponse
    );
    return responseText;
  } catch (error) {
    console.error("API error:", error);
  }
};

// uuden generointisivun testaamiseen
const makeApiRequestNoRole = async (prompt: string) => {
  try {
    requestData.messages[0].content = prompt;
    requestData.messages[1].content = roles.webdev;

    const response = await axios.post(endpoint, requestData, { headers });
    const responseContent = response.data.choices[0].message.content;

    return responseContent;
  } catch (error) {
    console.error("API-virhe: ", error);
  }
};

/*
const cafeWebsite = [
  {
    header: "<header> <h1></h1> </header>",
    banner: `<div class="banner"> <h2></h2> </div>`,
    menu: `<div class="menu"> <h3>Menu</h3> <ul></ul> </div>`,
    contact: `<div class="contact"> <h3>Contact</h3> <p></p> </div>`,
    footer: `<footer> <p></p> </footer>`,
    style: `<style> </style>`,
    script: `<script> </script>`,
  },
];
*/

const convertStructureToHTML = (siteStructure: any) => {
  const { header, banner, textElement, footer } = siteStructure;

  const html: string = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      ${header}
      ${banner}
      ${textElement}
      ${footer}
    </body>
    </html>
  `;

  return html;
};

// funktio, joka lisää tyylittelyn ja tarvittavat skripit sivulle ja palauttaa valmiin sivun
const addStyleAndScript = async (html: string) => {
  requestData.messages[0].content = `Make a good looking and modern styling to this page: ${html}`;
  requestData.messages[1].content = roles.style;

  const responseStyle = await axios.post(endpoint, requestData, { headers });
  const responseStyleContent = responseStyle.data.choices[0].message.content;

  console.log("responseStyleContent: ", responseStyleContent);

  const style = getStyleComponent(responseStyleContent);

  console.log("style: ", style);

  return html.replace("</head>", `${style}</head>`);
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const componentRoles: { [key: string]: string } = {
  // roolit eri komponenttien generointiin:
  header:
    "You are responsible for generating high-quality and contextually relevant header html element based on users prompt. Return only the header tag, nothing else. Return only HTML code, nothing else. The element will be styled later",
  banner:
    "You are responsible for generating high-quality and contextually relevant banner html element based on users prompt. Return only the div with id=banner, nothing else. Return only HTML code, nothing else. The element will be styled later",
  textElement:
    "You are responsible for generating high-quality and contextually relevant main element based on users prompt. Make a main html tag and add content inside it. Return only HTML code, nothing else. Return only the main element, nothing else. Don't add a header or a footer. The element will be styled later",
  footer:
    "You are responsible for generating high-quality and contextually relevant footer html element based on users prompt. Return only the footer tag, nothing else. Return only HTML code, nothing else. The element will be styled later",
};

// api-kutsu, jossa mukana generointisivulla valittu toimiala
const makeApiRequestWithBusiness = async (prompt: string) => {
  try {
    // Set user input to request data
    requestData.messages[0].content = prompt;

    // Object to collect generated components
    const components: { [key: string]: string } = {
      header: "",
      banner: "",
      textElement: "",
      footer: "",
    };

    // Roles and their corresponding tags for capturing elements from the API response
    const roletags: { [key: string]: string } = {
      header: "header",
      banner: `div id="banner"`,
      textElement: "main",
      footer: "footer",
    };

    // Iterate through each role and make an API call for it
    // Generate each component one by one and add them to the components object
    for (const role in componentRoles) {
      // Set role to request data

      requestData.messages[1].content = componentRoles[role];
      const response = await axios.post(endpoint, requestData, { headers });

      // Get the content of the element from the response
      const responseContent = response.data.choices[0].message.content;
      console.log(`${role}-response: `, responseContent);

      if (role === "banner") {
        // If the role is banner, use a different function to capture the banner
        components[role] = getBannerContentWithTags(responseContent);
      } else {
        // If the role is anything else, use a function to capture the element
        components[role] = getComponentFromCode(
          responseContent,
          roletags[role]
        );
      }
      console.log(`${role}-component: `, components[role]);
    }

    const html = convertStructureToHTML(components);
    console.log("html: ", html);

    const completeHtml = await addStyleAndScript(html);
    console.log("completeHtml: ", completeHtml);

    return completeHtml;
  } catch (error) {
    console.error("API error: ", error);
  }
};

const generateSite = async (prompt: string) => {
  const siteStructure = await makeApiRequestWithBusiness(prompt);
  console.log("siteStructure: ", siteStructure);
  /*
  await delay(2000);

  const plainHtml = convertStructureToHTML(siteStructure);
  console.log("plainHtml: ", plainHtml);

  await delay(2000);

  const completeHtml = await addStyleAndScript(plainHtml);
  console.log("completeHtml: ", completeHtml);

  await delay(2000);

  return completeHtml;
  */
};

export {
  makeApiRequest,
  makeApiRequestNoRole,
  makeApiRequestWithBusiness,
  generateSite,
  exportToJSONFile,
  responseFinal,
  roles,
};
