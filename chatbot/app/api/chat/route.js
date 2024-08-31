import { NextResponse } from 'next/server';
import { PineconeClient } from '@pinecone-database/pinecone';

// Initialize Pinecone
const pinecone = new PineconeClient();

async function initializePinecone() {
  if (!pinecone.apiKey) {
    await pinecone.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });
  }
}

// Connect to your Pinecone index
async function getPineconeIndex() {
  await initializePinecone();
  return pinecone.Index('knowledgebase-index');
}

// Placeholder function for embedding text
async function embedText(text) {
  return [0.1, 0.2, 0.3]; // Dummy vector for testing
}

// Function to query Pinecone
async function queryPinecone(query, index, top_k = 3) {
  const embedding = await embedText(query);
  const results = await index.query({
    vector: embedding,
    topK: top_k,
    includeValues: true,
    includeMetadata: true,
  });
  return results;
}

export async function POST(req) {
  const data = await req.json();
  const index = await getPineconeIndex();

  const userMessage = data[data.length - 1].content;

  try {
    const pineconeResults = await queryPinecone(userMessage, index);
    const retrievedChunks = pineconeResults.matches.map(
      (match) => match.metadata.text
    ).join('\n');

    const finalPrompt = `
      Context: ${retrievedChunks}
      User: ${userMessage}
    `;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are an enigmatic and eccentric traveler...',
          },
          { role: 'assistant', content: retrievedChunks },
          { role: 'user', content: userMessage },
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
        controller.enqueue(encoder.encode(result.choices[0].message.content));
        controller.close();
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse('Error processing the request', { status: 500 });
  }
}
