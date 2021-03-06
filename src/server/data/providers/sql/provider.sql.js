var q = require('q');
var tedious = require('tedious');
var Request = tedious.Request;
var Connection = tedious.Connection;
var config = require('../../../config.js')();
var RestContract = require('../../rest.contract.js');
var logger = require('../../../utils/logger.js');

var connectionConfig = {
    userName: config.dataProviders.sql.user,
    password: config.dataProviders.sql.password,
    server: config.dataProviders.sql.server,
    options: {
        database: config.dataProviders.sql.database,
        encrypt: true,
        rowtableNameOnDone: true
    }
};

var service = {
    get: get,
    post: post,
    put: put,
    delete: deleteItem
};

function connect(options) {
    var deferred = q.defer();
    var connection = new Connection(connectionConfig);
    connection.on('connect', function (err) {
        if (err) {
            logger.log(err);
            deferred.resolve(false);
        } else {
            deferred.resolve({
                connection: connection,
                options: options
            });
        }
    });
    return deferred.promise;
}

function executeStatement(connection, sql, options) {
    var data = [];
    var deferred = q.defer();
    var request = new Request(sql, function (err, rowCount) {
        if (err) {
            logger.log(err);
            deferred.resolve(false);
        }
    });
    request.on('row', function (columns) {
        var row = {};
        columns.forEach(function (column) {
            if (column.value === null) {
                logger.log('NULL');
            } else {
                row[column.metadata.colName] = column.value;
            }
        });
        data.push(row);
    });
    request.on('doneProc', function (rowCount, more, rows) {
        deferred.resolve({
            data: data,
            options: options
        });
    });
    connection.execSql(request);
    return deferred.promise;
}

function get(restRoute, id) {
    var deferred = q.defer();
    try {
        var sql = 'select * from ' + restRoute.dataName;
        if (id) {
            sql += ' where ' + restRoute.identity + ' = ' + id;
        }
        connect().then(function (val) {
            executeStatement(val.connection, sql).then(function (val) {
                if (id) {
                    deferred.resolve(new RestContract.GetById(val.data[0]));
                } else {
                    deferred.resolve(new RestContract.Get(val.data));
                }
            });
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
            var columns = Object.keys(newItem);
            var vals = Object.keys(newItem).map(function (key) {
                return '\'' + newItem[key] + '\'';
            });
            var sql = 'insert into ' + restRoute.dataName + ' (' + columns.join(',') + ') ';
            sql += 'values (' + vals.join(',') + '); select @@identity AS \'' + restRoute.identity + '\'';
            connect(index).then(function (connectVal) {
                executeStatement(connectVal.connection, sql, connectVal.options).then(function (execVal) {
                    deferred.resolve(new RestContract.PostById(execVal.data[0][restRoute.identity]));
                });
            });
        } catch (error) {
            deferred.resolve(new RestContract.Error(error.toString()));
        }
        return deferred.promise;
    }
}

//Note: Tedious has a bulkLoad function, but unfortunately it won't return IDs
function postBatch(restRoute, items) {
    var deferred = q.defer();
    var promises = items.map(function (item, index) {
        return service.post(restRoute.dataName, item, index);
    });
    //TODO: Potential race condition bug here. Need to ensure the Ids are returned in the order of the items posted.
    q.all(promises).then(function (results) {
        var ids = results.map(function (item) {
            return item.id;
        });
        deferred.resolve(new RestContract.Post(ids));
    }, function (error) {
        deferred.resolve(new RestContract.Error(error.toString()));
    });
    return deferred.promise;
}

function put(restRoute, item) {
    var deferred = q.defer();
    try {
        var sql = 'update ' + restRoute.dataName + ' set ';
        var set = Object.keys(item).map(function (key) {
            if (key.toLowerCase() !== restRoute.identity) {
                return key + ' = \'' + item[key] + '\', ';
            } else {
                return '';
            }
        }).join('');
        sql += set.substr(0, set.length - 2);
        sql += ' where ' + restRoute.identity + ' = ' + item[restRoute.identity];
        console.log('sql - ' + sql);
        connect().then(function (connectVal) {
            executeStatement(connectVal.connection, sql).then(function () {
                deferred.resolve(new RestContract.PutById({
                    id: item[restRoute.identity],
                    success: true
                }));
            });
        });
    } catch (error) {
        deferred.resolve(new RestContract.Error(error.toString()));
    }
    return deferred.promise;
}

function deleteItem(restRoute, id) {
    var deferred = q.defer();
    try {
        var sql = 'delete ' + restRoute.dataName;
        sql += ' where ' + restRoute.identity + ' = ' + id;
        connect().then(function (connectVal) {
            executeStatement(connectVal.connection, sql).then(function () {
                deferred.resolve(new RestContract.DeleteById({
                    id: id,
                    success: true
                }));
            });
        });
    } catch (error) {
        deferred.resolve(new RestContract.Error(error.toString()));
    }
    return deferred.promise;
}

module.exports = service;
