import connection from "../database/db.js"

export async function listCustomers(req, res) {
    try {
        const offset = req.query.offset || 0;
        const customers = await connection.query("SELECT * FROM customers OFFSET $1", [offset]);
        res.send(customers.rows);
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}

export async function getCustomerById(req, res) {
    try {
        const reqId  = req.params.id;
        const customer = await connection.query("SELECT * FROM customers WHERE id=$1", [reqId]);
        res.send(customer.rows);
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}

export async function insertCustomer(req, res) {
    try {
        const { name, phone, cpf, birthday } = req.body;
        connection.query("INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)",
                        [name, phone, cpf, birthday]);
        res.sendStatus(201);
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}

export async function updateCustomer(req, res) {
    try {
        const { name, phone, cpf, birthday } = req.body;
        connection.query("UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5",
                         [name, phone, cpf, birthday, req.params.id]);
        res.sendStatus(200);
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}