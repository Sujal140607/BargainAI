import OpenAI from 'openai';
import Provider from './provider.js';

export default class OpenAIProvider extends Provider {
  constructor(config = {}) {
    super(config);
    this.client = new OpenAI({
      apiKey: config.apiKey ?? process.env.OPENAI_API_KEY,
    });
  }

  async generate({ prompt, model, ...options } = {}) {
    return this.client.responses.create({
      model: model ?? this.config.model,
      input: prompt,
      ...options,
    });
  }
}
