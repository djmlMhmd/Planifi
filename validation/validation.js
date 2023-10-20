const Joi = require('joi');

function userValidation(data) {
	const userValidationSchema = Joi.object({
		firstName: Joi.string().min(2).max(30).trim().required(),
		lastName: Joi.string().min(2).max(30).trim().required(),
		email: Joi.string().email().trim().required(),
		password: Joi.string().min(8).max(60).required(),
		phone: Joi.string().min(10).max(12),
		company_name: Joi.string().min(2).max(100).trim(),
		company_address: Joi.string().min(5).max(300).trim(),
	});
	return userValidationSchema.validate(data);
}

module.exports = userValidation;
