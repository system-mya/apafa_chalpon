//creamos la conexion a nuestra base de datos con los datos de acceso de cada uno
connection = require('../conexion');

class Reportes {
    listar_apoderados_xanhio(dato, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{
            var query = "CALL pa_listar_apoderados_xanhio("+ [dato.idbusqueda] +")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'No hay Apoderados'});
                    } else {
                        res.send({status: 1, message: 'Lista Apoderados',data:result[0]});
                    }
                }
            });
            }
        });
    };

    listar_alumnos_xapoderado(dato, res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
            }else{
            var query = "CALL pa_listar_alumnos_xapoderado_matricula("+ [dato.idbusqueda] +","+[dato.datobusqueda]+")"; 
            /* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
            con.query(query,(err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'No hay Alumnos'});
                    } else {
                        res.send({status: 1, message: 'Lista Alumnos',data:result[0]});
                    }
                }
            });
            }
        });
    };

    listar_grados_xmatricula(anhio,res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{
            con.query("CALL pa_listar_grados_xmatricula("+ [anhio.idbusqueda] +")", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'NO HAY GRADOS CON MATRICULA'});
                    } else {
                        res.send({status: 1, message: 'LISTA GRADOS',data:result[0]});
                    }
                }
               
            });
        }
        });
    };

    pa_listar_matriculados_xanhio(anhio,res) {
        connection.acquire((err, con) => {
            if(err){
                res.send({status: 0, message: err.sqlMessage});
            }else{
            con.query("CALL pa_listar_matriculados_xanhio("+ [anhio.idbusqueda] +")", (err, result) => {
                con.release();
                if(err){
                    res.send({status: 0, message: err.sqlMessage});
                }else{
                    if (result[0].length == 0) {
                        res.send({status: 2, message: 'NO HAY DATOS EN LA CONSULTA'});
                    } else {
                        res.send({status: 1, message: 'LISTA MATRICULADOS',data:result[0]});
                    }
                }
               
            });
        }
        });
    };

}

module.exports = new Reportes();