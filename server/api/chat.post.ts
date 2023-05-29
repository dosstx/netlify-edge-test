import * as openai from "https://deno.land/x/openai@1.3.4/mod.ts";

const config = useRuntimeConfig()

const openAI = new openai(Deno.env.get(config.OPENAI_API_KEY))

export default defineEventHandler(async (event) => {

  const chatCompletion = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": "Who won the world series in 2020?" },
      {
        "role": "assistant",
        "content": "The Los Angeles Dodgers won the World Series in 2020.",
      },
      { "role": "user", "content": "Where was it played?" },
    ],
  });

  console.log(chatCompletion);

})