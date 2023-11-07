import { KEY } from "./secret.ts";
import axios from "axios";

const apiKey = KEY;
const endpoint = "https://api.openai.com/v1/chat/completions";

const headers = {
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
};

const requestData = {
  model: "gpt-3.5-turbo",
  max_tokens: 50,
  messages: [
    {
      role: "user",
      content: "Who are you?",
    },
  ],
};

const makeApiRequest = async () => {
  try {
    const response = await axios.post(endpoint, requestData, { headers });
    console.log(response);
    console.log("API response:", response.data.choices[0].message.content);
  } catch (error) {
    console.error("API error:", error);
  }
};

export { makeApiRequest };
