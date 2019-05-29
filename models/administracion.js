//creamos la conexion a nuestra base de datos con los datos de acceso de cada uno
connection = require('../conexion');
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

        return yyyy+'-'+mm+'-'+dd;
}
//creamos un objeto para ir almacenando todo lo que necesitemos
class Administracion {
  get(res) {
        connection.acquire((err, con) => {
            con.query('CALL LISTAR_DEPARTAMENTOS()', (err, result) => {
                con.release();
                res.send(result[0]);
            });
        });
 };

 listar_usuarios(res) {
    connection.acquire((err, con) => {
        con.query('CALL pa_listar_usuarios()', (err, result) => {
            con.release();
            res.send(result[0]);
        });
    });
};

listar_perfiles(res) {
    connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
		}else{
        con.query('CALL pa_listar_perfil_usuario()', (err, result) => {
            con.release();
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
			}else{
				if (result[0].length == 0) {
					res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA PERFIL USUARIOS'});
				} else {
                    res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                }
			}
           
		});
	}
    });
};


 consultar(user, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
		}else{
		var query = "CALL pa_iniciar_sesion('"+ [user.username] +"','"+ [user.password] +"')";
		//res.send("CALL INICIAR_SESION('"+ [user.username] +"','"+ [user.password] +"','"+ hoyFecha()+ "')");
		con.query(query,(err, result) => {
			con.release();
			if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
			}else{
				if (result[0].length == 0) {
					res.send({status: 2, message: 'Usuario / Clave incorrectos'});
				} else {
					res.send({status: 1, message: 'LOGIN EXITOSO',data:result[0]});
				}
			}
		});
		}
	});
};

nvo_usuario(user, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
		}else{
        if ([user.obser_usu]==''){
            var obser_usu="NULL";
        }else{
            obser_usu="'"+[user.obser_usu]+"'";
        }

        if ([user.correo_usu]==''){
            var correo_usu="NULL";
        }else{
            correo_usu="'"+[user.obser_usu]+"'";
        }

        var query_dni = "CALL pa_buscar_dni_usuario('"+ [user.dni_usu] +"')";
        
        con.query(query_dni,(err, result) => {
            con.release();
			if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
			}else{
				if (result[0].length == 0) {
					var query = "CALL pa_insertar_usuario('"+ [user.nom_usu] +"','"+ [user.dni_usu] 
                    +"','"+ [user.dni_usu] + "','"+ [user.nombres_usu] + "','"+ [user.apellidos_usu]
                    + "','"+ [user.sexo_usu] + "','"+ [user.celular_usu] + "',"+ correo_usu
                    + ",'"+ [user.direccion_usu] + "','"+ [user.fecha_usu].toString().slice(0,10)
                    + "',"+ obser_usu +","+ [user.perfil_usu] +")";
		
                    con.query(query,(err, result) => {
                        if(err){
                            res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                        }else{
                            if (result.affectedRows == 1) {
                                res.send({status: 1, message: 'Usuario Registrado'});
                            } else {
                                res.send({status: 2, message: 'Usuario No Registrado'});
                            }
                        }
                    });
				} else {
					res.send({status: 3, message: 'DNI DEL USUARIO YA REGISTRADO'});
				}
			}
		});

        
		}
	});
};

detalle_usuario(user, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
		}else{
		var query = "CALL pa_detalle_usuario("+ [user.idbusqueda] +")"; 
		/* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
		con.query(query,(err, result) => {
			con.release();
			if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
			}else{
				if (result[0].length == 0) {
					res.send({status: 2, message: 'Usuario No Existe'});
				} else {
					res.send({status: 1, message: 'Datos Usuario',data:result[0]});
				}
			}
		});
		}
	});
};

editar_usuario(user, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
		}else{
		var query = "CALL pa_obtener_usuario("+ [user.idbusqueda] +")"; 
		/* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
		con.query(query,(err, result) => {
			con.release();
			if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
			}else{
				if (result[0].length == 0) {
					res.send({status: 2, message: 'Usuario No Existe'});
				} else {
					res.send({status: 1, message: 'Datos Usuario',data:result[0]});
				}
			}
		});
		}
	});
};


nom_usuario(user, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
		}else{
		var query = "CALL pa_consultar_nomusuario('"+ [user.datobusqueda] +"')"; 
		/* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
		con.query(query,(err, result) => {
			con.release();
			if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
			}else{
				if (result[0].length == 0) {
					res.send({status: 2, message: 'Nom Usuario Libre'});
				} else {
					res.send({status: 1, message: 'Nom Usuario Ocupado'});
				}
			}
		});
		}
	});
};


update_usuario(user, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
		}else{
        if ([user.obser_usu]==''){
            var obser_usu="NULL";
        }else{
            obser_usu="'"+[user.obser_usu]+"'";
        }

        if ([user.correo_usu]==''){
            var correo_usu="NULL";
        }else{
            correo_usu="'"+[user.obser_usu]+"'";
		}
		
		if ([user.baja_usu]==''){
            var baja_usu="NULL";
        }else{
            baja_usu="'"+[user.fecha_usu]+"'";
        }
					var query = "CALL pa_update_usuario("+ [user.idusuario] +",'"+ [user.nom_usu] 
                    + "','" +[user.nombres_usu] + "','"+ [user.apellidos_usu]
                    + "','"+ [user.sexo_usu] + "','"+ [user.celular_usu] + "',"+ correo_usu
                    + ",'"+ [user.direccion_usu] + "',"+ baja_usu
                    + ","+ obser_usu +","+ [user.perfil_usu] +")";
                    con.query(query,(err, result) => {
                        if(err){
                            res.send({status: 0, message: 'ERROR EN LA BASE DE DATOSs'});
                        }else{
                            if (result.affectedRows == 1) {
                                res.send({status: 1, message: 'Usuario Actualizado'});
                            } else {
                                res.send({status: 2, message: 'Usuario No Actualizado'});
                            }
                        }
                    });

        
		}
	});
};

// consulta para resetear clave de usuario
resetear_usuario(user, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
		}else{
		var query = "CALL pa_resetear_clave("+ [user.idbusqueda] +")"; 
		/* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
		con.query(query,(err, result) => {
			con.release();
			if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
			}else{
				if (result.affectedRows == 0) {
					res.send({status: 2, message: 'CAMBIOS NO REALIZADOS'});
				} else {
					res.send({status: 1, message: 'CLAVE RESETEADA'});
				}
			}
		});
		}
	});
};

eliminar_usuario(user, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
		}else{
		var query = "CALL pa_eliminar_usuario("+ [user.idbusqueda] +")"; 
		/* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
		con.query(query,(err, result) => {
			con.release();
			if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
			}else{
				if (result.affectedRows == 0) {
					res.send({status: 2, message: 'CAMBIOS NO REALIZADOS'});
				} else {
					res.send({status: 1, message: 'USUARIO ELIMINADO'});
				}
			}
		});
		}
	});
};

nvo_anhio(anhio, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
		}else{
        if ([anhio.descripcion_anhio]==''){
            var descripcion="NULL";
        }else{
            descripcion="'"+[anhio.descripcion_anhio]+"'";
        }

        var query_anhio = "CALL pa_verificar_anhio('"+ [anhio.anhio] +"')";

        con.query(query_anhio,(err, result) => {
            con.release();
			if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
			}else{
				if (result[0].length == 0) {
					var query = "CALL pa_insertar_anhio('"+ [anhio.anhio] +
					"','"+[anhio.finicio_anhio]+"','"+[anhio.ffin_anhio]+"',"+descripcion+")";
		         
                    con.query(query,(err, result) => {
                        if(err){
                            res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
                        }else{
                            if (result.affectedRows == 1) {
                                res.send({status: 1, message: 'Año Registrado'});
                            } else {
                                res.send({status: 2, message: 'Año No Registrado'});
                            }
                        }
                    });
				} else {
					res.send({status: 3, message:'AÑO YA REGISTRADO',data:result[0]});
				}
			}
		});

        
		}
	});
};

listar_anhio(res) {
    connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
		}else{
          con.query('CALL pa_listar_anhio()', (err, result) => {
            con.release();
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
			}else{
				if (result[0].length == 0) {
					res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA AÑO'});
				} else {
                    res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                }
			}
           
		});
	}
    });
};

eliminar_anhio(user, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
		}else{
		var query = "CALL pa_eliminar_anhio("+ [user.idbusqueda] +")"; 
		/* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
		con.query(query,(err, result) => {
			con.release();
			if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
			}else{
				if (result.affectedRows == 0) {
					res.send({status: 2, message: 'CAMBIOS NO REALIZADOS'});
				} else {
					res.send({status: 1, message: 'AÑO ELIMINADO'});
				}
			}
		});
		}
	});
};

//http://raquellorente.esy.es/nodejs/subir-y-bajar-archivos-del-servidor-con-express-y-node-js/
agregar(user, res) {
//El modulo 'fs' (File System) que provee Nodejs nos permite manejar los archivos
var path = require('path');
var fs = require('fs');
var nombre_nuevo = "erick";

/*la foto en este caso se guarda en archivos temporales*/
var ruta_archivo= user.file.file.files.file.path;

var nueva_ruta = "./carpetaArchivos/" + nombre_nuevo+ path.extname(ruta_archivo ).toLowerCase();

/*copia el archivo desde tmp hasta nueva ruta*/
fs.createReadStream(ruta_archivo).pipe(fs.createWriteStream(nueva_ruta));


res.send('¡archivo subido!');

	
	
};

}

module.exports = new Administracion();