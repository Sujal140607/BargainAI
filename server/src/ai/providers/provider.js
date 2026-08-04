export default class Provider {
  constructor(config = {}) {
    if (this.constructor === Provider) {
      throw new Error('Provider is an abstract class and cannot be instantiated directly');
    }
    this.config = config;
  }

  async generate(params) {
    throw new Error(`generate() not implemented by ${this.constructor.name}`);
  }
}
