import connection from "../database/db.js"

export async function listGames(req, res) {
    try {
        const offset = req.query.offset || 0;
        const games = await connection.query("SELECT * FROM games OFFSET $1", [offset]);
        res.send(games.rows);
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}

export async function insertGame(req, res) {
    try {     
        const game = req.body;
        connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)',
                        [game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay]);
        res.status(201).send();
    }
    catch(e) {
        res.status(500).send(e.message);
    }

}