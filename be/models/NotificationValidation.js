import joi from "joi";

const NotificationValidation = joi.object({
    from:joi.string(),
    message: joi.string(),
    isRead:joi.bool(),
})

export default NotificationValidation;