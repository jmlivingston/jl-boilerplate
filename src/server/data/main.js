var providers = {
    json: require('./providers/json.js'),
    firebase: require('./providers/firebase.js'),
    sql: require('./providers/sql.js'),
    mongo: require('./providers/mongo.js')
};
var logger = require('../utils/logger.js');
var config = require('../config.js')();

var service = {
    get: get,
    post: post,
    put: put,
    delete: deleteById
};

function get(dataOptions, id, options) {
    logger.log('get ' + dataOptions.dataName + ' ' + id);
    return providers[dataOptions.provider].get(dataOptions.dataName, id, options);
}

function post(dataOptions, newItem, options) {
    logger.log('post ' + dataOptions.dataName + ' ' + JSON.stringify(newItem));
    return providers[dataOptions.provider].post(dataOptions.dataName, newItem, options);
}

function put(dataOptions, item, options) {
    logger.log('put ' + dataOptions.dataName + ' ' + JSON.stringify(item));
    return providers[dataOptions.provider].put(dataOptions.dataName, item, options);
}

function deleteById(dataOptions, id, options) {
    logger.log('delete ' + dataOptions.dataName + ' ' + id);
    return providers[dataOptions.provider].delete(dataOptions.dataName, id, options);
}

module.exports = service;
