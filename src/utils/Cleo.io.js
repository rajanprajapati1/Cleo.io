import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || `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`,
});

export const reqGroqAI = async (content) => {
  const res = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content,
      },
    ],
    model: "llama3-8b-8192",
  });
  return res;
};