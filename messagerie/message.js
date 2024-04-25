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
			console.log('Message enregistré avec succès:', result.rows[0]);
			return result.rows[0];
		} catch (e) {
			console.error(
				"Erreur lors de l'enregistrement du message:",
				e.stack
			);
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
			return result.rows;
		} catch (e) {
			console.error(
				'Erreur lors de la récupération des messages:',
				e.stack
			);
			throw e; // Rethrow l'erreur pour le gestionnaire d'erreurs supérieur
		}
	};
});
