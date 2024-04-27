const { checkIfTableExist, checkIfColumnExistInTable} = require("./utils/utils");

const deleteInTables = () => {
    try {
        checkIfTableExist('users')
            .then(async (resultTableExists) => {
                if (resultTableExists.exists) {
                    /* supprimer les colonnes voulues de la table 'USERS' ici*/
                    checkIfColumnExistInTable(resultTableExists.tableName, 'est_verifie')
                        .then((resultColumnExists) => {
                            if (resultColumnExists.exists) {
                            }
                        })
                }
            })
            .catch(e => console.log(e))
    }
    catch (e) {
        console.log(e)
    }
}