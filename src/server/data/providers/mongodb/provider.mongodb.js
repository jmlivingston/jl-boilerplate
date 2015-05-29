//TODO: These queries seem pretty damn slow for MongoDB. Need to see where we can optimize
var q = require('q');
var mongodb = require('mongodb');
var config = require('../../../config.js')();
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
    getCollection(restRoute).then(function (data) {
        try {
            if (data.error) {
                throw data.error;
            } else {
                if (id) {
                    var query = {
                        _id: new mongodb.ObjectID(id)
                    };
                    if (query) {
                        data.collection.findOne(query, function (error, documents) {
                            if (error) {
                                logger.log(error);
                                throw error;
                            } else {
                                deferred.resolve(new RestContract.GetById(documents));
                            }
                        });
                    } else {
                        deferred.resolve(new RestContract.GetById(null));
                    }
                } else {
                    data.collection.find({}).toArray(function (error, documents) {
                        if (error) {
                            throw error;
                        } else {
                            deferred.resolve(new RestContract.Get(documents));
                        }
                    });
                }
            }
        } catch (error) {
            deferred.resolve(new RestContract.Error(error.toString()));
        }
    });
    return deferred.promise;
}

function getCollection(restRoute) {
    var deferred = q.defer();
    var uri = 'mongodb://' + config.dataProviders.mongodb.user + ':' + config.dataProviders.mongodb.password + '@' + config.dataProviders.mongodb.database;
    mongodb.MongoClient.connect(uri, function (error, db) {
        if (error) {
            logger.log('Error connecting to MongoDB ' + error);
            deferred.resolve(new RestContract.Error(error.toString()));
        } else {
            var collection = db.collection(restRoute.dataName);
            deferred.resolve({
                collection: collection
            });
        }
    });
    return deferred.promise;
}

function post(restRoute, newItem) {
    var deferred = q.defer();
    getCollection(restRoute).then(function (data) {
        try {
            if (data.error) {
                throw data.error;
            } else {
                data.collection.insert(newItem, function (error, result) {
                    if (Array.isArray(newItem)) {
                        var ids = newItem.map(function (item) {
                            return item._id;
                        });
                        deferred.resolve(new RestContract.Post(ids));
                    } else {
                        deferred.resolve(new RestContract.PostById(newItem._id.toString()));
                    }
                });
            }
        } catch (error) {
            deferred.resolve(new RestContract.Error(error.toString()));
        }
    });
    return deferred.promise;
}

function put(restRoute, item) {
    var deferred = q.defer();
    getCollection(restRoute).then(function (data) {
        try {
            if (data.error) {
                throw data.error;
            } else {
                var query = {
                    _id: new mongodb.ObjectID(item._id)
                };
                var id = item._id;
                delete item._id;
                data.collection.update(query, {
                    $set: item
                }, function (error, result) {
                    if (error) {
                        throw error;
                    } else {
                        deferred.resolve(new RestContract.PutById({
                            id: id,
                            success: true
                        }));
                    }
                });
            }
        } catch (error) {
            deferred.resolve(new RestContract.Error(error.toString()));
        }
    });
    return deferred.promise;
}

function deleteItem(restRoute, id) {
    var deferred = q.defer();
    getCollection(restRoute).then(function (data) {
        try {
            if (data.error) {
                throw data.error;
            } else {
                var query = id ? {
                    _id: new mongodb.ObjectID(id)
                } : {};
                data.collection.remove(query, function (error, result) {
                    if (error) {
                        throw error;
                    } else {
                        deferred.resolve(new RestContract.DeleteById({
                            id: id,
                            success: true
                        }));
                    }
                });
            }
        } catch (error) {
            deferred.resolve(new RestContract.Error(error.toString()));
        }
    });
    return deferred.promise;
}

module.exports = service;
