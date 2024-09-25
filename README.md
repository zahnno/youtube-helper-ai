# YouTube Video Digest AI

Welcome to the **YouTube Video Digest AI** repository! This project allows users to digest YouTube videos using Google Gemini and interactively ask questions about the content of the provided video URL.

## Features
- **Digest YouTube Videos**: Analyze video content through Google Gemini.
- **Interactive Q&A**: Ask questions related to the video and receive informative answers.

  
## Preview
<img width="300" alt="intro" src="https://github.com/user-attachments/assets/97341e29-120b-4ecd-ac7f-54b6fa90c1aa">
<img width="300" alt="chat" src="https://github.com/user-attachments/assets/966e8acd-82be-4d52-98c8-16231e058cd3">

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp#installation)
- Your own gemini api key

### Installation

1. **Clone the repository**:

2. **Setup the Environment Variables**:
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

4. **Install yt-dlp using Yarn**:
   ```bash
   yarn global add yt-dlp
   ```

   For detailed installation instructions, visit the [yt-dlp GitHub page](https://github.com/yt-dlp/yt-dlp#installation).

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

Your application should now be running locally! Open your browser and go to `http://localhost:3000` to interact with the YouTube Video Digest AI.

## Acknowledgments
- [Google Gemini](https://cloud.google.com/gemini/docs)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)

---

Thank you for checking out the project! If you have any questions or feedback, feel free to reach out.
