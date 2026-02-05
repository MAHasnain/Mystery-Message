import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { config } from "@/config/config";
import { NextResponse } from "next/server";

const openai = createOpenAI({
  apiKey: config.OPENAI_API_KEY,
});

export async function POST() {
  try {
    const prompt = `
        Create a list of three open-ended and engaging questions formatted as a single string.
        Each question should be separated by '||'.

        These questions are for an anonymous social messaging platform like Qooh.me.
        They must be suitable for a diverse audience.
        Avoid personal, sensitive, or controversial topics.
        Focus on universal, friendly, curiosity-driven themes.

        Example format:
        "What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?"`;

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      temperature: 0.8,
      maxOutputTokens: 150,
    });

    return NextResponse.json({
      success: true,
      suggestions: result.text,
    });
  } catch (error) {
    console.error("AI Suggestion Error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to generate message suggestions",
      },
      { status: 500 }
    );
  }
}
