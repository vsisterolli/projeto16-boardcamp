import connection from "../database/db.js";
import Joi from "joi";

const gamesSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().uri().required(),
    stockTotal: Joi.number().required().min(1),
    categoryId: Joi.number().required(),
    pricePerDay: Joi.number().required().min(1)
});

export async function validateGame(req, res, next) {
    try {
        const game = req.body;

        const validation = gamesSchema.validate(req.body)
        if(validation.error)
            return res.status(400).send(validation.error.message);
        
        const category = await connection.query("SELECT name FROM categories WHERE id=$1;", [game.categoryId]);
        if(!category.rows.length)
            return res.status(400).send("Categoria não encontrada");

        const previous = await connection.query("SELECT name FROM games WHERE name=$1;", [game.name]);
        if(previous.rows.length)
               return res.status(409).send("Jogo já registrado");

        next();
    }
    catch(e) {
        res.status(500).send(e);
    }
}