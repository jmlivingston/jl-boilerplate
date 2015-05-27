var express = require('express');
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
    app.get('/user/:id', userConfig.get);

    config.restRoutes.forEach(function (route) {
        restRoute.config({
            app: app,
            path: config.restRouteBaseUrl + route.path,
            dataName: route.dataName,
            provider: route.provider
        });
    });

    //app.get('/*', four0four.notFoundMiddleware);
}

function userGet(request, response) {
    var firebase = new Firebase(config.todoFirebaseUrl);
    var userId = request.params.id;

    firebase.child(userConfig.usersPath + '/' + userId).once('value', success, fail);

    console.log('looking for user ' + userId);

    function success(data) {
        console.log('user found!');
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
