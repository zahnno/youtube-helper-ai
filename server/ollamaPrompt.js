const axios = require('axios');

async function ollamaPrompt({ transcript, userInput, model}) {
  const text = `
    Moving forward in this converation you will be acting as a youtube helper that interprets video transcripts.
    If the user asks for questions outside of the video context, please answer it to the best of your ability.
    Digest the following transcript: ${transcript}, Here is the user input: ${userInput}
  `;
  try {
    const result = await axios.post('http://localhost:11434/api/generate', {
      model: model,
      stream: false,
      prompt: text,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return result.data?.response
  } catch (error) {
    return error;
  }
}

module.exports = { ollamaPrompt };