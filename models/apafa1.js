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
                    res.send({status: 0, message: err.sqlMessage});
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
                                res.send({status: 0, message: err.sqlMessage});
                            }else{
                                if (result.affectedRows == 1) {
                                    res.send({status: 1, message: 'ALUMNO REGISTRADO'});
                                } else {
                                    res.send({status: 2, message: 'ALUMNO NO REGISTRADO'});
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
                res.send({status: 0, message: err.sqlMessage});
            }else{
            var query = "CALL pa_detalle_alumno("+ [alumno.idbusqueda] +")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
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
            res.send({status: 0, message: err.sqlMessage});
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
                                res.send({status: 0, message: err.sqlMessage});
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
                res.send({status: 0, message: err.sqlMessage});
            }else{
            var query = "CALL pa_eliminar_alumno("+ [alumno.idbusqueda] +")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result.affectedRows == 0) {
                        res.send({status: 2, message: 'ALUMNO NO ELIMINADO'});
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
                res.send({status: 0, message: err.sqlMessage});
            }else{
            con.query("CALL pa_listar_apoderados()", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
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
                res.send({status: 0, message: err.sqlMessage});
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
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        var query = "CALL pa_insertar_apoderado('"+ [apoderado.tdoc_apoderado] +"','"+ [apoderado.doc_apoderado] 
                        +"','"+ [apoderado.apellidos_apoderado] + "','"+ [apoderado.nombres_apoderado] 
                        + "','"+ [apoderado.sexo_apoderado] + "','"+ [apoderado.celular_apoderado]
                        + "','"+ [apoderado.direccion_apoderado] + "',"+ correo_apoderado + ")";
                        
                        con.query(query,(err, result) => {
                            if(err){
                                res.send({status: 0, message: err.sqlMessage});
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
                res.send({status: 0, message: err.sqlMessage});
            }else{
            var query = "CALL pa_detalle_apoderado("+ [apoderado.idbusqueda] +")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
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
                res.send({status: 0, message: err.sqlMessage});
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
                                res.send({status: 0, message: err.sqlMessage});
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
                res.send({status: 0, message: err.sqlMessage});
            }else{
            var query = "CALL pa_eliminar_apoderado("+ [apoderado.idbusqueda] +")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result.affectedRows == 0) {
                        res.send({status: 2, message: 'APODERADO NO ELIMINADO'});
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
                res.send({status: 0, message: err.sqlMessage});
            }else{
            con.query("CALL pa_listar_matriculados()", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
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
                res.send({status: 0, message: err.sqlMessage});
            }else{    
                con.beginTransaction(function(err) {
                    if (err) {  
                        con.rollback(function() {
                            con.release();                                                                                                  
                        });
                        res.send({status: 0, message: err.sqlMessage}); 
                    }
                    var query_matricula = "CALL pa_verificar_matricula_alumno("+[matricula.id_alumno]+",'"+ [matricula.anhio] +"')";
                    con.query(query_matricula, function(err, result) {
                      if (err) { 
                        con.rollback(function() {
                            con.release();                                                                                                  
                        });
                            res.send({status: 0, message: err.sqlMessage});
                      }else{
                        if (result[0].length == 0) {
                            var query_insert_matricula = "CALL pa_insertar_matricula('"+ [matricula.fecha_matricula]
                            +"',"+ [matricula.id_apoderado] + ","+ [matricula.id_alumno] 
                            + ","+ [matricula.id_seccion] + ","+ [matricula.id_tipo_relacion] 
                            + ",'"+ [matricula.anhio] + "')";

                            con.query(query_insert_matricula, function(err, result) {
                                
                                if (err) { 
                                    con.rollback(function() {
                                        con.release();                                                                                                  
                                    });
                                  res.send({status: 0, message: err.sqlMessage});
                                }else{
                                    if (result.affectedRows == 1) {
                                        var query_apafa = "CALL pa_verificar_si_cuota_apafa_registrada("+[matricula.id_apoderado]+",'"+ [matricula.anhio] +"')";
                                        con.query(query_apafa, function(err, result) {
                                          if (err) { 
                                            con.rollback(function() {
                                                con.release();                                                                                                  
                                            });
                                                res.send({status: 0, message: err.sqlMessage});
                                          }else{
                                            if (result[0].length == 0) {
                                                var query_insert_apafa = "CALL pa_insertar_deuda_apafa("+ [matricula.id_apoderado] 
                                                + ",'"+ [matricula.anhio] + "')";
                                                
                                                con.query(query_insert_apafa, function(err, result_apafa) {
                                                    if (err) { 
                                                        console.log(err.sqlMessage);
                                                        con.rollback(function() {
                                                            res.send({status: 0, message: err.sqlMessage});                                                                                               
                                                        });                                                  
                                                    }else{
                                                        if (result_apafa.affectedRows == 1) {
                                                            con.commit(function(err) {
                                                                if (err) { 
                                                                  con.rollback(function() {
                                                                    res.send({status: 0, message: err.sqlMessage});
                                                                  });
                                                                }else{
                                                                    res.send({status: 1, message: 'MATRICULA REGISTRADA'});
                                                                }                                                      
                                                                
                                                              });
                                                            
                                                        }else{
                                                            con.rollback(function() {
                                                                con.release();
                                                                res.send({status: 2, message: 'MATRICULA NO REGISTRADA'});                                                                                                  
                                                            });
                                                           
                                                        }
                                                    }
                                                }); 
                                            }else{
                                                con.commit(function(err) {
                                                    if (err) { 
                                                      con.rollback(function() {
                                                        res.send({status: 0, message: err.sqlMessage});
                                                      });
                                                    }else{
                                                        res.send({status: 1, message: 'MATRICULA REGISTRADA'});
                                                    }                                                      
                                                    
                                                  });
                                            }
                                            
                                          }
                                        });
                                        
                                        
                                    } else {
                                        con.rollback(function() {
                                            con.release();    
                                            res.send({status: 2, message: 'MATRICULA NO REGISTRADA'});                                                                                              
                                        });
                                        
                                    }
                                }
                          });
                        } else {
                            res.send({status: 3, message: 'ALUMNO YA MATRICULO'});
                        }
                       

                    }

                });
            });

        }

    });

    };

    detalle_matricula(matricula, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{
            var query = "CALL pa_detalle_matricula("+ [matricula.idbusqueda] +")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'CONSULTA SIN EXITO'});
                    } else {
                        res.send({status: 1, message: 'Datos Matricula',data:result[0]});
                    }
                }
            });
            }
        });
    };

    eliminar_matricula(matricula, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{
            var query = "CALL pa_eliminar_matricula("+ [matricula.idbusqueda] +")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result.affectedRows == 0) {
                        res.send({status: 2, message: 'MATRICULA NO ELIMINADA'});
                    } else {
                        res.send({status: 1, message: 'MATRICULA ELIMINADA'});
                    }
                }
            });
            }
        });
    };

    nva_deuda_apoderado(deuda, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{

            if ([deuda.descripcion_deuda]==''){
                var descripcion_deuda="NULL";
            }else{
                descripcion_deuda="'"+[deuda.descripcion_deuda]+"'";
            }
    
            var query_verificar = "CALL pa_verificar_deuda_apoderado("+[deuda.id_concepto]+","+[deuda.id_apoderado]+",'"+ [deuda.anhio] +"')";
            
            con.query(query_verificar,(err, result) => {
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        var query = "CALL pa_insertar_deuda_apoderado("+ [deuda.id_concepto] +","+ [deuda.id_apoderado] 
                        +",'"+ [deuda.monto_ingresado] + "',"+ descripcion_deuda +")";
                        
                        con.query(query,(err, result) => {
                            con.release();
                            if(err){
                                res.send({status: 0, message: err.sqlMessage});
                            }else{
                                if (result.affectedRows == 1) {
                                    res.send({status: 1, message: 'DEUDA REGISTRADA'});
                                } else {
                                    res.send({status: 2, message: 'DEUDA NO REGISTRADA'});
                                }
                            }
                        });
                    } else {
                        res.send({status: 3, message: 'CONCEPTO YA REGISTRADO'});
                    }
                }
            });
    
            
            }
        });
    };


    listar_historial_matricula(alumno, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{
            var query = "CALL pa_listar_historial_matricula("+ [alumno.idbusqueda] +")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'Historial No Existe'});
                    } else {
                        res.send({status: 1, message: 'Datos Historial',data:result[0]});
                    }
                }
            });
            }
        });
    };

    listar_matriculados_xgrado(grado, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{
            var query = "CALL pa_listar_matriculados_xgrado("+ [grado.idbusqueda] +")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'NO EXISTEN MATRICULADOS'});
                    } else {
                        res.send({status: 1, message: 'MATRICULADOS',data:result[0]});
                    }
                }
            });
            }
        });
    };

    listar_libros_xgrado(dato, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{
            var query = "CALL pa_listar_libros_xgrado("+ [dato.idbusqueda] +","+parseInt([dato.datobusqueda])+")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'ENTREGA COMPLETA'});
                    } else {
                        res.send({status: 1, message: 'Libros Registrados',data:result[0]});
                    }
                }
            });
            }
        });
    };

    listar_libros_xmatricula(dato, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{
            var query = "CALL pa_listar_libros_xmatricula("+ [dato.idbusqueda] +")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'No hay Libros Entregados'});
                    } else {
                        res.send({status: 1, message: 'Libros Entregados',data:result[0]});
                    }
                }
            });
            }
        });
    };
                      
                  
    insertar_libro_matricula(libro, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{            
                        var query = "CALL pa_insertar_libro_xmatricula("+ [libro.id_matricula] 
                            + "," + [libro.id_libro] +")";
                            con.query(query,(err, result) => {
                                con.release();
                                if(err){
                                    res.send({status: 0, message: err.sqlMessage});
                                }else{
                                    if (result.affectedRows == 1) {
                                        res.send({status: 1, message: 'LIBRO AGREGADO'});
                                    } else {
                                        res.send({status: 2, message: 'LIBRO NO AGREGADO'});
                                    }
                                }
                            });      
                            
                }
            });
        };

    quitar_entrega_libro(dato, res) {
            connection.acquire((err, con) => {
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                var query = "CALL pa_quitar_entrega_libro("+ [dato.idbusqueda] +","+parseInt([dato.datobusqueda])+")"; 
                /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
                con.query(query,(err, result) => {
                    con.release();
                    if(err){
                        res.send({status: 0, message: err.sqlMessage});
                    }else{
                        if (result.affectedRows == 0) {
                            res.send({status: 2, message: 'ERROR AL QUITAR LIBRO'});
                        } else {
                            res.send({status: 1, message: 'LIBRO DEVUELTO A LISTA'});
                        }
                    }
                });                
                }
            });
        };

    registrar_devolucion_libro(dato, res) {
            connection.acquire((err, con) => {
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                var array = dato.datobusqueda.split("-");
                var query = "CALL pa_devolver_libro("+[dato.idbusqueda] +","+parseInt(array[1])+","+parseInt(array[0])+")"; 
                con.query(query,(err, result) => {
                    con.release();
                    if(err){
                        res.send({status: 0, message: err.sqlMessage});
                    }else{
                        if (result.affectedRows == 0) {
                            res.send({status: 2, message: 'DEVOLUCIÓN NO REALIZADA'});
                        } else {
                            res.send({status: 1, message: 'DEVOLUCIÓN REGISTRADA'});
                        }
                    }
                });
                }
            });
        };

    eliminar_deuda(deuda, res) {
            connection.acquire((err, con) => {
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                var query = "CALL pa_eliminar_deuda_apoderado("+ [deuda.idbusqueda] +",'"+[deuda.datobusqueda]+"')"; 
                /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
                con.query(query,(err, result) => {
                    con.release();
                    if(err){
                        res.send({status: 0, message: err.sqlMessage});
                    }else{
                        if (result.affectedRows == 0) {
                            res.send({status: 2, message: 'DEUDA NO ELIMINADA'});
                        } else {
                            res.send({status: 1, message: 'DEUDA ELIMINADA'});
                        }
                    }
                });
                }
            });
        };

        obtener_perfil_alumno(alumno, res) {
            connection.acquire((err, con) => {
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                var query = "CALL pa_obtener_perfil_alumno("+ [alumno.idbusqueda] +")"; 
                /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
                con.query(query,(err, result) => {
                    con.release();
                    if(err){
                        res.send({status: 0, message: err.sqlMessage});
                    }else{
                        if (result[0].length == 0) {
                            res.send({status: 2, message: 'CONSULTA SIN EXITO'});
                        } else {
                            res.send({status: 1, message: 'Datos Alumno',data:result[0]});
                        }
                    }
                });
                }
            });
        };
    
}

module.exports = new Apafa();