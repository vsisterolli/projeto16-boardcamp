import dayjs from "dayjs";
import connection from "../database/db.js"

export async function listRentals(req, res) {
    try {
        const offset = req.query.offset || 0;
        const rentals = await connection.query(`SELECT json_build_object('rent', rentals.*, 'game', games.*, 'customer', customers.*) FROM rentals 
                                              JOIN games ON games.id = rentals."gameId"
                                              JOIN customers ON customers.id = rentals."customerId" OFFSET $1`, [offset]);

        const sentableList = [];
        for(let index = 0; index < rentals.rows.length; index++) {
            const object = rentals.rows[index].json_build_object;
            const sentableObject = {
                ...object.rent,
                "customer": object.customer,
                "game": object.game
            }
            delete sentableObject.game.image;
            delete sentableObject.game.stockTotal;
            delete sentableObject.customer.cpf;
            delete sentableObject.customer.phone;
            delete sentableObject.customer.birthday;
            sentableList.push(sentableObject);
        }
        res.send(sentableList);

    }
    catch(e) {
        console.log(e)
        res.status(500).send(e.message);
    }
}

export async function insertRent(req, res) {
    try {     
        const rent = res.locals.rent;
        await connection.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
                                VALUES ($1, $2, $3, $4, $5, $6, $7)`, 
                                [rent.customerId, rent.gameId, rent.rentDate, rent.daysRented, rent.returnDate, rent.originalPrice, rent.delayFee]);
        res.status(201).send();
    }
    catch(e) {
        res.status(500).send(e.message);
    }

}

export async function finishRent(req, res) {
    try {     
        const rent = res.locals.rent;
        
        rent.returnDate = dayjs().format("YYYY-MM-DD");
        rent.rentDate = dayjs(rent.rentDate);

        const requiredReturn = rent.rentDate.add(rent.daysRented, 'day');
        

        if(requiredReturn.isBefore(rent.returnDate))
            rent.delayFee = requiredReturn.diff(rent.returnDate, 'days') * rent.pricePerDay;
        else
            rent.delayFee = 0;

        await connection.query('UPDATE rentals SET "delayFee"=$1, "rentDate"=$2, "returnDate"=$3 WHERE id=$4', [rent.delayFee, rent.rentDate, rent.returnDate, rent.id]);

        res.status(200).send(rent);
    }
    catch(e) {
        res.status(500).send(e.message);
    }

}

export async function deleteRent(req, res) {
    try {
        const { id } = req.params;
        
        const rent = await connection.query('SELECT "returnDate" FROM rentals WHERE id=$1', [id]);
        if(!rent.rows.length)
            return res.status(404).send("Aluguel não encontrado");
        else if(!rent.rows[0].returnDate)
            return res.status(400).send("O aluguel ainda não foi finalizado");
        
        connection.query("DELETE FROM rentals WHERE id=$1", [id])
        res.sendStatus(200);
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}