import GameServer from "../game_server";

declare global {
  namespace Express {
    interface Request {
      game_server: GameServer;
    }
  }
}

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}
