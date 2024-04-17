document.getElementById('send-message').addEventListener('click', function () {
	const subject = document.getElementById('message-subject').value;
	const body = document.getElementById('message-body').value;
	const serviceId = document.getElementById('service-select').value;

	fetch('/api/send-message', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			subject,
			message_body: body,
			service_id: serviceId,
			sender_id: clientID, // Supposons que clientID est l'ID du client connecté
			// Adapter cette partie pour envoyer l'ID du professionnel choisi
		}),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Problème lors de l'envoi du message");
			}
			return response.json();
		})
		.then((data) => {
			console.log('Message envoyé avec succès:', data);
			alert('Message envoyé avec succès');
		})
		.catch((error) => {
			console.error("Erreur lors de l'envoi du message:", error);
		});
});
