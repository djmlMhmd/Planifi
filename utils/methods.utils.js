/**
 * Vérifie si la valeur passée en paramètre est bien un nombre
 * @param value chaine de caractère
 */
const checkIsNumber = (value) => {
    value = parseInt(value, 10)
    return !isNaN(value) && parseFloat(value) === value
}

/**
 * converti en nombre
 *
 * @param value
 * @returns {number}
 */
const convertToNumber = (value) => {
    return parseInt(value, 10)
}


module.exports ={
    checkIsNumber,
    convertToNumber
}