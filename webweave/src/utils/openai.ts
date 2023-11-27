import { API_KEY } from "./secret.ts";
import axios from "axios";
const apiKey = API_KEY;
const endpoint = "https://api.openai.com/v1/chat/completions";

const headers = {
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
};

const roles = {
  webdev:
    "As an AI tool, your primary function is to generate HTML pages based on user prompts. Give a brief explanation of the given website before the HTML code. Ensure the HTML is enhanced with modern styling. Incorporate CSS and JavaScript within the same file, utilizing CDN libraries when necessary.",
  // "You are an AI tool that creates HTML pages from the user's prompt. You don't add any explanations or additional text, only the HTML code. Don't add any markdown. Add modern styling to the page. Add CSS and JavaScript to the same file. Link to CDN libraries if needed.",
  optimizer:
    "Your expertise in concise writing is needed to elaborate on the provided website specification. Emphasize key points and streamline the content by eliminating unnecessary information. Feel free to expand without altering the meaning. Ensure HTML validity as per HTML5 specifications and prioritize responsive design. Remember, the audience lacks technical knowledge, so thorough explanations and additional details are crucial. Avoid creating HTML code; solely focus on detailing the specification.",
  // "As an expert writer skilled in crafting concise and clear text, your task is to expand the given website specification, emphasizing the most important points and removing any unnecessary information. Be as verbose as you want. Please do not change the meaning of the text. You can add or remove words, but do not change the meaning of the text. HTML must be valid and respect the HTML5 specification. Design must be responsive. Use simple words and short sentences. Focus on the most important points. The input is from a novice and non-technical person, so you must explain everything in detail and fill in any missing information. Do not create HTML code, just the specification.",
};

const requestData = {
  model: "gpt-3.5-turbo-1106",
  //model: "gpt-4-0613",
  //max_tokens: 50,
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

  console.log("Log entry written to localStorage");
  console.log("Log entry: ", logEntry);
};

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
    console.log("Role:", role);

    //console.log("Prompt:", promptText);
    //console.log("Response:", responseText);
    //console.log(response);
    writeToLog(
      responseModel,
      tokenTotal,
      responseRole,
      promptText,
      tokenPrompt,
      responseText,
      tokenResponse
    );
    //console.log("API response:", responseText);
    return responseText;
  } catch (error) {
    console.error("API error:", error);
  }
};

export { makeApiRequest, exportToJSONFile, responseFinal, roles };
