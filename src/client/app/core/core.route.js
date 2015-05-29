//TODO: UPDATE TO NEW ANGULAR ROUTER
(function () {
    'use strict';
    angular
        .module('app.core')
        .config(addSecureRoutes)
        .config(configureRoutes)
        .run(appRun);

    var initialized = false;

    configureRoutes.$inject = ['$routeProvider', '$locationProvider'];
    /* @ngInject */
    function configureRoutes($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/areas/home/home.html',
                controller: 'HomeController',
                firebaseKey: 'Home',
                title: 'Home',
                controllerAs: 'vm'
            })
            .when('/issues', {
                templateUrl: 'app/areas/issues/issues.html',
                controller: 'IssuesController',
                firebaseKey: 'Issues',
                title: 'Issues',
                controllerAs: 'vm'
            })
            .whenAuthenticated('/admin', {
                templateUrl: 'app/areas/admin/admin.html',
                controller: 'AdminController',
                firebaseKey: 'Home,Admin',
                title: 'Admin',
                controllerAs: 'vm',
                authRequired: true
            })
            .whenAuthenticated('/apidemo', {
                templateUrl: 'app/areas/apidemo/apidemo.html',
                controller: 'ApiDemoController',
                firebaseKey: 'ApiDemo',
                title: 'API Demo',
                controllerAs: 'vm',
                authRequired: false
            })
            .when('/login', {
                templateUrl: 'app/areas/account/login.html',
                controller: 'LoginController',
                firebaseKey: 'Login',
                title: 'Login',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    }

    addSecureRoutes.$inject = ['$routeProvider', 'SECURED_ROUTES'];
    /* @ngInject */
    function addSecureRoutes($routeProvider, SECURED_ROUTES) {
        $routeProvider.whenAuthenticated = function (path, route) {
            route.resolve = route.resolve || {};
            route.resolve.user = ['authService', function (authService) {
                return authService();
            }];
            $routeProvider.when(path, route);
            SECURED_ROUTES[path] = true;
            return $routeProvider;
        };
    }

    appRun.$inject = ['$route', '$rootScope', '$location', 'loginService', 'SECURED_ROUTES', 'loginRedirectPath', 'dataservice'];
    /* @ngInject */
    function appRun($route, $rootScope, $location, loginService, SECURED_ROUTES, loginRedirectPath, dataservice) {
        $rootScope.$on('$routeChangeStart', function (event, current) {
            dataservice.getStrings(current.firebaseKey, $rootScope);
            $('.navbar-collapse').removeClass('in');
        });

        $rootScope.$on('$routeChangeSuccess', function (event, current) {
            if ($location.$$path === '/') {
                if (!initialized && $location.$$url !== '/?disableSplash=true') {
                    initialized = true;
                } else {
                    $rootScope.disableSplash = true;
                }
            } else {
                $rootScope.disableSplash = true;
            }
        });

        loginService.watch(check, $rootScope);
        $rootScope.$on('$routeChangeError', function (e, next, prev, err) {
            if (err === 'AUTH_REQUIRED') {
                $location.path(loginRedirectPath);
            }
        });

        function check(user) {
            if (!user && authRequired($location.path())) {
                $location.path(loginRedirectPath);
            }
        }

        function authRequired(path) {
            return SECURED_ROUTES.hasOwnProperty(path);
        }
    }
})();
