var q = require('q');
var https = require('https');
var config = require('../../../config.js')();
var firebaseUtil = require('../../../utils/firebase.js');
var RestContract = require('../../rest.contract.js');
var logger = require('../../../utils/logger.js');

var service = {
    get: get,
    post: post,
    put: put,
    delete: deleteItem
};
var identity;

function get(restRoute, id) {
    var deferred = q.defer();
    try {
        identity = restRoute.identity;
        var request = null;
        var data = '';
        var options = {};
        if (id) {
            options = {
                host: config.dataProviders.firebase.host,
                path: '/' + restRoute.dataName + '/' + id + '.json'
            };
            request = https.get(options, function (response) {
                response.on('data', function (d) {
                    data += d;
                });
                response.on('end', function () {
                    var json = JSON.parse(data);
                    json[restRoute.identity] = id;
                    deferred.resolve(new RestContract.GetById(json));
                });
            });
            request.on('error', function (e) {
                deferred.resolve(false);
            });
        } else {
            options = {
                host: config.dataProviders.firebase.host,
                path: '/' + restRoute.dataName + '.json'
            };
            request = https.get(options, function (response) {
                response.on('data', function (d) {
                    data += d;
                });
                response.on('end', function () {
                    firebaseUtil.objToArray(JSON.parse(data), identity).then(function (json) {
                        deferred.resolve(new RestContract.Get(json));
                    });
                });
            });
            request.on('error', function (e) {
                deferred.resolve(false);
            });
        }
    } catch (error) {
        deferred.resolve(new RestContract.Error(error.toString()));
    }
    return deferred.promise;
}

function post(restRoute, newItem, index) {
    if (Array.isArray(newItem)) {
        return postBatch(restRoute.dataName, newItem);
    } else {
        var deferred = q.defer();
        try {
            var jsonItem = JSON.stringify(newItem);
            var options = {
                method: 'POST',
                host: config.dataProviders.firebase.host,
                path: '/' + restRoute.dataName + '.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': jsonItem.length
                }
            };
            var data = '';
            var request = https.request(options, function (response) {
                response.on('data', function (d) {
                    data += d;
                });
                response.on('end', function () {
                    var json = JSON.parse(data);
                    deferred.resolve(new RestContract.PostById(json.name));
                });
            });
            request.write(jsonItem);
            request.end();
        } catch (error) {
            deferred.resolve(new RestContract.Error(error.toString()));
        }
        return deferred.promise;
    }
}

function postBatch(restRoute, items) {
    var deferred = q.defer();
    try {
        var promises = items.map(function (item, index) {
            return service.post(restRoute.dataName, item, index);
        });
        //TODO: Potential race condition bug here. Need to ensure the Ids are returned in the order of the items posted.
        q.all(promises).then(function (results) {
            var ids = results.map(function (item) {
                return item.id;
            });
            deferred.resolve(new RestContract.Post(ids));
        });
    } catch (error) {
        deferred.resolve(new RestContract.Error(error.toString()));
    }
    return deferred.promise;
}

function put(restRoute, item) {
    var deferred = q.defer();
    try {
        var id = item[restRoute.identity];
        delete item[restRoute.identity];
        var jsonItem = JSON.stringify(item);
        var options = {
            method: 'PUT',
            host: config.dataProviders.firebase.host,
            path: '/' + restRoute.dataName + '/' + id + '.json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': jsonItem.length
            }
        };
        var data = '';
        var request = https.request(options, function (response) {
            response.on('data', function (d) {
                data += d;
            });
            response.on('end', function () {
                deferred.resolve(new RestContract.PutById({
                    id: id,
                    success: true
                }));
            });
        });
        request.write(jsonItem);
        request.end();
    } catch (error) {
        deferred.resolve(new RestContract.Error(error.toString()));
    }
    return deferred.promise;
}

function deleteItem(restRoute, id) {
    var deferred = q.defer();
    try {
        var options = {
            method: 'DELETE',
            host: config.dataProviders.firebase.host,
            path: '/' + restRoute.dataName + '/' + id + '.json'
        };
        var data = '';
        var request = https.request(options, function (response) {
            response.on('data', function (d) {
                data += d;
            });
            response.on('end', function () {
                deferred.resolve(new RestContract.DeleteById({
                    id: id,
                    success: true
                }));
            });
        });
        request.write(id);
        request.end();
    } catch (error) {
        deferred.resolve(new RestContract.Error(error.toString()));
    }
    return deferred.promise;
}

module.exports = service;
