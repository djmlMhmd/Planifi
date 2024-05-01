const nodeMailer = require('nodemailer')
const {templateResetPassword} = require("./templates/reset-password-template");
const {logLogger, errorLogger} = require("../config/winston/winston.config");
const {confirmRegistrationTemplate} = require("./templates/confirm-registration");
const {confirmationRDVClientTemplate} = require("./templates/confirmation-rendez-vous-client");
const {confirmationRDVProTemplate} = require("./templates/confirmation-rendez-vous-pro");
const {annulationRDVClientTemplate} = require("./templates/annulation-rendez-vous-client");
const {annulationRDVProTemplate} = require("./templates/annulation-rendez-vous-pro");


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
 * @param rdvInfos
 * => {
 *      date: date du rdv,
 *      heure: heure du rdv,
 *      nom_pro: NOM_FAMILLE Prénom,
 *      service_nom: nom du service du pro
 * }
 * objet avec nom du pro, date et heure du rendez, nom du service
 * @returns {Promise<void>}
 */
const sendConfirmationRendezVousClient = async (userEmail, name, rdvInfos) => {
    try{
        /**
         * [prenom]
         * [date_rdv]
         * [heure_rdv]
         * [nom_pro]
         * [nom_service]
         */
        let template = confirmationRDVClientTemplate.replace('[prenom]', name)
        template = template.replace('[date_rdv]', rdvInfos.date)
        template = template.replace('[heure_rdv]', rdvInfos.heure)
        template = template.replace('[nom_pro]', rdvInfos.nom_pro)
        template = template.replace('[nom_service]', rdvInfos.service_nom)
        const info = await transporter.sendMail({
            from: `Planifi <${process.env.MAIL_USERNAME}>`,
            to: userEmail,
            subject: "Confirmation de rendez-vous",
            html: template
        })
        logLogger(`Un mail de confirmation de rendez-vous a bien été envoyé à: ${userEmail} avec l'id: ${info.messageId}`, "sendConfirmationRendezVousClient")
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
 * @param rdvInfos
 * => {
 *      date: date du rdv,
 *      heure: heure du rdv,
 *      nom_client: NOM_FAMILLE Prénom,
 *      service_nom: nom du service du pro
 * }
 * @returns {Promise<void>}
 */
const sendRendezVousPrisPro = async (userEmail, name, rdvInfos) => {
    try{
        /**
         * [prenom]
         * [date_rdv]
         * [heure_rdv]
         * [nom_client]
         * [nom_service]
         */
        let template = confirmationRDVProTemplate.replace('[prenom]', name)
        template = template.replace('[date_rdv]', rdvInfos.date)
        template = template.replace('[heure_rdv]', rdvInfos.heure)
        template = template.replace('[nom_client]', rdvInfos.nom_client)
        template = template.replace('[nom_service]', rdvInfos.service_nom)
        const info = await transporter.sendMail({
            from: `Planifi <${process.env.MAIL_USERNAME}>`,
            to: userEmail,
            subject: "Nouveau Rendez-vous",
            html: template
        })
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
 * @param rdvInfos
 * => {
 *      date: date du rdv,
 *      heure: heure du rdv,
 *      nom_client: NOM_FAMILLE Prénom,
 *      service_nom: nom du service du pro
 * }
 * @returns {Promise<void>}
 */
const sendRendezVousAnnuleClient = async (userEmail, name, rdvInfos) => {
    try{
        /**
         * [prenom]
         * [date_rdv]
         * [heure_rdv]
         * [nom_pro]
         * [nom_service]
         */
        let template = annulationRDVClientTemplate.replace('[prenom]', name)
        template = template.replace('[date_rdv]', rdvInfos.date)
        template = template.replace('[heure_rdv]', rdvInfos.heure)
        template = template.replace('[nom_pro]', rdvInfos.nom_pro)
        template = template.replace('[nom_service]', rdvInfos.service_nom)
        const info = await transporter.sendMail({
            from: `Planifi <${process.env.MAIL_USERNAME}>`,
            to: userEmail,
            subject: "Annulation rendez-vous",
            html: template
        })
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
 * @param rdvInfos
 * => {
 *      date: date du rdv,
 *      heure: heure du rdv,
 *      nom_client: NOM_FAMILLE Prénom,
 *      service_nom: nom du service du pro
 * }
 * @returns {Promise<void>}
 */
const sendRendezVousAnnulePro = async (userEmail, name, rdvInfos) => {
    try{
        /**
         * [prenom]
         * [date_rdv]
         * [heure_rdv]
         * [nom_client]
         * [nom_service]
         */
        let template = annulationRDVProTemplate.replace('[prenom]', name)
        template = template.replace('[date_rdv]', rdvInfos.date)
        template = template.replace('[heure_rdv]', rdvInfos.heure)
        template = template.replace('[nom_client]', rdvInfos.nom_client)
        template = template.replace('[nom_service]', rdvInfos.service_nom)
        const info = await transporter.sendMail({
            from: `Planifi <${process.env.MAIL_USERNAME}>`,
            to: userEmail,
            subject: "Annulation rendez-vous",
            html: template
        })
        logLogger(`Un mail de rendez-vous annulé a bien été envoyé à: ${userEmail} avec l'id: ${info.messageId}`, "sendRendezVousAnnulePro")
    }
    catch (e) {
        errorLogger(`Erreur lors de l'envoi du mail à ${userEmail}` + e, "sendRendezVousAnnulePro")
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
    sendRendezVousAnnulePro
}
