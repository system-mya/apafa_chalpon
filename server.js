'use strict';

let express = require('express'),
multiparty = require('connect-multiparty'),
    bodyParser = require('body-parser'),
    routes = require('./router/api_v1'),
    connection = require('./conexion');

let app = express();
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(multiparty());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public/dist'));

connection.init();
routes.configure(app);
let server = app.listen(4200,() => {
        console.log('Servidor ejecutando en el Puerto: ' + server.address().port);
});