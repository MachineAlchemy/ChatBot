# Engineering Knowledge Assistant

## Overview
An intelligent chatbot powered by Next.js and Llama3.1-8b-instruct that provides engineering knowledge and insights by leveraging a comprehensive vector database of 19 engineering textbooks. The system uses advanced natural language processing to understand technical queries and provide accurate, textbook-referenced responses across multiple engineering disciplines.

## Features
- Real-time engineering knowledge retrieval
- Context-aware responses from multiple engineering textbooks
- Support for various engineering disciplines including:
  - Aerospace Engineering
  - Mechanical Engineering
  - Electrical Engineering
  - Systems Engineering
  - Materials Science
  - Control Systems
  - And more...

## Technical Stack
- **Frontend**: Next.js, React
- **UI Components**: Material-UI (@mui/material)
- **AI/ML**: 
  - **OpenRouter API:** OpenRouter is a service that provides access to various LLMs including Llama,
  -  Claude, and others, often at more affordable rates than direct API access.
  -  It acts as an intermediary service that can route requests to different LLM providers while providing a unified API interface.
    
  - Hugging Face Transformers
  - ONNX Runtime
- **Vector Database**: Pinecone
- **Development Tools**: ESLint, CSS Loader, Style Loader

## Installation

1. Clone the repository: git clone https://github.com/yourusername/engineering-knowledge-assistant.git


2. Install dependencies: npm install


3. Set up environment variables:
Create a `.env.local` file with the following variables:

AI_API_KEY=your_api_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_environment


4. Run the development server:  npm run dev



## Usage
The application will be available at `http://localhost:3000`. Users can:
- Ask engineering-related questions
- Get responses backed by academic textbooks
- Receive detailed explanations with source references
- Explore multiple engineering disciplines

## Textbook Database
The system includes vectorized knowledge from 19 engineering textbooks, including:
- Aircraft Structures
- Fundamentals of Astrodynamics
- Systems Engineering: Principles and Practice
- Spacecraft Attitude Determination and Control
- And many more...

## Development

### Building for Production




















## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments
- Meta for their powerful language models
- The authors of all engineering textbooks included in the database
- The Next.js team for their excellent framework

## Contact
Your Name - [@yourusername](https://twitter.com/yourusername)
Project Link: [https://github.com/yourusername/engineering-knowledge-assistant](https://github.com/yourusername/engineering-knowledge-assistant)





