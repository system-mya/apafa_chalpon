//https://github.com/robertoganiani/mysql-express-angular-node
//https://www.nodehispano.com/2012/01/express-el-framework-web-para-nodejs/
'use strict';
var path = require('path');
let express = require('express'),
multiparty = require('connect-multiparty'),
    bodyParser = require('body-parser'),
    routes = require('./router/api_v1'),
    connection = require('./conexion');

let app = express();
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(multiparty());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname + '/public/dist')));

connection.init();
routes.configure(app);
let server = app.listen(process.env.PORT || 3000,() => {
        console.log('Servidor ejecutando en el Puerto: ' + server.address().port);
});