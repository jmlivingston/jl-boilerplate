module.exports = function () {
    var Firebase = require('firebase');
    var config = require('../config')();
    var q = require('q');

    var service = {
        getData: getData,
        getImage: getImage
    };
    return service;

    function getData(path, req) {
        var readyPromise = q.defer();

        var firebase = new Firebase(config.todoFirebaseUrl);
        firebase.child('/Settings/SEO/Default').once('value', success, fail);

        function success(data) {
            var seoDefault = {
                Title: ' ',
                Description: '',
                Keywords: '',
                Author: '',
                PageTitle: '',
                Url: '',
                SiteName: '',
                FirebaseUrl: '',
                Image: '',
                ImageDataUri: '',
                ImageDataUriFileName: ''
            };
            var seoData = data.val() || seoDefault;
            seoData.FirebaseUrl = config.todoFirebaseUrl;
            var path = req.originalUrl.split('/')[1];
            path = path && ' | ' + path[0].toUpperCase() + path.slice(1);
            seoData.PageTitle = (seoData.Title + path).split('?')[0];
            seoData.Url =  req.protocol + '://' + req.get('host');
            seoData.Image = seoData.Url + '/seoimage.jpg';
            delete seoData.ImageDataUri;
            delete seoData.ImageDataUriFileName;
            readyPromise.resolve(seoData);
        }

        function fail(err) {
            readyPromise.resolve(null);
        }

        return readyPromise.promise;
    }

    function getImage() {
        var readyPromise = q.defer();

        var firebase = new Firebase(config.todoFirebaseUrl);
        firebase.child('/SEO/Default/ImageDataUri').once('value', success, fail);

        function success(data) {
            var imageDataUri = data.val();
            var imageSplit = imageDataUri.split(',');
            readyPromise.resolve({
                binary: imageSplit[1],
                type: imageSplit[0].split(':')[1].split(';')[0]
            });
        }

        function fail(err) {
            readyPromise.resolve(null);
        }

        return readyPromise.promise;
    }
};
