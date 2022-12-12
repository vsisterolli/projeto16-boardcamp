import connection from "../database/db.js"

export async function listCustomers(req, res) {
    try {
        const customers = await connection.query("SELECT * FROM customers");
        res.send(customers.rows);
    }
    catch(e) {
        res.status(500).send(e);
    }
}

export async function listCustomers(req, res) {
    try {
        reqId  = req.params;
        const customer = await connection.query("SELECT * FROM customers WHERE id=$1", [reqId]);
        res.send(customer.rows);
    }
    catch(e) {
        res.status(500).send(e);
    }
}

export async function insertCustomer(req, res) {
    
    try {
        const { name } = req.body;
    
        const validation = categoriesSchema.validate(req.body)
        if(validation.error)
            return res.status(400).send(validation.error.message);

        const previous = await connection.query("SELECT * FROM categories WHERE name=$1;", [name]);
        if(previous.rows.length)
            return res.status(409).send("Categoria já existente");

        connection.query("INSERT INTO categories (name) VALUES ($1)", [name])
        res.status(201).send();
    }
    catch(e) {
        res.status(500).send(e);
    }

}