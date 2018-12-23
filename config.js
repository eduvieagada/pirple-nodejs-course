
var enviroments = {};

enviroments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging'
};

enviroments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production'
};


let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';


let environmentToExport  = typeof(enviroments[currentEnvironment]) == 'object' ? enviroments[currentEnvironment] : enviroments.staging;


module.exports = environmentToExport;