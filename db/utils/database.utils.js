const { getClientsCollection } = require('../database');
const {errorLogger} = require("../../config/winston/winston.config");

/**
 * fonction qui vérifie si une table existe
 *
 * @param tableName nom de la table à vérifier
 */
const checkIfTableExist = async (tableName) => {
    const commandCheckTableExists = `SELECT EXISTS(SELECT 1
                                                   FROM information_schema.tables
                                                   WHERE table_name = '${tableName}');`
    try {
        const client = getClientsCollection();
        const resultTableExists = await client.query(commandCheckTableExists);
        return {exists: resultTableExists.rows[0].exists, tableName}
    } catch (e) {
        errorLogger(`Erreur lors de la verification l'existence dans la table ${tableName}:` + JSON.stringify(e), 'checkIfTableExist')
    }
}

/**
 * fonction qui vérifie si une colonne existe dans la table fournie en paramètre
 * On omet la vérification de l'existence de la table car
 * on estime que la vérification a été faite auparavant
 *
 * @param tableName nom de la table à vérifier
 * @param columnName nom de la colonne à vérifier la présence dans la table
 */
const checkIfColumnExistInTable = async (tableName, columnName) => {

    const commandCheckColumnExists = `SELECT EXISTS (SELECT 1
                                                     FROM information_schema.columns
                                                     WHERE table_name = '${tableName}'
                                                       AND column_name = '${columnName}')`
    try {
        const client = getClientsCollection();
        const resultColumnExists = await client.query(commandCheckColumnExists);
        return {exists: resultColumnExists.rows[0].exists, tableName, columnName}
    } catch (e) {
        errorLogger(`Erreur lors de la vérification de la présence de la colonne ${columnName} dans la table ${tableName}:` + JSON.stringify(e), 'checkIfColumnExistInTable')
    }
}

/**
 * fonction qui ajoute une colonne dans une table SQL
 * On omet la vérification de l'existence de la table et de la colonne car
 * on estime que la vérification a été faite auparavant
 *
 * la fonction fait bien évidemment qu'un ajout simple d'une colonne dans une table
 * s'il y a des constraintes sur la colonne avec d'autres tables, il faudra utiliser la fonction
 * executeCustomQuery avec le string de la commande directement en paramètres
 *
 * @param tableName nom de la table ou on va ajouter @columnName
 * @param columnName nom de la colonne à ajouter dans la table
 * @param columnType valeur type de la colonne VARCHAR, INT, BOOLEAN etc
 * @param isNotNull booleen pour savoir si la colonne est non null ou pas, true => colonne IS NOT NULL
 * @param defaultValue valeur par défaut de la colonne
 *
 * @isNotNull et @defaultValue vont bien évidemment de pair
 */
const addColumInTable = async (tableName, columnName, columnType, isNotNull = false, defaultValue = '') => {
    const command = `ALTER TABLE ${tableName} 
                            ADD COLUMN ${columnName} ${columnType} ${isNotNull ? 'NOT NULL': ''} ${defaultValue !== '' ? `DEFAULT ${defaultValue}`: defaultValue};`
    try {
        const client = getClientsCollection();
        await client.query(command);
        return true
    } catch (e) {
        errorLogger(`Erreur lors de l'ajout de la colonne ${columnName} dans la table ${tableName}:` + e, 'addColumInTable')
    }
}

/**
 * execute une commande SQL personnalisée
 *
 * @param query requete SQL exemple: 'SELECT * FROM users'
 * @param values valeurs
 * @returns {Promise<boolean>}
 */
const executeCustomQuery = async (query) => {
    try{
        const client = getClientsCollection();
        await client.query(query);
        return true
    }
    catch (e) {
        errorLogger(`Erreur lors de l'execution de la commande personnalisé ${query}, pensez à verifier la commande en local sur PgAdmin:` + e, 'executeCustomQuery')
    }
}

/**
 * execute une commande SQL personnalisée
 *
 * @param query requete SQL exemple: 'SELECT * FROM users'
 * @param values valeurs
 * @returns {Promise<boolean>}
 */
const executeCustomQueryWithData = async (query, values) => {
    try{
        const client = getClientsCollection();
        let data = await client.query(query, values);
        return data.rows
    }
    catch (e) {
        errorLogger(`Erreur lors de l'execution de la commande personnalisé ${query}, pensez à verifier la commande en local sur PgAdmin:` + e, 'executeCustomQuery')
    }
}

/**
 * fonction qui supprime une colonne dans une table SQL
 * On omet la vérification de l'existence de la table et de la colonne car
 * on estime que la vérification a été faite auparavant
 *
 * @param tableName nom de la table ou on va supprimer @columnName
 * @param columnName nom de la colonne à supprimer dans la table
 * @returns {Promise<boolean>}
 */
const deleteColumInTable = async (tableName, columnName) => {
    const command = `ALTER TABLE ${tableName} 
                            DROP COLUMN ${columnName}`
    try {
        const client = getClientsCollection();
        await client.query(command);
        return true
    } catch (e) {
        errorLogger(`Erreur lors de la suppression de la colonne ${columnName} dans la table ${tableName}:` + e, 'deleteColumInTable')
    }
}


/**
 * fonction qui modifie le nom d'une dans une table SQL
 * On omet la vérification de l'existence de la table et de la colonne car
 * on estime que la vérification a été faite auparavant
 *
 * @param tableName nom de la table ou on va supprimer @columnName
 * @param columnName nom de la colonne à supprimer dans la table
 * @param newName nouveau nom de la colonne
 * @returns {Promise<boolean>}
 */
const renameColumInTable = async (tableName, columnName, newName) => {
    const command = `ALTER TABLE ${tableName}
                            RENAME COLUMN ${columnName} TO ${newName}`
    try {
        const client = getClientsCollection();
        await client.query(command);
        return true
    } catch (e) {
        errorLogger(`Erreur lors du renommage de la colonne ${columnName} dans la table ${tableName}:` + e, 'renameColumInTable')
    }
}


module.exports = { checkIfColumnExistInTable, addColumInTable, executeCustomQuery, deleteColumInTable, renameColumInTable, checkIfTableExist, executeCustomQueryWithData}