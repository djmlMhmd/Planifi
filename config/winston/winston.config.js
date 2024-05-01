const {createLogger, transports, format} = require('winston')


const logger = createLogger({
    format: format.combine(
        format.simple(),
        format.timestamp({ format: 'dddd DD/MM/YY HH:mm:ss' }),
        format.printf(
            (info) =>
                `${info.timestamp} ${info.level}: ${info.message}` +
                (info.splat !== undefined ? `${info.splat}` : ' '),
        ),
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.timestamp({ format: 'YY-MM-DD HH:mm:SS' }),
                format.colorize(),
                format.simple(),
                format.label({ label: '[LOGGER]' }),
                format.printf(
                    (info) =>
                        `${info.label} ${info.timestamp} ${info.level}: ${info.message}` +
                        (info.splat !== undefined ? `${info.splat}` : ' '),
                ),
            ),
            level: 'debug',
        }),

        new transports.File({
            filename: 'error.log',
            level: 'error',
            dirname: 'logs',
            zippedArchive: true,
        }),
        new transports.File({
            filename: 'combined.log',
            level: 'debug',
            dirname: 'logs',
            zippedArchive: true,
        }),
    ],
})


/**
 * Message d'utilité
 *
 * @param message
 * @param nomComposant
 * @param fichier
 * @param route
 * @param httpMethode
 */
const logLogger = (message, nomComposant = '', fichier = '', route = '', httpMethode = '' )=>{
    logger.log({
        level: 'info',
        message: `${fichier !== '' ? `[${fichier}] `: ''}${httpMethode !== '' ? `[${httpMethode}] `: ''}${route !== '' ? `[${route}] `: ''}${nomComposant !== '' ? `[${nomComposant}] `: ''}: ${message}`,
    })
}

/**
 * message d'erreur
 *
 * @param message
 * @param nomComposant
 * @param fichier
 * @param route
 * @param httpMethode
 */
const errorLogger = (message, nomComposant, fichier = '', route = '', httpMethode = '' )=>{
    logger.log({
        level: 'error',
        message: `${fichier !== '' ? `[${fichier}] `: ''}${httpMethode !== '' ? `[${httpMethode}] `: ''}${route !== '' ? `[${route}] `: ''}${nomComposant !== '' ? `[${nomComposant}] `: ''}: ${message}`,
    })
}

/**
 * Message de warning
 *
 * @param message
 * @param nomComposant
 * @param fichier
 * @param route
 * @param httpMethode
 */
const warnLogger = (message, nomComposant, fichier = '', route = '', httpMethode = '' )=>{
    logger.log({
        level: 'warn',
        message: `${fichier !== '' ? `[${fichier}] `: ''}${httpMethode !== '' ? `[${httpMethode}] `: ''}${route !== '' ? `[${route}] `: ''}${nomComposant !== '' ? `[${nomComposant}] `: ''}: ${message}`,
    })
}

/**
 * Message de verbose (tout les autres messages pas si importants que ca)
 *
 * @param message
 * @param nomComposant
 * @param fichier
 * @param route
 * @param httpMethode
 */
const verboseLogger = (message, nomComposant, fichier = '', route = '', httpMethode = '' )=>{
    logger.log({
        level: 'verbose',
        message: `${fichier !== '' ? `[${fichier}] `: ''}${httpMethode !== '' ? `[${httpMethode}] `: ''}${route !== '' ? `[${route}] `: ''}${nomComposant !== '' ? `[${nomComposant}] `: ''}: ${message}`,
    })
}





module.exports = {logLogger, errorLogger, warnLogger, verboseLogger}