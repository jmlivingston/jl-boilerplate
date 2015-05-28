(function () {
    'use strict';
    angular
        .module('app.apidemo')
        .controller('ApiDemoController', ApiDemoController);
    ApiDemoController.$inject = ['apiService'];
    /* @ngInject */
    function ApiDemoController(apiService) {
        var vm = this;
        vm.dataSources = [{
            title: 'Firebase',
            collectionName: 'issues-firebase'
        }, {
            title: 'JSON',
            collectionName: 'issues-json'
        }, {
            title: 'MongoDB',
            collectionName: 'issues-mongo',
            description: 'This datasource is still being worked on.'
        }, {
            title: 'SQL',
            collectionName: 'issues-sql'
        }];

        vm.get = function (collectionName, id) {
            if (id) {
                apiService.get({
                    collectionName: collectionName,
                    id: id,
                    promiseValue: {
                        collectionName: collectionName
                    }
                }).then(function (data) {
                    vm[data.promiseValue.collectionName + '-get-item'] = data.item;
                });
            } else {
                apiService.get({
                    collectionName: collectionName,
                    promiseValue: {
                        collectionName: collectionName
                    }
                }).then(function (data) {
                    vm[data.promiseValue.collectionName + '-get-items'] = data.items;
                });
            }
        };

        vm.post = function (collectionName, postItem) {

        };

        vm.put = function (collectionName, id, putItem) {

        };

        vm.delete = function (collectionName, id) {
            apiService.delete({
                collectionName: collectionName,
                id: id,
                promiseValue: {
                    collectionName: collectionName
                }
            }).then(function (data) {
                var collectionName = data.promiseValue.collectionName;
                vm[collectionName + '-get-items'] = vm[collectionName + '-get-items'].filter(function(val) {
                    return val.Id !== id;
                });
                delete data.promiseValue;
                vm[collectionName + 'deleteId'] = '';
                vm[collectionName + 'getId'] = '';
                vm[collectionName + 'putId'] = '';
                vm[collectionName + '-delete-item'] = data;
            });
        };

        function activate() {
            for (var x = 0; x < vm.dataSources.length; x++) {
                apiService.get({
                    collectionName: vm.dataSources[x].collectionName,
                    promiseValue: {
                        collectionName: vm.dataSources[x].collectionName
                    }
                }).then(function (data) {
                    vm[data.promiseValue.collectionName + '-get-items'] = data.items;
                });
            }
        }

        activate();
    }
})();
