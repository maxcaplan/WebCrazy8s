/**
 * @file API endpoints for managing lobbies
 * @author Max Caplan
 */
import express, { Request } from "express";
import { TypedRequestBody } from "./types";

const router = express.Router();

interface CreateLobbyRequestBody {
  name: string | undefined;
}

router.use(express.json());

/**
 * Routes
 */

// Create a new lobby
router.post("/create", (req: TypedRequestBody<CreateLobbyRequestBody>, res) => {
  console.log("Creating new lobby");

  // Validate request body
  if (req.body.name == undefined || typeof req.body.name != "string") {
    return res.status(400).send({ message: "Invalid request body", ok: false });
  }

  // Limit lobby name length
  if (req.body.name.length > req.game_server.lobby_name_max_length) {
    return res
      .status(400)
      .send({ message: "Lobby name exceeds max length", ok: false });
  }

  // Create lobby
  const lobby = req.game_server.createLobby(req.body.name);

  // Send lobby details to client
  res.send({
    message: "Lobby created succesfully",
    ok: true,
    data: { lobby_id: lobby.id, lobby_name: lobby.name },
  });
});

// [TODO] Join an existing lobby

export { router };
