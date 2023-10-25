//const { MongoClient } = require('mongodb');
const express = require('express');
const {
	connectToDatabase,
	createTableUser,
	createTableProfessional,
	createTableService,
	getClientsCollection,
	createTableReservation,
	createTableAvailability,
	createTableDefaultAvailability,
} = require('./db/database');

getClientsCollection();
connectToDatabase();
createTableUser();
createTableProfessional();
createTableService();
createTableAvailability();
createTableReservation();
createTableDefaultAvailability();

const { dbConnexion, getDatabase } = require('./db/database');
const path = require('path');
const app = express();
const port = 3000;
const routes = require('./routes/authentication');
const profilRoutes = require('./routes/profil');
const services = require('./routes/services');
const availability = require('./routes/availability');
const reservation = require('./routes/reservation');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(routes);
app.use(profilRoutes);
app.use(services);
app.use(availability);
app.use(reservation);

// dbConnexion();
app.use(express.json());

// permet de lancer serveur web
app.listen(port, () => {
	console.log(`App listening port ${port}`);
});

app.use(
	'/public/js',
	express.static(__dirname + '/public/js', {
		'Content-Type': 'text/javascript',
	})
);

// Configurez vos routes et la connexion à la base de données ici

// Récupérez les disponibilités du professionnel
app.get('/disponibilite/:professional_id', async (req, res) => {
	const professionalId = req.params.professional_id;
	try {
		// Effectuez une requête à la base de données pour récupérer les disponibilités du professionnel
		// Par exemple, si vous avez une table "availability" dans votre base de données :
		const client = getClientsCollection();
		const query = {
			text: 'SELECT * FROM availability WHERE professional_id = $1',
			values: [professionalId],
		};

		const result = await client.query(query);

		// Assurez-vous que les données sont renvoyées au format JSON
		res.json(result.rows);
	} catch (error) {
		console.error(
			'Erreur lors de la récupération des disponibilités :',
			error
		);
		res.status(500).json({
			message: 'Erreur lors de la récupération des disponibilités.',
		});
	}
});
