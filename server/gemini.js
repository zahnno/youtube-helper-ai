const { GoogleGenerativeAI } = require("@google/generative-ai");

async function geminiAIChat({ transcript, userInput}) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const text = `
    Moving forward you will be acting as my youtube helper AI.
    Digest the following transcript of the video, I will ask you a question about it.
    Transcript: ${transcript}
  `;
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: text}],
      }
    ],
  });
  let result = await chat.sendMessage(userInput);
  console.log(result.response.text());
  return result.response.text();
}

module.exports = { geminiAIChat };