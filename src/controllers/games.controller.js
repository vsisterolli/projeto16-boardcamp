import connection from "../database/db.js"
import gamesSchema from "../schemas/games.schema.js";

export async function listGames(req, res) {
    try {
        const games = await connection.query("SELECT * FROM games");
        res.send(games.rows);
    }
    catch(e) {
        res.status(500).send(e);
    }
}

export async function insertGame(req, res) {
    
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

        connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)',
                        [game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay]);
                            
        res.status(201).send();
    }
    catch(e) {
        res.status(500).send(e);
    }

}