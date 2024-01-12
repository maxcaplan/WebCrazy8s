import { generateId } from "../util/uuid";

export default class Lobby {
  id: string;
  name: string;
  worker: Bun.Worker;

  constructor(name: string, name_max_length = 24) {
    this.id = generateId(8);
    this.name = name;
    this.worker = this.createWorker();
  }

  createWorker(): Bun.Worker {
    const workerUrl = new URL("./worker.ts", import.meta.url).href;
    return new Worker(workerUrl, {
      env: { LOBBY_NAME: this.name, LOBBY_ID: this.id },
    });
  }
}
