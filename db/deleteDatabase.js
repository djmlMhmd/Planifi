const { checkIfTableExist, checkIfColumnExistInTable, deleteColumInTable} = require("./utils/database.utils");
const {errorLogger} = require("../config/winston/winston.config");

const deleteInTables = () => {
    try {
        checkIfTableExist('users')
            .then(async (resultTableExists) => {
                if (resultTableExists.exists) {
                    /* supprimer les colonnes voulues de la table 'USERS' ici*/
                    checkIfColumnExistInTable(resultTableExists.tableName, 'est_verifie')
                        .then((resultColumnExists) => {
                            if (resultColumnExists.exists) {
                                //deleteColumInTable(resultColumnExists.tableName, resultColumnExists.columnName)
                            }
                        })
                }
            })
            .catch(e => errorLogger(e, "checkIfTableExist('users')"))

        checkIfTableExist('professionals')
            .then(async (resultTableExists) => {
                if (resultTableExists.exists) {
                    /* supprimer les colonnes voulues de la table 'USERS' ici*/
                    checkIfColumnExistInTable(resultTableExists.tableName, 'est_verifie')
                        .then((resultColumnExists) => {
                            if (resultColumnExists.exists) {
                                //deleteColumInTable(resultColumnExists.tableName, resultColumnExists.columnName)
                            }
                        })
                }
            })
            .catch(e => errorLogger(e, "checkIfTableExist('users')"))
    }
    catch (e) {
        errorLogger(e, "deleteInTables")
    }
}

module.exports = {
    deleteInTables
}