//obtenemos el modelo UserModel con toda la funcionalidad
var admin = require('../models/administracion');
var apafa = require('../models/apafa');
var tesoreria = require('../models/tesoreria');
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

//LISTAR GRADOS ACTIVOS
app.get('/api/listar_grados_activos', (req, res) => {
    admin.listar_grados_activos(res);
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
    apafa.listar_alumnos(res);
});

//INSERTAR NUEVO ALUMNO
app.post('/api/apafa/insertar_alumno', (req, res) => {
    apafa.nvo_alumno(req.body, res);
});


app.post('/api/apafa/detalle_alumno', (req, res) => {
    apafa.obtener_alumno(req.body, res);
});

// LLAMADO AL UPDATE ALUMNO
app.post('/api/apafa/update_alumno', (req, res) => {
    apafa.update_alumno(req.body, res);
});

// LLAMADO AL MODELO ELIMINAR ALUMNO
app.post('/api/apafa/eliminar_alumno', (req, res) => {
    apafa.eliminar_alumno(req.body, res);
});

// LISTAR APODERADOS
app.get('/api/apafa/listar_apoderados', (req, res) => {
    apafa.listar_apoderados(res);
});


//INSERTAR NUEVO APODERADO
app.post('/api/apafa/insertar_apoderado', (req, res) => {
    apafa.nvo_apoderado(req.body, res);
});

//LLAMADO OBTENER DETALLE APODERADO
app.post('/api/apafa/detalle_apoderado', (req, res) => {
    apafa.obtener_apoderado(req.body, res);
});

// LLAMADO AL UPDATE APODERADO
app.post('/api/apafa/update_apoderado', (req, res) => {
    apafa.update_apoderado(req.body, res);
});

// LLAMADO AL MODELO ELIMINAR APODERADO
app.post('/api/apafa/eliminar_apoderado', (req, res) => {
    apafa.eliminar_apoderado(req.body, res);
});

//LLAMADO A LISTAR MATRICULADOS
app.get('/api/apafa/listar_matriculados', (req, res) => {
    apafa.listar_matriculados(res);
});

//LLAMADA A BUSCAR X NUM DOCUMENTO DE IDENTIDAD
app.post('/api/apafa/datos_alumno_apoderado', (req, res) => {
    apafa.obtener_datos_xdoc(req.body, res);
});

//LLAMADA LISTA DE TIPO DE RELACION
app.get('/api/apafa/listar_tipo_relacion', (req, res) => {
    apafa.listar_tipo_relacion(res);
});

//LLAMADA INSERTAR NUEVA MATRICULA
app.post('/api/apafa/insertar_matricula', (req, res) => {
    apafa.nva_matricula(req.body, res);
});

//LLAMADA LISTA DE INGRESOS
app.post('/api/tesoreria/listar_tipo_relacion', (req, res) => {
    tesoreria.listar_ingresos_xperido(req.body,res);
});

//INSERTAR NUEVO INGRESO
app.post('/api/tesoreria/insertar_ingreso', (req, res) => {
    tesoreria.nvo_otro_ingreso(req.body, res);
});

}
}