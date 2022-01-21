/**
 * Validates a string or a number.
 * @param {"number"|"string"|"array"|"boolean"} type 
 * @param {*} value 
 * @returns {number|string|[]|boolean}
 */
function validate(type, value) {
    switch(type) {
        case 'number':
            return typeof value === type && isFinite(value) ? value : 0;
            break;
        case 'string':
            return typeof value === type ? value : '';
            break;
        case 'array':
            return typeof value === 'object' && typeof value.length === 'number' ? [ ...value ] : [];
            break;
        case 'boolean':
            return typeof value === 'boolean' && value ? true : false;
            break;
        default:
            return value;
            break;
    }
}

module.exports = validate;