//obtenemos el modelo UserModel con toda la funcionalidad
var user = require('../models/model_apafa');
 
//creamos el ruteo de la aplicación
module.exports = {
   configure: (app) => {
        //get users list from USERS table

  app.get('/api/users', (req, res) => {
            user.get(res);
  });


app.post('/api/users', (req, res) => {
    user.consultar(req.body, res);
});

app.post('/api/users/add', (req, res) => {
    user.agregar(req.body, res);
    //console.log(res);
    //console.log("hola");
});

app.post('/api/insertar_usuario', (req, res) => {
    user.nvo_usuario(req.body, res);
});

app.get('/api/listar_usuarios', (req, res) => {
    user.listar_usuarios(res);
});

app.get('/api/listar_perfiles', (req, res) => {
    user.listar_perfiles(res);
});

app.post('/api/detalle_usuario', (req, res) => {
    user.detalle_usuario(req.body, res);
});

app.post('/api/editar_usuario', (req, res) => {
    user.editar_usuario(req.body, res);
});

app.post('/api/nom_usuario', (req, res) => {
    user.nom_usuario(req.body, res);
});

app.post('/api/update_usuario', (req, res) => {
    user.update_usuario(req.body, res);
});

// LLAMADO AL MODELO RESETEAR CLAVE
app.post('/api/resetear_usuario', (req, res) => {
    user.resetear_usuario(req.body, res);
});

// LLAMADO AL MODELO ELIMINAR USUARIO
app.post('/api/eliminar_usuario', (req, res) => {
    user.eliminar_usuario(req.body, res);
});

}
}