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
 
 //LLAMADO AL PA_LISTAR_USUARIOS;
 listar_usuarios(res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: err.sqlMessage});
		}else{
        con.query('CALL pa_listar_usuarios()', (err, result) => {
            con.release();
            if(err){
                res.send({status: 0, message: err.sqlMessage});
			}else{
				if (result[0].length == 0) {
					res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA USUARIOS',data:result[0]});
				} else {
                    res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                }
			}
           
		});
	}
    });
};

//LLAMADO AL PA_LISTAR_PERFIL_USUARIO
listar_perfiles(res) {
    connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: err.sqlMessage});
		}else{
        con.query('CALL pa_listar_perfil_usuario()', (err, result) => {
            con.release();
            if(err){
                res.send({status: 0, message: err.sqlMessage});
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

//CONSULTA PARA INICIAR SESION
 iniciar_sesion(user, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: err.sqlMessage});
		}else{
		var query = "CALL pa_iniciar_sesion('"+ [user.username] +"','"+ [user.password] +"')";
		//res.send("CALL INICIAR_SESION('"+ [user.username] +"','"+ [user.password] +"','"+ hoyFecha()+ "')");
		con.query(query,(err, result) => {
			con.release();
			if(err){
                res.send({status: 0, message: err.sqlMessage});
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

//LLAMADO AL PA_INSERTAR_USUARIO
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
            correo_usu="'"+[user.correo_usu]+"'";
        }
        var query_dni = "CALL pa_buscar_dni_usuario('"+ [user.dni_usu] +"')";
        con.query(query_dni,(err, result) => {
            con.release();
			if(err){
                res.send({status: 0, message: err.sqlMessage});
			}else{
				if (result[0].length == 0) {
					var query = "CALL pa_insertar_usuario("+[user.perfil_usu]+",'"+ [user.nom_usu] +"','"+ [user.dni_usu] 
                    +"','"+ [user.dni_usu] + "','"+ [user.nombres_usu] + "','"+ [user.apellidos_usu]
                    + "','"+ [user.sexo_usu] + "','"+ [user.celular_usu] + "',"+ correo_usu
                    + ",'"+ [user.direccion_usu] + "','"+ [user.fecha_usu].toString().slice(0,10)
                    + "',"+ obser_usu + ")";
		
                    con.query(query,(err, result) => {
                        if(err){
                            res.send({status: 0, message: err.sqlMessage});
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


obtener_usuario(user, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: err.sqlMessage});
		}else{
		var query = "CALL pa_obtener_usuario("+ [user.idbusqueda] +")"; 
		con.query(query,(err, result) => {
			con.release();
			if(err){
                res.send({status: 0, message: err.sqlMessage});
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
			res.send({status: 0, message: err.sqlMessage});
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
                            res.send({status: 0, message: err.sqlMessage});
                        }else{
                            if (result.affectedRows == 1) {
                                res.send({status: 1, message: 'USUARIO ACTUALIZADO'});
                            } else {
                                res.send({status: 2, message: 'USUARIO NO ACTUALIZADO'});
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
			res.send({status: 0, message: err.sqlMessage});
		}else{
		var query = "CALL pa_resetear_usuario("+ [user.idbusqueda] +")"; 
		/* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
		con.query(query,(err, result) => {
			con.release();
			if(err){
                res.send({status: 0, message: err.sqlMessage});
			}else{
				if (result.affectedRows == 0) {
					res.send({status: 2, message: 'CAMBIOS NO REALIZADOS'});
				} else {
					res.send({status: 1, message: 'USUARIO RESETEADO'});
				}
			}
		});
		}
	});
};

eliminar_usuario(user, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: err.sqlMessage});
		}else{
		var query = "CALL pa_eliminar_usuario("+ [user.idbusqueda] +")"; 
		con.query(query,(err, result) => {
			con.release();
			if(err){
                res.send({status: 0, message: err.sqlMessage});
			}else{
				if (result.affectedRows == 0) {
					res.send({status: 2, message: 'USUARIO NO ELIMINADO'});
				} else {
					res.send({status: 1, message: 'USUARIO ELIMINADO'});
				}
			}
		});
		}
	});
};

update_clave(usuario, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
		}else{
        
				
					var query = "CALL pa_update_clave('"+ [usuario.datobusqueda] 
					+"',"+ [usuario.idbusqueda] + ")";
                    con.query(query,(err, result) => {
                        if(err){
                            res.send({status: 0, message: err.sqlMessage});
                        }else{
                            if (result.affectedRows == 1) {
                                res.send({status: 1, message: 'Clave Actualizada'});
                            } else {
                                res.send({status: 2, message: 'Clave No Actualizada'});
                            }
                        }
                    });
        
		}
	});
};

nvo_anhio(anhio, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: err.sqlMessage});
		}else{
        if ([anhio.descripcion_anhio]==''){
            var descripcion="NULL";
        }else{
            descripcion="'"+[anhio.descripcion_anhio]+"'";
        }

        var query_anhio = "CALL pa_verificar_anhio('"+ [anhio.anhio_lectivo] +"')";

        con.query(query_anhio,(err, result) => {
            con.release();
			if(err){
                res.send({status: 0, message: err.sqlMessage});
			}else{
				if (result[0].length == 0) {
					var query = "CALL pa_insertar_anhio('"+ [anhio.anhio_lectivo] +
					"','"+[anhio.finicio_anhio]+"','"+[anhio.ffin_anhio]+"',"+descripcion+")";
		         
                    con.query(query,(err, result) => {
                        if(err){
                            res.send({status: 0, message: err.sqlMessage});
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
			res.send({status: 0, message: err.sqlMessage});
		}else{
          con.query('CALL pa_listar_anhio()', (err, result) => {
            con.release();
            if(err){
                res.send({status: 0, message: err.sqlMessage});
			}else{
				if (result[0].length == 0) {
					res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA AÑO',data:result[0]});
				} else {
                    res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                }
			}
           
		});
	}
    });
};

update_anhio_xcriterio(anhio, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: err.sqlMessage});
		}else{
		  if([anhio.datobusqueda]=='reaperturar'){
            con.query('CALL pa_verificar_si_anhio_aperturado()', (err, result) => {
				con.release();
				if(err){
					res.send({status: 0, message: err.sqlMessage});
				}else{
					if (result[0].length == 0) {
						var query = "CALL pa_update_anhio_xcriterio('"+[anhio.datobusqueda]+"',"+ [anhio.idbusqueda] +")"; 
						/* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
						con.query(query,(err, result) => {
							if(err){
								res.send({status: 0, message: err.sqlMessage});
							}else{
								if (result.affectedRows == 0) {
									res.send({status: 2, message: 'CAMBIOS NO REALIZADOS'});
								} else {
									con.query('CALL pa_verificar_si_anhio_aperturado()',(err, result) => {
										if(err){
											res.send({status: 0, message: err.sqlMessage});
										}else{
											if (result.affectedRows == 0) {
												res.send({status: 3, message: 'AÑO LECTIVO NO APERTURADO'});
											} else {												
												res.send({status: 1, message: 'AÑO LECTIVO APERTURADO',data:result[0]});
											}
										}
									});
								}
							}
						});
					} else {
						res.send({status: 2, message: 'DEBE CERRAR AÑO APERTURADO'});
					}
				}
			   
			});
		  }else{
			var query = "CALL pa_update_anhio_xcriterio('"+[anhio.datobusqueda]+"',"+ [anhio.idbusqueda] +")"; 
			/* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
			con.query(query,(err, result) => {
				con.release();
				if(err){
					res.send({status: 0, message: err.sqlMessage});
				}else{
					if (result.affectedRows == 0) {
						res.send({status: 2, message: 'CAMBIOS NO REALIZADOS'});
					} else {
						if([anhio.datobusqueda]=='eliminar'){
							con.query('CALL pa_verificar_si_anhio_aperturado()',(err, result) => {
								if(err){
									res.send({status: 0, message: err.sqlMessage});
								}else{
									if (result.affectedRows == 0) {
										res.send({status: 3, message: 'AÑO LECTIVO NO APERTURADO'});
									} else {												
										res.send({status: 1, message: 'AÑO LECTIVO ELIMINADO',data:result[0]});
									}
								}
							});
							
						}else{
							if([anhio.datobusqueda]=='cerrar'){
								res.send({status: 1, message: 'AÑO LECTIVO FINALIZADO'});
							}
						}
					}
				}
			});
		  }
		}
	});
};

listar_grados(res) {
    connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
		}else{
        con.query("CALL pa_listar_grados('S')", (err, result) => {
            con.release();
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
			}else{
				if (result[0].length == 0) {
					res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA GRADOS'});
				} else {
                    res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                }
			}
           
		});
	}
    });
};

listar_grados_activos(res) {
    connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
		}else{
        con.query("CALL pa_listar_grados_activos('S')", (err, result) => {
            con.release();
            if(err){
                res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
			}else{
				if (result[0].length == 0) {
					res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA GRADOS'});
				} else {
                    res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                }
			}
           
		});
	}
    });
};


cambiar_estado_grado(grado, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: err.sqlMessage});
		}else{
		var query = "CALL pa_cambiar_estado_grado("+ [grado.idbusqueda] +","+ [grado.datobusqueda] +")"; 
		con.query(query,(err, result) => {
			con.release();
			if(err){
                res.send({status: 0, message: err.sqlMessage});
			}else{
				if (result.affectedRows == 0) {
					res.send({status: 2, message: 'CAMBIOS NO REALIZADOS'});
				} else {
					res.send({status: 1, message: 'CAMBIO REALIZADO'});
				}
			}
		});
		}
	});
};

listar_secciones_xgrados(grado,res) {
    connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: err.sqlMessage});
		}else{
        con.query("CALL pa_listar_secciones_xgrado("+ [grado.idbusqueda] +")", (err, result) => {
            con.release();
            if(err){
                res.send({status: 0, message: err.sqlMessage});
			}else{
				if (result[0].length == 0) {
					res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA SECCIONES'});
				} else {
                    res.send({status: 1, message: 'SECCIONES REGISTRADAS',data:result[0]});
                }
			}
           
		});
	}
    });
};

nva_seccion(seccion, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: err.sqlMessage});
		}else{

		var query_seccion = "CALL pa_verificar_seccion('"+ [seccion.nombre_seccion] +"',"
	                       + [seccion.id_grado] +")";
        
        con.query(query_seccion,(err, result) => {
            con.release();
			if(err){
                res.send({status: 0, message: err.sqlMessage});
			}else{
				if (result[0].length == 0) {
					var query = "CALL pa_insertar_seccion('"+ [seccion.nombre_seccion] 
                    +"',"+ [seccion.id_grado] + ",'"+ [seccion.id_turno] +"')";
		
                    con.query(query,(err, result) => {
                        if(err){
                            res.send({status: 0, message: err.sqlMessage});
                        }else{
                            if (result.affectedRows == 1) {
                                res.send({status: 1, message: 'Sección Registrada'});
                            } else {
                                res.send({status: 2, message: 'Sección No Registrada'});
                            }
                        }
                    });
				} else {
					res.send({status: 3, message: 'NOMBRE DE SECCION YA REGISTRADA'});
				}
			}
		});

        
		}
	});
};

eliminar_seccion(seccion, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: err.sqlMessage});
		}else{
		var query = "CALL pa_eliminar_seccion("+ [seccion.idbusqueda] +")"; 
		/* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
		con.query(query,(err, result) => {
			con.release();
			if(err){
                res.send({status: 0, message: err.sqlMessage});
			}else{
				if (result.affectedRows == 0) {
					res.send({status: 2, message: 'SECCION NO ELIMINADA'});
				} else {
					res.send({status: 1, message: 'SECCION ELIMINADA'});
				}
			}
		});
		}
	});
};

listar_libros_activos(res) {
    connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: err.sqlMessage});
		}else{
        con.query("CALL pa_listar_libros_activos()", (err, result) => {
            con.release();
            if(err){
                res.send({status: 0, message: err.sqlMessage});
			}else{
				if (result[0].length == 0) {
					res.send({status: 2, message: 'NO HAY DATOS EN LA TABLA LIBROS',data:result[0]});
				} else {
                    res.send({status: 1, message: 'CONSULTA EXITOSA',data:result[0]});
                }
			}
           
		});
	}
    });
};

nvo_libro(libro, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
		}else{
        
				
					var query = "CALL pa_insertar_libro('"+ [libro.titulo_libro.toUpperCase()] 
					+"','"+ [libro.editorial_libro.toUpperCase()] + "','"+[libro.edicion_libro]
					+"',"+ [libro.id_grado] + ")";
                    con.query(query,(err, result) => {
                        if(err){
                            res.send({status: 0, message: err.sqlMessage});
                        }else{
                            if (result.affectedRows == 1) {
                                res.send({status: 1, message: 'Libro Registrado'});
                            } else {
                                res.send({status: 2, message: 'Libro No Registrado'});
                            }
                        }
                    });
        
		}
	});
};

update_libro(libro, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: 'ERROR EN LA BASE DE DATOS'});
		}else{
                var query = "CALL pa_update_libro('"+ [libro.titulo_libro.toUpperCase()] +"','"+ [libro.editorial_libro.toUpperCase()] 
                    + "','" +[libro.edicion_libro.toUpperCase()]+"'," + [libro.id_grado] + ","+[libro.id_libro]+")";
		
                con.query(query,(err, result) => {
                        if(err){
                            res.send({status: 0, message: err.sqlMessage});
                        }else{
                            if (result.affectedRows == 1) {
                                res.send({status: 1, message: 'Libro Actualizado'});
                            } else {
                                res.send({status: 2, message: 'Libro No Actualizado'});
                            }
                        }
                    });
        
		}
	});
};

eliminar_libro(libro, res) {
	connection.acquire((err, con) => {
		if(err){
			res.send({status: 0, message: err.sqlMessage});
		}else{
		var query = "CALL pa_eliminar_libro("+ [libro.idbusqueda] +")"; 
		/* res.send("CALL pa_obtener_usuario("+ [user.idbusqueda] +")");  */
		con.query(query,(err, result) => {
			con.release();
			if(err){
                res.send({status: 0, message: err.sqlMessage});
			}else{
				if (result.affectedRows == 0) {
					res.send({status: 2, message: 'LIBRO NO ELIMINADO'});
				} else {
					res.send({status: 1, message: 'LIBRO ELIMINADO'});
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