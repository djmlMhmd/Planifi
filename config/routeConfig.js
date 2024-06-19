const disconnect = require('../routes/disconnect');
const authRoutes = require('../routes/authentication');
const profileRoutes = require('../routes/profil');
const serviceRoutes = require('../routes/services');
const availabilityRoutes = require('../routes/availability');
const reservationRoutes = require('../routes/reservation');
const indexRoutes = require('../routes/index');
const messageRoutes = require('../messagerie/message');
const professionalRoutes = require('../routes/professionalsRoute');
const noteRoutes = require('../routes/notation');

function setupRoutes(app) {
	app.use('/', indexRoutes);
	app.use('/disconnect', disconnect);
	app.use('/auth', authRoutes);
	app.use('/profile', profileRoutes);
	app.use('/availability', availabilityRoutes);
	app.use('/reservation', reservationRoutes);
	app.use('/messages', messageRoutes);
	app.use('/professionals', professionalRoutes);
	app.use('/notes', noteRoutes);

	// Doublon j'ai l'impression, en tout cas "services" ne sert à rien
	app.use('/service', serviceRoutes);
	// Pas sûr que ça soit utile ça :
	app.use('/api', reservationRoutes);
}

module.exports = { setup: setupRoutes };
