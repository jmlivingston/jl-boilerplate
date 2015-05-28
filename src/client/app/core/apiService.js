(function () {
    'use strict';
    angular
        .module('app.core')
        .factory('apiService', apiService);
    apiService.$inject = ['$http', '$resource', 'logger', '$q'];
    /* @ngInject */
    function apiService($http, $resource, logger, $q) {
        var service = {
            get: get,
            post: post,
            put: put,
            delete: deleteItem
        };
        return service;

        function get(options) {
            var deferred = $q.defer();
            if (options.id) {
                var getApiById = $resource('/api/' + options.collectionName + '/:id', {
                    id: '@id'
                });
                getApiById.get({
                    id: options.id
                }).$promise.then(function (data) {
                    data.promiseValue = options.promiseValue;
                    deferred.resolve(data);
                });
            } else {
                var getApi = $resource('/api/' + options.collectionName);
                getApi.get().$promise.then(function (data) {
                    data.promiseValue = options.promiseValue;
                    deferred.resolve(data);
                });
            }
            return deferred.promise;
        }

        function post(options) {
            var deferred = $q.defer();
            var resource = $resource('/api/' + options.collectionName + '/:id', {
                id: '@id'
            });
            var getApiById = new resource(options.data);
            getApiById.$save().then(function (data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        }

        function put(options) {
            var deferred = $q.defer();
            var resource = $resource('/api/' + options.collectionName + '/:id', {
                id: '@id'
            });
            var getApiById = new resource(options.data);
            getApiById.$update({
                id: options.id
            }, options.data).then(function (data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        }

        function deleteItem(options) {
            var deferred = $q.defer();
            var deleteApiById = $resource('/api/' + options.collectionName + '/:id', {
                id: '@id'
            });
            deleteApiById.delete({
                id: options.id
            }).$promise.then(function (data) {
                data.promiseValue = options.promiseValue;
                deferred.resolve(data);
            });
            return deferred.promise;
        }
    }
})();
