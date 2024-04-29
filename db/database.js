const { Client } = require('pg');
const {logLogger, errorLogger, verboseLogger} = require('../config/winston/winston.config')
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
		logLogger('Connecté avec succès à la base de données PostgreSQL', 'connectToDatabase')
	} catch (e) {
		errorLogger('Erreur lors de la connexion à la base de données PostgreSQL:' + e.stack, 'connectToDatabase' )
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
		  creation_date DATE NOT NULL DEFAULT CURRENT_DATE,
		  profile_picture VARCHAR
        );
      `;

			await client.query(createTableQuery);
			logLogger('Table [USERS] créée avec succès', 'createTableUser')
		} else {
			verboseLogger('La table [USERS] existe déjà.', 'createTableUser')
		}
	} catch (e) {
		errorLogger('Erreur lors de la création/verification de la table [USERS]:' + e.stack, 'createTableUser')
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
		  country VARCHAR(100),
		  city VARCHAR(100),
		  address VARCHAR(100),
          phone VARCHAR(20),
          company_name VARCHAR(100),
          company_address VARCHAR(300),
          creation_date DATE NOT NULL DEFAULT CURRENT_DATE,
		  profile_picture VARCHAR
        );
      `;

			await client.query(createTableQuery);
			logLogger('Table [professionals] créée avec succès', 'createTableProfessional')
		} else {
			verboseLogger('La table [professionals] existe déjà.', 'createTableProfessional')
		}
	} catch (e) {
		errorLogger('Erreur lors de la création/verification de la table [professionnels]:' + e.stack, 'createTableProfessional')
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
		  CONSTRAINT FK_professional_id FOREIGN KEY(professional_id)
		  REFERENCES professionals(professional_id)
		  );
		  `;

			await client.query(createTableQuery);
			logLogger('Table [SERVICE] créée avec succès', 'createTableService')
		} else {
			verboseLogger('La table [SERVICE] existe déjà.', 'createTableService')
		}
	} catch (e) {
		errorLogger('Erreur lors de la création/verification de la table [SERVICE]:' + e.stack, 'createTableService')
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
                    day_of_week VARCHAR(10),
                    start_time TIME,
                    end_time TIME
                );
            `;

			await client.query(createTableQuery);
			logLogger('Table [availability] créée avec succès', 'createTableAvailability')
		} else {
			verboseLogger('La table [availability] existe déjà.', 'createTableAvailability')
		}
	} catch (e) {
		errorLogger('Erreur lors de la création/verification de la table [availability]:' + e.stack, 'createTableAvailability')
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
                    CONSTRAINT FK_professional_id FOREIGN KEY (professional_id)
                        REFERENCES professionals(professional_id),
                    users_id INT,
                    CONSTRAINT FK_users_id FOREIGN KEY (users_id)
                        REFERENCES users(users_id),
                    day_of_week VARCHAR(10) NOT NULL,
                    start_time TIME NOT NULL,
                    end_time TIME NOT NULL,
                    service_id INT,
                    CONSTRAINT FK_service_id FOREIGN KEY (service_id)
                        REFERENCES services(service_id)
                );
            `;

			await client.query(createTableQuery);
			logLogger('Table [reservation] créée avec succès', 'createTableReservation')
		} else {
			verboseLogger('La table [reservation] existe déjà.', 'createTableReservation')
		}
	} catch (e) {
		errorLogger('Erreur lors de la création/mise à jour de la table [reservation]:' + e.stack, 'createTableReservation')
	}
};

/*
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
					end_time TIME NOT NULL DEFAULT '21:00:00',
					is_available BOOLEAN DEFAULT TRUE
                );
            `;

			await client.query(createTableQuery);
			logLogger('Table [default_availability] créée avec succès', 'createTableDefaultAvailability')
		} else {
			verboseLogger('La table [default_availability] existe déjà.', 'createTableDefaultAvailability')
		}
	} catch (e) {
		errorLogger('Erreur lors de la création/verification de la table [default_availability]:' + e.stack, 'createTableDefaultAvailability')
	}
};*/

const createTableMessages = async () => {
	try {
		const checkTableQuery = `
      SELECT to_regclass('public.messages') as table_exists;
    `;

		const result = await client.query(checkTableQuery);
		if (result.rows[0].table_exists === null) {
			const createTableQuery = `
        CREATE TABLE messages (
          message_id SERIAL PRIMARY KEY,
          sender_id INT,
          receiver_id INT,
          subject VARCHAR(255),
          message_body TEXT,
          service_id INT,
          sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT FK_sender_id FOREIGN KEY (sender_id)
            REFERENCES users(users_id),
          CONSTRAINT FK_receiver_id FOREIGN KEY (receiver_id)
            REFERENCES professionals(professional_id),
          CONSTRAINT FK_service_id FOREIGN KEY (service_id)
            REFERENCES services(service_id)
        );
      `;

			await client.query(createTableQuery);
			logLogger('Table [MESSAGES] créée avec succès', 'createTableMessages')
		} else {
			verboseLogger('La table [MESSAGES] existe déjà.', 'createTableMessages')
		}
	} catch (e) {
		errorLogger('Erreur lors de la création/verification de la table [MESSAGES]:' + e.stack, 'createTableMessages')
	}
};

const createTablePreferencePro = async () => {
	try {
		const checkTableQuery = `
      		SELECT to_regclass('public.preference_pro') as table_exists;`;
		const createTableQuery = `
			CREATE TABLE preference_pro (
			  preference_id SERIAL PRIMARY KEY,
			  show_mobile BOOLEAN DEFAULT TRUE,
			  show_adress BOOLEAN DEFAULT TRUE,
			  pro_id INT,
			  CONSTRAINT FK_sender_id FOREIGN KEY (pro_id)
				  REFERENCES professionals(professional_id)
			);`;

		const result = await client.query(checkTableQuery);
		if (result.rows[0].table_exists === null) {
			await client.query(createTableQuery);
			logLogger('Table [PREFERENCE_PRO] créée avec succès', 'createTablePreferencePro')
		} else {
			verboseLogger('La table [PREFERENCE_PRO] existe déjà.', 'createTablePreferencePro')
		}
	} catch (e) {
		errorLogger('Erreur lors de la création/verification de la table [PREFERENCE_PRO]:' + e.stack, 'createTablePreferencePro')
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
			  REFERENCES professionals(professional_id),
		  CONSTRAINT FK_service_id FOREIGN KEY (service_id)
			  REFERENCES services(service_id)
        );
      `;

			await client.query(createTableQuery);
			logLogger('Table [images_services_professionals] créée avec succès', 'createTableImagesServicesProfessionals')
		} else {
			verboseLogger('La table [images_services_professionals] existe déjà.', 'createTableImagesServicesProfessionals')
		}
	} catch (e) {
		errorLogger('Erreur lors de la création/verification de la table [images_services_professionals]:' + e.stack, 'createTableImagesServicesProfessionals')
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
	/*createTableDefaultAvailability,*/
	createTableMessages,
	getClientsCollection,
	createTablePreferencePro,
	createTableImagesServicesProfessionals
};
