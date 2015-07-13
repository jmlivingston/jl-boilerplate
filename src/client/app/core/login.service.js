(function () {
    'use strict';
    angular
        .module('app.core')
        .factory('loginService', loginService);
    loginService.$inject = ['FBURL', '$firebaseAuth', 'dataservice', '$q', '$rootScope', '$http', 'logger', '$location'];
    /* @ngInject */
    function loginService(FBURL, $firebaseAuth, dataservice, $q, $rootScope, $http, logger, $location) {
        var auth = $firebaseAuth(dataservice.ref());
        var listeners = [];
        var service = {
            initialized: false,
            auth: auth,
            //user: null,
            userCreate: userCreate,
            userGet: userGet,
            userSet: userSet,
            //userDelete: userDelete,
            userList: userList,
            login: login,
            logout: logout,
            watch: watch,
            rootScope: $rootScope
        };
        activate();
        return service;

        function activate() {
            auth.$onAuth(statusChange);
        }

        function statusChange() {
            service.initialized = true;
            service.rootScope.user = auth.$getAuth() || null;
            if (service.rootScope.user !== null) {
                service.userGet(service.rootScope.user.uid)
                    .then(function (user) {
                        service.rootScope.user = user;
                        angular.forEach(listeners, function (fn) {
                            fn(service.rootScope.user);
                        });
                    })
                    .catch(function (error) {
                        //console.log(error);
                    });
            }
        }

        function login(creds, opts) {
            return auth.$authWithPassword(creds, opts);
        }

        function logout() {
            auth.$unauth();
            service.rootScope.user = null;
            $location.path('/');
        }

        function userGet(id) {
            return $http.get('/api/user/' + id)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                var msg = 'query for user failed. ' + error.data.description;
                logger.error(msg);
                return $q.reject(msg);
            }
        }

        function userCreate(user) {
            //service.rootScope.user = user;
            var ref = new Firebase(FBURL);
            var authObj = $firebaseAuth(ref);
            var deferred = $q.defer();
            authObj.$createUser(user)
                .then(function (userData) {
                    var credentials = {
                        email: user.Email,
                        password: user.Password
                    };
                    var opts = {
                        rememberMe: false //vm.RememberMe
                    };
                    user.id = userData.uid;
                    return service.userSet(user)
                        .then(function (data) {
                            service.login(credentials, opts);
                            deferred.resolve(data);
                            $location.path('/');
                        })
                        .catch(function (error) {
                            deferred.reject(error);
                        });
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function userSet(user) {
            var deferred = $q.defer();
            $http.post('/api/user', user)
                .then(success)
                .catch(fail);

            function success(response) {
                deferred.resolve(response.data);
            }

            function fail(error) {
                var msg = 'query to update user failed ' + error.data.description;
                logger.error(msg);
                deferred.reject(msg);
            }
            return deferred.promise;
        }

        function userList() {
            return $http.get('/api/users/list')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                var msg = 'query for users failed. ' + error.data.description;
                logger.error(msg);
                return $q.reject(msg);
            }
        }

        function watch(cb, $scope) {
            listeners.push(cb);
            auth.$waitForAuth(cb);
            var unbind = function () {
                var i = listeners.indexOf(cb);
                if (i > -1) {
                    listeners.splice(i, 1);
                }
            };
            if ($scope) {
                $scope.$on('$destroy', unbind);
            }
            return unbind;
        }
    }
})();
