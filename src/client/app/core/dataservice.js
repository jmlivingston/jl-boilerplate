(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$window', 'FBURL', '$firebaseObject', '$firebaseArray', '$q', '_', 'logger'];
    /* @ngInject */
    function dataservice($window, FBURL, $firebaseObject, $firebaseArray, $q, _, logger) {
        var stringsUrl = '/Settings/Content/English/Strings/';
        var service = {
            //TRY TO USE THIS INSTEAD OF ANGULARFIRE
            get: function (path) {
                var deferred = $q.defer();
                var firebaseRef = new Firebase(FBURL + path);
                firebaseRef.orderByChild('Deleted').equalTo(null).on('value', function (data) {
                    var returnData = data.val();
                    deferred.resolve(returnData);
                });
                return deferred.promise;
            },
            getWithId: function (path) {
                var deferred = $q.defer();
                var firebaseRef = new Firebase(FBURL + path);
                firebaseRef.orderByChild('Deleted').equalTo(null).on('value', function (data) {
                    var returnData = data.val();
                    var returnArray = [];
                    for (var prop in returnData) {
                        if (returnData.hasOwnProperty(prop)) {
                            returnData[prop]['Id'] = prop;
                            returnArray.push(returnData[prop]);
                        }
                    }
                    deferred.resolve(returnArray);
                });
                return deferred.promise;
            },
            getAll: function (path) {
                var deferred = $q.defer();
                var firebaseRef = new Firebase(FBURL + path);
                firebaseRef.on('value', function (data) {
                    var returnData = data.val();
                    deferred.resolve(returnData);
                });
                return deferred.promise;
            },
            add: function (parentPath, item, itemParent, itemType) {
                var deferred = $q.defer();
                var firebaseRef = new Firebase(FBURL + parentPath);
                var newItem = firebaseRef.push(item, function (error) {
                    if (error) {
                        deferred.resolve(false);
                        if (itemType) {
                            logger.info('Error occurred trying to add a new ' + itemType);
                        }
                    } else {
                        var id = newItem.key();
                        if (itemParent) {
                            itemParent[id] = item;
                        }
                        if (itemType) {
                            logger.info(itemType + ' added!');
                        }
                        deferred.resolve(newItem);
                    }
                });
                return deferred.promise;
            },

            update: function (path, child, item, itemParent, itemType, isDelete) {
                var deferred = $q.defer();
                var firebaseRef = new Firebase(FBURL + path);
                var itemJson = JSON.parse(angular.toJson(item));
                var updateItem = firebaseRef.child(child);
                var savingText = 'saving';
                var savedText = 'saved';
                if (isDelete) {
                    savingText = 'deleting';
                    savedText = 'deleted';
                }
                updateItem.update(itemJson, function (error) {
                    if (error) {
                        logger.info('Error occurred ' + savingText + itemType);
                        deferred.resolve(false);
                    } else {
                        if (itemType) {
                            logger.info(itemType + ' ' + savedText + '!');
                        }
                        deferred.resolve(true);
                        if (isDelete) {
                            delete itemParent[child];
                        }
                    }
                });
                return deferred.promise;
            },

            //marks as delete
            delete: function (path, child, item, itemParent, itemType) {
                item.deleted = true;
                service.update(path, child, item, itemParent, itemType, true);
            },

            remove: function (path, child) {
                var deferred = $q.defer();
                var firebaseRef = new Firebase(FBURL + path);
                firebaseRef.child(child).remove(function (error) {
                    if (error) {
                        deferred.resolve(false);
                    } else {
                        deferred.resolve(true);
                    }
                });
                return deferred.promise;
            },

            syncObject: function (path, factoryConfig) { // jshint ignore:line
                return $firebaseObject(syncData.apply(null, arguments));
            },
            syncArray: function (path, factoryConfig) { // jshint ignore:line
                return $firebaseArray(syncData.apply(null, arguments));
            },
            getStrings: getStrings,
            settings: {
                content: {
                    strings: {
                        add: addString,
                        remove: removeString,
                        save: saveString
                    }
                }
            },
            ref: firebaseRef
        };
        return service;
        ////////////////////////////////////////////////////////////////
        function getStrings(page, scope) {
            var promises = [getGlobalStrings(scope)];
            var pages = page.split(',');
            for (var i = 0; i < pages.length; i++) {
                promises.push(getPageStrings(pages[i], scope));
            }
            return $q.all(promises).then(function () {
                return true;
            });
        }

        function getPageStrings(page, scope) {
            var deferred = $q.defer();
            var ref = syncData(stringsUrl + page);
            var firebaseObj = $firebaseObject(ref);
            scope['pageStrings'] = [];
            firebaseObj.$watch(function () {
                if (firebaseObj.Items) {
                    var items = _.object(_.map(firebaseObj.Items, function (x) {
                        return [x.Name, x.Value];
                    }));
                    if (scope['pageStrings']) {
                        scope['pageStrings'] = mergeProperties(scope['pageStrings'], items);
                    } else {
                        scope['pageStrings'] = items;
                    }
                    deferred.resolve(items);
                }
            });
            return deferred.promise;
        }

        function mergeProperties(obj1, obj2) {
            var obj3 = {};
            for (var attrname1 in obj1) {
                if (obj1.hasOwnProperty(attrname1)) {
                    obj3[attrname1] = obj1[attrname1];
                }
            }
            for (var attrname2 in obj2) {
                if (obj2.hasOwnProperty(attrname2)) {
                    obj3[attrname2] = obj2[attrname2];
                }
            }
            return obj3;
        }

        function getGlobalStrings(scope) {
            var deferred = $q.defer();
            var ref = syncData(stringsUrl + 'Globals');
            var firebaseObj = $firebaseObject(ref);
            firebaseObj.$watch(function () {
                if (firebaseObj.Items) {
                    var items = _.object(_.map(firebaseObj.Items, function (x) {
                        return [x.Name, x.Value];
                    }));
                    scope['globalStrings'] = items;
                    deferred.resolve(items);
                }
            });
            return deferred.promise;
        }

        function addString(category, item) {
            var rootPath = stringsUrl + category + '/Items';
            var ref = new $window.Firebase(FBURL + rootPath);
            var list = $firebaseArray(ref);
            list.$add(item);
        }

        function removeString(category, item) {
            var rootPath = stringsUrl + category + '/Items/' + item;
            var ref = new $window.Firebase(FBURL + rootPath);
            var removeItem = $firebaseObject(ref);
            removeItem.$remove();
        }

        function saveString(category, key, item) {
            var rootPath = stringsUrl + category + '/Items/' + key;
            var ref = new $window.Firebase(FBURL + rootPath);
            var obj = $firebaseObject(ref);
            obj.Name = item.Name;
            obj.Value = item.Value;
            obj.$save();
        }

        function pathRef(args) {
            for (var i = 0; i < args.length; i++) {
                if (angular.isArray(args[i])) {
                    args[i] = pathRef(args[i]);
                } else if (typeof args[i] !== 'string') {
                    throw new Error('Argument ' + i + ' to firebaseRef is not a string: ' + args[i]);
                }
            }
            return args.join('/');
        }

        function firebaseRef(path) { // jshint ignore:line
            var ref = new $window.Firebase(FBURL);
            var args = Array.prototype.slice.call(arguments);
            if (args.length) {
                ref = ref.child(pathRef(args));
            }
            return ref;
        }

        function syncData(path, props) {
            var ref = firebaseRef(path);
            props = angular.extend({}, props);
            angular.forEach(['limitToFirst', 'limitToLast', 'orderByKey', 'orderByChild',
                             'orderByPriority', 'startAt', 'endAt'],
                function (k) {
                    if (props.hasOwnProperty(k)) {
                        var v = props[k];
                        ref = ref[k].apply(ref, angular.isArray(v) ? v : [v]);
                        delete props[k];
                    }
                });
            return ref;
        }
    }
})();
