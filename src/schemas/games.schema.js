import Joi from "joi";

const gamesSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().uri().required(),
    stockTotal: Joi.number().required().min(1),
    categoryId: Joi.number().required(),
    pricePerDay: Joi.number().required().min(1)
});

export default gamesSchema;