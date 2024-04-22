import { VertexAI } from "@google-cloud/vertexai";
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from "ai";

const project = process.env.GOOGLE_CLOUD_PROJECT || "";
const location = "us-central1";

const vertexAI = new VertexAI({ project: project, location: location });

// Google GenAI API can use the edge runtime. This will not work with Vertex AI
// export const runtime = 'edge';

// Instantiate Gemini models
const generativeModel = vertexAI.getGenerativeModel({
  model: "gemini-pro",
});

const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter(
      (message) => message.role === "user" || message.role === "assistant"
    )
    .map((message) => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.content }],
    })),
});

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json();

  const geminiStream = await generativeModel.generateContentStream(
    buildGoogleGenAIPrompt(messages)
  );

  // Convert the response into a friendly text-stream
  // GoogleGenerativeAIStream class decodes/extracts the text tokens in the
  // response and then re-encodes them properly for simple consumption.
  const stream = GoogleGenerativeAIStream(geminiStream);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
