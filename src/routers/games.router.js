import { Router } from "express";
import { listGames, insertGame } from "../controllers/games.controller.js";
import { validateGame } from "../middlewares/validateGame.middleware.js";

const gamesRouter = Router();

gamesRouter.get("/games", listGames);
gamesRouter.post("/games", validateGame, insertGame);

export default gamesRouter;