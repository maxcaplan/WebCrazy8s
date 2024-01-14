import { generateId } from "../util/uuid";
import {
  LobbyWorkerMethod,
  LobbyWorkerRequest,
  LobbyWorkerResponseData,
  Player,
} from "./types";

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

  // Add a player to the lobby worker
  async addPlayer(): Promise<void> {
    return new Promise<void>((res, rej) => {});
  }

  // Get the player list from the lobby worker
  async getPlayers(): Promise<Player[]> {
    return new Promise<Player[]>((res, rej) => {
      // Format worker request
      const request: LobbyWorkerRequest = {
        method: LobbyWorkerMethod.GET,
        path: "player/list",
        body: {},
      };

      // Send request message to worker
      this.worker.postMessage(request);

      const timeout = setTimeout(() => {
        rej("Request timed out");
      }, 1000);

      // Listen for worker messages
      this.worker.onmessage = (
        event: MessageEvent<LobbyWorkerResponseData<{ players: Player[] }>>,
      ) => {
        try {
          // Ignore message if it is for the wrong method or from the wrong path
          if (
            event.data.method != request.method ||
            event.data.path != request.path
          ) {
            return;
          }

          // Reject if message result is not ok
          if (!event.data.ok) {
            clearTimeout(timeout);
            rej(event.data.message);
            return;
          }

          // Resolve player data
          clearTimeout(timeout);
          res(event.data.body.players);
          return;
        } catch (_e) {
          return;
        }
      };

      // Reject if an error occurs in the worker
      this.worker.onerror = (event) => {
        clearTimeout(timeout);
        rej(event.message);
        return;
      };
    });
  }
}
