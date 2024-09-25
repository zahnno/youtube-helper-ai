const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");

async function geminiAIChat({ transcript, userInput}) {
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    }
  ];

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest", safetySettings: safetySettings });
  const text = `
    Moving forward in this converation you will be acting as a youtube helper that interprets video transcripts.
    If the user asks for questions outside of the video context, please answer it to the best of your ability.
    Digest the following transcript: ${transcript}
  `;
  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: text }],
        }
      ]
    });
    let result = await chat.sendMessage(userInput);
    console.log('gemini response', result.response.text());
    return result.response.text();
  } catch (error) {
    console.log('gemini error', error);
    return error;
  }
}

module.exports = { geminiAIChat };