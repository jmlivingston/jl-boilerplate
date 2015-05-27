var main = require('../data/main.js');

var service = {
    config: config
};

function config(options, next) {
    options.app.get(options.path, function (req, res, next) {
        main.get(options).then(function (data) {
            res.json(data);
            next();
        });
    });
    options.app.post(options.path, function (req, res, next) {
        main.post(options, req.body).then(function (data) {
            res.json(data);
            next();
        });
    });

    options.app.get(options.path + '/:id', function (req, res, next) {
        main.get(options, req.params.id).then(function (data) {
            res.json(data);
            next();
        });
    });
    options.app.put(options.path + '/:id', function (req, res, next) {
        main.put(options, req.body).then(function (data) {
            res.json(data);
            next();
        });
    });
    options.app.delete(options.path + '/:id', function (req, res, next) {
        main.delete(options, req.params.id).then(function (data) {
            res.json(data);
            next();
        });
    });
}

module.exports = service;
