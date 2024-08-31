import Pinecone from '@pinecone-database/pinecone';

// Directly access what you need from the default export.
const pinecone = Pinecone.default();

async function testPinecone() {
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });

  const index = pinecone.Index('knowledgebase-index');
  console.log('Pinecone client initialized and connected to index:', index);
}

testPinecone().catch(console.error);
