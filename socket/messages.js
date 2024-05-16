document.addEventListener('DOMContentLoaded', function () {
	const userId = sessionStorage.getItem('userId') || 'defaultUserId'; // Assurez-vous de définir cet ID correctement

	const socket = io('http://localhost:3000');

	socket.on('connect', () => {
		console.log('Connecté au serveur Socket.IO');
		socket.emit('join_room', `user_room_${userId}`);
	});

	document
		.getElementById('send-message')
		.addEventListener('click', function () {
			const body = document.getElementById('message-body').value;
			const receiverId = document.getElementById('receiver-id').value; // ID du professionnel

			const messageData = {
				subject: 'Réponse rapide', // Ou 'Réponse' si c'est une réponse à un message
				message_body: body,
				sender_id: userId,
				receiver_id: receiverId,
			};
			socket.emit('send_message', messageData);
			document.getElementById('message-body').value = ''; // Effacer le champ de texte après l'envoi
		});

	socket.on('new_message', (message) => {
		console.log('Nouveau message reçu:', message);
		displayMessage(message);
	});

	function displayMessage(message) {
		const messagesContainer = document.getElementById('messages');
		const msgElement = document.createElement('div');
		msgElement.innerHTML = `<strong>${message.subject}</strong>: ${message.message_body}`;
		messagesContainer.appendChild(msgElement);
	}

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
});
