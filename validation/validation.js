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

function serviceValidation(data) {
	const serviceValidationSchema = Joi.object({
		service_name: Joi.string().min(2).max(30).trim().required(),
		service_description: Joi.string().min(2).max(300).trim().required(),
		service_price: Joi.number().min(0).required(),
		duration: Joi.number().min(1).required(),
	});
	return serviceValidationSchema.validate(data);
}

function availabilityValidation(data) {
	const availabilityValidationSchema = Joi.object({
		professional_id: Joi.number().integer().min(1).required(),
		day_of_week: Joi.number().integer().min(0).max(6).required(),
		start_time: Joi.string()
			.pattern(new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'))
			.required(),
		end_time: Joi.string()
			.pattern(new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'))
			.required(),
	});
	return availabilityValidationSchema.validate(data);
}

module.exports = { userValidation, serviceValidation, availabilityValidation };
