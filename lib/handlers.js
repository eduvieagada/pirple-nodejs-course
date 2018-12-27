const _data = require('./data')
const helpers = require('./helpers');

var handlers = {};

handlers.users = function (data, callback) {
    let acceptableMethods = ['post', 'get', 'put', 'delete'];

    if (acceptableMethods.indexOf(data.method) > -1)
        handlers._users[data.method](data, callback);
    else
        callback(405);
};

handlers._users = {};

handlers._users.post = function (data, callback) {
    let firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    let password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    let tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {

        _data.read('users', phone, (err, data) => {
            if (err) {
                let hashedPassword = helpers.hash(password);

                if (hashedPassword) {
                    let userObject = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'phone': phone,
                        'hashedPassword': hashedPassword,
                        'tosAgreement': true
                    };

                    _data.create('users', phone, userObject, (err) => {
                        if (!err)
                            callback(200);
                        else {
                            console.log(err);
                            callback(500, { 'error': 'could not create the new user' });
                        }
                    });
                } else {
                    callback(500, { 'error': 'could not hash the user\'s password' })
                }
            }
            else
                callback(400, { 'error': 'user already exists' });
        });
    } else
        callback(400, { 'error': 'missing required fields' });
};

handlers._users.get = function (data, callback) {

    let phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ?
        data.queryStringObject.phone.trim() : false;

    if (phone) {
        _data.read('users', phone, function (err, data) {
            if (!err && data){
                delete data.hashedPassword;
                callback(200, data);
            } else
                callback(404);
        });
    } else
        callback(400, { 'error': 'missing required field' });
};
handlers._users.put = function (data, _callback) {

};
handlers._users.delete = function (data, _callback) {

};

handlers.ping = function (data, callback) {
    callback(200);
};

handlers.notFound = function (data, callback) {
    callback(404);
};

module.exports = handlers;