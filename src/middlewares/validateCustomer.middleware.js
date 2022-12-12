import customersSchema from "../schemas/customers.schema.js";
import connection from "../database/db.js";

export async function validateCustomer(req, res, next) {
    try {
        const customer = req.body;
        
        const validation = customersSchema.validate(customer)
        if(validation.error)
            return res.status(400).send(validation.error.message);

        const previousCpf = await connection.query("SELECT cpf FROM customers WHERE cpf=$1", [customer.cpf]);
        if(previousCpf)
            return res.status(409).send("CPF já cadastrado");

        next();
    }
    catch(e) {
        res.status(500).send(e);
    }
}