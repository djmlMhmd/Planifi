require('dotenv').config();
const { func } = require('joi');
const { Client } = require('pg');

const client = new Client({
	user: 'user',
	host: 'localhost',
	database: 'postgresql',
	password: 'password',
	port: 5432,
});

const connectToDatabase = async () => {
	try {
		await client.connect();
		console.log('Connecté avec succès à la base de données PostgreSQL');
	} catch (e) {
		console.error(
			'Erreur lors de la connexion à la base de données PostgreSQL',
			e.stack
		);
	}
};

const createTableUser = async () => {
	try {
		const query = `
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
				password VARCHAR(100),
                email VARCHAR(100) UNIQUE NOT NULL
            );
        `;

		await client.query(query);
		console.log('Table users créée avec succès');
	} catch (e) {
		console.error('Erreur lors de la création de la table', e.stack);
	}
};

module.exports = {
	connectToDatabase,
	createTableUser,
};
