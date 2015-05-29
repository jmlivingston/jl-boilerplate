var providers = {
    firebase: require('./providers/firebase/provider.firebase.js'),
    json: require('./providers/json/provider.json.js'),
    mongodb: require('./providers/mongodb/provider.mongodb.js'),
    sql: require('./providers/sql/provider.sql.js')
};
var logger = require('../utils/logger.js');
var config = require('../config.js')();

var service = {
    get: get,
    post: post,
    put: put,
    delete: deleteItem
};

function get(restRoute, id, options) {
    logger.log('get ' + restRoute.dataName + ' ' + id);
    return providers[restRoute.provider].get(restRoute, id, options);
}

function post(restRoute, newItem, options) {
    logger.log('post ' + restRoute.dataName + ' ' + JSON.stringify(newItem));
    return providers[restRoute.provider].post(restRoute, newItem, options);
}

function put(restRoute, item, options) {
    logger.log('put ' + restRoute.dataName + ' ' + JSON.stringify(item));
    return providers[restRoute.provider].put(restRoute, item, options);
}

function deleteItem(restRoute, id, options) {
    logger.log('delete ' + restRoute.dataName + ' ' + id);
    return providers[restRoute.provider].delete(restRoute, id, options);
}

module.exports = service;
