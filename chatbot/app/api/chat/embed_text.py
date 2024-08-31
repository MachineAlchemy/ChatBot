from transformers import RobertaTokenizer, RobertaModel
import torch

def embed_text(text):
    tokenizer = RobertaTokenizer.from_pretrained('roberta-base')
    model = RobertaModel.from_pretrained('roberta-base')
    model.eval()

    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
        embedding = outputs.last_hidden_state.mean(dim=1).squeeze().numpy()
    return embedding

# Example usage
if __name__ == "__main__":
    import sys
    text = sys.argv[1]
    print(embed_text(text).tolist())
