var q = require('q');

var service = {
    objToArray: objToArray
};

var items = [];

function objToArray(obj) {
    items = [];
    //TODO: Really hate this, but trying to keep Firebase consistent with other data sources which have an Id in the record
    var deferred = q.defer();
    var promises = Object.keys(obj).map(function (value, index) {
        return getObj(value, obj[value]);
    });
    q.all(promises).then(function () {
        deferred.resolve(items);
    }, function (err) {
        deferred.resolve('err');
    });
    return deferred.promise;
}

function getObj(prop, obj) {
    var deferred = q.defer();
    obj.Id = prop;
    items.push(obj);
    deferred.resolve();
    return deferred.promise;
}

module.exports = service;
