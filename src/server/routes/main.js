var express = require('express');
/* jshint -W079 */
var Firebase = require('firebase');
var router = express.Router();
var four0four = require('../utils/404.js')();
var restRoute = require('./rest.route.js');
var config = require('../config.js')();
var logger = require('../utils/logger.js');
var service = {
    init: init
};

var userConfig = {
    usersPath: 'Security/Users',
    get: userGet
};

function init(app) {
    router.use(function (req, res, next) {
        next();
    });

    //REST API DEFINITION
    router.get('/', function (req, res) {
        res.sendfile(__dirname + '/api-definition.html');
    });

    //REST API
    app.use(config.restRouteBaseUrl, router);

    //USER INFO
    app.get('/api/user/:id', userConfig.get);

    app.get('/api/restroutes', function (req, res) {
        res.json(config.restRoutes);
    });

    Object.keys(config.restRoutes).forEach(function (key) {
        if (config.restRoutes[key].enabled) {
            restRoute.config({
                app: app,
                restRoute: config.restRoutes[key]
            });
        }
    });
    //app.get('/*', four0four.notFoundMiddleware);
}

function userGet(request, response) {
    var firebase = new Firebase(config.todoFirebaseUrl);
    var userId = request.params.id;

    firebase.child(userConfig.usersPath + '/' + userId).once('value', success, fail);

    function success(data) {
        if (data.val() !== null) {
            var user = data.val();
            response.status(200).send(user);
        } else {
            response.status(400).send({
                description: 'user ' + userId + ' not found.'
            });
        }
    }

    function fail(err) {
        response.status(400).send({
            description: 'user ' + userId + ' not found.'
        });
    }
}

module.exports = service;
