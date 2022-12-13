import connection from "../database/db.js"

export async function listCategories(req, res) {
    try {
        const offset = req.query.offset || 0;
        console.log(offset)
        const categories = await connection.query("SELECT * FROM categories OFFSET $1", [offset]);
        res.send(categories.rows);
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}

export async function insertCategory(req, res) {
    try {
        const { name } = req.body;
        connection.query("INSERT INTO categories (name) VALUES ($1)", [name])
        res.status(201).send();
    }
    catch(e) {
        res.status(500).send(e.message);
    }

}