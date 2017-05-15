process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var rootPath = process.cwd();
var bodyParser = require('body-parser');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var prerender = require('prerender-node');

var app = express();
var port = process.env.PORT || 8080;

app.use(express({}));
app.use(prerender);
app.use(compression());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
    res.header("X-powered-by", "Photohost");
    next();
});

app.use(function (req, res, next) {
    req.headers['if-none-match'] = 'no-match-for-this';
    next();
});

app.disable('etag');

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(rootPath + '/build', {maxAge: 1}));
    app.use(favicon(rootPath + '/build/favicon.ico'));
} else if (process.env.NODE_ENV === 'development') {
    app.use(express.static(rootPath + '/src', {maxAge: 1}));
    app.use(favicon(rootPath + '/src/favicon.ico'));
}

/**
 * Redirect for Old Site Images,
 * if last image from Old Site will be deleted,
 * this code also will be removed.
 */
app.get(['/img/*', '/square/*', '/thumbs/*'], function (req, res) {
    var serverUrl = (process.env.NODE_ENV === 'production') ? 'http://i.fpicture.ru' : 'http://i.testfpic.ru';
    res.redirect(serverUrl + req.url)
});

app.get('/*', function (req, res) {
    if (process.env.NODE_ENV === 'production') {
        res.sendFile(rootPath + '/build/app/index.html');
    } else if (process.env.NODE_ENV === 'development') {
        res.sendFile(rootPath + '/src/app/index.html');
    }
});

app.listen(port, function () {
    console.info('Listening on port ' + port);
});