const {checkIfColumnExistInTable, addColumInTable, checkIfTableExist} =  require("./utils/database.utils")
const {logLogger, errorLogger} = require("../config/winston/winston.config");

const alterInTables = () => {
    try {
        /** pas la meilleure des facons avec l'imbrication mais ca fonctionne */
        checkIfTableExist('users')
            .then((resultTableExists) => {
                if (resultTableExists.exists) {
                    checkIfColumnExistInTable(resultTableExists.tableName, 'est_verifie')
                        .then((resultColumnExists) => {
                            if (!resultColumnExists.exists) {
                                /* Créer la colonne ici*/
                                addColumInTable(resultColumnExists.tableName, resultColumnExists.columnName, 'BOOLEAN', false, false)
                                    .then(columnAddResult => {
                                        if (columnAddResult) {
                                            logLogger(`La colonne 'est_verifie' a bien été ajouté dans la table 'USERS`, 'alterInTables')
                                        }
                                    })
                            }
                        })
                }
            })
            .catch(e => errorLogger(e, "checkIfTableExist('users')"))
        /**
         * MODIFICATIONS DE LA TABLE PRO
         */
        checkIfTableExist('professionals')
            .then((resultTableExists) => {
                if (resultTableExists.exists) {
                    checkIfColumnExistInTable(resultTableExists.tableName, 'banner_profile')
                        .then((resultColumnExists) => {
                            if (!resultColumnExists.exists) {
                                /* Créer la colonne ici*/
                                addColumInTable(resultColumnExists.tableName, resultColumnExists.columnName, 'VARCHAR')
                                    .then(columnAddResult => {
                                        if (columnAddResult) {
                                            logLogger(`La colonne 'banner_profile' a bien été ajouté dans la table 'PROFESSIONALS`, 'alterInTables')
                                        }
                                    })
                            }
                        })
                    checkIfColumnExistInTable(resultTableExists.tableName, 'est_verifie')
                        .then((resultColumnExists) => {
                            if (!resultColumnExists.exists) {
                                /* Créer la colonne ici*/
                                addColumInTable(resultColumnExists.tableName, resultColumnExists.columnName, 'BOOLEAN', false, false)
                                    .then(columnAddResult => {
                                        if (columnAddResult) {
                                            logLogger(`La colonne 'est_verifie' a bien été ajouté dans la table 'PROFESSIONALS`, 'alterInTables')
                                        }
                                    })
                            }
                        })
                }
            })
            .catch(e => errorLogger(e, " checkIfTableExist('professionals')"))
    } catch (e) {
       errorLogger(e, 'alterInTables')
    }
}


module.exports = { alterInTables }