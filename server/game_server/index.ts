import { Server, ServerWebSocket } from "bun";

import Lobby from "../lobby";

export default class GameServer {
  server: Server;
  lobbies: Lobby[] = [];

  lobby_name_max_length = 24;

  constructor(
    port = 3000,
    hostname = "0.0.0.0",
    lobby_name_max_length?: number,
  ) {
    this.server = this.initServer(port, hostname);
    if (lobby_name_max_length != undefined)
      this.lobby_name_max_length = lobby_name_max_length;
  }

  initServer(port: number, hostname: string): Server {
    const that = this;
    const server = Bun.serve({
      fetch(req, server) {
        // Upgrade the request to a WebSocket
        if (server.upgrade(req)) return;
        // Failed to upgrade to a Websocket
        return new Response("Upgrade failed :(", { status: 500 });
      },

      websocket: {
        open(ws: ServerWebSocket) {
          that.onSocketOpen(ws);
        },

        close(ws: ServerWebSocket) {
          that.onSocketClose(ws);
        },

        message(ws: ServerWebSocket, message: string | Buffer) {
          that.onSocketMessage(ws, message);
        },
      },

      port: port,
      hostname: hostname,
    });

    return server;
  }

  /**
   * Creates a new lobby and adds it to the game server
   * @param name {string} - The name of the lobby
   */
  createLobby(name: string): Lobby {
    const lobby = new Lobby(name);
    this.lobbies.push(lobby);
    lobby.getPlayers().then((players) => {
      console.log(players);
    });
    return lobby;
  }

  handleLobbyMessage(event: MessageEvent, lobby: Lobby) {
    console.log(`[Lobby ${lobby.id}]: ${event.data}`);
  }

  /*
   * Socket Methods
   */

  onSocketOpen(ws: ServerWebSocket) {
    console.log("Websocket connection opened with address " + ws.remoteAddress);
  }

  onSocketClose(ws: ServerWebSocket) {
    console.log("Websocket connection closed with address " + ws.remoteAddress);
  }

  onSocketMessage(ws: ServerWebSocket, message: string | Buffer) {
    console.log(`Message: "${message}" From: ${ws.remoteAddress}`);
    ws.send("Echo: " + message);
  }
}
