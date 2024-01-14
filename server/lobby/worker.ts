import {
  LobbyWorkerErrorResponse,
  LobbyWorkerMethod,
  LobbyWorkerRequest,
  LobbyWorkerResponse,
  LobbyWorkerResponseData,
  Player,
} from "./types";

declare var self: Worker;

interface Route {
  method: LobbyWorkerMethod;
  path: string;
  function: (req: LobbyWorkerRequest) => void;
}

// Get lobby information from worker environment
const lobby_name = Bun.env.LOBBY_NAME;
const lobby_id = Bun.env.LOBBY_ID;

// Lobby state
var players: Player[] = [
  {
    id: "1",
    name: "Test Player",
  },
];

// Lobby router
const router: Route[] = [
  {
    method: LobbyWorkerMethod.GET,
    path: "player/list",
    function: (req: LobbyWorkerRequest) => {
      const response: LobbyWorkerResponseData<{ players: Player[] }> = {
        method: req.method,
        path: req.path,
        message: "success",
        ok: true,
        body: {
          players: players,
        },
      };

      postMessage(response);
    },
  },
];

function handleMessage(
  event: MessageEvent<LobbyWorkerRequest>,
  routes: Route[],
) {
  console.log(event.data);
  // Validate message data
  const is_method_valid =
    event.data.method != undefined &&
    typeof event.data.method == "number" &&
    event.data.method in LobbyWorkerMethod;

  const is_path_valid =
    event.data.path != undefined && typeof event.data.path == "string";

  if (!is_method_valid || !is_path_valid) {
    postErrorMessage({
      method: event.data.method,
      path: event.data.path,
      message: "Invalid request",
      ok: false,
    });
    return;
  }

  // Find route that matches request method and path
  const route = routes.find((el) => {
    return el.method === event.data.method && el.path === event.data.path;
  });

  if (!route) {
    postErrorMessage({
      method: event.data.method,
      path: event.data.path,
      message: `Method ${event.data.method} does not exist for path: ${event.data.path}`,
      ok: false,
    });

    return;
  }

  route.function(event.data);
}

function postErrorMessage(message: LobbyWorkerErrorResponse) {
  postMessage(message);
}

function postResponseMessage<T = {}>(
  message: LobbyWorkerResponseData<T>,
): void {}

// console.log(`[Lobby ${lobby_id}]: Created with name: ${lobby_name}`);

self.onmessage = (event) => handleMessage(event, router);
