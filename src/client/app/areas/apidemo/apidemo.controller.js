(function () {
    'use strict';
    angular
        .module('app.apidemo')
        .controller('ApiDemoController', ApiDemoController);
    ApiDemoController.$inject = ['apiService'];
    /* @ngInject */
    function ApiDemoController(apiService) {
        var vm = this;

        vm.get = function (restRoute, id) {
            var that = this;
            if (id) {
                apiService.get({
                    restRoute: restRoute,
                    id: id,
                    promiseValue: {
                        restRoute: restRoute
                    }
                }).then(function (data) {
                    vm[data.promiseValue.restRoute.path + '-get-item'] = data.item;
                });
            } else {
                apiService.get({
                    restRoute: restRoute,
                    promiseValue: {
                        restRoute: restRoute
                    }
                }).then(function (data) {
                    vm[data.promiseValue.restRoute.path + '-get-items'] = data.items;
                });
            }
        };

        vm.post = function (restRoute, postItem) {
            apiService.post({
                restRoute: restRoute,
                data: postItem
            }).then(function (data) {
                vm[restRoute.path + '-post-item'] = data;
                activate();
            });
        };

        vm.put = function (restRoute, item) {
            apiService.put({
                restRoute: restRoute,
                id: item[restRoute.identity],
                data: item
            }).then(function (data) {
                vm[restRoute.path + '-put-item'] = data;
                vm[restRoute.path + 'putItem'] = {};
                activate();
            });
        };

        vm.delete = function (restRoute, id) {
            apiService.delete({
                restRoute: restRoute,
                id: id,
                promiseValue: {
                    restRoute: restRoute
                }
            }).then(function (data) {
                var path = data.promiseValue.restRoute.path;
                vm[path + '-get-items'] = vm[path + '-get-items'].filter(function (val) {
                    return val[restRoute.identity] !== id;
                });
                delete data.promiseValue;
                vm[path + 'deleteId'] = '';
                vm[path + 'getId'] = '';
                vm[path + 'putItem'] = {};
                vm[path + 'postItem'] = {};
                vm[path + '-delete-item'] = data;
            });
        };

        vm.testAll = function (restRoute) {
            var startTime = (new Date()).getTime();
            var getItem = {};
            vm[restRoute.path + 'testAll'] = '';
            apiService.get({
                restRoute: restRoute
            }).then(function (data) {
                if (data.error) {
                    vm[restRoute.path + 'testAll'] += 'GET - Error\r\n';
                } else {
                    vm[restRoute.path + 'testAll'] += 'GET (id:' + (data.items.length).toString() + ' items)\r\n';
                    apiService.get({
                        id: data.items[data.items.length - 1][restRoute.identity],
                        restRoute: restRoute
                    }).then(function (data) {
                        getItem = data.item;
                        if (data.error) {
                            vm[restRoute.path + 'testAll'] += 'GET (By ID) - Error\r\n';
                        } else {
                            vm[restRoute.path + 'testAll'] += 'GET (id:' + getItem[restRoute.identity] + ')\r\n';
                            apiService.post({
                                data: getDummyName(),
                                restRoute: restRoute
                            }).then(function (data) {
                                if (data.error) {
                                    vm[restRoute.path + 'testAll'] += 'POST - Error\r\n';
                                } else {
                                    vm[restRoute.path + 'testAll'] += 'POST (id:' + data.id + ')\r\n';
                                    apiService.put({
                                        data: getItem,
                                        id: data.id,
                                        restRoute: restRoute
                                    }).then(function (data) {
                                        if (data.error) {
                                            vm[restRoute.path + 'testAll'] += 'PUT - Error\r\n';
                                        } else {
                                            vm[restRoute.path + 'testAll'] += 'PUT (id:' + data.id + ')\r\n';
                                            apiService.delete({
                                                id: data.id,
                                                restRoute: restRoute
                                            }).then(function (data) {
                                                vm[restRoute.path + 'testAll'] += 'DELETE (id:' + data.id + ')\r\n';
                                                vm[restRoute.path + 'testAll'] += 'Time: ' + ((new Date()).getTime() - startTime).toString() + ' milliseconds';
                                                activate();
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        };

        function activate() {
            apiService.getRestRoutes().then(function (data) {
                vm.restRoutes = data;
                Object.keys(vm.restRoutes).forEach(function (key) {
                    apiService.get({
                        restRoute: vm.restRoutes[key],
                        promiseValue: {
                            restRoute: vm.restRoutes[key]
                        }
                    }).then(function (data) {
                        vm[data.promiseValue.restRoute.path + '-get-items'] = data.items;
                        vm[data.promiseValue.restRoute.path + 'postItem'] = getDummyName();
                        vm[data.promiseValue.restRoute.path + 'putItem'] = {};
                    });
                });
            });
        }

        function getDummyName() {
            var date = new Date();
            var milliseconds = date.getMilliseconds();
            return {
                FirstName: 'FirstTest' + milliseconds,
                LastName: 'LastTest' + milliseconds
            };
        }

        activate();
    }
})();
