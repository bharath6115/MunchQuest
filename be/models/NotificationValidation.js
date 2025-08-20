import joi from "joi";

// const objectIdPattern = /^[a-f\d]{24}$/i;

const NotificationValidation = joi.object({
    from: joi.string(),
    message: joi.string(),
    isRead: joi.bool(),
})

export default NotificationValidation;