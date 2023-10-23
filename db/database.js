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
          users_id SERIAL PRIMARY KEY,
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
          professional_id SERIAL PRIMARY KEY,
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

const createTableService = async () => {
	try {
		const checkTableQuery = `
      SELECT to_regclass('services') as table_exists;
    `;

		const result = await client.query(checkTableQuery);
		if (result.rows[0].table_exists === null) {
			const createTableQuery = `
        CREATE TABLE services (
          service_id SERIAL PRIMARY KEY,
          service_name VARCHAR(100),
          service_description TEXT,
          service_price DECIMAL(10, 2),
          duration INT,
		  professional_id INT,
		  CONSTRAINT FK_professional_id FOREIGN KEY(professional_id)
		  REFERENCES professionals(professional_id),
		  ALTER TABLE availability
		  ADD CONSTRAINT uc_availability
		  UNIQUE (professional_id, day_of_week, start_time, end_time);

		  );
		  `;

			await client.query(createTableQuery);
			console.log('Table créée avec succès');
		} else {
			console.log('Le service existe déjà.');
		}
	} catch (e) {
		console.error('Erreur lors de la création du service', e.stack);
	}
};

const createTableAvailability = async () => {
	try {
		const checkTableQuery = `
            SELECT to_regclass('availability') as table_exists;
        `;

		const result = await client.query(checkTableQuery);
		if (result.rows[0].table_exists === null) {
			const createTableQuery = `
                CREATE TABLE availability (
                    availability_id SERIAL PRIMARY KEY,
                    professional_id INT,
					CONSTRAINT FK_professional_id FOREIGN KEY(professional_id)
					REFERENCES professionals(professional_id),
                    day_of_week INT,
                    start_time TIME,
                    end_time TIME
                );
            `;

			await client.query(createTableQuery);
			console.log('Table availability créée avec succès');
		} else {
			console.log('La table availability existe déjà.');
		}
	} catch (e) {
		console.error(
			'Erreur lors de la création/verification de la table availability',
			e.stack
		);
	}
};

const createTableReservation = async () => {
	try {
		const checkTableQuery = `
            SELECT to_regclass('reservations') as table_exists;
        `;

		const result = await client.query(checkTableQuery);
		if (result.rows[0].table_exists === null) {
			const createTableQuery = `
                CREATE TABLE reservations (
    				reservation_id SERIAL PRIMARY KEY,
    				professional_id INT,
					CONSTRAINT FK_professional_id FOREIGN KEY(professional_id)
					REFERENCES professionals(id),
					users_id INT,
					CONSTRAINT FK_users_id FOREIGN KEY (users_id)
					REFERENCES users(id),
					availability_id INT,
					CONSTRAINT FK_availability_id FOREIGN KEY (availability_id)
					REFERENCES availability(availability_id),
    				start_time TIME,
    				end_time TIME,
					service_id INT,
					CONSTRAINT FK_service_id FOREIGN KEY (service_id)
					REFERENCES services(service_id)
				);
            `;

			await client.query(createTableQuery);
			console.log('La table reservation créée avec succès');
		} else {
			console.log('La table reservation existe déjà.');
		}
	} catch (e) {
		console.error(
			'Erreur lors de la création/verification de la table reservation',
			e.stack
		);
	}
};

const createTableDefaultAvailability = async () => {
	try {
		const checkTableQuery = `
            SELECT to_regclass('default_availability') as table_exists;
        `;

		const result = await client.query(checkTableQuery);
		if (result.rows[0].table_exists === null) {
			const createTableQuery = `
                CREATE TABLE default_availability (
					default_availability_id SERIAL PRIMARY KEY,
					professional_id INT,
					day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche')),
					start_time TIME NOT NULL DEFAULT '08:00:00',
					end_time TIME NOT NULL DEFAULT '21:00:00'
                );
            `;

			await client.query(createTableQuery);
			console.log('Table de disponibilité par défaut créée avec succès');
		} else {
			console.log('La table de disponibilité par défaut existe déjà.');
		}
	} catch (e) {
		console.error(
			'Erreur lors de la création de la table de disponibilité par défaut',
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
	createTableService,
	createTableReservation,
	createTableAvailability,
	createTableDefaultAvailability,
	getClientsCollection,
};
