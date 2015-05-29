(function () {
    'use strict';
    angular
        .module('app.core')
        .factory('apiService', apiService);
    apiService.$inject = ['$http', 'logger', '$q'];
    /* @ngInject */
    function apiService($http, logger, $q) {
        var service = {
            getRestRoutes: getRestRoutes,
            get: get,
            post: post,
            put: put,
            delete: deleteItem
        };
        return service;

        function getRestRoutes() {
            var deferred = $q.defer();
            var req = {
                method: 'GET',
                url: '/api/restroutes'
            };
            $http(req).success(function (data, status) {
                deferred.resolve(data);
            }).error(function (data, status) {
                deferred.reject();
            });
            return deferred.promise;
        }

        function get(options) {
            var deferred = $q.defer();
            var req = {
                method: 'GET',
                url: '/api/' + options.restRoute.path + '/' + (options.id ? options.id : '')
            };
            $http(req).success(function (data, status) {
                data.promiseValue = options.promiseValue;
                deferred.resolve(data);
            }).error(function (data, status) {
                deferred.reject();
            });
            return deferred.promise;
        }

        function post(options) {
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: '/api/' + options.restRoute.path,
                data: options.data
            };
            $http(req).success(function (data, status) {
                data.promiseValue = options.promiseValue;
                deferred.resolve(data);
            }).error(function (data, status) {
                deferred.reject();
            });
            return deferred.promise;
        }

        function put(options) {
            var deferred = $q.defer();
            var req = {
                method: 'PUT',
                url: '/api/' + options.restRoute.path + '/' + (options.id ? options.id : ''),
                data: options.data
            };
            $http(req).success(function (data, status) {
                data.promiseValue = options.promiseValue;
                deferred.resolve(data);
            }).error(function (data, status) {
                deferred.reject();
            });
            return deferred.promise;
        }

        function deleteItem(options) {
            var deferred = $q.defer();
            var req = {
                method: 'DELETE',
                url: '/api/' + options.restRoute.path + '/' + options.id
            };
            $http(req).success(function (data, status) {
                data.promiseValue = options.promiseValue;
                deferred.resolve(data);
            }).error(function (data, status) {
                deferred.reject();
            });
            return deferred.promise;
        }
    }
})();
