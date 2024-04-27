const {checkIfExistTable, addColumInTable} = require("./utils/utils");

const deleteInTables = () => {
    try {
        checkIfExistTable('users', 'is_verifie')
            .then((result) =>{
                if(!result) {
                    /* supprimer les colonnes ici*/
                }
            })
            .catch(e => console.log(e))
    }
    catch (e) {
        console.log(e)
    }
}