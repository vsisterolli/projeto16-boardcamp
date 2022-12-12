import categoriesSchema from "../schemas/categories.schema.js";
import connection from "../database/db.js";

export async function validateCategory(req, res, next) {
    try {
        const { name } = req.body;

        const validation = categoriesSchema.validate(req.body);
        if(validation.error)
            return res.status(400).send(validation.error.message);

        const previous = await connection.query("SELECT * FROM categories WHERE name=$1;", [name]);
        if(previous.rows.length)
            return res.status(409).send("Categoria já existente");;

        next();
    }
    catch(e) {
        res.status(500).send(e);
    }
}