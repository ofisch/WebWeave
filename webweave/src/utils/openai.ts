import { API_KEY } from "./secret.ts";
import axios from "axios";

const apiKey = API_KEY;
const endpoint = "https://api.openai.com/v1/chat/completions";

const headers = {
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
};

const requestData = {
  model: "gpt-3.5-turbo",
  //max_tokens: 50,
  messages: [
    {
      role: "user",
      content: "käyttäjän prompt",
    },
    {
      role: "system",
      content:
        "you are an ai tool that creates html pages from the user's prompt. you don't add any explanations or additional text, only the html code. add css and javascript to the same file. link to cdn libraries if needed.",
    },
  ],
};

const writeToLog = (prompt: string, response: string) => {
  const logEntry = {
    prompt,
    response,
  };

  let log: { prompt: string; response: string }[] = [];
  const logFileData = localStorage.getItem("log.json");

  if (logFileData) {
    log = JSON.parse(logFileData);
  }

  log.push(logEntry);

  localStorage.setItem("log.json", JSON.stringify(log, null, 2));

  console.log("Log entry written to localStorage");
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

const makeApiRequest = async (prompt: string) => {
  try {
    requestData.messages[0].content = prompt;
    const response = await axios.post(endpoint, requestData, { headers });
    const responseText = response.data.choices[0].message.content;
    const promptText = requestData.messages[0].content;
    //console.log("Prompt:", promptText);
    //console.log("Response:", responseText);
    writeToLog(promptText, responseText);
    console.log("API response:", responseText);
    return responseText;
  } catch (error) {
    console.error("API error:", error);
  }
};

export { makeApiRequest, exportToJSONFile, responseFinal };
