// var express = require('express');
// var bodyParser = require('body-parser');
// var app = express();
// var morgan = require('morgan');
// var routes = require('./routes/main');
// var config = require('./config.js')();
// var logger = require('./utils/logger.js');

// app.use(morgan('dev'));
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(bodyParser.json());

// var port = process.env.PORT || config.port;

// routes.init(app);

// app.listen(port);

// logger.log('Listening on port ' + port);

/*jshint node:true*/

'use strict';
var express = require('express');
var routes = require('./routes/main');

var app = express();
//var config = require('./config')();
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var port = process.env.PORT || 8001;
var four0four = require('./utils/404')();
var seo = require(__dirname + '/utils/seo.js')(__dirname);
var environment = process.env.NODE_ENV;
var layoutPath = 'layout.jade';

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//app.use(logger('dev')); //Comment out to limit logging. Can be pretty verbose

//OLD app.use('/api', require('./routes'));
routes.init(app);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

app.get('/', function (req, res) {
    seo.getData('Default', req).then(function (seoData) {
        res.render('index', {
            layoutPath: layoutPath,
            seo: seoData
        });
    });
});

app.get('/seoimage.jpg', function (req, res) {
    seo.getImage().then(function (imageData) {
        var img = new Buffer(imageData.binary, 'base64');
        res.writeHead(200, {
            'Content-Type': imageData.type,
            'Content-Length': img.length
        });
        res.end(img);
    });
});

switch (environment) {
case 'production':
    console.log('** PRODUCTION **');
    app.use(express.static('./client/'));
    app.use('/app/*', function (req, res, next) {
        four0four.send404(req, res);
    });
    break;
case 'qa':
    console.log('** QA **');
    app.use(express.static('./client/'));
    app.use('/bower_components', express.static('./bower_components/'));
    app.use('/.tmp/', express.static('./.tmp/'));
    app.use('/src/client/', express.static('./client/'));
    app.use('/app/*', function (req, res, next) {
        four0four.send404(req, res);
    });
    break;
case 'build':
    console.log('** BUILD **');
    app.use(express.static('./build/'));
    app.use('/app/*', function (req, res, next) {
        four0four.send404(req, res);
    });
    break;
default:
    console.log('** DEV **');
    app.use(express.static('./src/client/'));
    app.use(express.static('./'));
    app.use(express.static('./tmp'));
    app.use('/app/*', function (req, res, next) {
        four0four.send404(req, res);
    });
    break;
}

app.use('/*', function (req, res) {
    seo.getData('Default', req).then(function (seoData) {
        res.render('index', {
            layoutPath: layoutPath,
            seo: seoData
        });
    });
});

app.listen(port, function () {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd());
});
