var main = require('../data/main.js');
var mainConfig = require('../config.js')();

var service = {
    config: config
};

function config(options, next) {
    var basePath = mainConfig.restRouteBaseUrl + '/' + options.restRoute.path;
    options.app.get(basePath, function (req, res, next) {
        main.get(options.restRoute).then(function (data) {
            res.json(data);
        });
    });
    options.app.post(basePath, function (req, res, next) {
        main.post(options.restRoute, req.body).then(function (data) {
            res.json(data);
        });
    });
    options.app.get(basePath + '/:id', function (req, res, next) {
        main.get(options.restRoute, req.params.id).then(function (data) {
            res.json(data);
        });
    });
    options.app.put(basePath + '/:id', function (req, res, next) {
        main.put(options.restRoute, req.body).then(function (data) {
            res.json(data);
        });
    });
    options.app.delete(basePath + '/:id', function (req, res, next) {
        main.delete(options.restRoute, req.params.id).then(function (data) {
            res.json(data);
        });
    });
}

module.exports = service;
