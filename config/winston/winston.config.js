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
                format.timestamp(),
                format.colorize(),
                format.simple(),
                format.printf(
                    (info) =>
                        `${info.timestamp} ${info.level}: ${info.message}` +
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

// message d'utilité
const logLogger = (message, nomComposant)=>{
    logger.log({
        level: 'info',
        message: `[${nomComposant}]: ${message}`,
    })
}

// message d'erreur
const errorLogger = (message, nomComposant)=>{
    logger.log({
        level: 'error',
        message: `[${nomComposant}]: ${message}`,
    })
}

// message d'erreur
const warnLogger = (message, nomComposant)=>{
    logger.log({
        level: 'warn',
        message: `[${nomComposant}]: ${message}`,
    })
}

// tout le reste
const verboseLogger = (message, nomComposant)=>{
    logger.log({
        level: 'verbose',
        message: `[${nomComposant}]: ${message}`,
    })
}





module.exports = {logLogger, errorLogger, warnLogger, verboseLogger}