const crypto = require('crypto');
const config = require('./../config');

let helpers = {};

helpers.hash = function (str) {
    if (typeof (str) == 'string' && str.length > 0) {
        let hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    } else
        return false;
};

helpers.parseJsonToObject = function (str) {
    try {
        let obj = JSON.parse(str);
        return obj
    } catch {
        return {};
    }
};

helpers.createRandomString = function(strLength) {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;

    if (strLength) {
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        let str = '';

        for(let i = 1; i <= strLength; i++) {
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters));
            str += randomCharacter;
        }

        return str;
    } else {
        return false;
    }
}

module.exports = helpers;