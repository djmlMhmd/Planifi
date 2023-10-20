const Joi = require('joi');

function userValidation(data) {
	const userValidationSchema = Joi.object({
		firstName: Joi.string().min(2).max(30).trim().required(),
		lastName: Joi.string().min(2).max(30).trim().required(),
		email: Joi.string().email().trim().required(),
		password: Joi.string().min(8).max(60).required(),
		phone: Joi.string().min(10).max(12),
	});
	return userValidationSchema.validate(data);
}

module.exports = userValidation;
