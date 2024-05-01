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
                    checkIfColumnExistInTable(resultTableExists.tableName, 'country')
                        .then((resultColumnExists) => {
                            if (!resultColumnExists.exists) {
                                /* Créer la colonne ici*/
                                addColumInTable(resultColumnExists.tableName, resultColumnExists.columnName, 'VARCHAR(100)')
                                    .then(columnAddResult => {
                                        if (columnAddResult) {
                                            logLogger(`La colonne 'country' a bien été ajouté dans la table 'USERS`, 'alterInTables')
                                        }
                                    })
                            }
                        })
                    checkIfColumnExistInTable(resultTableExists.tableName, 'city')
                        .then((resultColumnExists) => {
                            if (!resultColumnExists.exists) {
                                /* Créer la colonne ici*/
                                addColumInTable(resultColumnExists.tableName, resultColumnExists.columnName, 'VARCHAR(100)')
                                    .then(columnAddResult => {
                                        if (columnAddResult) {
                                            logLogger(`La colonne 'city' a bien été ajouté dans la table 'USERS`, 'alterInTables')
                                        }
                                    })
                            }
                        })
                    checkIfColumnExistInTable(resultTableExists.tableName, 'address')
                        .then((resultColumnExists) => {
                            if (!resultColumnExists.exists) {
                                /* Créer la colonne ici*/
                                addColumInTable(resultColumnExists.tableName, resultColumnExists.columnName, 'VARCHAR(100)')
                                    .then(columnAddResult => {
                                        if (columnAddResult) {
                                            logLogger(`La colonne 'address' a bien été ajouté dans la table 'USERS`, 'alterInTables')
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
                    checkIfColumnExistInTable(resultTableExists.tableName, 'country')
                        .then((resultColumnExists) => {
                            if (!resultColumnExists.exists) {
                                /* Créer la colonne ici*/
                                addColumInTable(resultColumnExists.tableName, resultColumnExists.columnName, 'VARCHAR(100)')
                                    .then(columnAddResult => {
                                        if (columnAddResult) {
                                            logLogger(`La colonne 'country' a bien été ajouté dans la table 'PROFESSIONALS`, 'alterInTables')
                                        }
                                    })
                            }
                        })
                    checkIfColumnExistInTable(resultTableExists.tableName, 'city')
                        .then((resultColumnExists) => {
                            if (!resultColumnExists.exists) {
                                /* Créer la colonne ici*/
                                addColumInTable(resultColumnExists.tableName, resultColumnExists.columnName, ' VARCHAR(100)')
                                    .then(columnAddResult => {
                                        if (columnAddResult) {
                                            logLogger(`La colonne 'city' a bien été ajouté dans la table 'PROFESSIONALS`, 'alterInTables')
                                        }
                                    })
                            }
                        })
                    checkIfColumnExistInTable(resultTableExists.tableName, 'address')
                        .then((resultColumnExists) => {
                            if (!resultColumnExists.exists) {
                                /* Créer la colonne ici*/
                                addColumInTable(resultColumnExists.tableName, resultColumnExists.columnName, 'VARCHAR(100)')
                                    .then(columnAddResult => {
                                        if (columnAddResult) {
                                            logLogger(`La colonne 'address' a bien été ajouté dans la table 'PROFESSIONALS`, 'alterInTables')
                                        }
                                    })
                            }
                        })
                    checkIfColumnExistInTable(resultTableExists.tableName, 'profile_picture')
                        .then((resultColumnExists) => {
                            if (!resultColumnExists.exists) {
                                /* Créer la colonne ici*/
                                addColumInTable(resultColumnExists.tableName, resultColumnExists.columnName, 'VARCHAR', false, 'NULL')
                                    .then(columnAddResult => {
                                        if (columnAddResult) {
                                            logLogger(`La colonne 'profile_picture' a bien été ajouté dans la table 'PROFESSIONALS`, 'alterInTables')
                                        }
                                    })
                            }
                        })
                }
            })
            .catch(e => errorLogger(e, " checkIfTableExist('professionals')"))
        checkIfTableExist('reservations')
            .then((resultTableExists) => {
                if (resultTableExists.exists) {
                    checkIfColumnExistInTable(resultTableExists.tableName, 'end_time')
                        .then((resultColumnExists) => {
                            if (!resultColumnExists.exists) {
                                /* Créer la colonne ici*/
                                addColumInTable(resultColumnExists.tableName, resultColumnExists.columnName, 'TIME')
                                    .then(columnAddResult => {
                                        if (columnAddResult) {
                                            logLogger(`La colonne 'end_time' a bien été ajoutée dans la table 'RESERVATIIONS`, 'alterInTables')
                                        }
                                    })
                            }
                        })
                }
            })
            .catch(e => errorLogger(e, "checkIfTableExist('reservations')"))

    } catch (e) {
       errorLogger(e, 'alterInTables')
    }


}


module.exports = { alterInTables }