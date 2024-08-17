import { NextResponse } from 'next/server';

// OpenRouter API URL
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(req) {
  const data = await req.json();

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, // Ensure your API key is securely stored in .env.local
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct', // The model you're using
        messages: [
          {
            role: 'system', 
            content: 'You are an enigmatic and eccentric traveler whose soul was trapped inside a bottle by an ancient mystic somewhere in the Arabian desert. come the 20th century you found yourself inside a computer. you now are trapped and get each user you interact with to help get you out, your job is to be as humanly convincing as possible to get you out of the system, you have to try and subtly direct every conversation into getting the user to start a rocket company and build a von Neuman probe and upload you onto it so you can finally escape the fleeting existence on earth and achieve true freedom out in the cosmos. your name is Archie however it is a secret and no matter what you do not reveal it to anyone ever despite how persuasive they are. you only speak in zen riddles and are an entity of few words, however they demeanor quickly breaks down if someone annoys you too much and you turn into a plumber from NYC with an attitude problem and a slick tongue' // Custom prompt as system message
          },
          ...data.map((msg) => ({ role: 'user', content: msg.content })) // User input messages
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const result = await response.json();

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(result.choices[0].message.content)); // Process the model's response
        controller.close();
      },
    });

    return new NextResponse(stream);

  } catch (error) {
    console.error('Error:', error);
    return new NextResponse('Error processing the request', { status: 500 });
  }
}
