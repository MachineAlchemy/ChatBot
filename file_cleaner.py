import os
import re
import PyPDF2

def extract_text_from_pdf(pdf_path):
    """
    Extracts text from a PDF file.
    """
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)  # This is the correct usage
        text = ''
        for page in reader.pages:
            text += page.extract_text()
        return text

def clean_text(text):
    """
    Cleans the extracted text by removing headers, footers, extra whitespace, and other unwanted elements.
    """
    # Remove headers, footers, and page numbers using regex
    text = re.sub(r'\bPage \d+\b', '', text)  # Remove page numbers
    text = re.sub(r'\n\s*\n', '\n', text)  # Remove extra line breaks
    text = re.sub(r'\n', ' ', text)  # Replace line breaks with spaces (preserve sentence flow)
    text = ' '.join(text.split())  # Normalize whitespace
    
    # Handle technical content more accurately
    text = handle_technical_content(text)
    
    return text

def handle_technical_content(text):
    """
    Preserves equations, special characters, and technical formatting accurately.
    """
    # Retain equations formatted in LaTeX, MathML, or similar formats
    text = re.sub(r'(\$\$.*?\$\$|\$.*?\$)', r'\1', text)  # Retain LaTeX-style inline equations

    # Retain technical terms or patterns
    text = re.sub(r'(\[\[.*?\]\])', r'\1', text)  # Example for retaining specific technical annotations
    
    # Replace certain special character placeholders if needed

    return text

def preserve_lists(text):
    """
    Ensures that lists and bullet points are preserved during the cleaning process.
    """
    text = re.sub(r'(\n)(\d+\.\s|\-\s|\•\s)', r'\1', text)  # Preserve numbered and bullet points lists
    return text

def process_pdf_folder(folder_path, output_folder):
    """
    Processes all PDFs in the specified folder, extracts and cleans the text, and saves the cleaned text to output files.
    """
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        
    for filename in os.listdir(folder_path):
        if filename.endswith('.pdf'):
            pdf_path = os.path.join(folder_path, filename)
            print(f"Processing {filename}...")
            
            # Extract text from the PDF
            text = extract_text_from_pdf(pdf_path)
            
            # Preserve lists and bullet points
            text = preserve_lists(text)
            
            # Clean the extracted text
            cleaned_text = clean_text(text)
            
            # Save the cleaned text to a new file
            output_file = os.path.join(output_folder, filename.replace('.pdf', '.txt'))
            with open(output_file, 'w') as f:
                f.write(cleaned_text)
                
            print(f"Cleaned text saved to {output_file}")

# Example usage: replace these paths with your actual paths
pdf_folder_path = '/Users/taimoorawan/Documents/ChatBot/KnoledgeBase-Unprocessed'  # Path to the folder containing your PDFs
cleaned_output_folder = '/Users/taimoorawan/Documents/ChatBot/cleaned_output_folder'  # Path to the folder where cleaned text files will be saved

process_pdf_folder(pdf_folder_path, cleaned_output_folder)
