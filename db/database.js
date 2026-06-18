const { Client } = require('pg');
const {
	logLogger,
	errorLogger,
	verboseLogger,
} = require('../config/winston/winston.config');
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
		logLogger(
			'Connecté avec succès à la base de données PostgreSQL',
			'connectToDatabase'
		);
	} catch (e) {
		errorLogger(
			'Erreur lors de la connexion à la base de données PostgreSQL:' +
				e.stack,
			'connectToDatabase'
		);
		throw e;
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
		  country VARCHAR(100),
		  city VARCHAR(100),
		  address VARCHAR(100),
		  phone VARCHAR(20),
		  creation_date TIMESTAMP NULL DEFAULT (timezone('Europe/Paris', now())),
		  profile_picture VARCHAR,
		  est_verifie BOOLEAN DEFAULT false,
          est_pro BOOLEAN DEFAULT false
        );
      `;

			await client.query(createTableQuery);
			logLogger('Table [USERS] créée avec succès', 'createTableUser');
		} else {
			verboseLogger('La table [USERS] existe déjà.', 'createTableUser');
		}
	} catch (e) {
		errorLogger(
			'Erreur lors de la création/verification de la table [USERS]:' +
				e.stack,
			'createTableUser'
		);
	}
};

const createTableProAccount = async () => {
	try {
		const checkTableQuery = `
      SELECT to_regclass('pro_account') as table_exists;
    `;

		const result = await client.query(checkTableQuery);
		if (result.rows[0].table_exists === null) {
			const createTableQuery = `
        CREATE TABLE pro_account (
		  professional_id SERIAL PRIMARY KEY,
		  company_name VARCHAR(100),
		  company_address VARCHAR(300),
		  creation_date TIMESTAMP NULL DEFAULT (timezone('Europe/Paris', now())),
		  show_mobile BOOLEAN DEFAULT TRUE,
		  show_adress BOOLEAN DEFAULT TRUE,
		  user_id INT UNIQUE NOT NULL,
		  CONSTRAINT FK_user_id FOREIGN KEY(user_id)
		  REFERENCES users(users_id)
		  );
		  `;

			await client.query(createTableQuery);
			logLogger(
				'Table [PRO_ACCOUNT] créée avec succès',
				'createTableProAccount'
			);
		} else {
			verboseLogger(
				'La table [PRO_ACCOUNT] existe déjà.',
				'createTableProAccount'
			);
		}
	} catch (e) {
		errorLogger(
			'Erreur lors de la création/verification de la table [PRO_ACCOUNT]:' +
				e.stack,
			'createTableProAccount'
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
          duration INTERVAL,
		  professional_id INT,
		  CONSTRAINT FK_pro_id FOREIGN KEY(professional_id)
		  REFERENCES users(users_id)
		  );
		  `;

			await client.query(createTableQuery);
			logLogger(
				'Table [SERVICE] créée avec succès',
				'createTableService'
			);
		} else {
			verboseLogger(
				'La table [SERVICE] existe déjà.',
				'createTableService'
			);
		}
	} catch (e) {
		errorLogger(
			'Erreur lors de la création/verification de la table [SERVICE]:' +
				e.stack,
			'createTableService'
		);
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
					CONSTRAINT FK_pro_id FOREIGN KEY(professional_id)
					REFERENCES users(users_id),
                    day_of_week VARCHAR(10),
                    start_time TIME,
                    end_time TIME
                );
            `;

			await client.query(createTableQuery);
			logLogger(
				'Table [availability] créée avec succès',
				'createTableAvailability'
			);
		} else {
			verboseLogger(
				'La table [availability] existe déjà.',
				'createTableAvailability'
			);
		}
	} catch (e) {
		errorLogger(
			'Erreur lors de la création/verification de la table [availability]:' +
				e.stack,
			'createTableAvailability'
		);
	}
};

const createTableReservation = async () => {
	try {
		const client = getClientsCollection();
		const checkTableQuery = `
            SELECT to_regclass('public.reservations') as table_exists;
        `;

		const result = await client.query(checkTableQuery);
		if (result.rows[0].table_exists === null) {
			const createTableQuery = `
                CREATE TABLE reservations (
                    reservation_id SERIAL PRIMARY KEY,
                    professional_id INT,
					CONSTRAINT FK_pro_id FOREIGN KEY(professional_id)
						REFERENCES users(users_id),
                    users_id INT,
                    CONSTRAINT FK_users_id FOREIGN KEY (users_id)
                        REFERENCES users(users_id),
                    day_of_week VARCHAR(10) NOT NULL,
                    start_time TIME NOT NULL,
                    end_time TIME NOT NULL,
                    status VARCHAR(40) NOT NULL DEFAULT 'confirmed',
                    service_id INT,
                    CONSTRAINT FK_service_id FOREIGN KEY (service_id)
                        REFERENCES services(service_id)
                );
            `;

			await client.query(createTableQuery);
			logLogger(
				'Table [reservation] créée avec succès',
				'createTableReservation'
			);
		} else {
			// J'ajoute la colonne si elle manque pour garder la migration simple à relire.
			await client.query(`
				ALTER TABLE reservations
				ADD COLUMN IF NOT EXISTS status VARCHAR(40) NOT NULL DEFAULT 'confirmed';
			`);

			await client.query(`
				UPDATE reservations
				SET status = 'confirmed'
				WHERE status IS NULL OR status = '';
			`);

			verboseLogger(
				'La table [reservation] existe déjà.',
				'createTableReservation'
			);
		}
	} catch (e) {
		errorLogger(
			'Erreur lors de la création/mise à jour de la table [reservation]:' +
				e.stack,
			'createTableReservation'
		);
	}
};

const createTableNotation = async () => {
	try {
		const checkTableQuery = `
            SELECT to_regclass('notation') as table_exists;
        `;

		const result = await client.query(checkTableQuery);
		if (result.rows[0].table_exists === null) {
			const createTableQuery = `
                CREATE TABLE notation (
                    note_id SERIAL PRIMARY KEY,
                    users_id INT,
					rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
					comment TEXT,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (users_id) REFERENCES users(users_id)
                );
            `;

			await client.query(createTableQuery);
			logLogger(
				'Table [notation] créée avec succès',
				'createTableNotation'
			);
		} else {
			verboseLogger(
				'La table [notation] existe déjà.',
				'createTableNotation'
			);
		}
	} catch (e) {
		errorLogger(
			'Erreur lors de la création/verification de la table [notation]:' +
				e.stack,
			'createTableNotation'
		);
	}
};
const createTableImagesServicesProfessionals = async () => {
	try {
		const checkTableQuery = `
      SELECT to_regclass('images_services_professionals') as table_exists;
    `;

		const result = await client.query(checkTableQuery);
		if (result.rows[0].table_exists === null) {
			const createTableQuery = `
        CREATE TABLE images_services_professionals (
          image_id SERIAL PRIMARY KEY,
		  pro_id INT,
		  service_id INT,
		  image_URL VARCHAR,
		  CONSTRAINT FK_pro_id FOREIGN KEY (pro_id)
			  REFERENCES users(users_id),
		  CONSTRAINT FK_service_id FOREIGN KEY (service_id)
			  REFERENCES services(service_id)
        );
      `;

			await client.query(createTableQuery);
			logLogger(
				'Table [images_services_professionals] créée avec succès',
				'createTableImagesServicesProfessionals'
			);
		} else {
			verboseLogger(
				'La table [images_services_professionals] existe déjà.',
				'createTableImagesServicesProfessionals'
			);
		}
	} catch (e) {
		errorLogger(
			'Erreur lors de la création/verification de la table [images_services_professionals]:' +
				e.stack,
			'createTableImagesServicesProfessionals'
		);
	}
};

const getClientsCollection = () => {
	return client;
};

module.exports = {
	connectToDatabase,
	createTableUser,
	createTableProAccount,
	createTableService,
	createTableReservation,
	createTableAvailability,
	createTableNotation,
	getClientsCollection,
	createTableImagesServicesProfessionals,
};
