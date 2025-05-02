const { clients } = require('./datas/clients');
const { pros } = require('./datas/pros');
const { services } = require('./datas/services');
const {
	executeCustomQuery,
	executeCustomQueryWithData,
} = require('./utils/database.utils');
const { errorLogger } = require('../config/winston/winston.config');
const { constants } = require('../constants/constants');
const { sendInternalServerError } = require('../utils/error_message.utils');
const { reservations } = require('./datas/reservations');

const insertDatas = () => {
	for (let pro of pros) {
		try {
			executeCustomQuery('BEGIN').then();
			const insertUserQuery = `INSERT INTO users("firstName", "lastName", password, email, phone, country, city, address, est_pro, est_verifie)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, true, true) ON CONFLICT DO NOTHING RETURNING *`;

			const valuesUser = [
				pro.firstName,
				pro.lastName,
				pro.password,
				pro.email,
				pro.phone,
				pro.country,
				pro.city,
				pro.address,
			];
			executeCustomQueryWithData(insertUserQuery, valuesUser).then(
				(result) => {
					let resultInsertUser = result;

					const insertProQuery =
						'INSERT INTO pro_account(company_name, company_address, user_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING *';
					const valuesPro = [
						pro.company_name,
						pro.company_address,
						resultInsertUser[0].users_id,
					];
					executeCustomQueryWithData(
						insertProQuery,
						valuesPro
					).then();
					console.log('pro inseré');
				}
			);
			executeCustomQuery('COMMIT').then();
		} catch (e) {
			executeCustomQuery('ROLLBACK').then();
			console.log(e.stack);
		}
	}

	const insertQuery = `INSERT INTO users("firstName", "lastName", password, email, phone, country, city, address, est_verifie)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, true) ON CONFLICT DO NOTHING RETURNING *`;
	for (let client of clients) {
		const values = [
			client.firstName,
			client.lastName,
			client.password,
			client.email,
			client.phone,
			client.country,
			client.city,
			client.address,
		];
		executeCustomQueryWithData(insertQuery, values).then();
	}
	console.log('clients inserés');

	const insertService = `INSERT INTO services (service_name, service_description, service_price, duration, professional_id)
			VALUES($1, $2, $3, $4, $5) RETURNING *`;

	for (let service of services) {
		const values = [
			service.service_name,
			service.service_description,
			service.service_price,
			service.duration,
			service.professional_id,
		];
		executeCustomQueryWithData(insertService, values).then();
	}
	console.log('services inserés');

	const insertReservation =
		'INSERT INTO reservations (professional_id, start_time, end_time, users_id, service_id, day_of_week) VALUES ($1, $2, $3, $4, $5, $6)';

	for (let reservation of reservations) {
		const values = [
			reservation.professional_id,
			reservation.start_time,
			reservation.end_time,
			reservation.users_id,
			reservation.service_id,
			reservation.day_of_week,
		];
		executeCustomQueryWithData(insertReservation, values).then();
	}
	console.log('réservations inserés');
};

module.exports = { insertDatas };
