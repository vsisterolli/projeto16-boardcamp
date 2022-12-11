import express, { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoriesRouter from "./routers/categories.router.js";
import gamesRouter from "./routers/games.router.js";
dotenv.config()

const app = express();
const router = Router();

router.use(categoriesRouter);
router.use(gamesRouter);

app.use(cors());
app.use(express.json())
app.use(router);

app.listen(process.env.PORT || 4000);