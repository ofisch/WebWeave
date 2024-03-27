import {
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
  style:
    "You are responsible for generating high-quality and contextually relevant style element based on users prompt. Make the page responsive. Never make text color the same as its background. Make the styling match the theme of the site. Add colors to match the theme of the site. Always add the style html tag. Return only the style tag and css code inside it, nothing else.",
  script:
    "You are responsible for generating high-quality and contextually relevant script element based on users prompt. Return only the script html tag with javascript code inside, nothing else.",
};

// Pyyntödata
const requestData = {
  model: "gpt-4-turbo-preview",
  //model: "gpt-3.5-turbo-1106",
  //gpt-4-32k // ei toimi tällä hetkellä
  //gpt-4-1106-preview // toimii, tulee hyviä tuloksia mutta hidas
  //gpt-4-turbo-preview // ehkä nopeempi
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

interface SiteStructure {
  header: string;
  banner: string;
  textElement: string;
  footer: string;
}

const convertStructureToHTML = (siteStructure: SiteStructure) => {
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
  // tyylin lisääminen sivulle
  requestData.messages[0].content = `Make a good looking and modern styling to this page: ${html}`;
  requestData.messages[1].content = roles.style;

  const responseStyle = await axios.post(endpoint, requestData, { headers });
  const responseStyleContent = responseStyle.data.choices[0].message.content;

  console.log("responseStyleContent: ", responseStyleContent);

  const style = getStyleComponent(responseStyleContent);

  console.log("style: ", style);

  const styledHtml = html.replace("</head>", `${style}</head>`);

  /*
  // skriptin lisääminen sivulle
  requestData.messages[0].content = `Add some JavaScript to this page if needed: ${styledHtml}`;
  requestData.messages[1].content = roles.script;

  const responseScript = await axios.post(endpoint, requestData, { headers });
  const responseScriptContent = responseScript.data.choices[0].message.content;

  console.log("responseScriptContent: ", responseScriptContent);

  const script = getScriptComponent(responseScriptContent);

  console.log("script: ", script);

  const completeHtml = styledHtml.replace("</body>", `${script}</body>`);

  return completeHtml;
  */

  return styledHtml;
};

const componentRoles: { [key: string]: string } = {
  // roolit eri komponenttien generointiin:
  header:
    "You are responsible for generating high-quality and contextually relevant header html element based on users prompt. Return only the header tag, nothing else. Return only HTML code, nothing else. Make the header clear and easy to read. Add a title to the header that matches the theme of the site. ",
  banner:
    "You are responsible for generating high-quality and contextually relevant banner html element based on users prompt. Return only the div with id=banner, nothing else. Return only HTML code, nothing else. Style the banner to be big and eye-catching. Add text to the banner. You can also add an image or a button to it.",
  textElement:
    "You are responsible for generating high-quality and contextually relevant main element based on users prompt. Make a main html tag and add content inside it. Make many different sections. Return only HTML code, nothing else. Return only the main element, nothing else. Don't make a banner or hero section. Don't add a header or a footer. You can add images, text, and buttons. Make the text easy to read. You can add different kinds of sections and elements like cards and testimonials. Make the page look professional.",
  footer:
    "You are responsible for generating high-quality and contextually relevant footer html element based on users prompt. Return only the footer tag, nothing else. Return only HTML code, nothing else. Make the footer match the style of the page. Add a copyright notice. Add links and info. Make the footer easy to read.",
};

// api-kutsu, jossa mukana generointisivulla valittu toimiala
const makeApiRequestWithBusiness = async (prompt: string) => {
  try {
    // aseta prompt request dataan
    requestData.messages[0].content = prompt;

    // tyhjä objekti komponenteille
    const components: { [key: string]: string } = {
      header: "",
      banner: "",
      textElement: "",
      footer: "",
    };

    // roolit ja niiden tagit
    const roletags: { [key: string]: string } = {
      header: "header",
      banner: `div id="banner"`,
      textElement: "main",
      footer: "footer",
    };

    // iteroi jokainen komponentti ja lisää ne komponentit-olioon
    // generoidaan jokainen komponentti yksitellen ja lisätään ne komponentit-olioon
    for (const role in componentRoles) {
      // aseta rooli pyyntödataan

      requestData.messages[1].content = componentRoles[role];
      const response = await axios.post(endpoint, requestData, { headers });

      // otetaan elementti talteen
      const responseContent = response.data.choices[0].message.content;
      console.log(`${role}-response: `, responseContent);

      if (role === "banner") {
        // jos rooli on banner, käytetään erillistä funktiota, joka ottaa bannerin talteen
        const bannerContent = getBannerContentWithTags(responseContent);
        if (bannerContent !== null) {
          components[role] = bannerContent;
        } else {
          components[role] = "";
        }
      } else {
        // jos rooli on mikä tahansa muu, käytetään tavallista funktiota, joka ottaa elementin talteen tag-parametrin avulla
        components[role] = getComponentFromCode(
          responseContent,
          roletags[role]
        );
      }
      console.log(`${role}-component: `, components[role]);
    }

    const html = convertStructureToHTML({
      header: components.header,
      banner: components.banner,
      textElement: components.textElement,
      footer: components.footer,
    });
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


  const plainHtml = convertStructureToHTML(siteStructure);
  console.log("plainHtml: ", plainHtml);



  const completeHtml = await addStyleAndScript(plainHtml);
  console.log("completeHtml: ", completeHtml);

  

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
