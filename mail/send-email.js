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
    sendRestart
}
