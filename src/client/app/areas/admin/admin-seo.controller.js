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
            dataservice.getAll('/Settings/SEO/Default')
                .then(function (data) {
                    vm.seoItem = data;
                    vm.initialized = true;
                });
        }

        function save() {
            dataservice.update('/Settings/SEO', 'Default', vm.seoItem, vm.seoItem, vm.seoItem.TabTitle);
        }

        function updateSeoImage() {
            var file = document.getElementById('update-seo-image').files[0];
            var fileReader = new FileReader();
            fileReader.onloadend = function (e) {
                var data = e.target.result;
                vm.seoItem.ImageDataUri = data;
                vm.seoItem.ImageDataUriFileName = file.name;
            };
            fileReader.readAsDataURL(file);
        }
    }
})();
