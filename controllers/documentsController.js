const { constants } = require('../constants/constants');
const {
	errorLogger,
	verboseLogger,
} = require('../config/winston/winston.config');
const { getClientsCollection } = require('../db/database');
const { decodeJWT } = require('../utils/auth.utils');
const {
	sendInternalServerError,
	sendSuccess,
	sendSuccessWithNoContent,
} = require('../utils/error_message.utils');

function getDocumentStatusMeta(status) {
	switch (status) {
		case 'paid':
			return { label: 'Payée', typeLabel: 'Facture' };
		case 'pending':
			return { label: 'En attente', typeLabel: 'Devis' };
		case 'cancelled':
			return { label: 'Annulé', typeLabel: 'Document' };
		default:
			return { label: 'Disponible', typeLabel: 'Document' };
	}
}

module.exports.documents_get = async (req, res) => {
	const { id } = decodeJWT(req.cookies.jwt);

	try {
		const client = getClientsCollection();
		const query = {
			text: `
				SELECT
					d.document_id,
					d.document_type,
					d.document_number,
					d.title,
					d.status,
					d.issue_date,
					d.deadline_date,
					d.quantity,
					d.unit_price,
					d.total_price,
					d.note,
					d.created_at,
					d.professional_id,
					d.client_id,
					d.reservation_id,
					d.service_id,
					s.service_name,
					r.day_of_week,
					r.start_time,
					r.end_time,
					r.status AS reservation_status,
					pro.email AS professional_email,
					pro.phone AS professional_phone,
					pro.address AS professional_user_address,
					client_user.email AS client_email,
					client_user.phone AS client_phone,
					client_user.address AS client_address,
					CONCAT(client_user."firstName", ' ', client_user."lastName") AS client_name,
					CONCAT(pro."firstName", ' ', pro."lastName") AS professional_name,
					pa.company_name,
					pa.company_address
				FROM documents d
				LEFT JOIN reservations r ON r.reservation_id = d.reservation_id
				LEFT JOIN services s ON s.service_id = d.service_id
				LEFT JOIN users pro ON pro.users_id = d.professional_id
				LEFT JOIN users client_user ON client_user.users_id = d.client_id
				LEFT JOIN pro_account pa ON pa.user_id = d.professional_id
				WHERE d.professional_id = $1 OR d.client_id = $1
				ORDER BY d.issue_date DESC, d.document_id DESC
			`,
			values: [id],
		};

		const result = await client.query(query);
		if (!result.rows.length) {
			return sendSuccessWithNoContent(res, 'Aucun document trouvé');
		}

		const documents = result.rows.map((row) => {
			const statusMeta = getDocumentStatusMeta(row.status);
			const issueDate = row.issue_date ? new Date(row.issue_date) : null;
			const deadlineDate = row.deadline_date ? new Date(row.deadline_date) : null;
			const startTime = row.start_time ? String(row.start_time).slice(0, 5) : '';
			const endTime = row.end_time ? String(row.end_time).slice(0, 5) : '';

			return {
				id: row.document_id,
				type: row.document_type,
				typeLabel: row.document_type === 'invoice' ? 'Facture' : 'Devis',
				status: row.status,
				statusLabel: statusMeta.label,
				number: row.document_number,
				title: row.title,
				subtitle: `${row.client_name || 'Client'} · ${row.day_of_week || ''}`.trim(),
				issueDate: issueDate ? issueDate.toISOString() : null,
				deadlineDate: deadlineDate ? deadlineDate.toISOString() : null,
				issueDateLabel: issueDate ? issueDate.toLocaleDateString('fr-FR') : '',
				deadlineLabel: deadlineDate ? deadlineDate.toLocaleDateString('fr-FR') : '',
				provider: {
					name: row.company_name || row.professional_name || 'Prestataire',
					address: row.company_address || row.professional_user_address || 'Adresse professionnelle à compléter',
					email: row.professional_email || '',
					phone: row.professional_phone || '',
				},
				client: {
					name: row.client_name || 'Client',
					address: row.client_address || 'Adresse communiquée après confirmation',
					email: row.client_email || '',
					phone: row.client_phone || '',
				},
				lines: [
					{
						label: row.service_name || 'Prestation',
						description: `${row.day_of_week || ''}${startTime && endTime ? ` · ${startTime} - ${endTime}` : ''}`,
						quantity: Number(row.quantity) || 1,
						unitPrice: Number(row.unit_price) || 0,
						total: Number(row.total_price) || 0,
					},
				],
				subtotal: Number(row.total_price) || 0,
				total: Number(row.total_price) || 0,
				legalNotice: 'TVA non applicable, art. 293 B du CGI.',
				note: row.note || 'Document généré depuis votre espace Prestat.',
				professionalId: row.professional_id,
				clientId: row.client_id,
				reservationId: row.reservation_id,
				serviceId: row.service_id,
				reservationStatus: row.reservation_status || 'confirmed',
			};
		});

		verboseLogger(
			`${documents.length} document(s) trouvés pour l'utilisateur ${id}`,
			'',
			'documentsController.js',
			'/documents/data',
			constants.GET_HTTP
		);
		return sendSuccess(res, documents);
	} catch (e) {
		errorLogger(
			`Erreur lors de la récupération des documents: ${e.stack}`,
			'',
			'documentsController.js',
			'/documents/data',
			constants.GET_HTTP
		);
		return sendInternalServerError(
			res,
			'Erreur lors de la récupération des documents.'
		);
	}
};
