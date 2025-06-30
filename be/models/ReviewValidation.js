import joi from "joi"

const reviewValidation = joi.object({
    rating: joi.number().required().max(5).min(1),
    message: joi.string().required(),
    owner: joi.string().required(),
})

export default reviewValidation;