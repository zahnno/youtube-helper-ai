# YouTube Video Digest AI

Welcome to the **YouTube Video Digest AI** repository! This project allows users to digest YouTube videos using Google Gemini or local LLM models via Ollama, and interactively ask questions about the content of the provided video URL.

## Features
- **Digest YouTube Videos**: Analyze video content through Google Gemini or a local LLM (Ollama).
- **Interactive Q&A**: Ask questions related to the video and receive informative answers.
- **Local LLM Support**: Use a locally hosted LLM (Ollama) with various pre-loaded models for context-based interaction.
- **Download MP4/MP3**: Download Youtube video as MP4 or MP3

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp#installation)
- [Ollama](https://ollama.com) (for local LLM support)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/zahnno/youtube-helper-ai
   cd youtube-helper-ai
   ```

2. **Setup the Environment Variables (GEMINI)**:
   - Create a `.env` file in the `server` directory.
   - Add your Google Gemini API key:
     ```
     GEMINI_API_KEY=your_gemini_api_key
     ```

3. **Install Dependencies**:
   - Navigate to the `server` folder and install dependencies:
     ```bash
     cd server
     npm install
     ```
   - Navigate to the `web-client` folder and install dependencies:
     ```bash
     cd ../web-client
     npm install
     ```

4. **Install yt-dlp**:
   For detailed installation instructions, visit the [yt-dlp GitHub page](https://github.com/yt-dlp/yt-dlp#installation).

5. **Run Ollama for Local LLM**:
   - Make sure [Ollama](https://ollama.com) is installed on your machine.
   - Start Ollama locally on `localhost:11434`:
     ```bash
     ollama serve
     ```

### Running the Application

1. **Start the Server**:
   - Navigate back to the `server` folder and run:
     ```bash
     cd ../server
     npm run dev
     ```

2. **Start the Web Client**:
   - In a new terminal window, navigate to the `web-client` folder and run:
     ```bash
     cd ../web-client
     npm run start
     ```

Your application should now be running locally! Open your browser and go to `http://localhost:3000` to interact with the YouTube Video Digest AI. You can select between Google Gemini or a local LLM model (via Ollama) for chatting in the context of the video.

### Local LLM Models
When Ollama is running, you can select from a list of loaded models to interact with. Make sure the models are properly loaded into Ollama before starting the application.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. Contributions are welcome!

## Acknowledgments
- [Google Gemini](https://cloud.google.com/gemini/docs)
- [Ollama](https://ollama.com)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
