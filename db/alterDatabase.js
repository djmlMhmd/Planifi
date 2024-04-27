const {checkIfColumnExistInTable, addColumInTable, checkIfTableExist} =  require("./utils/utils")

const alterInTables = () => {
    try {
        /** pas la meilleure des facons avec l'imbrication mais ca fonctionne */
        checkIfTableExist('users')
            .then(async (resultTableExists) => {
                if (resultTableExists.exists) {
                    checkIfColumnExistInTable(resultTableExists.tableName, 'est_verifie')
                        .then((resultColumnExists) =>{
                            if(!resultColumnExists.exists) {
                                /* Créer la colonne ici*/
                                addColumInTable(resultColumnExists.tableName, resultColumnExists.columnName, 'BOOLEAN')
                                    .then(columnAddResult => {
                                        if(columnAddResult) {
                                            console.log(`La colonne 'est_verifie' a bien été ajouté dans la table 'USERS`)
                                        }
                                    })
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


module.exports = { alterInTables }