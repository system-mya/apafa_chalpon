connection = require('../conexion');
 CryptoJS =require('crypto-js');

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
}
module.exports = new Tesoreria();