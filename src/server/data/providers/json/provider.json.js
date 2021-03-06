//TODO: This works great locally, but for Heroku and some other host providers we can't simply write to a file.
//Need to think of a different way to store the json data. S3? NODE_ENV as a hack? Need to determine size limit.
var q = require('q');
var io = require('../../../utils/io.js');
var jsonBasePath = __dirname + '/data/';
var RestContract = require('../../rest.contract.js');
var logger = require('../../../utils/logger.js');

var service = {
    get: get,
    post: post,
    put: put,
    delete: deleteItem
};

function get(restRoute, id) {
    var deferred = q.defer();
    try {
        io.read(jsonBasePath + restRoute.dataName + '.json').then(function (data) {
            if (data !== false) {
                data = JSON.parse(data);
                //By ID
                if (id) {
                    for (var i = 0; i < data.length; i++) {
                        if (parseFloat(data[i][restRoute.identity]) === parseFloat(id)) {
                            deferred.resolve(new RestContract.GetById(data[i]));
                            break;
                        }
                        if (i === data.length - 1) {
                            deferred.resolve(new RestContract.GetById(null));
                        }
                    }
                } else {
                    deferred.resolve(new RestContract.Get(data));
                }
            }
        });
    } catch (error) {
        deferred.resolve(new RestContract.Error(error.toString()));
    }
    return deferred.promise;
}

function postBatch(restRoute, items) {
    var deferred = q.defer();
    try {
        var promises = items.map(function (item, index) {
            return post(restRoute.dataName, item, index);
        });
        q.all(promises).then(function (results) {
            var ids = results.map(function (item) {
                return item.id;
            });
            deferred.resolve(new RestContract.Post(ids));
        }, function (err) {
            deferred.resolve(false);
        });
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
            var data = io.readSync(jsonBasePath + restRoute.dataName + '.json');
            data = JSON.parse(data);
            var newId = parseFloat(data[data.length - 1][restRoute.identity]) + 1;
            newItem[restRoute.identity] = newId;
            data.push(newItem);
            io.writeSync(jsonBasePath + restRoute.dataName + '.json', JSON.stringify(data));
            deferred.resolve(new RestContract.PostById(newId));
        } catch (error) {
            deferred.resolve(new RestContract.Error(error.toString()));
        }
        return deferred.promise;
    }
}

function put(restRoute, item) {
    var deferred = q.defer();
    io.read(jsonBasePath + restRoute.dataName + '.json').then(function (data) {
        try {
            if (data !== false) {
                data = JSON.parse(data);
                for (var i = 0; i < data.length; i++) {
                    if (parseFloat(data[i][restRoute.identity]) === parseFloat(item[restRoute.identity])) {
                        data[i] = item;
                        io.write(jsonBasePath + restRoute.dataName + '.json', JSON.stringify(data)).then(function (data) {
                            deferred.resolve(new RestContract.PutById({
                                id: item[restRoute.identity],
                                success: true
                            }));
                        });
                        break;
                    } else if (i === data.length - 1) {
                        throw 'PUT failed. ' + item.id + ' does not exist in ' + restRoute.dataName + '.';
                    }
                }
            }
        } catch (error) {
            deferred.resolve(new RestContract.Error(error.toString()));
        }
    });
    return deferred.promise;
}

function deleteItem(restRoute, id) {
    var deferred = q.defer();
    io.read(jsonBasePath + restRoute.dataName + '.json').then(function (data) {
        try {
            if (data !== false) {
                data = JSON.parse(data);
                for (var i = 0; i < data.length; i++) {
                    if (parseFloat(data[i][restRoute.identity]) === parseFloat(id)) {
                        data.splice(i, 1);
                        io.write(jsonBasePath + restRoute.dataName + '.json', JSON.stringify(data)).then(function (data) {
                            deferred.resolve(new RestContract.DeleteById({
                                id: id,
                                success: true
                            }));
                        });
                        break;
                    } else if (i === data.length - 1) {
                        throw 'DELETE failed. ' + id + ' does not exist in ' + restRoute.dataName + '.';
                    }
                }
            }
        } catch (error) {
            deferred.resolve(new RestContract.Error(error.toString()));
        }
    });

    return deferred.promise;
}

module.exports = service;
