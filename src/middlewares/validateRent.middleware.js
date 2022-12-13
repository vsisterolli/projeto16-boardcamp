import connection from "../database/db.js";
import Joi from "joi";
import dayjs from "dayjs";

const rentSchema = Joi.object({
    customerId: Joi.number().required(),
    gameId: Joi.number().required(),
    daysRented: Joi.number().min(1).required()
});

export default async function validateRent(req, res, next) {
    try {
        
        const rent = req.body;

        const validation = rentSchema.validate(rent)
        if(validation.error)
            return res.status(400).send(validation.error.message);
        
        rent.returnDate = null;
        rent.delayFee = null;

        const customer = await connection.query("SELECT id FROM customers WHERE id=$1;", [rent.customerId]);
        if(!customer.rows.length)
            return res.status(400).send("Id de usuário não encontrado");

        const game = await connection.query('SELECT "stockTotal", "pricePerDay" FROM games WHERE id=$1;', [rent.gameId]);
        if(!game.rows.length)
            return res.status(400).send("Id de jogo não encontrado");

        if(game.rows[0].stockTotal <= 0)
            return res.status(400).send("O jogo não possui estoque")
        
        rent.rentDate = dayjs().format('YYYY-MM-DD')
        rent.originalPrice = rent.daysRented * game.rows[0].pricePerDay;

        res.locals.rent = rent;
        
        next();
    }
    catch(e) {
        console.log(e)
        res.status(500).send(e);
    }
}