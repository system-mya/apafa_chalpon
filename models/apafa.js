connection = require('../conexion');

class Apafa {
    listar_alumnos(res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{
            con.query("CALL pa_listar_alumnos()", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA ALUMNOS'});
                    } else {
                        res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                    }
                }
               
            });
        }
        });
    };

    nvo_alumno(alumno, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{

            if ([alumno.telefono_alumno]==''){
                var telefono_alumno="NULL";
            }else{
                telefono_alumno="'"+[alumno.telefono_alumno]+"'";
            }
    
            if ([alumno.correo_alumno]==''){
                var correo_alumno="NULL";
            }else{
                correo_alumno="'"+[alumno.correo_alumno]+"'";
            }

            if (([alumno.procedencia_alumno]).toLocaleString().trimLeft()==''){
                var procedencia_alumno="NULL";
            }else{
                procedencia_alumno="'"+[alumno.procedencia_alumno]+"'";
            }

            if ([alumno.celular_padre]==''){
                var celular_padre="NULL";
            }else{
                celular_padre="'"+[alumno.celular_padre]+"'";
            }

            if ([alumno.correo_padre]==''){
                var correo_padre="NULL";
            }else{
                correo_padre="'"+[alumno.correo_padre]+"'";
            }

            if ([alumno.celular_madre]==''){
                var celular_madre="NULL";
            }else{
                celular_madre="'"+[alumno.celular_madre]+"'";
            }

            if ([alumno.correo_madre]==''){
                var correo_madre="NULL";
            }else{
                correo_madre="'"+[alumno.correo_madre]+"'";
            }
    
            var query_doc = "CALL pa_buscar_doc_alumno('"+ [alumno.doc_alumno] +"')";
            
            con.query(query_doc,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                }else{
                    if (result[0].length == 0) {
                        var query = "CALL pa_insertar_alumno('"+ [alumno.tdoc_alumno] +"','"+ [alumno.doc_alumno] 
                        +"','"+ [alumno.apellidos_alumno] + "','"+ [alumno.nombres_alumno] +"','" + [alumno.fnac_alumno]
                        + "','"+ [alumno.sexo_alumno] + "',"+ telefono_alumno + ",'"+ [alumno.celular_alumno]
                        + "','"+ [alumno.direccion_alumno] + "',"+ correo_alumno + "," + procedencia_alumno 
                        + ",'"+ [alumno.apellidos_padre] +"','"+ [alumno.nombres_padre] + "'," + celular_padre 
                        + "," + correo_padre + ",'" + [alumno.apellidos_madre] + "','" + [alumno.nombres_madre]
                        + "'," + celular_madre + "," + correo_madre + ")";
                        
                        con.query(query,(err, result) => {
                            if(err){
                                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                            }else{
                                if (result.affectedRows == 1) {
                                    res.send({status: 1, message: 'Alumno Registrado'});
                                } else {
                                    res.send({status: 2, message: 'Alumno No Registrado'});
                                }
                            }
                        });
                    } else {
                        res.send({status: 3, message: 'NUM. DOC. DEL ALUMNO YA REGISTRADO'});
                    }
                }
            });
    
            
            }
        });
    };

    obtener_alumno(alumno, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{
            var query = "CALL pa_detalle_alumno("+ [alumno.idbusqueda] +")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'Alumno No Existe'});
                    } else {
                        res.send({status: 1, message: 'Datos Alumno',data:result[0]});
                    }
                }
            });
            }
        });
    };

update_alumno(alumno, res) {
    connection.acquire((err, con) => {
        if(err){
            res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
        }else{            
                if ([alumno.telefono_alumno]==''){
                    var telefono_alumno="NULL";
                }else{
                    telefono_alumno="'"+[alumno.telefono_alumno]+"'";
                }

                if ([alumno.correo_alumno]==''){
                    var correo_alumno="NULL";
                }else{
                    correo_alumno="'"+[alumno.correo_alumno]+"'";
                }

                if (([alumno.procedencia_alumno]).toLocaleString().trimLeft()==''){
                    var procedencia_alumno="NULL";
                }else{
                    procedencia_alumno="'"+[alumno.procedencia_alumno]+"'";
                }
    
                if ([alumno.celular_padre]==''){
                    var celular_padre="NULL";
                }else{
                    celular_padre="'"+[alumno.celular_padre]+"'";
                }
    
                if ([alumno.correo_padre]==''){
                    var correo_padre="NULL";
                }else{
                    correo_padre="'"+[alumno.correo_padre]+"'";
                }
    
                if ([alumno.celular_madre]==''){
                    var celular_madre="NULL";
                }else{
                    celular_madre="'"+[alumno.celular_madre]+"'";
                }
    
                if ([alumno.correo_madre]==''){
                    var correo_madre="NULL";
                }else{
                    correo_madre="'"+[alumno.correo_madre]+"'";
                }
                        var query = "CALL pa_update_alumno("+ [alumno.id_alumno] 
                        + ",'" +[alumno.apellidos_alumno] + "','"+ [alumno.nombres_alumno]
                        + "','" + [alumno.fnac_alumno] + "','" + [alumno.sexo_alumno]
                        + "'," + telefono_alumno + ",'"+ [alumno.celular_alumno]
                        + "','" + [alumno.direccion_alumno]
                        + "'," + correo_alumno + "," + procedencia_alumno
                        + ",'" + [alumno.apellidos_padre] +"','"+ [alumno.nombres_padre]
                        + "'," + celular_padre + ","+ correo_padre
                        + ",'" + [alumno.apellidos_madre] + "','" + [alumno.nombres_madre]
                        + "'," + celular_madre + "," + correo_madre + ")";
                        con.query(query,(err, result) => {
                            if(err){
                                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                            }else{
                                if (result.affectedRows == 1) {
                                    res.send({status: 1, message: 'ALUMNO ACTUALIZADO'});
                                } else {
                                    res.send({status: 2, message: 'ALUMNO NO ACTUALIZADO'});
                                }
                            }
                        });
    
            
            }
        });
    };
    
    eliminar_alumno(alumno, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{
            var query = "CALL pa_eliminar_alumno("+ [alumno.idbusqueda] +")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                }else{
                    if (result.affectedRows == 0) {
                        res.send({status: 2, message: 'CAMBIOS NO REALIZADOS'});
                    } else {
                        res.send({status: 1, message: 'ALUMNO ELIMINADO'});
                    }
                }
            });
            }
        });
    };

    listar_apoderados(res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{
            con.query("CALL pa_listar_apoderados()", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA APODERADOS'});
                    } else {
                        res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                    }
                }
               
            });
        }
        });
    };
    
    nvo_apoderado(apoderado, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{
    
            if ([apoderado.correo_apoderado]==''){
                var correo_apoderado="NULL";
            }else{
                correo_apoderado="'"+[apoderado.correo_apoderado]+"'";
            }
    
            var query_doc = "CALL pa_buscar_doc_apoderado('"+ [apoderado.doc_apoderado] +"')";
            
            con.query(query_doc,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS1'});
                }else{
                    if (result[0].length == 0) {
                        var query = "CALL pa_insertar_apoderado('"+ [apoderado.tdoc_apoderado] +"','"+ [apoderado.doc_apoderado] 
                        +"','"+ [apoderado.apellidos_apoderado] + "','"+ [apoderado.nombres_apoderado] 
                        + "','"+ [apoderado.sexo_apoderado] + "','"+ [apoderado.celular_apoderado]
                        + "','"+ [apoderado.direccion_apoderado] + "',"+ correo_apoderado + ")";
                        
                        con.query(query,(err, result) => {
                            if(err){
                                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS2'});
                            }else{
                                if (result.affectedRows == 1) {
                                    res.send({status: 1, message: 'APODERADO REGISTRADO'});
                                } else {
                                    res.send({status: 2, message: 'APODERADO NO REGISTRADO'});
                                }
                            }
                        });
                    } else {
                        res.send({status: 3, message: 'NUM. DOC. DEL APODERADO YA REGISTRADO'});
                    }
                }
            });
    
            
            }
        });
    };
    
    obtener_apoderado(apoderado, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{
            var query = "CALL pa_detalle_apoderado("+ [apoderado.idbusqueda] +")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'Apoderado No Existe'});
                    } else {
                        res.send({status: 1, message: 'Datos Apoderado',data:result[0]});
                    }
                }
            });
            }
        });
    };

    update_apoderado(apoderado, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{
            
                if ([apoderado.correo_apoderado]==''){
                    var correo_apoderado="NULL";
                }else{
                    correo_apoderado="'"+[apoderado.correo_apoderado]+"'";
                }

                        var query = "CALL pa_update_apoderado("+ [apoderado.id_apoderado]
                        + ",'" +[apoderado.apellidos_apoderado] + "','"+ [apoderado.nombres_apoderado]
                        + "','" + [apoderado.sexo_apoderado]
                        + "','"+ [apoderado.celular_apoderado]
                        + "','" + [apoderado.direccion_apoderado]
                        + "'," + correo_apoderado + ")";
                        con.query(query,(err, result) => {
                            if(err){
                                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOSs'});
                            }else{
                                if (result.affectedRows == 1) {
                                    res.send({status: 1, message: 'APODERADO ACTUALIZADO'});
                                } else {
                                    res.send({status: 2, message: 'APODERADO NO ACTUALIZADO'});
                                }
                            }
                        });
    
            
            }
        });
    };
    
    eliminar_apoderado(apoderado, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{
            var query = "CALL pa_eliminar_apoderado("+ [apoderado.idbusqueda] +")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                }else{
                    if (result.affectedRows == 0) {
                        res.send({status: 2, message: 'CAMBIOS NO REALIZADOS'});
                    } else {
                        res.send({status: 1, message: 'APODERADO ELIMINADO'});
                    }
                }
            });
            }
        });
    };

    listar_matriculados(res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{
            con.query("CALL pa_listar_matriculados()", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA MATRICULA'});
                    } else {
                        res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                    }
                }
               
            });
        }
        });
    };

    obtener_datos_xdoc(datos, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{
              if([datos.idbusqueda]==0){
                var query = "CALL pa_buscar_doc_alumno('"+ [datos.datobusqueda] +"')"; 
                /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
                con.query(query,(err, result) => {
                    con.release();
                    if(err){
                        res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                    }else{
                        if (result[0].length == 0) {
                            res.send({status: 2, message: 'Alumno No Existe'});
                        } else {
                            res.send({status: 1, message: 'Datos Alumno',data:result[0]});
                        }
                    }
                });
              }else{
                var query = "CALL pa_buscar_doc_apoderado('"+ [datos.datobusqueda] +"')"; 
                /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
                con.query(query,(err, result) => {
                    con.release();
                    if(err){
                        res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                    }else{
                        if (result[0].length == 0) {
                            res.send({status: 2, message: 'Apoderado No Existe'});
                        } else {
                            res.send({status: 1, message: 'Datos Apoderado',data:result[0]});
                        }
                    }
                });
              }
            }
        });
    };

    listar_tipo_relacion(res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{
            con.query("CALL pa_listar_tipo_relacion()", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA TIPO RELACION'});
                    } else {
                        res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                    }
                }
               
            });
        }
        });
    };

    nva_matricula(matricula, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{
    
            //var query_dni = "CALL pa_buscar_dni_usuario('"+ [user.dni_usu] +"')";
            
         
                
               
                        var query = "CALL pa_insertar_matricula('"+ [matricula.fecha_matricula]
                        +"',"+ [matricula.id_apoderado] + ","+ [matricula.id_alumno] 
                        + ","+ [matricula.id_seccion] + ","+ [matricula.id_tipo_relacion] 
                        + ",'"+ [matricula.id_anhio] + "')";
                        con.release();
                        con.query(query,(err, result) => {
                            if(err){
                                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                            }else{
                                if (result.affectedRows == 1) {
                                    res.send({status: 1, message: 'Matricula Registrado'});
                                } else {
                                    res.send({status: 2, message: 'Matricula No Registrado'});
                                }
                            }
                        });
            
            }
        });
    };
    
}

module.exports = new Apafa();