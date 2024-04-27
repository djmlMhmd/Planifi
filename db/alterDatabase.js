const {checkIfColumnExistInTable, addColumInTable, checkIfTableExist} =  require("./utils/utils")
const {logLogger} = require("../config/winston/winston.config");

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
                                addColumInTable(resultColumnExists.tableName, resultColumnExists.columnName, 'BOOLEAN')
                                    .then(columnAddResult => {
                                        if (columnAddResult) {
                                            logLogger(`La colonne 'est_verifie' a bien été ajouté dans la table 'USERS`, 'alterInTables')
                                        }
                                    })
                            }
                        })
                }
            })
            .catch(e => console.log(e))
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
                }
            })
            .catch(e => console.log(e))
    } catch (e) {
        console.log(e)
    }
}


module.exports = { alterInTables }