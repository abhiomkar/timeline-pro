import {
  HarmBlockThreshold,
  HarmCategory,
  VertexAI,
} from "@google-cloud/vertexai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { personName } = await req.json();

  const response = await getTimeline(personName);
  return NextResponse.json(response);
}

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
  project: "timeline-pro-421115",
  location: "us-central1",
});
const model = "gemini-1.5-pro-preview-0409";

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 1,
    topP: 0.95,
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

// - create json object with birthDate and deathDate keys for given person name
// - if a person is still alive then set deathDate as null.
// - Always use YYYY-MM-DD format for dates.
// - avoid using markdown format.
// - the output should be a json object.

async function getTimeline(personName: string) {
  const req = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
- create json output with birthDate and deathDate as keys for given person name
- if a person is still alive then set deathDate as null.
- Always use YYYY-MM-DD format for dates.
- avoid using markdown format.
- Example output for person name "Steve Jobs": {birthDate: "1955-02-24", "deathDate": "2011-10-05"}

      Person name:
      ${personName}`,
          },
        ],
      },
    ],
  };

  const result = await generativeModel.generateContent(req);
  return result.response;
}
