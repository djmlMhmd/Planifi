const nodeMailer = require('nodemailer')
const {templateResetPassword} = require("./templates/reset-password-template");
const {logLogger, errorLogger} = require("../config/winston/winston.config");
const {confirmRegistrationTemplate} = require("./templates/confirm-registration");


const sendResetPassword = async (userEmail, name, link) => {
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
    try{
        /**
         * [prenom]
         * [lien_reinitialisation]
         * [lien_inscription]
         */
        let changingTemplate = templateResetPassword.replace()
        const info = await transporter.sendMail({
            from: `Planifi <${process.env.MAIL_USERNAME}>`,
            to: userEmail,
            subject: "Réinitialisation de votre mot de passe",
            html: templateResetPassword,
        })
        logLogger(`un mail de reinitialisation de mot de passe a bien été envoyé à: ${info.messageId}`, "sendResetPassword")
    }
    catch (e) {
        errorLogger(`Erreur lors de lors de l'envoi du mail à ${userEmail}` + e, "sendResetPassword")
    }
}

const sendRegistrationLink = async (userEmail, name, link) => {
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
    try{
        /**
         * [prenom]
         * [lien_inscription]
         */
        let changingTemplate = confirmRegistrationTemplate.replace()
        const info = await transporter.sendMail({
            from: `Planifi <${process.env.MAIL_USERNAME}>`,
            to: userEmail,
            subject: "Activation de votre compte",
            html: confirmRegistrationTemplate,
            attachments: [ {
                filename: 'header',
                path: './mail/images/image-5.png',
                cid: 'header-image'
            }]
        })
        logLogger(`Message envoyé: ${info.messageId}`, "sendRegistrationLink")
        logLogger(`Un mail de confirmation d'inscription a bien été envoyé à: ${info.messageId}`, "sendRegistrationLink")
    }
    catch (e) {
        errorLogger(`Erreur lors de l'envoi du mail à ${userEmail}` + e, "sendRegistrationLink")
    }
}

const sendRestart = async () => {
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
    try{
        /**
         * [prenom]
         * [lien_inscription]
         */
        let changingTemplate = confirmRegistrationTemplate.replace()
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
