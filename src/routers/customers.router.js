import { Router } from "express";
import { listCustomers, insertCustomer, getCustomerById, updateCustomer } from "../controllers/customers.controller.js";
import { validateCustomer } from "../middlewares/validateCustomer.middleware.js";

const customersRouter = Router();

customersRouter.get("/customers", listCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", validateCustomer, insertCustomer);
customersRouter.put("/customers/:id", updateCustomer);

export default customersRouter;