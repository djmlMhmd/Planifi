const cron = require('node-cron');
const { getClientsCollection } = require('../db/database');

const updateReservationStatus = async () => {
	const client = getClientsCollection();
	try {
		const updateQuery = `
        UPDATE reservations
        SET statut = 'passé'
        WHERE end_time < NOW() AND statut != 'passé';
        `;
		const { rowCount } = await client.query(updateQuery);
		console.log(`Update ${rowCount} reservations to 'passé'.`);
	} catch (error) {
		console.error('Error updating reservation status:', error);
	}
};

cron.schedule('*/5 * * * *', updateReservationStatus); // toutes les 5 minutes
