import os
from transformers import RobertaTokenizer, RobertaModel
import torch
from pinecone import Pinecone, ServerlessSpec

# Initialize Pinecone with your API key
pc = Pinecone(api_key="8c4581b7-31bc-438c-ac65-12f8ab93e620")

# Create an index if it doesn't exist
index_name = 'knowledgebase-index'
if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name, 
        dimension=768,  # Set to the embedding dimension of your model (768 for RoBERTa)
        metric='cosine',  # You can use 'euclidean', 'cosine', etc.
        spec=ServerlessSpec(
            cloud='aws',
            region='us-east-1'  # Use 'us-east-1' for East Coast U.S. region
        )
    )

# Connect to the index
index = pc.Index(index_name)

# Initialize RoBERTa tokenizer and model for embedding
tokenizer = RobertaTokenizer.from_pretrained('roberta-base')
model = RobertaModel.from_pretrained('roberta-base')
model.eval()

# Move the model to GPU
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)

# Function to embed text chunks
def embed_chunk(chunk, tokenizer, model):
    inputs = tokenizer(chunk, return_tensors="pt", truncation=True, max_length=512)
    inputs = {key: value.to(device) for key, value in inputs.items()}  # Move inputs to GPU
    with torch.no_grad():
        outputs = model(**inputs)
        chunk_embedding = outputs.last_hidden_state.mean(dim=1).squeeze().cpu().numpy()
    return chunk_embedding

# Path to the folder where the chunked text files are stored
chunked_folder_path = '/semantic_chunks'  # Ensure this is the correct path

# Iterate over each chunked file
for filename in os.listdir(chunked_folder_path):
    if filename.endswith('_chunks.txt'):  # Ensure only chunked text files are processed
        file_path = os.path.join(chunked_folder_path, filename)
        print(f"Embedding chunks from {filename}...")
        
        try:
            # Read the chunked text file
            with open(file_path, 'r', encoding='utf-8') as file:
                chunks = file.read().split("\n\n")  # Assuming chunks are separated by double newlines
            
            # Embed each chunk and upsert into Pinecone
            for i, chunk in enumerate(chunks):
                embedding = embed_chunk(chunk, tokenizer, model)
                chunk_id = f"{filename}_{i}"
                index.upsert([(chunk_id, embedding.tolist())])
                print(f"Inserted chunk {chunk_id} into Pinecone")
        
        except Exception as e:
            print(f"Error processing {filename}: {e}")

# Cleanup or further processing can be added here
