connection = require('../conexion');
 CryptoJS =require('crypto-js'); 
 function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}
//FUNCION PARA OBTENER FECHA DE ACTUAL
function hoyFecha(){
    var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth()+1;
        var yyyy = hoy.getFullYear();
        
        dd = addZero(dd);
        mm = addZero(mm);

        return yyyy+''+mm+''+dd;
}

  //The get method is use for decrypt the value.
  function get(keys, value){
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  };
  
  function update_deuda (recibo,con,cantidad,id_recibo) {
    var buenas=0;
    var malos=0;
    var estado;
    return new Promise(function (resolve, reject) {
    for(i=0;i<cantidad;i++){
        if(parseFloat(recibo.detalle[i].monto)>0){
            if(parseFloat(recibo.detalle[i].monto)<recibo.detalle[i].saldo_deuda){
                estado='P';
              }else{
                estado='C';
              }
              console.log(recibo.detalle[i].id_detalle_deuda);        
                  var query="CALL pa_update_deuda("+recibo.detalle[i].id_detalle_deuda+",'"+recibo.detalle[i].monto+"','"+estado+"')";
                 con.query(query ,function(err,result_update) {                     
                        if (err) { 
                            malos=malos+1;
                            return reject(malos);
                        }else{
                             if (result_update.affectedRows == 1) {                                 
                                buenas= buenas + 1;
                                return resolve(buenas);                                                                             
                              }
                                  
                           }
                      });   
        }
             
    }
    
})

    
  }

  function insertar_detalle_recibo(recibo,con,cantidad,id_recibo) {
    var buenas=0;
    var malos=0;
    return new Promise(function (resolve, reject) {
    for(i=0;i<cantidad;i++){
        if(parseFloat(recibo.detalle[i].monto)>0){
            var query_insert="CALL pa_insertar_detalle_recibo("+recibo.detalle[i].id_detalle_deuda+","+id_recibo+",'"+recibo.detalle[i].monto+"')";
            con.query(query_insert ,function(err,result_insert) {
                            if (err) { 
                                malos=malos+1;
                                return reject(malos);
                            }else{
                                 if (result_insert.affectedRows == 1) {
                                      buenas= buenas + 1;
                                       return resolve(buenas);                                                                                       
                                  }
                                      
                               }
                          });   
        }
             
    }
    
})

    
  }

  function insertar_detalle_compra(compra,con,cantidad,id_compra) {
    var buenas=0;
    var malos=0;
    return new Promise(function (resolve, reject) {
    for(i=0;i<cantidad;i++){       
                  var query="CALL pa_insertar_detalle_compra("+id_compra
                  +",'"+compra.detalle[i].nom_producto +"',"+ compra.detalle[i].cantidad_compra
                  +",'" + compra.detalle[i].medida_compra +"','" + compra.detalle[i].punit_compra +"')";
                     con.query(query ,function(err,result) {                     
                        if (err) { 
                            malos=malos+1;
                            return reject(malos);
                        }else{
                             if (result.affectedRows == 1) {                                 
                                buenas= buenas + 1;
                                return resolve(buenas);                                                                             
                              }
                                  
                           }
                      });   
             
    }
    
})

    
  }
  
  function insertar_reunion_apoderado(con,data,id_reunion) {
    var buenas=0;
    var malos=0;
    return new Promise(function (resolve, reject) {
    for(i=0;i<data.length;i++){       
                  var query="CALL pa_insertar_reunion_apoderado("+id_reunion
                  +"," + data[i].id_apoderado +")";
                     con.query(query ,function(err,result) {                     
                        if (err) { 
                            malos=malos+1;
                            return reject(malos);
                        }else{
                             if (result.affectedRows == 1) {                                 
                                buenas= buenas + 1;
                                return resolve(buenas);                                                                             
                              }
                                  
                           }
                      });   
                  }  
            })
 }
  
class Tesoreria {
    listar_ingresos_xperiodo(anhio,res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{
            con.query("CALL pa_listar_ingresos_xperiodo('"+[anhio.datobusqueda]+"')", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA INGRESOS'});
                    } else {
                        res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                    }
                }
               
            });
        }
        });
    };

    nvo_movimiento(movimiento, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{                   
               var query = "CALL pa_insertar_movimientos('"+[movimiento.tipo_movimiento]+"','"+ [movimiento.descripcion_movimiento.toUpperCase()] 
                        +"','"+ [movimiento.monto_movimiento] + "','"+ [movimiento.doc_encargado_movimiento] 
                        + "','"+ [movimiento.datos_encargado_movimiento] 
                        + "',"+ get('123456$#@$^@1ERF',[movimiento.id_usuario][0]) + ")";
                        con.query(query,(err, result) => {
                            con.release();
                            if(err){
                                res.send({status: 0, message: err.sqlMessage});
                            }else{
                                if (result.affectedRows == 1) {
                                    res.send({status: 1, message: 'Movimiento Registrado'});
                                } else {
                                    res.send({status: 2, message: 'Movimiento No Registrado'});
                                }
                            }
                        });
            }
        });
    };

    listar_detalle_deuda(recibo, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{
            var query = "CALL pa_listar_detalle_deuda_pendientes("+[recibo.idbusqueda]+")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'No Registra Deuda'});
                    } else {
                        res.send({status: 1, message: 'Datos Deuda',data:result[0]});
                    }
                }
            });
            }
        });
    };    

    nvo_recibo(recibo, res) {
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
                     var query_ultimo_recibo = "CALL pa_ultimo_recibo_ingresado('"+[recibo.anhio]+"')";
                     con.query(query_ultimo_recibo, function(err, result) {
                       if (err) { 
                         con.rollback(function() {
                             con.release();                                                                                                  
                         });
                             res.send({status: 0, message: err.sqlMessage});
                       }else{
                         if (result[0].length == 0) {
                            var num_recibo = [recibo.doc_apoderado][0].substr(0,4) + "-" + hoyFecha() + "-1";
                            var query_nvo_recibo = "CALL pa_insertar_nvo_recibo("+[recibo.id_apoderado]
                            + "," + get('123456$#@$^@1ERF',[recibo.id_usuario][0]) 
                            + ",'" + [recibo.mtotal_recibo] + "','"+ num_recibo + "')";
                            con.query(query_nvo_recibo, function(err, result) {
                            if (err) { 
                                con.rollback(function() {
                                    con.release();                                                                                                  
                                });
                                    res.send({status: 0, message: err.sqlMessage});
                            }else{           
                                if (result.affectedRows == 1) {
                                    var query_obtener_recibo = "CALL pa_ultimo_recibo_ingresado('"+[recibo.anhio]+"')";
                                    con.query(query_obtener_recibo, function(err, result) {
                                      if (err) { 
                                        con.rollback(function() {
                                            con.release();                                                                                                  
                                        });
                                            res.send({status: 0, message: err.sqlMessage});
                                      }else{
                                        if (result[0].length > 0) {
                                        var id_recibo = result[0][0].id_recibo;
                                        var freg_recibo = result[0][0].freg_recibo;
                                        var cantidad = [recibo.detalle.length];
                                        var resultad;
                                        resultad = update_deuda(recibo,con,cantidad,id_recibo);
                                        console.log(resultad);
                                        resultad.then(function(value){
                                            if(value>0){
                                                var detalle_recibo;
                                                detalle_recibo = insertar_detalle_recibo(recibo,con,cantidad,id_recibo);
                                                detalle_recibo.then(function(value){
                                                   if(value>0){
                                                    console.log("nu hubo error");
                                                    con.commit(function(err) {
                                                     if (err) { 
                                                       con.rollback(function() {
                                                         res.send({status: 0, message: err.sqlMessage});
                                                       });
                                                     }else{
                                                         res.send({status: 1, message: 'RECIBO REGISTRADO',data:[num_recibo,[recibo.id_apoderado,id_recibo],freg_recibo]});
                                                     }                                                      
                                                   });
                                                   }
                                                }).catch(function(value){
                                                    if(value>0){
                                                        console.log("hubo error");
                                                        con.rollback(function() {
                                                         con.release();
                                                         res.send({status: 2, message: 'RECIBO NO REGISTRADO'});                                                                                                  
                                                     });
                                                     }
                                                    
                                                })
                                               
                                               
                                            }
                                        }     
                                            )
                                        .catch(function(value){
                                            if(value>0){
                                               con.rollback(function() {
                                                con.release();
                                                res.send({status: 2, message: 'RECIBO NO REGISTRADO'});                                                                                                  
                                            });
                                            }
                                        });   
                                        }else{
                                            con.rollback(function() {
                                                con.release();                                                                                                  
                                            });
                                                res.send({status: 2, message: 'RECIBO NO REGISTRADO'}); 
                                        }
                                      }
                                    })          
                                }else{
                                    con.rollback(function() {
                                        con.release();
                                        res.send({status: 2, message: 'RECIBO NO REGISTRADO'});                                                                                                  
                                    });
                                }
                                
                            }
                        });
                         } else {
                            var array = result[0][0].num_recibo.split("-");
                            var num_recibo = [recibo.doc_apoderado][0].substr(0,4) + "-" + hoyFecha() + "-" + (parseInt(array[2])+1);
                            var query_nvo_recibo = "CALL pa_insertar_nvo_recibo("+[recibo.id_apoderado]
                            + "," + get('123456$#@$^@1ERF',[recibo.id_usuario][0]) 
                            + ",'" + [recibo.mtotal_recibo] + "','"+ num_recibo + "')";
                            con.query(query_nvo_recibo, function(err, result) {
                            if (err) { 
                                con.rollback(function() {
                                    con.release();                                                                                                  
                                });
                                    res.send({status: 0, message: err.sqlMessage});
                            }else{           
                                if (result.affectedRows == 1) {
                                    var query_obtener_recibo = "CALL pa_ultimo_recibo_ingresado('"+[recibo.anhio]+"')";
                                    con.query(query_obtener_recibo, function(err, result) {
                                      if (err) { 
                                        con.rollback(function() {
                                            con.release();                                                                                                  
                                        });
                                            res.send({status: 0, message: err.sqlMessage});
                                      }else{
                                        if (result[0].length > 0) {
                                        var id_recibo = result[0][0].id_recibo;
                                        var freg_recibo = result[0][0].freg_recibo;
                                        var cantidad = [recibo.detalle.length];
                                        var resultad;
                                        resultad = update_deuda(recibo,con,cantidad,id_recibo);
                                        resultad.then(function(value){
                                            if(value>0){
                                                var detalle_recibo;
                                                detalle_recibo = insertar_detalle_recibo(recibo,con,cantidad,id_recibo);
                                                detalle_recibo.then(function(value){
                                                   if(value>0){
                                                    console.log("nu hubo error");
                                                    con.commit(function(err) {
                                                     if (err) { 
                                                       con.rollback(function() {
                                                         res.send({status: 0, message: err.sqlMessage});
                                                       });
                                                     }else{
                                                         res.send({status: 1, message: 'RECIBO REGISTRADO',data:[num_recibo,[recibo.id_apoderado,id_recibo],freg_recibo]});
                                                     }                                                      
                                                   });
                                                   }
                                                }).catch(function(value){
                                                    if(value>0){
                                                        console.log("hubo error x aki");
                                                        con.rollback(function() {
                                                         con.release();
                                                         res.send({status: 2, message: 'RECIBO NO REGISTRADO'});                                                                                                  
                                                     });
                                                     }
                                                    
                                                })
                                            }
                                        }).catch(function(value){
                                            if(value>0){
                                               console.log("hubo error");
                                               con.rollback(function() {
                                                con.release();
                                                res.send({status: 2, message: 'RECIBO NO REGISTRADO'});                                                                                                  
                                            });
                                            }
                                        }                                     
                                            
                                            );   
                                        }else{
                                            con.rollback(function() {
                                                con.release();                                                                                                  
                                            });
                                                res.send({status: 2, message: 'RECIBO NO REGISTRADO'}); 
                                        }
                                      }
                                    })          
                                }else{
                                    con.rollback(function() {
                                        con.release();
                                        res.send({status: 2, message: 'RECIBO NO REGISTRADO'});                                                                                                  
                                    });
                                }
                                
                            }
                        });

                         }
                        
 
                     }
 
                 });
             });
 
         }
 
     });
 
    }

    obtener_detalle_recibo(recibo,res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{
            con.query("CALL pa_obtener_detalle_recibo("+[recibo.idbusqueda]+")", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA DETALLE RECIBO'});
                    } else {
                        res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                    }
                }
               
            });
        }
        });
    };

    obtener_detalle_movimiento(recibo,res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{
            con.query("CALL pa_obtener_detalle_movimiento("+[recibo.idbusqueda]+",'"+[recibo.datobusqueda]+"')", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA DETALLE MOVIMIENTO'});
                    } else {
                        res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                    }
                }
               
            });
        }
        });
    };

    nva_compra(compra, res) {
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
                    }else{
                        if ([compra.ruc_compra]==''){
                            var ruc_compra="NULL";
                        }else{
                            ruc_compra="'"+[compra.ruc_compra]+"'";
                        }                
                                    var query = "CALL pa_insertar_compra("+ get('123456$#@$^@1ERF',[compra.id_usuario][0]) +",'"+ [compra.anhio] 
                                    +"','"+ [compra.tipo_compra] + "','"+ [compra.num_compra] +"','" + [compra.razon_social_compra]
                                    + "',"+ ruc_compra + ",'"+  [compra.fecha_compra]
                                    + "','"+ [compra.doc_encargado_compra] 
                                    + "','"+ [compra.encargado_compra] +"','"+ [compra.total_compra] + "')";
                                    
                                    con.query(query,(err, result) => {
                                        if(err){
                                            con.rollback(function() {
                                                con.release();                                                                                                  
                                            });
                                            res.send({status: 0, message: err.sqlMessage}); 
                                        }else{
                                            if (result.affectedRows == 1) {
                                                var query_obtener_compra = "CALL pa_ultima_compra('"+[compra.anhio]+"')";
                                                con.query(query_obtener_compra, function(err, result) {
                                                  if (err) { 
                                                    con.rollback(function() {
                                                        con.release();                                                                                                  
                                                    });
                                                    res.send({status: 0, message: err.sqlMessage}); 
                                                  }else{
                                                    if (result[0].length > 0) {
                                                        var id_compra = result[0][0].id_compra;
                                                        var cantidad = [compra.detalle.length];
                                                        var resultad;
                                                        resultad = insertar_detalle_compra(compra,con,cantidad,id_compra);
                                                        resultad.then(function(valule){
                                                        if(valule>0){
                                                           con.commit(function(err) {
                                                            if (err) { 
                                                                con.rollback(function() {
                                                                    con.release();                                                                                                  
                                                                });
                                                                res.send({status: 0, message: err.sqlMessage}); 
                                                            }else{
                                                                res.send({status: 1, message: 'COMPRA REGISTRADA'});
                                                            }                                                      
                                                            
                                                          });
                                                        }
                                                    }     
                                                        )
                                                    .catch(function(value){
                                                        if(value>0){
                                                            con.rollback(function() {
                                                                con.release();
                                                                res.send({status: 2, message: 'COMPRA NO REGISTRADA'});                                                                                                  
                                                            });
                                                        }
                                                    }                                     
                                                        
                                                        );
                                                    }
                                                }
                                            })
                                            } else {
                                                con.rollback(function() {
                                                    con.release();
                                                    res.send({status: 2, message: 'COMPRA NO REGISTRADA'});                                                                                                  
                                                });
                                            }
                                        }
                                    });
                    }
                })
            }
        });
    };

    listar_egresos_xperiodo(anhio,res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message:err.sqlMessage});
            }else{
            con.query("CALL pa_listar_egresos_xperiodo('"+[anhio.datobusqueda]+"')", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message:err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA COMPRAS'});
                    } else {
                        res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                    }
                }
               
            });
        }
        });
    };

    listar_detalle_compra(compra,res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message:err.sqlMessage});
            }else{
            con.query("CALL pa_listar_detalle_compra("+[compra.idbusqueda]+")", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message:err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA DETALLE COMPRA'});
                    } else {
                        res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                    }
                }
               
            });
        }
        });
    };

    eliminar_movimiento(movimiento, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{
            var query = "CALL pa_eliminar_ingreso_egreso('"+[movimiento.datobusqueda]+"',"+ [movimiento.idbusqueda] +")";
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result.affectedRows == 0) {
                        res.send({status: 2, message: 'NO SE ELIMINO'});
                    } else {
                        res.send({status: 1, message: 'ELIMINACION EXITOSA'});
                    }
                }
            });
            }
        });
    };

    listar_reuniones_xperiodo(anhio,res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message:err.sqlMessage});
            }else{
            con.query("CALL pa_listar_reuniones_xperiodo('"+[anhio.datobusqueda]+"')", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message:err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA COMPRAS'});
                    } else {
                        res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                    }
                }
               
            });
        }
        });
    };

    listar_otros_conceptos(anhio,res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message:err.sqlMessage});
            }else{
            con.query("CALL pa_listar_otros_conceptos('"+[anhio.datobusqueda]+"')", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message:err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'NO HAY OTROS CONCEPTOS'});
                    } else {
                        res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                    }
                }
               
            });
        }
        });
    };

    listar_todos_conceptos(anhio,res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message:err.sqlMessage});
            }else{
            con.query("CALL pa_listar_todos_conceptos('"+[anhio.datobusqueda]+"')", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message:err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'NO HAY CONCEPTOS REGISTRADOS'});
                    } else {
                        res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                    }
                }
               
            });
        }
        });
    };

    nva_reunion(reunion, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{                   
               var query = "CALL pa_insertar_reunion('"+ [reunion.motivo_reunion] 
                        +"','"+ [reunion.fecha_reunion] + "','"+ [reunion.hora_reunion] 
                        + "',"+ [reunion.id_concepto] + ")";
                        con.query(query,(err, result) => {
                            con.release();
                            if(err){
                                res.send({status: 0, message:  err.sqlMessage});
                            }else{
                                if (result.affectedRows == 1) {
                                    res.send({status: 1, message: 'Reunión Registrada'});
                                } else {
                                    res.send({status: 2, message: 'Reunión No Registrada'});
                                }
                            }
                        });
            }
        });
    };

    generar_lista_firmas_apoderados(dato,res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message:err.sqlMessage});
            }else{
                con.beginTransaction(function(err) {
                    if (err) {  
                        con.rollback(function() {
                            con.release();                                                                                                  
                        });
                        res.send({status: 0, message: err.sqlMessage}); 
                    }else{
                        con.query("CALL pa_listar_apoderados_matricula('"+[dato.datobusqueda]+"')", (err, result) => {
                            con.release();
                            if(err){
                                res.send({status: 0, message:err.sqlMessage});
                            }else{
                                if (result[0].length == 0) {
                                    res.send({status: 2, message: 'NO HAY OTROS CONCEPTOS'});
                                } else {
                                    
                                    var resultad;
                                    resultad = insertar_reunion_apoderado(con,result[0],[dato.idbusqueda]);
                                    resultad.then(function(valule1){
                                    if(valule1>0){
                                        con.query("CALL pa_cambiar_lista_reunion("+[dato.idbusqueda]+")", (err, result) => {
                                            if(err){
                                                con.rollback(function() {   
                                                    res.send({status: 0, message:err.sqlMessage});
                                                }); 
                                            }else{
                                                if (result.affectedRows == 0) {
                                                    con.rollback(function() {   
                                                        res.send({status: 0, message: 'LISTA NO GENERADA'});                                                                                               
                                                    });  
                                                }else{
                                                    con.commit(function(err) {
                                                        if (err) { 
                                                            con.rollback(function() {
                                                                con.release();                                                                                                  
                                                            });
                                                            res.send({status: 0, message: err.sqlMessage}); 
                                                        }else{
                                                            res.send({status: 1, message: 'LISTA GENERADA'});
                                                        }                                                      
                                                      });
                                                }
                                            }
    
                                        })
                                      
                                    }
                                }).catch(function(value){
                                    if(value>0){
                                        con.rollback(function() {   
                                            res.send({status: 0, message: 'LISTA NO GENERADA'});                                                                                               
                                        });
                                        
                                        }
                                    });
                                }
                            }
                           
                        });
                    }
                    
                })
           }
        });
    };

    listar_apoderados_reunion(dato,res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message:err.sqlMessage});
            }else{
            con.query("CALL pa_listar_apoderados_reunion("+[dato.idbusqueda]+",'"+[dato.datobusqueda]+"')", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message:err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'NO HAY DETALLE REUNION'});
                    } else {
                        res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                    }
                }
               
            });
        }
        });
    };

    registrar_asistencia_reunion(dato, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{
               var array = dato.datobusqueda.split("-");
            var query = "CALL pa_registrar_asistencia_reunion("+ parseInt(array[1]) +","+[dato.idbusqueda]+","+array[0]+")"; 
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                }else{
                    if (result.affectedRows == 0) {
                        res.send({status: 2, message: 'ASISTENCIA NO REGISTRADA'});
                    } else {
                        res.send({status: 1, message: 'ASISTENCIA REGISTRADA'});
                    }
                }
            });
            }
        });
    };

    nvo_concepto(concepto, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{
                if([concepto.tipo_concepto]=='A'){
                    var query_doc = "CALL pa_verificar_cuota_apafa_xanhio('"+ [concepto.anhio] +"')";
            
                    con.query(query_doc,(err, result) => {
                        con.release();
                        if(err){
                            res.send({status: 0, message: err.sqlMessage});
                        }else{
                            if (result[0].length == 0) {
                                var query = "CALL pa_insertar_concepto_apafa('"+ [concepto.descripcion_concepto.toUpperCase()]  
                                + "','"+ [concepto.tipo_concepto] + "','"+[concepto.anhio]+"','"+[concepto.monto_concepto]+"')";
                    
                                con.query(query,(err, result) => {
                                    if(err){
                                        res.send({status: 0, message: err.sqlMessage});
                                    }else{
                                        if (result.affectedRows == 1) {
                                            res.send({status: 1, message: 'Concepto Registrado'});
                                        } else {
                                            res.send({status: 2, message: 'Concepto No Registrado'});
                                        }
                                    }
                                });
                            }else{
                                res.send({status: 3, message: 'CUOTA DE APAFA YA REGISTRADA'});
                            }
                        }
                    })
                }else{
                    var query = "CALL pa_insertar_concepto_apafa('"+ [concepto.descripcion_concepto.toUpperCase()]  
                    + "','"+ [concepto.tipo_concepto] + "','"+[concepto.anhio]+"','"+[concepto.monto_concepto]+"')";
        
                    con.query(query,(err, result) => {
                        con.release();
                        if(err){
                            res.send({status: 0, message: err.sqlMessage});
                        }else{
                            if (result.affectedRows == 1) {
                                res.send({status: 1, message: 'Concepto Registrado'});
                            } else {
                                res.send({status: 2, message: 'Concepto No Registrado'});
                            }
                        }
                    });
                }
             }
        });
    };

    update_concepto(concepto, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{
                var query = "CALL pa_update_concepto("+[concepto.id_concepto]+",'"+ [concepto.descripcion_concepto.toUpperCase()]  
                +"','"+[concepto.monto_concepto]+"')";
    
                con.query(query,(err, result) => {
                    con.release();
                    if(err){
                        res.send({status: 0, message: err.sqlMessage});
                    }else{
                        if (result.affectedRows == 1) {
                            res.send({status: 1, message: 'Concepto Actualizado'});
                        } else {
                            res.send({status: 2, message: 'Concepto No Actualizado'});
                        }
                    }
                });
            }

        })

    }

    eliminar_concepto(concepto, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{
            var query = "CALL pa_eliminar_concepto("+ [concepto.idbusqueda] +")";
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result.affectedRows == 0) {
                        res.send({status: 2, message: 'CONCEPTO NO ELIMINADO'});
                    } else {
                        res.send({status: 1, message: 'CONCEPTO ELIMINADO'});
                    }
                }
            });
            }
        });
    };
}
module.exports = new Tesoreria();