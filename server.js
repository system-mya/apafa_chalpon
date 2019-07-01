//https://github.com/robertoganiani/mysql-express-angular-node
//https://www.nodehispano.com/2012/01/express-el-framework-web-para-nodejs/
'use strict';
let express = require('express'),
multiparty = require('connect-multiparty'),
    bodyParser = require('body-parser'),
    routes = require('./router/api_v1'),
    connection = require('./conexion');

let app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(multiparty());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public/dist'));

connection.init();
routes.configure(app);
let server = app.listen(4200, () => {
        console.log('Servidor ejecutando en el Puerto: ' + server.address().port);
});