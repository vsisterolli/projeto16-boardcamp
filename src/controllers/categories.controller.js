import connection from "../database/db.js"
import categoriesSchema from "../schemas/categories.schema.js";

export async function listCategories(req, res) {
    try {
        const categories = await connection.query("SELECT * FROM categories");
        res.send(categories.rows);
    }
    catch(e) {
        res.status(500).send(e);
    }
}

export async function insertCategory(req, res) {
    try {
        const { name } = req.body;
        connection.query("INSERT INTO categories (name) VALUES ($1)", [name])
        res.status(201).send();
    }
    catch(e) {
        res.status(500).send(e);
    }

}