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
            if (!err && data) {
                delete data.hashedPassword;
                callback(200, data);
            } else
                callback(404);
        });
    } else
        callback(400, { 'error': 'missing required field' });
};

handlers._users.put = function (data, callback) {
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ?
        data.payload.phone.trim() : false;

    let firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (phone) {
        if (firstName || lastName || password) {
            _data.read('users', phone, (err, userData) => {
                if (!err && userData) {
                    if (firstName)
                        userData.firstName = firstName;
                    if (lastName)
                        userData.lastName = lastName;
                    if (password)
                        userData.hashedPassword = helpers.hash(password);

                    _data.update('users', phone, userData, (err) => {
                        if (!err)
                            callback(200);
                        else {
                            console.log(err);
                            callback(500, { 'error': 'could not update the user' });
                        }
                    })
                } else
                    callback(400, { 'error': 'the specified user does not exist' });
            });
        } else
            callback(400, { 'error': 'missing fields to update' });
    } else
        callback(400, { 'error': 'missing required field' });
};

handlers._users.delete = function (data, callback) {
    let phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ?
        data.queryStringObject.phone.trim() : false;

    if (phone) {
        _data.read('users', phone, function (err, data) {
            if (!err && data) {
                _data.delete('users', phone, (err) => {
                    if (!err)
                        callback(200);
                    else
                        callback(500, { 'error': 'could not delete the specified user' });
                })
            } else
                callback(400, { 'error': 'could not find the specified user' });
        });
    } else
        callback(400, { 'error': 'missing required field' });
};

// tokens

handlers.tokens = function (data, callback) {
    let acceptableMethods = ['post', 'get', 'put', 'delete'];

    if (acceptableMethods.indexOf(data.method) > -1)
        handlers._tokens[data.method](data, callback);
    else
        callback(405);
};

handlers._tokens = {};

handlers._tokens.post = function (data, callback) {
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    let password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (phone && password) {
        _data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                let hashedPassword = helpers.hash(password);
                if (hashedPassword == userData.hashedPassword) {
                    let tokenId = helpers.createRandomString(20);

                    let expires = Date.now() + 1000 * 60 * 60;

                    let tokenObj = {
                        'phone': phone,
                        'id': tokenId,
                        'expires': expires
                    };
                    _data.create('tokens', tokenId, tokenObj, (err) => {
                        if (!err) {
                            callback(200, tokenObj);
                        } else {
                            callback(500, err);
                        }
                    })
                } else {
                    callback(400, { 'Error': 'Password did not match the specified user\'s password' });
                }
            } else {
                callback(400, { 'Error': 'could not find the specified user' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required fields ' });
    }
};

handlers._tokens.get = function (data, callback) {
    let id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ?
        data.queryStringObject.id.trim() : false;

        if (id) {
            _data.read('tokens', id, function (err, data) {
                if (!err && data) {
                    callback(200, data);
                } else
                    callback(404);
            });
        } else
            callback(400, { 'error': 'missing required field' });
};

handlers._tokens.put = function (data, callback) {

};

handlers._tokens.delete = function (data, callback) {

};

handlers.ping = function (data, callback) {
    callback(200);
};

handlers.notFound = function (data, callback) {
    callback(404);
};

module.exports = handlers;