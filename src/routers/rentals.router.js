import { Router } from "express";
import { insertRent, listRentals, finishRent, deleteRent } from "../controllers/rentals.controller.js";
import validateFinishRent from "../middlewares/validateFinishRent.middleware.js";
import validateRent from "../middlewares/validateRent.middleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", listRentals);
rentalsRouter.post("/rentals", validateRent, insertRent);
rentalsRouter.post("/rentals/:id/return", validateFinishRent, finishRent)
rentalsRouter.delete("/rentals/:id", deleteRent)

export default rentalsRouter; 