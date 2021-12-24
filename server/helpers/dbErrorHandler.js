'use strict'

/**
 * Get unique error field name
 */
const getUniqueErrorMessage = (err) => {
    let output;
    let fieldName_ = 'input';
    
    try {
        let fieldName = err.message.substring(err.message.lastIndexOf('index: ') + 7, err.message.lastIndexOf('_1'));
        fieldName_ = fieldName;
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';        
    } catch (ex) {
        output = 'Unique field already exists'
    }

    return [fieldName_, output]
}
//11000 duplicate key error collection: elearn.users index: email already exists
/**
 * Get the error message from error object
 */
const getErrorMessage = (err) => {
    let message = ''

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err)
                break
            default:
                message = 'Something went wrong'
        }
    } else {
        for (let errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message
        }
    }

    return message
}

export default { getErrorMessage }