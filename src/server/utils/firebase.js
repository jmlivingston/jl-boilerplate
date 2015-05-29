var q = require('q');

var service = {
    objToArray: objToArray
};

var items = [];

function objToArray(obj, identity) {
    items = [];
    //TODO: Really hate this, but trying to keep Firebase consistent with other data sources which have an Id in the record
    //Funny thing is this still smokes MongoDB and SQL in initial performance tests
    var deferred = q.defer();
    var promises = Object.keys(obj).map(function (value, index) {
        return getObj(value, obj[value], identity);
    });
    q.all(promises).then(function () {
        deferred.resolve(items);
    }, function (err) {
        deferred.resolve('err');
    });
    return deferred.promise;
}

function getObj(prop, obj, identity) {
    var deferred = q.defer();
    obj[identity] = prop;
    items.push(obj);
    deferred.resolve();
    return deferred.promise;
}

module.exports = service;
