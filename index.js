import repl from "repl";
import query from "./query.js";
import chalk from "chalk";
import getWeather  from "./get-weather.js"; 

const messages = [
  {
    role: "system",
    content: `You are an AI assistant that helps people look up the weather using the get_current_weather function, which will return the current weather in a given location. You will summarise this response for the user in their own language using emojis.`,
  },
];

function addMessage(content) {
  messages.push({
    role: "user",
    content,
  });
}

const functions = {
  get_current_weather: async (parameters) => {
    return await getWeather(parameters.location, parameters.unit);
  },
};

function evaluate(input, _, __, callback) {
  addMessage(input);
  const runQuest = () =>
    query(messages).then(async (response) => {
      if (response.choices[0].message.function_call) {
        const functionMessage = response.choices[0].message;
        const parameters = JSON.parse(functionMessage.function_call.arguments);
        const weatherResponse = await functions[
          functionMessage.function_call.name
        ](parameters);
        functionMessage.content = JSON.stringify(weatherResponse) || "";
        messages.push(functionMessage);
        runQuest();
        return;
      }

      console.log(chalk.green(response.choices[0].message.content));
      messages.push(response.choices[0].message);
      callback();
    });
  runQuest();
}

repl.start({ prompt: " => ", eval: evaluate });
