import connection from "../database/db.js";
import Joi from "joi";

const customersSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().min(10).max(11).required(),
    cpf: Joi.string().length(11).required(),
    birthday: Joi.date().required()
});

export async function validateCustomer(req, res, next) {
    try {
        const id = Number(req.params.id);
        const customer = req.body;
        
        const validation = customersSchema.validate(customer)
        if(validation.error)
            return res.status(400).send(validation.error.message);

        // checks if the CPF found it's not the same as the client we are changing/inserting
        const previousCpf = await connection.query("SELECT id FROM customers WHERE cpf=$1", [customer.cpf]);
        if(previousCpf.rows.length && (id !== previousCpf.rows[0].id))
            return res.status(409).send("CPF já cadastrado");

        next();
    }
    catch(e) {
        res.status(500).send(e);
    }
}