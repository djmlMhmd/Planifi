const {
	connectToDatabase,
	createTableUser,
	createTableProAccount,
	createTableService,
	createTableReservation,
	createTableAvailability,
	createTableNotation,
	createTableMessages,
	createTableImagesServicesProfessionals,
} = require('../db/database');

const { alterInTables } = require('../db/alterDatabase');

function initDatabase() {
	connectToDatabase().then(() => {
		createTableUser();
		createTableProAccount();
		createTableService();
		createTableReservation();
		createTableNotation();
		createTableMessages();
		createTableAvailability();
		createTableImagesServicesProfessionals();
		alterInTables();
	});
}

module.exports = {
	init: initDatabase,
};
