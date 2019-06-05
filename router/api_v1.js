//obtenemos el modelo UserModel con toda la funcionalidad
var admin = require('../models/administracion');
var alumno = require('../models/apafa');
//creamos el ruteo de la aplicación
module.exports = {
   configure: (app) => {
        //get users list from USERS table

  app.get('/api/users', (req, res) => {
    admin.get(res);
  });

app.post('/api/users', (req, res) => {
    admin.consultar(req.body, res);
});

app.post('/api/users/add', (req, res) => {
    admin.agregar(req.body, res);
    //console.log(res);
    //console.log("hola");
});

app.post('/api/insertar_usuario', (req, res) => {
    admin.nvo_usuario(req.body, res);
});

app.get('/api/listar_usuarios', (req, res) => {
    admin.listar_usuarios(res);
});

app.get('/api/listar_perfiles', (req, res) => {
    admin.listar_perfiles(res);
});

app.post('/api/detalle_usuario', (req, res) => {
    admin.detalle_usuario(req.body, res);
});

app.post('/api/editar_usuario', (req, res) => {
    admin.editar_usuario(req.body, res);
});

app.post('/api/nom_usuario', (req, res) => {
    admin.nom_usuario(req.body, res);
});

app.post('/api/update_usuario', (req, res) => {
    admin.update_usuario(req.body, res);
});

// LLAMADO AL MODELO RESETEAR CLAVE
app.post('/api/resetear_usuario', (req, res) => {
    admin.resetear_usuario(req.body, res);
});

// LLAMADO AL MODELO ELIMINAR USUARIO
app.post('/api/eliminar_usuario', (req, res) => {
    admin.eliminar_usuario(req.body, res);
});

// LLAMADO AL MODELO INSERTAR AÑO
app.post('/api/insertar_anhio', (req, res) => {
    admin.nvo_anhio(req.body, res);
});

// LLAMADO AL MODELO LISTAR AÑO
app.get('/api/listar_anhio', (req, res) => {
    admin.listar_anhio(res);
});

// LLAMADO AL MODELO ELIMINAR AÑO
app.post('/api/eliminar_anhio', (req, res) => {
    admin.eliminar_anhio(req.body, res);
});

app.get('/api/listar_grados', (req, res) => {
    admin.listar_grados(res);
});

// CAMBIAR EL ESTADO DE GRADO
app.post('/api/cambiar_estado_grado', (req, res) => {
    admin.cambiar_estado_grado(req.body, res);
});

// LISTAR SECCIONES POR GRADO
app.post('/api/listar_secciones_xgrados', (req, res) => {
    admin.listar_secciones_xgrados(req.body, res);
});

// LLAMADO AL MODELO INSERTAR SECCION
app.post('/api/insertar_seccion', (req, res) => {
    admin.nva_seccion(req.body, res);
});

// LISTAR ALUMNOS
app.get('/api/listaralumnos', (req, res) => {
    alumno.listar_alumnos(res);
});

//INSERTAR NUEVO ALUMNO
app.post('/api/apafa/insertar_alumno', (req, res) => {
    alumno.nvo_alumno(req.body, res);
});

// LLAMADO AL UPDATE ALUMNO
app.post('/api/apafa/update_alumno', (req, res) => {
    alumno.update_alumno(req.body, res);
});

// LLAMADO AL MODELO ELIMINAR ALUMNO
app.post('/api/apafa/eliminar_alumno', (req, res) => {
    alumno.eliminar_alumno(req.body, res);
});

//INSERTAR NUEVO APODERADO
app.post('/api/apafa/insertar_apoderado', (req, res) => {
    alumno.nvo_apoderado(req.body, res);
});

// LLAMADO AL UPDATE APODERADO
app.post('/api/apafa/update_alumno', (req, res) => {
    alumno.update_apoderado(req.body, res);
});

// LLAMADO AL MODELO ELIMINAR APODERADO
app.post('/api/apafa/eliminar_alumno', (req, res) => {
    alumno.eliminar_apoderado(req.body, res);
});

}
}