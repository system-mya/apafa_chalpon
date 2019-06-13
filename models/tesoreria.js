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

class Tesoreria {
    listar_ingresos_xperido(anhio,res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{
            con.query("CALL pa_listar_ingresos_xperiodo('"+[anhio.datobusqueda]+"')", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
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

    nvo_otro_ingreso(ingreso, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOSaa'});
            }else{                   
               var query = "CALL pa_insertar_otro_ingreso('"+ [ingreso.descripcion_ingreso] 
                        +"','"+ [ingreso.monto_ingreso] + "','"+ [ingreso.doc_encargado_ingreso] 
                        + "','"+ [ingreso.datos_encrgado_ingreso] 
                        + "',"+ get('123456$#@$^@1ERF',[ingreso.id_usuario][0]) + ")";
                        con.query(query,(err, result) => {
                            con.release();
                            if(err){
                                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOSsss'});
                            }else{
                                if (result.affectedRows == 1) {
                                    res.send({status: 1, message: 'Ingreso Registrado'});
                                } else {
                                    res.send({status: 2, message: 'Ingreso No Registrado'});
                                }
                            }
                        });
            }
        });
    };

    listar_detalle_deuda(recibo, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{
            var query = "CALL pa_listar_detalle_deuda("+[recibo.id_apoderado]+")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'Lista Detalle No Existe'});
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
                 res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
             }else{    
                 con.beginTransaction(function(err) {
                     if (err) {  
                         con.rollback(function() {
                             con.release();                                                                                                  
                         });
                         res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'}); 
                     }
                     var query_ultimo_recibo = "CALL pa_ultimo_recibo_ingresado('"+[recibo.anhio]+"')";
                     con.query(query_ultimo_recibo, function(err, result) {
                       if (err) { 
                         con.rollback(function() {
                             con.release();                                                                                                  
                         });
                             res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
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
                                   res.send({status: 0, message: 'ERROR EN LA BASE DE DATOSss'});
                                 }else{
                                     if (result.affectedRows == 1) {
                                         var query_apafa = "CALL pa_verificar_si_cuota_apafa_registrada("+[matricula.id_apoderado]+",'"+ [matricula.anhio] +"')";
                                         con.query(query_apafa, function(err, result) {
                                           if (err) { 
                                             con.rollback(function() {
                                                 con.release();                                                                                                  
                                             });
                                                 res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                                           }else{
                                             if (result[0].length == 0) {
                                                 var query_insert_apafa = "CALL pa_insertar_deuda_apafa("+ [matricula.id_apoderado] 
                                                 + ",'"+ [matricula.anhio] + "')";
                                                 
                                                 con.query(query_insert_apafa, function(err, result_apafa) {
                                                     if (err) { 
                                                         con.rollback(function() {
                                                             res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});                                                                                               
                                                         });                                                  
                                                     }else{
                                                         if (result_apafa.affectedRows == 1) {
                                                             con.commit(function(err) {
                                                                 if (err) { 
                                                                   con.rollback(function() {
                                                                     res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
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
                                                         res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
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
                                    res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                            }else{           
                                if (result.affectedRows == 1) {
                                    var cantidad=[recibo.detalle.length]; 
                                    var monto=0;                             
                                    for(var i = 0; i < cantidad;i++){
                                        var query_update_deuda = "CALL pa_update_deuda("+[recibo.detalle[i].id_detalle_deuda]
                                        + ",'" + [recibo.detalle[i].monto] + "')";
                                        con.query(query_update_deuda, function(err, result) {
                                        if (err) { 
                                            con.rollback(function() {
                                                con.release();                                                                                                  
                                            });
                                                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                                        }else{
                                            if (result.affectedRows == 1) {
                                                monto = monto + 1;
                                                
                                            }
                                        }
                                      });
                                    }
                                    console.log("contador final: " + cantidad);
                                    if(cantidad == 4 ){
                                        con.commit(function(err) {
                                            if (err) { 
                                              con.rollback(function() {
                                                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                                              });
                                            }else{
                                                res.send({status: 1, message: 'RECIBO REGISTRADO',data:num_recibo});
                                            }                                                      
                                            
                                          }); 
                                    }else{
                                        con.rollback(function() {
                                            con.release();
                                            res.send({status: 2, message: 'RECIBO NO REGISTRADOss'});                                                                                                  
                                        });
                                    }
                                    
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
}
module.exports = new Tesoreria();