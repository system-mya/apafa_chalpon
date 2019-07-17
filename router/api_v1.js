//obtenemos el modelo UserModel con toda la funcionalidad
var admin = require('../models/administracion');
var apafa = require('../models/apafa');
var tesoreria = require('../models/tesoreria');
var reportes = require('../models/reportes');
//creamos el ruteo de la aplicación
module.exports = {
   configure: (app) => {
//POST PARA INICIAR SESION
app.post('/api/administracion/iniciar_sesion', (req, res) => {
    admin.iniciar_sesion(req.body, res);
});

//POST PARA INSERTAR NVO USUARIO
app.post('/api/administracion/insertar_usuario', (req, res) => {
    admin.nvo_usuario(req.body, res);
});

//GET PARA LISTAR USUARIOS
app.get('/api/administracion/listar_usuarios', (req, res) => {
    admin.listar_usuarios(res);
});

app.get('/api/administracion/listar_perfiles', (req, res) => {
    admin.listar_perfiles(res);
});

app.post('/api/administracion/obtener_usuario', (req, res) => {
    admin.obtener_usuario(req.body, res);
});

app.post('/api/administracion/nom_usuario', (req, res) => {
    admin.nom_usuario(req.body, res);
});

app.post('/api/administracion/update_usuario', (req, res) => {
    admin.update_usuario(req.body, res);
});

// LLAMADO AL MODELO RESETEAR CLAVE
app.post('/api/administracion/resetear_usuario', (req, res) => {
    admin.resetear_usuario(req.body, res);
});

// LLAMADO AL MODELO ELIMINAR USUARIO
app.post('/api/administracion/eliminar_usuario', (req, res) => {
    admin.eliminar_usuario(req.body, res);
});

//LLAMADA UPDATE CLAVE
app.post('/api/administracion/update_clave', (req, res) => {
    admin.update_clave(req.body, res);
});

// LLAMADO AL MODELO INSERTAR AÑO
app.post('/api/administracion/insertar_anhio', (req, res) => {
    admin.nvo_anhio(req.body, res);
});

// LLAMADO AL MODELO LISTAR AÑO
app.get('/api/administracion/listar_anhio', (req, res) => {
    admin.listar_anhio(res);
});

// LLAMADO AL MODELO UPDATE ANHIO X CRITERIO
app.post('/api/administracion/update_anhio_xcriterio', (req, res) => {
    admin.update_anhio_xcriterio(req.body, res);
});

app.get('/api/administracion/listar_grados', (req, res) => {
    admin.listar_grados(res);
});

//LISTAR GRADOS ACTIVOS
app.get('/api/administracion/listar_grados_activos', (req, res) => {
    admin.listar_grados_activos(res);
});

// CAMBIAR EL ESTADO DE GRADO
app.post('/api/administracion/cambiar_estado_grado', (req, res) => {
    admin.cambiar_estado_grado(req.body, res);
});

// LISTAR SECCIONES POR GRADO
app.post('/api/administracion/listar_secciones_xgrados', (req, res) => {
    admin.listar_secciones_xgrados(req.body, res);
});

// LLAMADO AL MODELO INSERTAR SECCION
app.post('/api/administracion/insertar_seccion', (req, res) => {
    admin.nva_seccion(req.body, res);
});

// LLAMADO AL MODELO ELIMINAR SECCION
app.post('/api/administracion/eliminar_seccion', (req, res) => {
    admin.eliminar_seccion(req.body, res);
});

//LISTAR LIBROS ACTIVOS
app.get('/api/administracion/listar_libros_activos', (req, res) => {
    admin.listar_libros_activos(res);
});

//LLAMADA INSERTAR NUEVO LIBRO 
app.post('/api/administracion/insertar_libro', (req, res) => {
    admin.nvo_libro(req.body,res);
})

// LLAMADO AL MODELO ELIMINAR LIBRO
app.post('/api/administracion/eliminar_libro', (req, res) => {
    admin.eliminar_libro(req.body, res);
});

//LLAMADA UPDATE LIBRO 
app.post('/api/administracion/update_libro', (req, res) => {
    admin.update_libro(req.body,res);
})

// LISTAR ALUMNOS
app.get('/api/apafa/listaralumnos', (req, res) => {
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

//LLAMADA LISTA MATRICULADOS X GRADO
app.post('/api/apafa/listar_matriculados_xgrado', (req, res) => {
    apafa.listar_matriculados_xgrado(req.body,res);
});

//LLAMADA LISTA DE INGRESOS
app.post('/api/apafa/listar_historial_matricula', (req, res) => {
    apafa.listar_historial_matricula(req.body,res);
});

//LLAMADA LISTAR LIBROS X GRADO
app.post('/api/apafa/listar_libros_xgrado', (req, res) => {
    apafa.listar_libros_xgrado(req.body,res);
});

//LLAMADA LISTAR LIBROS X MATRICULA
app.post('/api/apafa/listar_libros_xmatricula', (req, res) => {
    apafa.listar_libros_xmatricula(req.body,res);
});

//LLAMADA ENTREGAR LIBRO A ALUMNO 
app.post('/api/apafa/insertar_libro_matricula', (req, res) => {
    apafa.insertar_libro_matricula(req.body,res);
});

// LLAMADO QUITAR LIBRO ALUMNO
app.post('/api/apafa/quitar_libro_alumno', (req, res) => {
    apafa.quitar_entrega_libro(req.body, res);
});

// LLAMADO DEVOLUCION DE LIBRO
app.post('/api/apafa/registrar_devolucion_libro', (req, res) => {
    apafa.registrar_devolucion_libro(req.body, res);
});


//LLAMADA LISTA DE INGRESOS
app.post('/api/tesoreria/listar_ingresos_xperiodo', (req, res) => {
    tesoreria.listar_ingresos_xperiodo(req.body,res);
});

//INSERTAR NUEVO INGRESO
app.post('/api/tesoreria/insertar_ingreso', (req, res) => {
    tesoreria.nvo_otro_ingreso(req.body, res);
});

//LLAMADA LISTA DE INGRESOS
app.post('/api/tesoreria/listar_detalle_deuda', (req, res) => {
    tesoreria.listar_detalle_deuda(req.body,res);
});

//INSERTAR NUEVO RECIBO
app.post('/api/tesoreria/insertar_nvo_recibo', (req, res) => {
    tesoreria.nvo_recibo(req.body, res);
});

//OBTENER DETALLE RECIBO
app.post('/api/tesoreria/obtener_detalle_recibo', (req, res) => {
    tesoreria.obtener_detalle_recibo(req.body, res);
});

//OBTENER DETALLE MOVIMIENTO
app.post('/api/tesoreria/obtener_detalle_movimiento', (req, res) => {
    tesoreria.obtener_detalle_movimiento(req.body, res);
});


//INSERTAR NUEVA COMPRA
app.post('/api/tesoreria/insertar_nueva_compra', (req, res) => {
    tesoreria.nva_compra(req.body, res);
});

//LLAMADA LISTA DE COMPRAS X PERIODO
app.post('/api/tesoreria/listar_compras_xperiodo', (req, res) => {
    tesoreria.listar_compras_xperiodo(req.body,res);
});

//LLAMADA LISTA DE DETALLE X COMPRA
app.post('/api/tesoreria/listar_detalle_compra', (req, res) => {
    tesoreria.listar_detalle_compra(req.body,res);
});

//LLAMADA LISTA DE REUNIONES X PERIODO
app.post('/api/tesoreria/listar_reuniones_xperiodo', (req, res) => {
    tesoreria.listar_reuniones_xperiodo(req.body,res);
});

//LLAMADA LISTA DE OTROS CONCEPTOS X PERIODO
app.post('/api/tesoreria/listar_otros_conceptos', (req, res) => {
    tesoreria.listar_otros_conceptos(req.body,res);
});

//LLAMADA LISTA DE CONCEPTOS X PERIODO
app.post('/api/tesoreria/listar_todos_conceptos', (req, res) => {
    tesoreria.listar_todos_conceptos(req.body,res);
});

//LLAMADA INSERTAR NUEVO CONCEPTO
app.post('/api/tesoreria/insertar_nvo_concepto', (req, res) => {
    tesoreria.nvo_concepto(req.body,res);
});

//LLAMADA UPDATE CONCEPTO
app.post('/api/tesoreria/update_concepto', (req, res) => {
    tesoreria.update_concepto(req.body,res);
});

// LLAMADO AL MODELO ELIMINAR CONCEPTO
app.post('/api/tesoreria/eliminar_concepto', (req, res) => {
    tesoreria.eliminar_concepto(req.body, res);
});

//LLAMADA LISTA DE OTROS CONCEPTOS X PERIODO
app.post('/api/tesoreria/insertar_nva_reunion', (req, res) => {
    tesoreria.nva_reunion(req.body,res);
});

//LLAMADA GENERAR LISTA DE FIRMAS PADRES
app.post('/api/tesoreria/generar_lista_firmas', (req, res) => {
    tesoreria.generar_lista_firmas_apoderados(req.body,res);
});

//LLAMADA LISTAR APODERADOS REUNION
app.post('/api/tesoreria/listar_apoderados_reunion', (req, res) => {
    tesoreria.listar_apoderados_reunion(req.body,res);
});

//LLAMADA REGISTRAR ASISTENCIA REUNION
app.post('/api/tesoreria/registrar_asistencia_reunion', (req, res) => {
    tesoreria.registrar_asistencia_reunion(req.body,res);
});

//LLAMADA LISTAR APODERADOS X AÑO
app.post('/api/reportes/listar_apoderados_xanhio', (req, res) => {
    reportes.listar_apoderados_xanhio(req.body,res);
});

//LLAMADA LISTAR ALUMNOS X APODERADO
app.post('/api/reportes/listar_alumnos_xapoderado', (req, res) => {
    reportes.listar_alumnos_xapoderado(req.body,res);
});

//LLAMADA LISTAR GRADOS X MATRICULA
app.post('/api/reportes/listar_grados_xmatricula', (req, res) => {
    reportes.listar_grados_xmatricula(req.body,res);
});

//LLAMADA LISTAR MATRICULADOS X ANHIO
app.post('/api/reportes/pa_listar_matriculados_xanhio', (req, res) => {
    reportes.pa_listar_matriculados_xanhio(req.body,res);
});

}

}