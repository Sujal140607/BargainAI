import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

class NegotiationChain {
  constructor(config = {}) {
    this.model = new ChatOpenAI({
      model: config.model ?? process.env.OPENAI_MODEL ?? "gpt-5.5",
      apiKey: config.apiKey ?? process.env.OPENAI_API_KEY,
      temperature: config.temperature ?? 0.7,
    });
  }

  async run({ systemPrompt, history }) {
    const messages = [
      new SystemMessage(systemPrompt),
      ...history.map(({ role, content }) =>
        role === "user" ? new HumanMessage(content) : new AIMessage(content)
      ),
    ];
    const response = await this.model.invoke(messages);
    return response.content;
  }
}

export { NegotiationChain };
