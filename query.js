import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export default async function query(messages) {
  const url = process.env.OPEN_AI_ENDPOINT;

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": process.env.OPEN_AI_KEY,
    },
    body: JSON.stringify({
      messages,
      max_tokens: 800,
      temperature: 0.7,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 0.95,
      stop: null,
      functions: [
        {
          name: "get_current_weather",
          description: "Get the current weather in a given location",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state, e.g. San Francisco, CA",
              },
              unit: {
                type: "string",
                enum: ["imperial", "metric"],
              },
            },
            required: ["location"],
          },
        },
      ],
    }),
  };

  const response = await fetch(url, options);
  const json = await response.json();
  return json
}
