//const { MongoClient } = require('mongodb');
const express = require('express');
const { connectToDatabase, createTableUser } = require('./db/database');

connectToDatabase();
createTableUser();
/** const {
	dbConnexion,
	getDatabase,
	getClientsCollection,
} = require('./db/database');
const path = require('path');
const app = express();
const port = 3000;
const routes = require('./routes/routes');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(routes);

// dbConnexion();
app.use(express.json());

// permet de lancer serveur web
app.listen(port, () => {
	console.log(`App listening port ${port}`);
});*/
