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
		console.error(
			'Erreur lors de la connexion à la base de données PostgreSQL',
			e.stack
		);
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
		console.error(
			'Erreur lors de la création/verification de la table',
			e.stack
		);
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
		console.error(
			'Erreur lors de la création/verification de la table des professionnels',
			e.stack
		);
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
		console.error('Erreur lors de la création du service', e.stack);
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
		console.error(
			'Erreur lors de la création/verification de la table availability',
			e.stack
		);
		errorLogger('Erreur lors de la création/verification de la table [availability]:' + e.stack, 'createTableAvailability')
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
                    REFERENCES professionals(professional_id),
                    users_id INT,
                    CONSTRAINT FK_users_id FOREIGN KEY (users_id)
                    REFERENCES users(users_id),
                    day_of_week VARCHAR(10) NOT NULL,
                    start_time TIME NOT NULL,
                    service_id INT,
                    CONSTRAINT FK_service_id FOREIGN KEY (service_id)
                    REFERENCES services(service_id),
                    default_availability_id INT,
                    CONSTRAINT FK_default_availability_id FOREIGN KEY (default_availability_id)
                    REFERENCES default_availability(default_availability_id)
                );
            `;

			await client.query(createTableQuery);
			logLogger('Table [reservation] créée avec succès', 'createTableReservation')
		} else {
			verboseLogger('La table [reservation] existe déjà.', 'createTableReservation')
		}
	} catch (e) {
		console.error(
			'Erreur lors de la création/mise à jour de la table reservation',
			e.stack
		);
		errorLogger('Erreur lors de la création/verification de la table [reservation]:' + e.stack, 'createTableReservation')
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
		console.error(
			'Erreur lors de la création de la table de disponibilité par défaut',
			e.stack
		);
		errorLogger('Erreur lors de la création/verification de la table [default_availability]:' + e.stack, 'createTableDefaultAvailability')
	}
};

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
		console.error(
			'Erreur lors de la création de la table messages',
			e.stack
		);
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
		console.error(
			'Erreur lors de la création/verification de la table',
			e.stack
		);
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
		  CONSTRAINT FK_sender_id FOREIGN KEY (pro_id)
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
		console.error(
			'Erreur lors de la création/verification de la table des images_services_professionals',
			e.stack
		);
		errorLogger('Erreur lors de la création/verification de la table [images_services_professionals]:' + e.stack, 'createTableImagesServicesProfessionals')
	}
};

const saveMessage = async ({
	sender_id,
	receiver_id,
	subject,
	message_body,
	service_id,
}) => {
	try {
		const insertQuery = `
      INSERT INTO messages (sender_id, receiver_id, subject, message_body, service_id, sent_at)
      VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *;
    `;
		const result = await client.query(insertQuery, [
			sender_id,
			receiver_id,
			subject,
			message_body,
			service_id,
		]);
		verboseLogger('Message enregistré avec succès:' + JSON.stringify(result.rows[0]), 'saveMessage')
		return result.rows[0];
	} catch (e) {
		errorLogger('Erreur lors de l\'enregistrement du message:' + e.stack, 'saveMessage')
		throw e; // Rethrow l'erreur pour le gestionnaire d'erreurs supérieur
	}
};

const getMessagesForProfessional = async (receiver_id) => {
	try {
		const selectQuery = `
      SELECT m.*, u.firstName, u.lastName FROM messages m
      JOIN users u ON m.sender_id = u.users_id
      WHERE receiver_id = $1
      ORDER BY sent_at DESC;
    `;
		const result = await client.query(selectQuery, [receiver_id]);
		console.log(
			`Messages récupérés pour le professionnel ${receiver_id}:`,
			result.rows
		);
		verboseLogger(`Messages récupérés pour le professionnel ${receiver_id}:`, 'getMessagesForProfessional')
		return result.rows;
	} catch (e) {
		console.error('Erreur lors de la récupération des messages:', e.stack);
		errorLogger('Erreur lors de la récupération des messages:' + e.stack, 'getMessagesForProfessional')
		throw e; // Rethrow l'erreur pour le gestionnaire d'erreurs supérieur
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
	createTableMessages,
	saveMessage,
	getMessagesForProfessional,
	getClientsCollection,
	createTablePreferencePro,
	createTableImagesServicesProfessionals
};
