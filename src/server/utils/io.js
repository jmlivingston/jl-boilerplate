var q = require('q');
var fs = require('fs');
var logger = require('../utils/logger.js');

var service = {
    read: read,
    write: write,
    readSync:  readSync,
    writeSync: writeSync
};

function read(path) {
    var deferred = q.defer();
    fs.readFile(path, 'utf8', function (error, data) {
        if (error) {
            //TODO: Log error
            logger.log('ERROR: ' + error);
            deferred.resolve(false);
        }
        else {
            deferred.resolve(data);
        }
    });
    return deferred.promise;
}

function write(path, text) {
    var deferred = q.defer();
    fs.writeFile(path, text, function (error) {
        if (error) {
            //TODO: Log error
            logger.log('ERROR: ' + error);
            deferred.resolve(false);
        } else {
            deferred.resolve(true);
        }
    });
    return deferred.promise;
}

function readSync(path) {
    return fs.readFileSync(path, 'utf8').toString();
}

function writeSync(path, text) {
    return fs.writeFileSync(path, text);
}

module.exports = service;
