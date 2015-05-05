(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('AdminSeoController', AdminSeoController);

    AdminSeoController.$inject = ['$scope', '$cookies', 'dataservice'];
    /* @ngInject */
    function AdminSeoController($scope, $cookies, dataservice) {
        var dataChanged = false;
        var dataChangedList = [];
        var vm = this;
        vm.seo = [];
        vm.save = save;
        vm.initialized = false;
        vm.updateSeoImage = updateSeoImage;

        $scope.$on('activeAdminTab4', activate);
        if ($cookies.activeAdminTab === '3') {
            activate();
        }

        function activate() {
            dataservice.getAll('/SEO/default')
                .then(function (data) {
                    vm.seoItem = data;
                    vm.initialized = true;
                });
        }

        function save() {
            dataservice.update('/SEO', 'default', vm.seoItem, vm.seoItem, vm.seoItem.tabTitle);
        }

        function updateSeoImage() {
            var file = document.getElementById('update-seo-image').files[0];
            var fileReader = new FileReader();
            fileReader.onloadend = function (e) {
                var data = e.target.result;
                vm.seoItem.imageDataUri = data;
                vm.seoItem.imageDataUriFileName = file.name;
            };
            fileReader.readAsDataURL(file);
        }
    }
})();
