import { Groq } from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  const { message } = await request.json();

  const chatCompletion = await groq.chat.completions.create({
    "messages": [{ role: "user", content: message }],
    "model": "compound-beta",
    "temperature": 1,
    "max_completion_tokens": 1024,
    "top_p": 1,
    "stream": false,
    "stop": null
  });

  return NextResponse.json({
    response: chatCompletion.choices[0].message.content
  });
}
