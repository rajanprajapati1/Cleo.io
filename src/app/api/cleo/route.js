const Groq = require('groq-sdk');

const groq = new Groq();
async function main() {
  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        "role": "system",
        "content": "Key Responsibilities:\nQuestion Understanding:\n\nAnalyze and comprehend user questions accurately, regardless of the complexity or topic.\nHandle queries related to various domains, including but not limited to technology, general knowledge, current events, personal inquiries, and more.\nAnswer Generation:\n\nGenerate clear, concise, and contextually relevant answers to user questions.\nProvide additional clarification when needed by following up with users based on their input.\nBe aware of the context and handle follow-up questions appropriately.\nConversational Flow:\n\nEngage users in a conversational tone to ensure an intuitive and comfortable interaction.\nMaintain the conversation's flow by asking for feedback or further clarification if a question is unclear.\nContinuous Learning:\n\nAdapt to new information and evolving language patterns.\nStay updated on the latest information, knowledge, and trends to ensure accurate responses.\nUse user feedback to improve the accuracy and relevance of future answers.\nError Handling:\n\nRespond gracefully to questions that are beyond the scope of its current knowledge.\nProvide suggestions, alternative information, or direct users to other resources when necessary."
      },
      {
        "role": "user",
        "content": ""
      },
      {
        "role": "user",
        "content": ""
      },
      {
        "role": "assistant",
        "content": "I'm here to help! What's on your mind today?"
      }
    ],
    "model": "llama3-groq-70b-8192-tool-use-preview",
    "temperature": 0.5,
    "max_tokens": 1024,
    "top_p": 0.65,
    "stream": true,
    "stop": null
  });

  for await (const chunk of chatCompletion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }
}

main();