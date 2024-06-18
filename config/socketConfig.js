const socketIo = require('socket.io');

function initSocket(server) {
	const io = socketIo(server);
	require('../socket/socketController')(io);
}

module.exports = {
	init: initSocket,
};
