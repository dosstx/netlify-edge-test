import { getChatStream } from '../utils/ai'
export default defineEventHandler(async (event) => {
  try {
    const { messages } = await readBody(event)
    const stream = await getChatStream({ messages })
    return stream
  } catch (error) {
    console.error('error on server', error)
  }

})