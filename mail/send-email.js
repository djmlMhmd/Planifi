const nodeMailer = require('nodemailer')
const {templateResetPassword} = require("./templates/reset-password-template");
const {logLogger, errorLogger} = require("../config/winston/winston.config");
const {confirmRegistrationTemplate} = require("./templates/confirm-registration");


const transporter = nodeMailer.createTransport( {
    host: 'acajou.o2switch.net',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    tls: { rejectUnauthorized: false}
})

const sendResetPassword = async (userEmail, name, linkResetPassword) => {
    try{
        /**
         * [prenom]
         * [lien_reinitialisation]
         */
        let template = templateResetPassword.replace('[prenom]', name)
        template = template.replace('[lien_reinitialisation]', linkResetPassword)
        /**
         * info.accepted: tableau contenant les mails accepté
         * info.rejected: tableau contenant les mails non envoyé
         * info.envelope: { from: 'test@shandoragames.fr', to: [ 'marius.vitta@gmail.com' ] },
         */
        const info = await transporter.sendMail({
            from: `Planifi <${process.env.MAIL_USERNAME}>`,
            to: userEmail,
            subject: "Réinitialisation de votre mot de passe",
            html: template,
        })
        logLogger(`un mail de reinitialisation de mot de passe a bien été envoyé à ${userEmail} avec l'id: ${info.messageId}`, "sendResetPassword")
    }
    catch (e) {
        errorLogger(`Erreur lors de lors de l'envoi du mail à ${userEmail}` + e, "sendResetPassword")
    }
}

/**
 * Fonction qui envoie un mail avec le template d'inscription à un utilisateur donnée
 *
 * @param userEmail mail de l'utilisateur
 * @param name prénom de l'utilisateur
 * @param linkRegistration link pour enregistrer l'utilsateur
 * @returns {Promise<void>}
 */
const sendRegistrationLink = async (userEmail, name, linkRegistration) => {
    try{
        /**
         * [prenom]
         * [lien_inscription]
         */
        let template = confirmRegistrationTemplate.replace('[prenom]', name)
        template = template.replace('[lien_inscription]', linkRegistration)
        const info = await transporter.sendMail({
            from: `Planifi <${process.env.MAIL_USERNAME}>`,
            to: userEmail,
            subject: "Activation de votre compte",
            html: template
        })
        logLogger(`Message envoyé: ${info.messageId}`, "sendRegistrationLink")
        logLogger(`Un mail de confirmation d'inscription a bien été envoyé à: ${userEmail} avec l'id: ${info.messageId}`, "sendRegistrationLink")
    }
    catch (e) {
        errorLogger(`Erreur lors de l'envoi du mail à ${userEmail}` + e, "sendRegistrationLink")
    }
}

/**
 * Fonction qui envoie un mail avec le template de confirmation de rdv à un utilisateur donnée
 *
 * @param userEmail mail de l'utilisateur
 * @param name prénom de l'utilisateur
 * @param rdvInfos objet avec nom du pro, date et heure du rendez, nom du service
 * @returns {Promise<void>}
 */
const sendConfirmationRendezVousClient = async (userEmail, name, rdvInfos) => {
    try{
        /**
         * [prenom]
         */
        const info = await transporter.sendMail({
            from: `Planifi <${process.env.MAIL_USERNAME}>`,
            to: userEmail,
            subject: "Confirmation de rendez-vous",
            html: `<h3>Bonjour, ${name} nous confirmons votre rendez-vous le ${rdvInfos.date} à ${rdvInfos.heure} avec ${rdvInfos.nom_pro} pour le service ${rdvInfos.service_nom}</h3>`
        })
        logLogger(`Message envoyé: ${info.messageId}`, "sendConfirmationRendezVous")
        logLogger(`Un mail de confirmation de rendez-vous a bien été envoyé à: ${userEmail} avec l'id: ${info.messageId}`, "sendConfirmationRendezVous")
    }
    catch (e) {
        errorLogger(`Erreur lors de l'envoi du mail à ${userEmail}` + e, "sendConfirmationRendezVous")
    }
}

/**
 * Fonction qui envoie un mail avec le template de confirmation de rdv à un utilisateur donnée
 *
 * @param userEmail mail de l'utilisateur
 * @param name prénom de l'utilisateur
 * @param rdvInfos objet avec nom du pro, date et heure du rendez, nom du service
 * @returns {Promise<void>}
 */
const sendRendezVousPrisPro = async (userEmail, name, rdvInfos) => {
    try{
        /**
         * [prenom]
         */
        const info = await transporter.sendMail({
            from: `Planifi <${process.env.MAIL_USERNAME}>`,
            to: userEmail,
            subject: "Nouveau Rendez-vous",
            html: `<h3>Bonjour, ${name} un rendez-vous à été pris par ${rdvInfos.nom_client} le ${rdvInfos.date} à ${rdvInfos.heure} pour le service ${rdvInfos.service_nom}</h3>`
        })
        logLogger(`Message envoyé: ${info.messageId}`, "sendRendezVousPrisPro")
        logLogger(`Un mail de nouveau de rendez-vous a bien été envoyé à: ${userEmail} avec l'id: ${info.messageId}`, "sendRendezVousPrisPro")
    }
    catch (e) {
        errorLogger(`Erreur lors de l'envoi du mail à ${userEmail}` + e, "sendRendezVousPrisPro")
    }
}

/**
 * Fonction qui envoie un mail avec le template de confirmation de rdv à un utilisateur donnée
 *
 * @param userEmail mail de l'utilisateur
 * @param name prénom de l'utilisateur
 * @param proInfos objet avec nom du pro, date et heure du rendez, nom du service
 * @returns {Promise<void>}
 */
const sendRendezVousAnnuleClient = async (userEmail, name, proInfos) => {
    try{
        /**
         * [prenom]
         */
        const info = await transporter.sendMail({
            from: `Planifi <${process.env.MAIL_USERNAME}>`,
            to: userEmail,
            subject: "Annulation rendez-vous",
            html: `<h3>Bonjour, ${name} votre rendez-vous du ${proInfos.date} à été annulé par ${proInfos.nom_client} pour le service ${proInfos.service_nom}</h3>`
        })
        logLogger(`Message envoyé: ${info.messageId}`, "sendRendezVousAnnuleClient")
        logLogger(`Un mail de rendez-vous annulé a bien été envoyé à: ${userEmail} avec l'id: ${info.messageId}`, "sendRendezVousAnnuleClient")
    }
    catch (e) {
        errorLogger(`Erreur lors de l'envoi du mail à ${userEmail}` + e, "sendRendezVousAnnuleClient")
    }
}

/**
 * Fonction qui envoie un mail avec le template de confirmation de rdv à un utilisateur donnée
 *
 * @param userEmail mail de l'utilisateur
 * @param name prénom de l'utilisateur
 * @param proInfos objet avec nom du pro, date et heure du rendez, nom du service
 * @returns {Promise<void>}
 */
const sendConfirmationRendezVousAnnulePro = async (userEmail, name, proInfos) => {
    try{
        /**
         * [prenom]
         */
        const info = await transporter.sendMail({
            from: `Planifi <${process.env.MAIL_USERNAME}>`,
            to: userEmail,
            subject: "Confirmation annulation rendez-vous",
            html: `<h3>Bonjour, ${name} votre rendez-vous du ${proInfos.date} à bien été annulé pour le client ${proInfos.nom_client} pour le service ${proInfos.service_nom}</h3>`
        })
        logLogger(`Message envoyé: ${info.messageId}`, "sendConfirmationRendezVousAnnulePro")
        logLogger(`Un mail de rendez-vous annulé a bien été envoyé à: ${userEmail} avec l'id: ${info.messageId}`, "sendConfirmationRendezVousAnnulePro")
    }
    catch (e) {
        errorLogger(`Erreur lors de l'envoi du mail à ${userEmail}` + e, "sendConfirmationRendezVousAnnulePro")
    }
}

const sendRestart = async () => {
    try{
        const info = await transporter.sendMail({
            from: `Planifi <${process.env.MAIL_USERNAME}>`,
            to: "marius.vitta@gmail.com",
            subject: "Le back a bien démarre",
            html: `<h1> le back vient de demarré à ${new Date()} </h1>`,
        })
        logLogger(`Message envoyé: ${info.messageId}`, "sendRestart")
        logLogger(`un mail de demarrage du serveur a bien été envoyé`, "sendRestart")
    }
    catch (e) {
        errorLogger(`Erreur lors de l'envoi du mail de demarrage à marius.vitta@gmail.com` + e, "sendRestart")
    }
}


module.exports = {
    sendResetPassword,
    sendRegistrationLink,
    sendRestart,
    sendConfirmationRendezVousClient,
    sendRendezVousPrisPro,
    sendRendezVousAnnuleClient,
    sendConfirmationRendezVousAnnulePro
}
