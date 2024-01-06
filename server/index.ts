import { ServerWebSocket } from "bun";

// Top level server function
function main() {
  console.log("Starting websocket server...");

  const wss = Bun.serve({
    fetch(req, server) {
      // Upgrade the request to a WebSocket
      if (server.upgrade(req)) return;
      // Failed to upgrade to a Websocket
      return new Response("Upgrade failed :(", { status: 500 });
    },

    websocket: {
      open(ws: ServerWebSocket) {
        console.log(
          "Websocket connection opened with address " + ws.remoteAddress,
        );
      },

      close(ws: ServerWebSocket) {
        console.log(
          "Websocket connection closed with address " + ws.remoteAddress,
        );
      },

      message(ws: ServerWebSocket, message: string | Buffer) {
        ws.send("Echo: " + message);
      },
    },

    port: Bun.env.WSS_PORT || 3000,
  });

  console.log(`Started WebSocket server at ${wss.hostname}:${wss.port}`);
}

// Start server
main();
