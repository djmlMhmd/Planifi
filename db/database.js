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

const createTableDocuments = async () => {
	try {
		const checkTableQuery = `
			SELECT to_regclass('documents') as table_exists;
		`;

		const result = await client.query(checkTableQuery);
		if (result.rows[0].table_exists === null) {
			const createTableQuery = `
				CREATE TABLE documents (
					document_id SERIAL PRIMARY KEY,
					professional_id INT NOT NULL,
					client_id INT NOT NULL,
					reservation_id INT,
					service_id INT,
					document_type VARCHAR(20) NOT NULL,
					document_number VARCHAR(60) UNIQUE NOT NULL,
					title VARCHAR(255) NOT NULL,
					status VARCHAR(40) NOT NULL,
					issue_date DATE NOT NULL,
					deadline_date DATE NOT NULL,
					quantity INT NOT NULL DEFAULT 1,
					unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
					total_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
					note TEXT,
					created_at TIMESTAMP NULL DEFAULT (timezone('Europe/Paris', now())),
					CONSTRAINT fk_document_professional_id FOREIGN KEY (professional_id)
						REFERENCES users(users_id),
					CONSTRAINT fk_document_client_id FOREIGN KEY (client_id)
						REFERENCES users(users_id),
					CONSTRAINT fk_document_reservation_id FOREIGN KEY (reservation_id)
						REFERENCES reservations(reservation_id),
					CONSTRAINT fk_document_service_id FOREIGN KEY (service_id)
						REFERENCES services(service_id)
				);
			`;

			await client.query(createTableQuery);
			logLogger(
				'Table [documents] créée avec succès',
				'createTableDocuments'
			);
		} else {
			verboseLogger(
				'La table [documents] existe déjà.',
				'createTableDocuments'
			);
		}
	} catch (e) {
		errorLogger(
			'Erreur lors de la création/verification de la table [documents]:' +
				e.stack,
			'createTableDocuments'
		);
	}
};

const seedDemoDocuments = async () => {
	try {
		const client = getClientsCollection();
		const reservationQuery = `
			SELECT
				r.reservation_id,
				r.professional_id,
				r.users_id AS client_id,
				r.service_id,
				r.day_of_week,
				r.start_time,
				r.end_time,
				r.status,
				s.service_name,
				s.service_price,
				pa.company_name
			FROM reservations r
			INNER JOIN services s ON s.service_id = r.service_id
			LEFT JOIN pro_account pa ON pa.user_id = r.professional_id
			WHERE r.professional_id = 2
			  AND r.users_id = 1
			ORDER BY TO_DATE(r.day_of_week, 'DD-MM-YYYY') ASC, r.start_time ASC
		`;
		const reservationResult = await client.query(reservationQuery);
		const reservations = reservationResult.rows;

		if (!reservations.length) {
			return;
		}

		const demoDocuments = [
			{
				reservation: reservations.find((item) => item.reservation_id === 11) || reservations[0],
				document_type: 'invoice',
				document_number: 'FAC-2026-0011',
				title: 'Facture test',
				status: 'paid',
				issue_offset_days: 0,
				deadline_offset_days: 15,
				note: 'Facture envoyée par Test Pro Services après la prestation réalisée.',
			},
			{
				reservation: reservations.find((item) => item.reservation_id === 12) || reservations[1] || reservations[0],
				document_type: 'invoice',
				document_number: 'FAC-2026-0012',
				title: 'Facture test 2',
				status: 'paid',
				issue_offset_days: 0,
				deadline_offset_days: 15,
				note: 'Facture PDF disponible pour le rendez-vous confirmé.',
			},
			{
				reservation: reservations.find((item) => item.reservation_id === 14) || reservations[2] || reservations[0],
				document_type: 'quote',
				document_number: 'DEV-2026-0014',
				title: 'Devis test 4',
				status: 'pending',
				issue_offset_days: -2,
				deadline_offset_days: 30,
				note: 'Devis envoyé depuis l’espace professionnel Test Pro.',
			},
			{
				reservation: reservations.find((item) => item.reservation_id === 17) || reservations[3] || reservations[0],
				document_type: 'quote',
				document_number: 'DEV-2026-0017',
				title: 'Devis test 3',
				status: 'pending',
				issue_offset_days: -1,
				deadline_offset_days: 30,
				note: 'Devis en attente de validation côté client.',
			},
		].filter((item) => item.reservation);

		for (const document of demoDocuments) {
			const issueDateQuery = `
				SELECT (
					TO_DATE($1, 'DD-MM-YYYY') + ($2 * INTERVAL '1 day')
				)::date AS issue_date,
				(
					TO_DATE($1, 'DD-MM-YYYY') + ($3 * INTERVAL '1 day')
				)::date AS deadline_date
			`;
			const dateResult = await client.query(issueDateQuery, [
				document.reservation.day_of_week,
				document.issue_offset_days,
				document.deadline_offset_days,
			]);
			const { issue_date: issueDate, deadline_date: deadlineDate } = dateResult.rows[0];

			await client.query(
				`
					INSERT INTO documents (
						professional_id,
						client_id,
						reservation_id,
						service_id,
						document_type,
						document_number,
						title,
						status,
						issue_date,
						deadline_date,
						quantity,
						unit_price,
						total_price,
						note
					)
					VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 1, $11, $12, $13)
					ON CONFLICT (document_number) DO NOTHING
				`,
				[
					document.reservation.professional_id,
					document.reservation.client_id,
					document.reservation.reservation_id,
					document.reservation.service_id,
					document.document_type,
					document.document_number,
					document.title,
					document.status,
					issueDate,
					deadlineDate,
					Number(document.reservation.service_price) || 0,
					Number(document.reservation.service_price) || 0,
					document.note,
				]
			);
		}
	} catch (e) {
		errorLogger(
			'Erreur lors de l’initialisation des documents de démonstration:' +
				e.stack,
			'seedDemoDocuments'
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
	createTableDocuments,
	seedDemoDocuments,
	getClientsCollection,
	createTableImagesServicesProfessionals,
};
