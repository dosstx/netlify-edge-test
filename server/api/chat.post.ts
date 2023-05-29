
import { Configuration, OpenAIApi } from "openai-edge"

const rConfig = useRuntimeConfig()

const configuration = new Configuration({
  apiKey: rConfig.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export const config = {
  runtime: "edge",
}

export default defineEventHandler(async (event) => {

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Who won the world series in 2020?" },
        {
          role: "assistant",
          content: "The Los Angeles Dodgers won the World Series in 2020.",
        },
        { role: "user", content: "Where was it played?" },
      ],
      max_tokens: 7,
      temperature: 0,
      stream: true,
    })

    const response = new Response(completion.body, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/event-stream;charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    })
    console.log('server: ', response)
    return response
  } catch (error: any) {
    console.error(error)

    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    })
  }
})