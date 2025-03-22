import OpenAI from "https://cdn.skypack.dev/openai";    
import GITHUB_TOKEN from "./config.js";

const token=GITHUB_TOKEN;

export async function getCompletion(prompt) {
    const client = new OpenAI({
        baseURL: "https://models.inference.ai.azure.com",
        apiKey: token,
        dangerouslyAllowBrowser: true
      });
    
      const response = await client.chat.completions.create({
        messages: [
          { role:"system", 
          content: `you are a task analyser .Extract the following details from the user prompt:
          {
           "task": "...",
           "description": "...",
           "priority": "...",
           "dueDate": "..." (or null if not specified)
        }
          Keep the task field case-insensitive for comparison.`
        },
          { role:"user", content: "What is the capital of France?" }
        ],
        model: "gpt-4o",
        temperature: 1,
        max_tokens: 4096,
        top_p: 1
      });
    
      console.log(response.choices[0].message.content);
      return JSON.parse(response.choices[0].message.content);
    }