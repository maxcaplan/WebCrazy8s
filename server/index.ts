import express from "express";

import GameServer from "./game_server";

// Routes
import { router as lobby_routes } from "./routes/lobby";

// Top level server function
function main() {
  console.log("Starting WebSocket server...");

  const game_server = createGameServer(Bun.env);

  console.log(
    `Started WebSocket server at ${game_server.server.hostname}:${game_server.server.port}`,
  );

  console.log("Starting HTTP server...");

  // Get http server host config
  const http_server_port =
    (Bun.env.REST_PORT ? parseInt(Bun.env.REST_PORT) : 4000) || 4000;
  const http_server_hostname = Bun.env.REST_HOSTNAME || "0.0.0.0";

  const app = express();

  // Add game server to http request object
  app.use((req, res, next) => {
    req.game_server = game_server;
    next();
  });

  // Add API routes
  app.use("/lobby", lobby_routes);

  // Start HTTP server
  app.listen(http_server_port, http_server_hostname, () => {
    console.log(
      `Started HTTP server at ${http_server_hostname}:${http_server_port}`,
    );
  });
}

/**
 * Creates a new game server object
 * @param env - NodeJS environment object
 */
function createGameServer(env: NodeJS.ProcessEnv): GameServer {
  // Get game server host config
  const game_server_port =
    (env.WSS_PORT ? parseInt(env.WSS_PORT) : 3000) || 3000;
  const game_server_hostname = env.WSS_HOSTNAME || "0.0.0.0";

  return new GameServer(game_server_port, game_server_hostname);
}

// Start server
main();
