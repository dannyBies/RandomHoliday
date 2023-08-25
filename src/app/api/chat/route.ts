import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

const apiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(apiConfig);

export async function POST(req: Request) {
  const { city, country } = await req.json();

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo", // Upgrade to gpt-3.5-turbo-instruct when available
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "You will be provided with a city, and your task is to create a short informational page for someone that goes on holiday. Your response should always be formatted as plain text such that it looks great within a html <pre> tag.",
      },
      { role: "user", content: `${city} - ${country}` },
    ],
    max_tokens: 1000,
    temperature: 0.7,
    frequency_penalty: 1,
    presence_penalty: 1,
  });
  if (!response.ok) {
    return response;
  }

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
