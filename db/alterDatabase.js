const {checkIfExistTable, addColumInTable} =  require("./utils/utils")

const alterInTables = () => {
    try {
        checkIfExistTable('users', 'is_verifie')
            .then((result) =>{
                if(!result) {
                    /* Créer la colonne ici*/
                    addColumInTable('users', 'is_verifie', 'BOOLEAN')
                        .then(columnAddResult => {
                            if(columnAddResult) {
                                console.log(`La colonne 'is_verifie' a bien été ajouté dans la table 'USERS`)
                            }
                        })
                        .catch(e => console.log(e))
                    console.log(result)
                }
            })
            .catch(e => console.log(e))
    }
    catch (e) {
        console.log(e)
    }
}


module.exports = { alterTables}