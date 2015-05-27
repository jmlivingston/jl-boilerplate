'use strict';
var router = require('express').Router();
var four0four = require('../../utils/404')();
/* jshint -W079 */
var Firebase = require('firebase');
var config = require('./config')();

var userConfig = {
    usersPath: 'Security/Users',
    get: userGet
};

function activate() {
    router.get('/user/:id', userConfig.get);
    router.get('/*', four0four.notFoundMiddleware);
    module.exports = router;
}
activate();

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
