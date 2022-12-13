import connection from "../database/db.js";
import dayjs from "dayjs";

export default async function validateFinishRent(req, res, next) {
    try {
             
        const { id } = req.params;
        const rent = await connection.query(`SELECT rentals.*, games."pricePerDay" 
                                            FROM rentals JOIN games ON rentals.id=$1 AND games.id = rentals."gameId"`, [id]);
        
        if(!rent.rows.length)
            return res.status(404).send("Aluguel não encontrado")
        
        if(rent.rows[0].returnDate)
            return res.status(400).send("Aluguel já finalizado")

        res.locals.rent = rent.rows[0];
        
        next();
    }
    catch(e) {
        console.log(e)
        res.status(500).send(e);
    }
}