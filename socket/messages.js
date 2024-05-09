const socket = io('http://localhost:3000');

socket.on('connect', () => {
	console.log('Connecté au serveur Socket.IO');
	// Maintenant que nous sommes connectés, nous pouvons joindre la room
	socket.emit('join_room', 'user_room_' + userId);

	// Joindre une room spécifique pour recevoir des messages
	socket.emit('join_room', 'user_room_' + userId);

	document
		.getElementById('send-message')
		.addEventListener('click', function () {
			const subject = document.getElementById('message-subject').value;
			const body = document.getElementById('message-body').value;
			const serviceId = document.getElementById('service-select').value;
			const receiverId = document.getElementById('receiver-id').value; // ID du professionnel

			socket.emit('send_message', {
				subject,
				message_body: body,
				service_id: serviceId,
				sender_id: userId, // ID du client connecté
				receiver_id: receiverId,
			});
		});
});

socket.on('new_message', (message) => {
	console.log('Nouveau message reçu:', message);
	// Ajouter le message à l'interface utilisateur
});

socket.on('message_sent', (response) => {
	console.log('Message envoyé avec succès:', response);
	alert('Message envoyé avec succès');
});

socket.on('message_error', (error) => {
	console.error("Erreur lors de l'envoi du message:", error.message);
});

socket.on('disconnect', () => {
	console.log('Déconnecté du serveur Socket.IO');
});
