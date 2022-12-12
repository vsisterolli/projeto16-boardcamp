import { Router } from "express";
import { listCategories, insertCategory } from "../controllers/categories.controller.js";
import { validateCategory } from "../middlewares/validateCategory.middleware.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", listCategories);
categoriesRouter.post("/categories", validateCategory, insertCategory);

export default categoriesRouter;