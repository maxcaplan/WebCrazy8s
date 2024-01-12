declare var self: Worker;

// Get lobby information from worker environment
const lobby_name = Bun.env.LOBBY_NAME;
const lobby_id = Bun.env.LOBBY_ID;

console.log(`[Lobby ${lobby_id}]: Created with name: ${lobby_name}`);

self.onmessage = (event) => {
  console.log(event.data);
};
