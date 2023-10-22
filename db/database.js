const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
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
		const checkTableQuery = `
      SELECT to_regclass('users') as table_exists;
    `;

		const result = await client.query(checkTableQuery);
		if (result.rows[0].table_exists === null) {
			// La table n'existe pas, alors on la crée
			const createTableQuery = `
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          "firstName" VARCHAR(100),
		  "lastName" VARCHAR(100),
          password VARCHAR(100),
          email VARCHAR(100) UNIQUE NOT NULL,
		  phone VARCHAR(20),
		  creation_date DATE NOT NULL DEFAULT CURRENT_DATE 
        );
      `;

			await client.query(createTableQuery);
			console.log('Table users créée avec succès');
		} else {
			console.log('La table users existe déjà.');
		}
	} catch (e) {
		console.error(
			'Erreur lors de la création/verification de la table',
			e.stack
		);
	}
};

const createTableProfessional = async () => {
	try {
		const checkTableQuery = `
      SELECT to_regclass('professionals') as table_exists;
    `;

		const result = await client.query(checkTableQuery);
		if (result.rows[0].table_exists === null) {
			const createTableQuery = `
        CREATE TABLE professionals (
          id SERIAL PRIMARY KEY,
          "firstName" VARCHAR(100),
          "lastName" VARCHAR(100),
          password VARCHAR(100),
          email VARCHAR(100) UNIQUE NOT NULL,
          phone VARCHAR(20),
          company_name VARCHAR(100),
          company_address VARCHAR(300),
          creation_date DATE NOT NULL DEFAULT CURRENT_DATE
        );
      `;

			await client.query(createTableQuery);
			console.log('Table professionals créée avec succès');
		} else {
			console.log('La table professionals existe déjà.');
		}
	} catch (e) {
		console.error(
			'Erreur lors de la création/verification de la table des professionnels',
			e.stack
		);
	}
};

const getClientsCollection = () => {
	return client;
};

module.exports = {
	connectToDatabase,
	createTableUser,
	createTableProfessional,
	getClientsCollection,
};
