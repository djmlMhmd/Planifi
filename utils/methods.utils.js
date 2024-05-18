/**
 * Vérifie si la valeur passée en paramètre est bien un nombre
 * @param value chaine de caractère
 */
const isANumber = (value) => {
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

/**
 * return vrai si la variable est indéfini ou vide
 *
 * @param value
 * @returns {boolean}
 */
const isUndefinedOrEmpty = (value)  => {
    return value === undefined || value === ""
}

/**
 * return vrai si la variable est indéfini ou vide
 *
 * @param value
 * @returns {boolean}
 */
const isUndefined = (value)  => {
    return value === undefined
}



module.exports ={
    isANumber,
    convertToNumber,
    isUndefinedOrEmpty,
    isUndefined
}