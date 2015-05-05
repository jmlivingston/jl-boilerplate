(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('AdminPageSettingsController', AdminPageSettingsController);

    AdminPageSettingsController.$inject = ['$scope', '$cookies', 'dataservice', 'logger', '$interval'];
    /* @ngInject */
    function AdminPageSettingsController($scope, $cookies, dataservice, logger, $interval) {
        var dataChanged = false;
        var dataChangedList = [];
        var vm = this;
        vm.pageSettings = [];
        vm.addString = addString;
        vm.deleteString = deleteString;
        vm.saveString = saveString;
        vm.initialized = false;
        vm.feature = {
            order: null,
            text: ''
        };
        vm.pageString = {
            name: '',
            value: ''
        };
        vm.deleteItem = deleteItem;

        $scope.$on('activeAdminTab1', activate);
        if ($cookies.activeAdminTab === '1') {
            activate();
        }

        function activate() {
            if (!vm.initialized) {
                vm.pageSettings = dataservice.syncObject('Settings/Content/English/Strings');
                vm.pageSettings.$watch(function (data) {
                    if (vm.initialized) {
                        dataChanged = true;
                        var saveText = 'Admin Settings Saved!';
                        if (dataChangedList.indexOf(saveText) === -1) {
                            dataChangedList.push(saveText);
                        }
                    }
                    vm.initialized = true;
                });
                $interval(function () {
                    if (dataChanged) {
                        logger.info(dataChangedList.join('<br />'));
                    }
                    dataChangedList = [];
                    dataChanged = false;
                }, 5000);
            }
        }

        function addString(category) {
            var item = {
                name: vm.pageString.name,
                value: vm.pageString.value
            };
            var addCategory = category;
            if (!category) {
                addCategory = vm.pageString.category;
            }
            dataservice.settings.content.strings.add(addCategory, item);
            vm.pageString.name = '';
            vm.pageString.value = '';
        }

        function deleteString(category, key) {
            dataservice.settings.content.strings.remove(category, key);
        }

        function saveString(category, key, item) {
            dataservice.settings.content.strings.save(category, key, item);
            logger.info('Page Settings Saved');
        }

        function deleteItem(hashKey, sourceArray) {
            angular.forEach(sourceArray, function (obj, index) {
                if (obj.$$hashKey === hashKey) {
                    sourceArray.splice(index, 1);
                    return;
                }
            });
        }
    }
})();
