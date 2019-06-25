-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 25-06-2019 a las 05:35:51
-- Versión del servidor: 5.5.24-log
-- Versión de PHP: 5.4.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `apafa_chalpon`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_buscar_dni_usuario`(IN `dni` CHAR(8))
    NO SQL
SELECT * FROM usuario
WHERE dni_usu=dni
AND estado_usu=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_buscar_doc_alumno`(IN `doc` VARCHAR(15))
    NO SQL
SELECT id_alumno,apellidos_alumno,nombres_alumno,
(CASE WHEN sexo_alumno='M' THEN 'MASCULINO' ELSE 'FEMENINO' END)
AS sexo_alumno FROM alumno
WHERE doc_alumno=doc
AND estado_alumno=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_buscar_doc_apoderado`(IN `doc` VARCHAR(15))
    NO SQL
SELECT * FROM apoderado
WHERE doc_apoderado=doc
AND estado_apoderado=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_cambiar_estado_grado`(IN `grado` INT, IN `estado` BIT)
    NO SQL
UPDATE grados SET estado_grado=estado 
WHERE id_grado=grado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_cambiar_lista_reunion`(IN `reunion` SMALLINT)
    NO SQL
UPDATE reunion SET lista_reunion=1
WHERE id_reunion=reunion$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_consultar_nomusuario`(IN `nom` VARCHAR(20))
    NO SQL
SELECT * FROM usuario
WHERE nom_usu=nom
AND estado_usu=1
AND fbaja_usu IS NULL$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_detalle_alumno`(IN `id` SMALLINT)
    NO SQL
SELECT id_alumno,(CASE WHEN tdoc_alumno='OTR' THEN 'OTROS' ELSE 'DNI' END) AS tdoc_alumno,doc_alumno,apellidos_alumno,
nombres_alumno,fnac_alumno,(CASE WHEN sexo_alumno='M' THEN 'MASCULINO' ELSE 'FEMENINO' END) AS sexo_alumno,
telefono_alumno,celular_alumno,direccion_alumno,correo_alumno,procedencia_alumno,apellidos_padre,
nombres_padre,celular_padre,correo_padre,apellidos_madre,nombres_madre,celular_madre,correo_madre FROM alumno
WHERE id_alumno=id
AND estado_alumno=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_detalle_apoderado`(IN `id` SMALLINT)
    NO SQL
SELECT id_apoderado, (CASE WHEN tdoc_apoderado='OTR' THEN 'OTROS' ELSE 'DNI' END) AS tdoc_apoderado, doc_apoderado, apellidos_apoderado,nombres_apoderado,(CASE WHEN sexo_apoderado='M' THEN 'MASCULINO' ELSE 'FEMENINO' END) AS sexo_apoderado, celular_apoderado, direccion_apoderado, correo_apoderado FROM apoderado
WHERE id_apoderado=id
AND estado_apoderado=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_detalle_usuario`(IN `usuario` SMALLINT)
    NO SQL
SELECT u.idusuario,u.apellidos_usu,u.nombres_usu,
u.dni_usu,u.celular_usu,
(CASE 
WHEN u.sexo_usu='M' THEN "MASCULINO"
ELSE "FEMENINO" 
END) as sexo_usu,u.direccion_usu,u.correo_usu,
u.nom_usu,pu.nombre_perfil,u.fcreacion_usu,u.fbaja_usu,
u.obser_usu FROM usuario u
INNER JOIN perfil_usuario pu ON pu.idperfil_usuario=u.idperfil_usuario
WHERE u.idusuario=usuario
AND u.estado_usu=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_devolver_libro`(IN `matricula` SMALLINT, IN `libro` SMALLINT, IN `estado` BIT(1))
    NO SQL
UPDATE libro_matricula SET devolvio_libro=estado
WHERE id_matricula=matricula
AND id_libro=libro$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_alumno`(IN `id` SMALLINT)
    NO SQL
UPDATE alumno SET estado_alumno=0
WHERE id_alumno=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_anhio`(IN `anhio` SMALLINT)
    NO SQL
UPDATE anhio_lectivo SET estado_anhio=0 WHERE idanhio=anhio$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_apoderado`(IN `id_apo` SMALLINT)
    NO SQL
UPDATE apoderado SET estado_apoderado=0 WHERE id_apoderado=id_apo$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_concepto`(IN `id` SMALLINT)
    NO SQL
UPDATE concepto_apafa SET estado_concepto=0
WHERE id_concepto=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_libro`(IN `idlibro` SMALLINT)
    NO SQL
UPDATE libro SET estado_libro=0 WHERE id_libro=idlibro$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_usuario`(IN `id_usu` SMALLINT)
    NO SQL
UPDATE usuario SET estado_usu=0
WHERE idusuario=id_usu$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_iniciar_sesion`(IN `nom` VARCHAR(20), IN `clave` VARCHAR(15))
    NO SQL
SELECT u.idusuario,u.nom_usu,pu.abrev_perfil,pu.nombre_perfil,
(SELECT anhio from anhio_lectivo WHERE condicion_anhio='A') AS anhio_lectivo FROM usuario u
INNER JOIN perfil_usuario pu ON u.idperfil_usuario=pu.idperfil_usuario
WHERE u.nom_usu=nom
AND u.clave_usu=SHA(clave)
AND u.estado_usu=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_alumno`(IN `tdoc` CHAR(3), IN `doc` VARCHAR(15), IN `ape_alum` VARCHAR(60), IN `nom_alum` VARCHAR(50), IN `fnac` DATE, IN `sexo` CHAR(1), IN `tel_alum` CHAR(6), IN `cel_alum` CHAR(9), IN `dire_alum` VARCHAR(80), IN `correo_alum` VARCHAR(80), IN `proc_alum` VARCHAR(100), IN `ape_padre` VARCHAR(60), IN `nom_padre` VARCHAR(50), IN `cel_padre` CHAR(9), IN `correo_pa` VARCHAR(80), IN `ape_madre` VARCHAR(60), IN `nom_madre` VARCHAR(50), IN `cel_madre` CHAR(9), IN `correo_ma` VARCHAR(80))
    NO SQL
INSERT INTO alumno(tdoc_alumno, 
doc_alumno, apellidos_alumno,nombres_alumno,fnac_alumno, 
sexo_alumno,telefono_alumno,celular_alumno, 
direccion_alumno,correo_alumno, 
procedencia_alumno,apellidos_padre, 
nombres_padre,celular_padre,correo_padre, 
apellidos_madre,nombres_madre,celular_madre, 
correo_madre) VALUES (tdoc,doc,ape_alum,nom_alum,fnac,
sexo,tel_alum,cel_alum,dire_alum,correo_alum,proc_alum,ape_padre,
nom_padre,cel_padre,correo_pa,ape_madre,nom_madre,cel_madre,
correo_ma)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_anhio`(IN `anhio` CHAR(4), IN `finicio` DATE, IN `ffin` DATE, IN `descripcion` VARCHAR(150))
INSERT INTO anhio_lectivo(anhio, finicio_anhio,
ffin_anhio, descripcion_anhio) 
VALUES (anhio,finicio,ffin,descripcion)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_apoderado`(IN `tdoc_apod` CHAR(3), IN `doc_apod` VARCHAR(15), IN `ape_apod` VARCHAR(60), IN `nom_apod` VARCHAR(50), IN `sex_apod` CHAR(1), IN `cel_apod` CHAR(9), IN `direc_apod` VARCHAR(80), IN `cor_apod` VARCHAR(80))
    NO SQL
INSERT INTO apoderado(tdoc_apoderado, 
doc_apoderado, apellidos_apoderado, nombres_apoderado,
sexo_apoderado, celular_apoderado, direccion_apoderado,
correo_apoderado) VALUES (tdoc_apod,doc_apod,
ape_apod,nom_apod,sex_apod,cel_apod,direc_apod,cor_apod)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_compra`(IN `usu` SMALLINT, IN `codanhio` CHAR(4), IN `tipo` CHAR(1), IN `num` VARCHAR(10), IN `rsocial` VARCHAR(50), IN `ruc` CHAR(11), IN `fecha` DATE, IN `doc` VARCHAR(15), IN `encargado` VARCHAR(80), IN `total` FLOAT)
    NO SQL
INSERT INTO compra(id_usuario,id_anhio,tipo_compra,
num_compra,razon_social_compra, ruc_compra,
fecha_compra,freg_compra,doc_encargado_compra,
encargado_compra, total_compra) 
VALUES (usu,(SELECT idanhio from
anhio_lectivo WHERE condicion_anhio='A' 
AND estado_anhio=1
AND anhio=codanhio),tipo,num,rsocial,ruc,fecha,NOW(),doc,
encargado,total)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_concepto_apafa`(IN `des_concepto` VARCHAR(100), IN `tipo` CHAR(1), IN `anhio_lec` CHAR(4), IN `monto` FLOAT(10,2))
    NO SQL
INSERT INTO concepto_apafa (descripcion_concepto, tipo_concepto, id_anhio, monto_concepto) 
VALUES (des_concepto,tipo,(SELECT idanhio FROM anhio_lectivo WHERE anhio=anhio_lec AND condicion_anhio='A' AND estado_anhio=1),monto)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_detalle_compra`(IN `compra` SMALLINT, IN `producto` VARCHAR(30), IN `cant` INT, IN `med` VARCHAR(10), IN `precio` FLOAT)
    NO SQL
INSERT INTO detalle_compra(id_compra,nom_producto,
cantidad,medida,precio_unit) VALUES (compra,
producto,cant,med,precio)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_detalle_recibo`(IN `id_detalle` SMALLINT, IN `recibo` SMALLINT, IN `monto` FLOAT(10,2))
    NO SQL
INSERT INTO detalle_recibo(id_detalle_deuda, id_recibo, monto_detalle) VALUES (id_detalle,recibo,monto)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_deuda_apafa`(IN `apoderado` SMALLINT, IN `dato_anhio` CHAR(4))
    NO SQL
INSERT INTO detalle_deuda(id_concepto,id_apoderado,saldo_deuda,freg_deuda,fseg_deuda) 
VALUES ((SELECT ca.id_concepto FROM concepto_apafa ca 
INNER JOIN anhio_lectivo a ON a.idanhio=ca.id_anhio 
WHERE ca.tipo_concepto='A' AND a.anhio=dato_anhio AND a.condicion_anhio='A' 
AND a.estado_anhio=1 AND ca.estado_concepto=1),apoderado,
(SELECT ca.monto_concepto FROM concepto_apafa ca 
INNER JOIN anhio_lectivo a ON a.idanhio=ca.id_anhio 
WHERE ca.tipo_concepto='A' AND a.anhio=dato_anhio AND a.condicion_anhio='A' 
AND a.estado_anhio=1 AND ca.estado_concepto=1),CURDATE(),NOW())$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_libro`(IN `titulo_lib` VARCHAR(80), IN `edit_libro` VARCHAR(20), IN `grado` INT)
    NO SQL
INSERT INTO libro (titulo_libro, editorial_libro,id_grado ) 
VALUES (titulo_lib,edit_lib,grado)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_libro_xmatricula`(IN `matricula` SMALLINT, IN `libro` SMALLINT)
    NO SQL
INSERT INTO libro_matricula(id_matricula, id_libro) 
VALUES (matricula,libro)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_matricula`(IN `fecha` DATE, IN `idapo` SMALLINT, IN `idalum` SMALLINT, IN `idseccion` SMALLINT, IN `idrelacion` SMALLINT, IN `codanhio` CHAR(4))
    NO SQL
INSERT INTO matricula(fecha_matricula, 
id_apoderado, id_alumno,id_anhio, 
id_seccion,id_tipo_relacion) 
VALUES (fecha,idapo,idalum,(SELECT idanhio from
anhio_lectivo WHERE condicion_anhio='A' 
AND estado_anhio=1
AND anhio=codanhio),idseccion,idrelacion)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_nvo_recibo`(IN `apo` SMALLINT, IN `usu` SMALLINT, IN `mtotal` FLOAT, IN `num` VARCHAR(20))
    NO SQL
INSERT INTO recibo(id_apoderado,id_usuario,mtotal_recibo,freg_recibo, num_recibo) 
VALUES (apo,usu,mtotal,NOW(),num)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_otro_ingreso`(IN `descripcion` VARCHAR(100), IN `monto` FLOAT(10,2), IN `doc` VARCHAR(15), IN `datos` VARCHAR(100), IN `usu` SMALLINT)
    NO SQL
INSERT INTO otro_ingreso (descripcion_ingreso,monto_ingreso,freg_ingreso,doc_encargado_ingreso, datos_encargado_ingreso, id_usuario) 
VALUES (descripcion,monto,NOW(),doc,datos,usu)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_reunion`(IN `motivo` VARCHAR(100), IN `fecha` DATE, IN `hora` TIME, IN `concepto` SMALLINT)
    NO SQL
INSERT INTO reunion(motivo_reunion, fecha_reunion,hora_reunion,id_concepto) 
VALUES (motivo,fecha,hora,concepto)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_reunion_apoderado`(IN `reunion` SMALLINT, IN `apoderado` SMALLINT)
    NO SQL
INSERT INTO reunion_apoderado(id_reunion,id_apoderado) 
VALUES (reunion,apoderado)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_seccion`(IN `nombre` VARCHAR(20), IN `grado` INT, IN `turno` CHAR(1))
    NO SQL
INSERT INTO secciones(nombre_seccion,id_grado,id_turno) 
VALUES (nombre,grado,turno)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_usuario`(IN `nom_usu` VARCHAR(20), IN `clave` VARCHAR(15), IN `dni` CHAR(8), IN `nombres` VARCHAR(45), IN `apellidos` VARCHAR(60), IN `sexo` CHAR(1), IN `celular` CHAR(9), IN `correo` VARCHAR(80), IN `direccion` VARCHAR(80), IN `fcreacion` DATE, IN `obser` VARCHAR(50), IN `perfil` INT)
INSERT INTO usuario(nom_usu, 
clave_usu,dni_usu,nombres_usu,apellidos_usu, 
sexo_usu,celular_usu,correo_usu,
direccion_usu,fcreacion_usu,
obser_usu,idperfil_usuario)
VALUES (nom_usu,SHA(clave),dni,nombres,apellidos,sexo,
celular,correo,direccion,fcreacion,obser,perfil)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_alumnos`()
    NO SQL
SELECT id_alumno,apellidos_alumno,
nombres_alumno,tdoc_alumno,doc_alumno,
(CASE
   WHEN sexo_alumno='M' THEN 'MASCULINO'
   ELSE 'FEMENINO'
 END) as sexo_alumno,celular_alumno FROM alumno
WHERE estado_alumno=1
ORDER BY apellidos_alumno$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_anhio`()
    NO SQL
SELECT idanhio,anhio,finicio_anhio,ffin_anhio,
LEFT(descripcion_anhio,20) as descripcion_anhio,
(CASE
  WHEN condicion_anhio='N' THEN 'NUEVO'
  WHEN condicion_anhio='A' THEN 'APERTURADO'
  WHEN condicion_anhio='R' THEN 'REAPERTURADO'
  ELSE 'CERRADO'
 END) as condicion,
 (CASE
  WHEN condicion_anhio='N' THEN '#0d28e8'
  WHEN condicion_anhio='A' THEN '#2a7703'
  WHEN condicion_anhio='R' THEN '#ff7600'
  ELSE '#e4040e'
 END) as color_condicion
  FROM anhio_lectivo
WHERE estado_anhio=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_apoderados`()
    NO SQL
SELECT id_apoderado,doc_apoderado,apellidos_apoderado,
nombres_apoderado,(CASE WHEN sexo_apoderado='M' THEN 'MASCULINO' ELSE 'FEMENINO' END) AS sexo_apoderado,
celular_apoderado
FROM apoderado
WHERE estado_apoderado=1
ORDER BY apellidos_apoderado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_apoderados_matricula`(IN `dato_anhio` CHAR(4))
    NO SQL
SELECT m.id_apoderado FROM matricula m 
INNER JOIN anhio_lectivo a ON a.idanhio=m.id_anhio
WHERE a.anhio=dato_anhio
GROUP BY m.id_apoderado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_apoderados_reunion`(IN `reunion` SMALLINT, IN `anhio` CHAR(4))
    NO SQL
SELECT m.id_apoderado,ap.doc_apoderado,CONCAT(ap.apellidos_apoderado,' ',ap.nombres_apoderado) AS apoderado,GROUP_CONCAT(a.apellidos_alumno,' ',a.nombres_alumno,'
') AS matriculados,ra.asistio_reunion 
FROM matricula m 
INNER JOIN alumno a ON a.id_alumno=m.id_alumno 
INNER JOIN anhio_lectivo al ON al.idanhio=m.id_anhio
INNER JOIN apoderado ap ON ap.id_apoderado=m.id_apoderado
INNER JOIN reunion_apoderado ra ON ra.id_apoderado=m.id_apoderado
WHERE al.anhio=anhio 
AND ra.id_reunion=reunion
GROUP BY m.id_apoderado,ap.doc_apoderado,ra.asistio_reunion
ORDER BY ap.apellidos_apoderado,ap.nombres_apoderado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_compras_xperiodo`(IN `cod_anhio` CHAR(4))
    NO SQL
SELECT id_compra,id_anhio,(CASE WHEN tipo_compra='F' THEN 'FACTURA'
                          ELSE 'BOLETA' END) as tipo_compra,num_compra, razon_social_compra,ruc_compra, fecha_compra,freg_compra, doc_encargado_compra, encargado_compra, total_compra, estado_compra FROM compra
WHERE estado_compra=1
AND id_anhio=(SELECT idanhio FROM anhio_lectivo WHERE condicion_anhio='A' AND estado_anhio=1 AND anhio=cod_anhio)
ORDER BY freg_compra DESC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_detalle_compra`(IN `compra` SMALLINT)
    NO SQL
SELECT * FROM detalle_compra
WHERE id_compra=compra$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_detalle_deuda_pendientes`(IN `apo` SMALLINT)
    NO SQL
SELECT de.id_detalle_deuda,ca.descripcion_concepto,de.saldo_deuda,
(CASE WHEN de.estado_deuda='P' THEN 'PENDIENTE'
ELSE 'PAGADO' END) AS estado_deuda,'' as tipo_pago,0 as monto FROM detalle_deuda de 
INNER JOIN concepto_apafa ca ON ca.id_concepto=de.id_concepto
WHERE de.id_apoderado=apo
AND de.estado_deuda!='E'
AND de.estado_deuda='P'$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_grados`(IN `nivel` CHAR(1))
    NO SQL
SELECT g.id_grado,g.descripcion_grado,g.nivel_grado,
(CASE 
     WHEN estado_grado=1 THEN 'ACTIVO'
     ELSE 'INACTIVO'
END) as estado, g.estado_grado,
(CASE
     WHEN s.total!=0 THEN s.total
    ELSE 0
END) as total FROM grados g
 LEFT JOIN
  (SELECT id_grado, COUNT(*) total FROM secciones GROUP BY id_grado) s
   ON g.id_grado = s.id_grado
 WHERE g.nivel_grado=nivel$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_grados_activos`(IN `nivel` CHAR(1))
    NO SQL
SELECT * FROM grados g
 WHERE g.nivel_grado=nivel
 AND g.estado_grado=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_historial_matricula`(IN `alumno` SMALLINT)
    NO SQL
SELECT m.id_matricula,g.descripcion_grado,s.nombre_seccion,a.anhio, ap.id_apoderado,ap.apellidos_apoderado,ap.nombres_apoderado,ap.doc_apoderado,deuda.total FROM apoderado ap LEFT JOIN
    (  SELECT id_apoderado, SUM(saldo_deuda) as total
       FROM detalle_deuda GROUP BY id_apoderado
    ) deuda ON ap.id_apoderado = deuda.id_apoderado
 INNER JOIN matricula m ON m.id_apoderado=ap.id_apoderado
 INNER JOIN secciones s ON s.id_seccion=m.id_seccion
 INNER JOIN grados g ON g.id_grado=s.id_grado
 INNER JOIN anhio_lectivo a ON a.idanhio=m.id_anhio
 WHERE m.id_alumno=alumno
 GROUP BY ap.id_apoderado,m.id_matricula,g.descripcion_grado,s.nombre_seccion,a.anhio$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_ingresos_xperiodo`(IN `anhio` CHAR(4))
    NO SQL
SELECT r.id_recibo AS id_ingreso,a.id_apoderado as id_apoderado,r.num_recibo AS doc_ingreso, 
CONCAT(a.apellidos_apoderado,' ',a.nombres_apoderado) as descripcion_ingreso,r.mtotal_recibo AS monto_ingreso, 
r.freg_recibo AS freg_ingreso
FROM recibo r
INNER JOIN apoderado a ON a.id_apoderado=r.id_apoderado
WHERE r.estado_recibo =1 AND YEAR(r.freg_recibo)=anhio
UNION ALL 
SELECT id_otro_ingreso AS id_ingreso,'' AS id_apoderdo, 
doc_encargado_ingreso AS doc_ingreso, 
descripcion_ingreso as descripcion_ingreso,
monto_ingreso AS monto_ingreso, freg_ingreso AS freg_ingreso
FROM otro_ingreso
WHERE estado_ingreso =1 AND YEAR(freg_ingreso)=anhio
ORDER BY freg_ingreso DESC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_libros_xgrado`(IN `grado` INT, IN `matricula` SMALLINT)
    NO SQL
SELECT * FROM libro l WHERE NOT EXISTS 
(SELECT * FROM libro_matricula lm WHERE lm.id_libro = l.id_libro
AND lm.id_matricula=matricula)
AND l.id_grado=grado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_libros_xmatricula`(IN `matricula` SMALLINT)
    NO SQL
SELECT * FROM libro_matricula lm
INNER JOIN libro l ON l.id_libro=lm.id_libro
WHERE id_matricula=matricula$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_matriculados`()
    NO SQL
SELECT a.id_alumno,a.doc_alumno,CONCAT(a.apellidos_alumno,' ',a.nombres_alumno) as datos_alumno,m.id_matricula,
g.descripcion_grado as grado,g.id_grado,s.nombre_seccion as seccion FROM matricula m 
INNER JOIN apoderado ap ON m.id_apoderado=ap.id_apoderado
INNER JOIN alumno a ON a.id_alumno=m.id_alumno
INNER JOIN anhio_lectivo an ON an.idanhio=m.id_anhio
INNER JOIN secciones s ON s.id_seccion=m.id_seccion
INNER JOIN grados g ON g.id_grado=s.id_grado
INNER JOIN tipo_relacion tr ON tr.id_tipo_relacion=m.id_tipo_relacion
WHERE m.estado_matricula=1
AND m.id_anhio=(SELECT idanhio FROM anhio_lectivo WHERE condicion_anhio='A' AND estado_matricula=1)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_otros_conceptos`(IN `dato_anhio` CHAR(4))
    NO SQL
SELECT * FROM concepto_apafa c 
INNER JOIN anhio_lectivo a ON a.idanhio=c.id_anhio
WHERE c.estado_concepto=1
AND c.tipo_concepto='O'
AND a.anhio=dato_anhio$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_perfil_usuario`()
    NO SQL
SELECT * FROM perfil_usuario
WHERE estado_perfil=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_reuniones_xperiodo`(IN `dato_anhio` CHAR(4))
    NO SQL
SELECT r.id_reunion, r.motivo_reunion,CONCAT(r.fecha_reunion,' ',r.hora_reunion) AS fecha_reunion,r.lista_reunion,r.id_concepto,r.estado_reunion,c.descripcion_concepto,
c.monto_concepto,a.anhio
FROM reunion r
INNER JOIN concepto_apafa c ON c.id_concepto=r.id_concepto
INNER JOIN anhio_lectivo a ON a.idanhio=c.id_anhio
WHERE r.estado_reunion=1
AND a.anhio=dato_anhio
ORDER BY r.id_reunion DESC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_secciones_xgrado`(IN `grado` INT)
    NO SQL
SELECT s.id_seccion,s.nombre_seccion,g.descripcion_grado,g.id_grado,
(CASE 
     WHEN s.id_turno='M' THEN 'MAÑANA'
     ELSE 'TARDE'
END) as turno FROM secciones s 
INNER JOIN grados g ON g.id_grado=s.id_grado 
WHERE s.estado_seccion=1
AND g.id_grado=grado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_tipo_relacion`()
    NO SQL
SELECT * FROM tipo_relacion
WHERE estado_relacion=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_todos_conceptos`(IN `anhio_lec` CHAR(4))
    NO SQL
SELECT id_concepto,descripcion_concepto,(CASE WHEN tipo_concepto='A'
THEN 'APAFA' ELSE 'OTROS' END) AS tipo_concepto,id_anhio,
monto_concepto FROM concepto_apafa c
INNER JOIN anhio_lectivo al ON al.idanhio=c.id_anhio
WHERE al.anhio=anhio_lec$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_usuarios`()
    NO SQL
SELECT u.idusuario,u.apellidos_usu,u.nombres_usu,
u.nom_usu,u.celular_usu,pu.nombre_perfil,
(CASE 
WHEN u.fbaja_usu IS NULL THEN 'ACTIVO'
ELSE 'INACTIVO'
END ) AS estado_usu,
(CASE 
WHEN u.fbaja_usu IS NULL THEN '#2a7703'
ELSE 'red'
END) as color_estado FROM usuario u
INNER JOIN perfil_usuario pu ON pu.idperfil_usuario=u.idperfil_usuario
WHERE u.estado_usu=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_obtener_detalle_recibo`(IN `num` VARCHAR(20))
    NO SQL
SELECT c.descripcion_concepto,convert(dr.monto_detalle, decimal(10,2)) as monto_detalle FROM detalle_recibo dr 
INNER JOIN detalle_deuda d ON dr.id_detalle_deuda=d.id_detalle_deuda
INNER JOIN recibo r ON r.id_recibo=dr.id_recibo
INNER JOIN concepto_apafa c ON c.id_concepto=d.id_concepto
WHERE r.num_recibo=num
AND r.estado_recibo=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_obtener_idconcepto_apafa`(IN `dato_anhio` CHAR(4))
    NO SQL
SELECT ca.id_concepto FROM concepto_apafa ca 
INNER JOIN anhio_lectivo a ON a.idanhio=ca.id_anhio
INNER JOIN tipo_concepto tc ON tc.id_tconcepto=ca.id_tipo_concepto
WHERE tc.cod_tconcepto='00'
AND ca.id_anhio=(SELECT idanhio FROM anhio_lectivo WHERE condicion_anhio='A' AND estado_anhio=1 AND anhio=dato_anhio)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_obtener_usuario`(IN `cod` INT)
    NO SQL
SELECT * FROM usuario u
INNER JOIN perfil_usuario pu ON pu.idperfil_usuario=u.idperfil_usuario
WHERE u.idusuario=cod
AND u.estado_usu=1
AND u.fbaja_usu IS NULL$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_quitar_entrega_libro`(IN `matricula` SMALLINT, IN `libro` SMALLINT)
    NO SQL
DELETE FROM libro_matricula
WHERE id_matricula=matricula
AND id_libro=libro$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_registrar_asistencia_reunion`(IN `reunion` SMALLINT, IN `apoderado` SMALLINT, IN `opt` BIT(1))
    NO SQL
UPDATE reunion_apoderado SET asistio_reunion=opt
WHERE id_reunion=reunion AND id_apoderado=apoderado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_resetear_clave`(IN `id_usu` SMALLINT)
    NO SQL
UPDATE usuario SET clave_usu=SHA('1A2B3C4D')
WHERE idusuario=id_usu$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_ultima_compra`(IN `anhio` CHAR(4))
    NO SQL
SELECT *
  FROM compra
  WHERE estado_compra=1
  AND YEAR(freg_compra)=anhio
 ORDER BY id_compra DESC
  limit 1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_ultimo_recibo_ingresado`(IN `anhio` CHAR(4))
    NO SQL
SELECT *
  FROM recibo
  WHERE estado_recibo=1
  AND YEAR(freg_recibo)=anhio
 ORDER BY id_recibo DESC
  limit 1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_alumno`(IN `id` SMALLINT, IN `ape_alum` VARCHAR(60), IN `nom_alum` VARCHAR(50), IN `fnac` DATE, IN `sex_alum` CHAR(1), IN `tel_alum` CHAR(6), IN `cel_alum` CHAR(9), IN `direc_alum` VARCHAR(80), IN `cor_alum` VARCHAR(80), IN `proc_alum` VARCHAR(100), IN `ape_padre` VARCHAR(60), IN `nom_padre` VARCHAR(50), IN `cel_padre` CHAR(9), IN `cor_padre` VARCHAR(80), IN `ape_madre` VARCHAR(60), IN `nom_madre` VARCHAR(50), IN `cel_madre` CHAR(9), IN `cor_madre` VARCHAR(80))
    NO SQL
UPDATE alumno SET apellidos_alumno=ape_alum,
nombres_alumno=nom_alum,fnac_alumno=fnac,
sexo_alumno=sex_alum,telefono_alumno=tel_alum,
celular_alumno=cel_alum,direccion_alumno=direc_alum,
correo_alumno=cor_alum,
procedencia_alumno=proc_alum,
apellidos_padre=ape_padre,nombres_padre=nom_padre,
celular_padre=cel_padre,correo_padre=cor_padre,
apellidos_madre=ape_madre,nombres_madre=nom_madre,
celular_madre=cel_madre,correo_madre=cor_madre
WHERE id_alumno=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_apoderado`(IN `id_apo` SMALLINT, IN `ape_apod` VARCHAR(60), IN `nom_apod` VARCHAR(50), IN `sex_apod` CHAR(1), IN `cel_apod` CHAR(9), IN `dir_apod` VARCHAR(80), IN `cor_apod` VARCHAR(80))
    NO SQL
UPDATE apoderado SET apellidos_apoderado=ape_apod,
nombres_apoderado=nom_apod,sexo_apoderado=sex_apod,
celular_apoderado=cel_apod,
direccion_apoderado=dir_apod,correo_apoderado=cor_apod
WHERE id_apoderado=id_apo$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_deuda`(IN `id` SMALLINT, IN `monto` FLOAT, IN `estado` CHAR(1))
    NO SQL
UPDATE detalle_deuda SET saldo_deuda=saldo_deuda-monto,
fseg_deuda=NOW(),estado_deuda=estado
WHERE id_detalle_deuda=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_libro`(IN `t_libro` VARCHAR(80), IN `edit_libro` VARCHAR(20), IN `grado` INT, IN `idlibro` SMALLINT)
    NO SQL
UPDATE libro SET titulo_libro=t_libro,editorial_libro=edit_libro,id_grado=grado WHERE id_libro=idlibro$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_usuario`(IN `idusu` INT, IN `nom_usu` VARCHAR(20), IN `nombres` VARCHAR(45), IN `apellidos` VARCHAR(60), IN `sexo` CHAR(1), IN `celular` CHAR(9), IN `correo` VARCHAR(80), IN `direccion` VARCHAR(80), IN `fbaja` DATE, IN `obser` VARCHAR(50), IN `perfil` INT)
UPDATE usuario SET nom_usu=nom_usu,nombres_usu=nombres,apellidos_usu=apellidos,sexo_usu=sexo,celular_usu=celular,correo_usu=correo,direccion_usu=direccion,fbaja_usu=fbaja,obser_usu=obser,idperfil_usuario=perfil
WHERE idusuario=idusu$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_anhio`(IN `dato` CHAR(4))
SELECT
    anhio,idanhio
    FROM anhio_lectivo
    WHERE anhio=dato AND estado_anhio=1
    UNION
    SELECT 'AÑO LECTIVO AUN APERTURADO',NULL FROM DUAL
    WHERE EXISTS
    ( SELECT idanhio
    FROM anhio_lectivo
    WHERE condicion_anhio='A' AND estado_anhio=1)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_cuota_apafa_xanhio`(IN `anhio_lec` CHAR(4))
    NO SQL
SELECT * FROM concepto_apafa c
INNER JOIN anhio_lectivo al ON al.idanhio=c.id_anhio
WHERE al.anhio=anhio_lec
AND c.tipo_concepto='A'$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_matricula_alumno`(IN `alumno` SMALLINT, IN `dato_anhio` CHAR(4))
    NO SQL
SELECT * FROM matricula m
WHERE m.id_alumno=alumno
AND m.estado_matricula=1
AND m.id_anhio=(SELECT idanhio FROM anhio_lectivo WHERE condicion_anhio='A' AND estado_anhio=1 AND anhio=dato_anhio)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_seccion`(IN `nombre` VARCHAR(20), IN `turno` CHAR(1), IN `grado` INT)
    NO SQL
SELECT * FROM secciones
WHERE nombre_seccion=nombre
AND id_turno=turno
AND id_grado=grado
AND estado_seccion=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_si_cuota_apafa_registrada`(IN `apoderado` SMALLINT, IN `dato_anhio` CHAR(4))
    NO SQL
SELECT * FROM detalle_deuda du 
INNER JOIN concepto_apafa ca ON ca.id_concepto=du.id_concepto
INNER JOIN anhio_lectivo a ON a.idanhio=ca.id_anhio
WHERE du.id_apoderado=apoderado
AND ca.tipo_concepto='A'
AND ca.id_anhio=(SELECT idanhio FROM anhio_lectivo WHERE condicion_anhio='A' AND estado_anhio=1
                AND anhio=dato_anhio)$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumno`
--

CREATE TABLE IF NOT EXISTS `alumno` (
  `id_alumno` smallint(6) NOT NULL AUTO_INCREMENT,
  `tdoc_alumno` char(3) NOT NULL,
  `doc_alumno` varchar(15) NOT NULL,
  `apellidos_alumno` varchar(60) NOT NULL,
  `nombres_alumno` varchar(50) NOT NULL,
  `fnac_alumno` date NOT NULL,
  `sexo_alumno` char(1) NOT NULL,
  `telefono_alumno` char(6) DEFAULT NULL,
  `celular_alumno` char(9) NOT NULL,
  `direccion_alumno` varchar(80) NOT NULL,
  `correo_alumno` varchar(80) DEFAULT NULL,
  `procedencia_alumno` varchar(100) DEFAULT NULL,
  `apellidos_padre` varchar(60) NOT NULL,
  `nombres_padre` varchar(50) NOT NULL,
  `celular_padre` char(9) DEFAULT NULL,
  `correo_padre` varchar(80) DEFAULT NULL,
  `apellidos_madre` varchar(60) NOT NULL,
  `nombres_madre` varchar(50) NOT NULL,
  `celular_madre` char(9) DEFAULT NULL,
  `correo_madre` varchar(80) DEFAULT NULL,
  `estado_alumno` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_alumno`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Volcado de datos para la tabla `alumno`
--

INSERT INTO `alumno` (`id_alumno`, `tdoc_alumno`, `doc_alumno`, `apellidos_alumno`, `nombres_alumno`, `fnac_alumno`, `sexo_alumno`, `telefono_alumno`, `celular_alumno`, `direccion_alumno`, `correo_alumno`, `procedencia_alumno`, `apellidos_padre`, `nombres_padre`, `celular_padre`, `correo_padre`, `apellidos_madre`, `nombres_madre`, `celular_madre`, `correo_madre`, `estado_alumno`) VALUES
(1, 'DNI', '71919582', 'Julca Vasquez', 'Jose Andersson', '2019-06-05', 'M', NULL, '978902579', 'Calle chiclayo # 114', NULL, NULL, 'Julca Zeña', 'Francisco Javier', NULL, NULL, 'Vasquez Delgado', 'Susana Esther', NULL, NULL, b'1'),
(2, 'DNI', '16686223', 'Julca Zeña', 'Francisco Javier', '2019-03-06', 'M', NULL, '978989288', 'calle chiclayo # 114', NULL, NULL, 'Julca Venegas', 'Segundo', NULL, NULL, 'Zeña Orreaga', 'Alejandrina', NULL, NULL, b'1'),
(3, 'OTR', '751654654M65484', 'Flores Aguilar', 'Diego', '2019-06-07', 'M', NULL, '312113313', 'La Posada SN', NULL, NULL, 'Fadad', 'Rqewwf', NULL, NULL, 'Fasdfasf', 'Radafasff', NULL, NULL, b'1'),
(4, 'DNI', '73258572', 'Sanchez Velasquez', 'Marita Vanessa ', '1992-02-05', 'F', NULL, '979241872', 'VISTA ALEGRE MZ H LT 22', NULL, NULL, 'Sanchez Granados', 'Luis', NULL, NULL, 'Velasquez Torres', 'Lila', NULL, NULL, b'1'),
(5, 'DNI', '16729503', 'Julca Vasquez', 'Alejandra Sayuri', '2019-06-07', 'F', NULL, '979013530', 'CALLE CHICALYO # 114', NULL, NULL, 'Julca Zeña', 'Francisco Javier', NULL, NULL, 'Vasquez Delgado', 'Susana', NULL, NULL, b'1'),
(6, 'DNI', '21654684', 'Rubio Vasquez', 'Jose Alexander', '2019-01-02', 'M', NULL, '979416039', 'calle jose quinones # 54', NULL, NULL, 'Rubio Marin', 'Alex', NULL, NULL, 'Vasquez Delgado', 'Luz', NULL, NULL, b'1'),
(7, 'DNI', '12412412', 'Dadad', 'Dadad', '2007-01-30', 'M', NULL, '325325325', 'sfasfasfsaf', NULL, NULL, 'Aadad', 'Aasad', NULL, NULL, 'Aad', 'Dadad', NULL, NULL, b'0'),
(8, 'DNI', '13415315', 'Aasadad', 'Fadadad', '2019-06-06', 'M', NULL, '325326236', 'ADADAD', NULL, NULL, 'Aadada', 'Dadadad', NULL, NULL, 'Fadad', 'Aaadad', NULL, NULL, b'0'),
(9, 'DNI', '34532532', 'Aadad', 'Fadad', '2019-06-14', 'M', NULL, '325325325', 'fasfsafsaf', NULL, NULL, 'Adadad', 'Fadad', NULL, NULL, 'Dadad', 'Fadad', NULL, NULL, b'0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `anhio_lectivo`
--

CREATE TABLE IF NOT EXISTS `anhio_lectivo` (
  `idanhio` smallint(6) NOT NULL AUTO_INCREMENT,
  `anhio` char(4) NOT NULL,
  `finicio_anhio` date NOT NULL,
  `ffin_anhio` date NOT NULL,
  `descripcion_anhio` varchar(150) DEFAULT NULL,
  `condicion_anhio` char(1) NOT NULL DEFAULT 'A',
  `estado_anhio` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`idanhio`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Volcado de datos para la tabla `anhio_lectivo`
--

INSERT INTO `anhio_lectivo` (`idanhio`, `anhio`, `finicio_anhio`, `ffin_anhio`, `descripcion_anhio`, `condicion_anhio`, `estado_anhio`) VALUES
(1, '2018', '2018-01-31', '2018-12-31', 'fasfsaf sa fsa fas ffas fas fasf asfasf asf asfasf asf asfasfasf asf ', 'C', b'1'),
(2, '2019', '2019-01-01', '2019-12-31', NULL, 'A', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `apoderado`
--

CREATE TABLE IF NOT EXISTS `apoderado` (
  `id_apoderado` smallint(6) NOT NULL AUTO_INCREMENT,
  `tdoc_apoderado` char(3) NOT NULL,
  `doc_apoderado` varchar(15) NOT NULL,
  `apellidos_apoderado` varchar(60) NOT NULL,
  `nombres_apoderado` varchar(50) NOT NULL,
  `sexo_apoderado` char(1) NOT NULL,
  `celular_apoderado` char(9) NOT NULL,
  `direccion_apoderado` varchar(80) NOT NULL,
  `correo_apoderado` varchar(80) DEFAULT NULL,
  `estado_apoderado` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_apoderado`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Volcado de datos para la tabla `apoderado`
--

INSERT INTO `apoderado` (`id_apoderado`, `tdoc_apoderado`, `doc_apoderado`, `apellidos_apoderado`, `nombres_apoderado`, `sexo_apoderado`, `celular_apoderado`, `direccion_apoderado`, `correo_apoderado`, `estado_apoderado`) VALUES
(1, 'DNI', '16686223', 'Julca Zeña', 'Francisco Javier', 'M', '978902579', 'calle chiclayo # 54', NULL, b'1'),
(2, 'DNI', '16729503', 'Vasquez Delgado', 'Susana Esther', 'F', '979013530', 'calle jose quiñones S/N', NULL, b'1'),
(3, 'DNI', '73258572', 'Sanchez Velasquez', 'Marita Vanessa', 'F', '979241872', 'vista alegre MZ H LT 22', NULL, b'1'),
(4, 'DNI', '32523523', 'Aguilar Diaz', 'Daniel', 'M', '111111111', 'fhdfhdfh', NULL, b'1'),
(5, 'OTR', 'SF43634634636', 'Fadad', 'Radad', 'M', '626432634', 'fdhndfhdfh', NULL, b'0'),
(6, 'DNI', '63463463', 'Aadad', 'Fadad', 'M', '375754745', 'rdh', NULL, b'0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE IF NOT EXISTS `compra` (
  `id_compra` smallint(6) NOT NULL AUTO_INCREMENT,
  `id_usuario` smallint(6) NOT NULL,
  `id_anhio` smallint(6) NOT NULL,
  `tipo_compra` char(1) NOT NULL,
  `num_compra` varchar(10) NOT NULL,
  `razon_social_compra` varchar(50) NOT NULL,
  `ruc_compra` char(11) DEFAULT NULL,
  `fecha_compra` date NOT NULL,
  `freg_compra` datetime NOT NULL,
  `doc_encargado_compra` varchar(15) NOT NULL,
  `encargado_compra` varchar(80) NOT NULL,
  `total_compra` float NOT NULL,
  `estado_compra` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_compra`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Volcado de datos para la tabla `compra`
--

INSERT INTO `compra` (`id_compra`, `id_usuario`, `id_anhio`, `tipo_compra`, `num_compra`, `razon_social_compra`, `ruc_compra`, `fecha_compra`, `freg_compra`, `doc_encargado_compra`, `encargado_compra`, `total_compra`, `estado_compra`) VALUES
(1, 46, 2, 'B', '325235325', 'safasfsaf', NULL, '2019-06-18', '2019-06-18 23:39:29', '325325235', 'Fafaf', 7.5, b'1'),
(2, 46, 2, 'B', '325235325', 'safasfsaf', NULL, '2019-06-18', '2019-06-18 23:43:10', '325325235', 'Fafaf', 7.5, b'1'),
(3, 46, 2, 'B', '325235325', 'safasfsaf', NULL, '2019-06-18', '2019-06-18 23:44:15', '325325235', 'Fafaf', 7.5, b'1'),
(4, 46, 2, 'B', '325235325', 'safasfsaf', NULL, '2019-06-18', '2019-06-18 23:50:37', '325325235', 'Fafaf', 7.5, b'1'),
(5, 46, 2, 'B', '325235325', 'safasfsaf', NULL, '2019-06-18', '2019-06-19 00:00:51', '325325235', 'Fafaf', 7.5, b'1'),
(6, 46, 2, 'B', '325235325', 'safasfsaf', NULL, '2019-06-18', '2019-06-19 00:03:21', '325325235', 'Fafaf', 7.5, b'1'),
(7, 46, 2, 'B', '325235325', 'safasfsaf', NULL, '2019-06-18', '2019-06-19 00:04:46', '325325235', 'Fafaf', 133.75, b'1'),
(8, 46, 2, 'B', '0025366496', 'CARPINTERI 540', NULL, '2019-02-07', '2019-06-19 12:04:43', '16589878', 'Carlos Roberto', 400, b'1'),
(9, 46, 2, 'F', '435345435', 'multiservicios', NULL, '2019-06-19', '2019-06-19 12:59:50', '35235325325', 'Fadad', 205, b'1'),
(10, 46, 2, 'F', '7457457547', 'POLLERIA', NULL, '2019-06-19', '2019-06-19 13:01:11', '43634634', 'Faadd', 227.5, b'1'),
(11, 46, 2, 'B', '0012545878', 'MULTISERVICIOS JV', NULL, '2019-01-10', '2019-06-19 15:54:58', '71919582', 'Jose Andersson Julca Vasquez', 683.42, b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `concepto_apafa`
--

CREATE TABLE IF NOT EXISTS `concepto_apafa` (
  `id_concepto` smallint(6) NOT NULL AUTO_INCREMENT,
  `descripcion_concepto` varchar(100) NOT NULL,
  `tipo_concepto` char(1) NOT NULL,
  `id_anhio` smallint(6) NOT NULL,
  `monto_concepto` float NOT NULL,
  `estado_concepto` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_concepto`),
  KEY `id_anhio` (`id_anhio`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Volcado de datos para la tabla `concepto_apafa`
--

INSERT INTO `concepto_apafa` (`id_concepto`, `descripcion_concepto`, `tipo_concepto`, `id_anhio`, `monto_concepto`, `estado_concepto`) VALUES
(1, 'CONCEPTO APAFA 2019', 'A', 2, 59, b'1'),
(2, 'CONCEPTO APAFA 2018', 'A', 1, 59, b'1'),
(3, 'ASAMBLEA GENERAL APAFA', 'O', 2, 25, b'1'),
(4, 'ASAMBLE DE ESCUELA DE PADRES', 'O', 2, 15, b'1'),
(5, 'ASFASF', 'O', 2, 33, b'1'),
(6, 'SVDSV', 'O', 2, 677, b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_compra`
--

CREATE TABLE IF NOT EXISTS `detalle_compra` (
  `id_detalle_compra` smallint(6) NOT NULL AUTO_INCREMENT,
  `id_compra` smallint(6) NOT NULL,
  `nom_producto` varchar(30) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `medida` varchar(10) NOT NULL,
  `precio_unit` float NOT NULL,
  PRIMARY KEY (`id_detalle_compra`),
  KEY `id_compra` (`id_compra`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

--
-- Volcado de datos para la tabla `detalle_compra`
--

INSERT INTO `detalle_compra` (`id_detalle_compra`, `id_compra`, `nom_producto`, `cantidad`, `medida`, `precio_unit`) VALUES
(1, 6, 'BROCHAS', 3, 'UNIT', 2.5),
(2, 7, 'BROCHAS', 3, 'UNIT', 2.5),
(3, 7, 'BALDES DE PINTURA', 5, 'BALDES', 25.25),
(4, 8, 'SILLAS', 10, 'UNIT', 15),
(5, 8, 'MESAS', 10, 'UNIT', 25),
(6, 9, 'BALDES DE PINTURAS', 10, 'BALDES', 20.5),
(7, 10, 'POLLOS A LA BRASA', 5, 'UNIT', 45.5),
(8, 11, 'ASFDASF', 3, '3', 5),
(9, 11, 'ASFSA', 7, 'I', 1.5),
(10, 11, 'GG', 6, 'DGDG', 8),
(11, 11, 'RFHGDFH', 6, '5Y', 7),
(12, 11, 'FJHDFJ', 4, '547457', 9),
(13, 11, 'DHH', 6, 'YY', 74),
(14, 11, 'DFHJFDJ', 7, 'TGJ', 12.56);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_deuda`
--

CREATE TABLE IF NOT EXISTS `detalle_deuda` (
  `id_detalle_deuda` smallint(6) NOT NULL AUTO_INCREMENT,
  `id_concepto` smallint(6) NOT NULL,
  `id_apoderado` smallint(6) NOT NULL,
  `saldo_deuda` float NOT NULL,
  `freg_deuda` date NOT NULL,
  `fseg_deuda` datetime NOT NULL,
  `estado_deuda` char(1) NOT NULL DEFAULT 'P',
  PRIMARY KEY (`id_detalle_deuda`),
  KEY `id_concepto` (`id_concepto`),
  KEY `id_apoderado` (`id_apoderado`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=22 ;

--
-- Volcado de datos para la tabla `detalle_deuda`
--

INSERT INTO `detalle_deuda` (`id_detalle_deuda`, `id_concepto`, `id_apoderado`, `saldo_deuda`, `freg_deuda`, `fseg_deuda`, `estado_deuda`) VALUES
(18, 2, 1, 0, '2019-06-17', '2019-06-19 16:40:36', 'C'),
(19, 1, 2, 0, '2019-06-17', '2019-06-18 15:35:32', 'C'),
(20, 1, 1, 10, '2019-06-05', '2019-06-22 16:16:15', 'P'),
(21, 1, 4, 59, '2019-06-21', '2019-06-21 12:31:45', 'P');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_recibo`
--

CREATE TABLE IF NOT EXISTS `detalle_recibo` (
  `id_detalle_deuda` smallint(6) NOT NULL,
  `id_recibo` smallint(6) NOT NULL,
  `monto_detalle` float NOT NULL,
  KEY `id_recibo` (`id_recibo`),
  KEY `id_detalle_deuda` (`id_detalle_deuda`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `detalle_recibo`
--

INSERT INTO `detalle_recibo` (`id_detalle_deuda`, `id_recibo`, `monto_detalle`) VALUES
(19, 1, 59),
(18, 2, 59),
(20, 3, 22),
(20, 4, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grados`
--

CREATE TABLE IF NOT EXISTS `grados` (
  `id_grado` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion_grado` varchar(40) NOT NULL,
  `nivel_grado` char(1) NOT NULL,
  `estado_grado` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_grado`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Volcado de datos para la tabla `grados`
--

INSERT INTO `grados` (`id_grado`, `descripcion_grado`, `nivel_grado`, `estado_grado`) VALUES
(1, 'PRIMER GRADO SECUNDARIA', 'S', b'0'),
(2, 'SEGUNDO GRADO SECUNDARIA', 'S', b'0'),
(3, 'TERCER GRADO SECUNDARIA', 'S', b'0'),
(4, 'CUARTO GRADO SECUNDARIA', 'S', b'0'),
(5, 'QUINTO GRADO SECUNDARIA', 'S', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro`
--

CREATE TABLE IF NOT EXISTS `libro` (
  `id_libro` smallint(6) NOT NULL AUTO_INCREMENT,
  `titulo_libro` varchar(80) NOT NULL,
  `editorial_libro` varchar(20) NOT NULL,
  `id_grado` int(6) NOT NULL,
  `estado_libro` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_libro`),
  KEY `id_grado` (`id_grado`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Volcado de datos para la tabla `libro`
--

INSERT INTO `libro` (`id_libro`, `titulo_libro`, `editorial_libro`, `id_grado`, `estado_libro`) VALUES
(1, 'LIBRO DE ACTIVDIADES MATEMATICA', 'NORMA', 1, b'1'),
(2, 'LIBRO DE TEXTO MATEMATICA', 'NORMA', 1, b'1'),
(3, 'LIBRO DE TRABAJO MATEMATICA 2', 'SANTILLANA', 2, b'1'),
(4, 'LIBRO DE LECTURA MATEMATICA 2', 'SANTILLANA', 2, b'1'),
(5, 'LIBRO DE TRABAJO COMUNICACION', 'NORMA', 2, b'1'),
(6, 'LIBRO DE LECTURA COMUNCIACION', 'NORMA', 2, b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro_matricula`
--

CREATE TABLE IF NOT EXISTS `libro_matricula` (
  `id_matricula` smallint(6) NOT NULL,
  `id_libro` smallint(6) NOT NULL,
  `devolvio_libro` bit(1) NOT NULL DEFAULT b'0',
  KEY `id_matricula` (`id_matricula`),
  KEY `id_libro` (`id_libro`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `libro_matricula`
--

INSERT INTO `libro_matricula` (`id_matricula`, `id_libro`, `devolvio_libro`) VALUES
(31, 3, b'0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `matricula`
--

CREATE TABLE IF NOT EXISTS `matricula` (
  `id_matricula` smallint(6) NOT NULL AUTO_INCREMENT,
  `fecha_matricula` date NOT NULL,
  `id_apoderado` smallint(6) NOT NULL,
  `id_alumno` smallint(6) NOT NULL,
  `id_anhio` smallint(6) NOT NULL,
  `id_seccion` smallint(6) NOT NULL,
  `id_tipo_relacion` smallint(6) NOT NULL,
  `estado_matricula` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_matricula`),
  KEY `id_tipo_relacion` (`id_tipo_relacion`),
  KEY `id_seccion` (`id_seccion`),
  KEY `id_anhio` (`id_anhio`),
  KEY `id_alumno` (`id_alumno`),
  KEY `id_apoderado` (`id_apoderado`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=35 ;

--
-- Volcado de datos para la tabla `matricula`
--

INSERT INTO `matricula` (`id_matricula`, `fecha_matricula`, `id_apoderado`, `id_alumno`, `id_anhio`, `id_seccion`, `id_tipo_relacion`, `estado_matricula`) VALUES
(28, '2019-06-17', 1, 1, 1, 1, 1, b'1'),
(29, '2019-06-17', 1, 4, 1, 1, 1, b'1'),
(31, '2019-06-17', 2, 1, 2, 5, 1, b'1'),
(32, '2019-06-17', 2, 4, 2, 5, 2, b'1'),
(33, '2019-06-21', 4, 3, 2, 11, 1, b'1'),
(34, '2019-06-21', 2, 6, 2, 7, 3, b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `otro_ingreso`
--

CREATE TABLE IF NOT EXISTS `otro_ingreso` (
  `id_otro_ingreso` smallint(6) NOT NULL AUTO_INCREMENT,
  `descripcion_ingreso` varchar(100) NOT NULL,
  `monto_ingreso` float(10,2) NOT NULL,
  `freg_ingreso` datetime NOT NULL,
  `doc_encargado_ingreso` varchar(15) NOT NULL,
  `datos_encargado_ingreso` varchar(100) NOT NULL,
  `id_usuario` smallint(6) NOT NULL,
  `estado_ingreso` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_otro_ingreso`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Volcado de datos para la tabla `otro_ingreso`
--

INSERT INTO `otro_ingreso` (`id_otro_ingreso`, `descripcion_ingreso`, `monto_ingreso`, `freg_ingreso`, `doc_encargado_ingreso`, `datos_encargado_ingreso`, `id_usuario`, `estado_ingreso`) VALUES
(1, 'RIFA DEL DIA DEL PADRE', 2000.50, '2019-06-03 03:19:17', '565665666', 'Juan Carlos Rios Vasquez', 46, b'1'),
(2, 'BINGO POR ANIVERSARIO', 5500.00, '2019-06-08 18:27:22', '15465465465', 'Julca Zeña Javier', 46, b'1'),
(3, 'RIFA POR EL DIA DE LA MADRE', 1000.50, '2019-06-08 18:28:37', '9879989898', 'Susana Vasquez Delgado', 46, b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil_usuario`
--

CREATE TABLE IF NOT EXISTS `perfil_usuario` (
  `idperfil_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_perfil` varchar(25) NOT NULL,
  `abrev_perfil` char(2) NOT NULL,
  `estado_perfil` bit(1) NOT NULL,
  PRIMARY KEY (`idperfil_usuario`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Volcado de datos para la tabla `perfil_usuario`
--

INSERT INTO `perfil_usuario` (`idperfil_usuario`, `nombre_perfil`, `abrev_perfil`, `estado_perfil`) VALUES
(1, 'ADMINISTRADOR', 'AD', b'1'),
(2, 'SECRETARIA', 'SE', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recibo`
--

CREATE TABLE IF NOT EXISTS `recibo` (
  `id_recibo` smallint(6) NOT NULL AUTO_INCREMENT,
  `id_apoderado` smallint(6) NOT NULL,
  `id_usuario` smallint(6) NOT NULL,
  `mtotal_recibo` float NOT NULL,
  `freg_recibo` datetime NOT NULL,
  `num_recibo` varchar(20) NOT NULL,
  `estado_recibo` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_recibo`),
  KEY `id_apoderado` (`id_apoderado`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Volcado de datos para la tabla `recibo`
--

INSERT INTO `recibo` (`id_recibo`, `id_apoderado`, `id_usuario`, `mtotal_recibo`, `freg_recibo`, `num_recibo`, `estado_recibo`) VALUES
(1, 2, 46, 59, '2019-06-18 15:35:31', '1672-20190618-1', b'1'),
(2, 1, 46, 59, '2019-06-19 16:40:35', '1668-20190619-2', b'1'),
(3, 1, 46, 22, '2019-06-19 16:46:06', '1668-20190619-3', b'1'),
(4, 1, 46, 10, '2019-06-22 16:16:15', '1668-20190622-4', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reunion`
--

CREATE TABLE IF NOT EXISTS `reunion` (
  `id_reunion` smallint(6) NOT NULL AUTO_INCREMENT,
  `motivo_reunion` varchar(100) NOT NULL,
  `fecha_reunion` date NOT NULL,
  `hora_reunion` time NOT NULL,
  `id_concepto` smallint(6) NOT NULL,
  `lista_reunion` bit(1) NOT NULL DEFAULT b'0',
  `estado_reunion` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_reunion`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Volcado de datos para la tabla `reunion`
--

INSERT INTO `reunion` (`id_reunion`, `motivo_reunion`, `fecha_reunion`, `hora_reunion`, `id_concepto`, `lista_reunion`, `estado_reunion`) VALUES
(1, 'Asamblea General de padres', '2019-06-21', '14:30:00', 3, b'1', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reunion_apoderado`
--

CREATE TABLE IF NOT EXISTS `reunion_apoderado` (
  `id_reunion` smallint(6) NOT NULL,
  `id_apoderado` smallint(6) NOT NULL,
  `asistio_reunion` bit(1) NOT NULL DEFAULT b'0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `reunion_apoderado`
--

INSERT INTO `reunion_apoderado` (`id_reunion`, `id_apoderado`, `asistio_reunion`) VALUES
(1, 2, b'0'),
(1, 4, b'0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secciones`
--

CREATE TABLE IF NOT EXISTS `secciones` (
  `id_seccion` smallint(11) NOT NULL AUTO_INCREMENT,
  `nombre_seccion` varchar(20) NOT NULL,
  `id_grado` int(11) NOT NULL,
  `id_turno` char(1) NOT NULL,
  `estado_seccion` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_seccion`),
  KEY `id_grado` (`id_grado`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

--
-- Volcado de datos para la tabla `secciones`
--

INSERT INTO `secciones` (`id_seccion`, `nombre_seccion`, `id_grado`, `id_turno`, `estado_seccion`) VALUES
(1, 'A', 1, 'M', b'1'),
(2, 'B', 1, 'M', b'1'),
(5, 'A', 2, 'M', b'1'),
(6, 'A', 3, 'M', b'1'),
(7, 'A', 4, 'M', b'1'),
(8, 'A', 5, 'M', b'1'),
(10, 'C', 1, 'M', b'1'),
(11, 'B', 2, 'M', b'1'),
(12, 'B', 3, 'M', b'1'),
(13, 'D', 1, 'T', b'1'),
(14, 'E', 1, 'T', b'1'),
(15, 'C', 2, 'M', b'1'),
(16, 'B', 4, 'M', b'1'),
(17, 'F', 1, 'T', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_relacion`
--

CREATE TABLE IF NOT EXISTS `tipo_relacion` (
  `id_tipo_relacion` smallint(11) NOT NULL AUTO_INCREMENT,
  `nombre_relacion` varchar(20) NOT NULL,
  `estado_relacion` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_tipo_relacion`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Volcado de datos para la tabla `tipo_relacion`
--

INSERT INTO `tipo_relacion` (`id_tipo_relacion`, `nombre_relacion`, `estado_relacion`) VALUES
(1, 'PADRE', b'1'),
(2, 'MADRE', b'1'),
(3, 'TIO (A)', b'1'),
(4, 'PRIMO (A)', b'1'),
(5, 'ABUELO (A)', b'1'),
(6, 'HERMANO (A)', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE IF NOT EXISTS `usuario` (
  `idusuario` smallint(11) NOT NULL AUTO_INCREMENT,
  `nom_usu` varchar(20) NOT NULL,
  `clave_usu` varchar(100) NOT NULL,
  `dni_usu` char(8) NOT NULL,
  `nombres_usu` varchar(50) NOT NULL,
  `apellidos_usu` varchar(60) NOT NULL,
  `sexo_usu` char(1) NOT NULL,
  `celular_usu` char(9) NOT NULL,
  `correo_usu` varchar(80) DEFAULT NULL,
  `direccion_usu` varchar(80) NOT NULL,
  `fcreacion_usu` date NOT NULL,
  `fbaja_usu` date DEFAULT NULL,
  `obser_usu` varchar(200) DEFAULT NULL,
  `estado_usu` bit(1) NOT NULL DEFAULT b'1',
  `idperfil_usuario` int(11) NOT NULL,
  PRIMARY KEY (`idusuario`),
  KEY `fk_usuario_perfil_usuario` (`idperfil_usuario`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=49 ;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idusuario`, `nom_usu`, `clave_usu`, `dni_usu`, `nombres_usu`, `apellidos_usu`, `sexo_usu`, `celular_usu`, `correo_usu`, `direccion_usu`, `fcreacion_usu`, `fbaja_usu`, `obser_usu`, `estado_usu`, `idperfil_usuario`) VALUES
(46, 'jjulcav', 'ea8d414fe25b078a9b8e1516862bddf210e686bd', '71919582', 'Jose Andersson', 'Julca Vasquez', 'M', '978902579', NULL, 'calle chiclayo # 114', '2019-05-24', NULL, NULL, b'1', 1),
(47, 'maritasv', 'a6b7354b8ec74b0550233c5cbf8773c6d28ceef4', '73258572', 'Marita Vanessa ', 'Sanchez Velasquez', 'F', '979241872', NULL, 'CP VISTA ALEGE MZ H LT 22', '2019-05-24', NULL, NULL, b'1', 2),
(48, 'ryeryeryer', '21af3f2067e4c9cbd160a7c3cda809416ef1f849', '85678678', 'Karina', 'Lopez Vilela', 'F', '456786786', NULL, 'dhdhdfhdfh', '2019-05-24', NULL, NULL, b'1', 1);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`idusuario`);

--
-- Filtros para la tabla `concepto_apafa`
--
ALTER TABLE `concepto_apafa`
  ADD CONSTRAINT `concepto_apafa_ibfk_2` FOREIGN KEY (`id_anhio`) REFERENCES `anhio_lectivo` (`idanhio`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD CONSTRAINT `detalle_compra_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id_compra`);

--
-- Filtros para la tabla `detalle_deuda`
--
ALTER TABLE `detalle_deuda`
  ADD CONSTRAINT `detalle_deuda_ibfk_1` FOREIGN KEY (`id_apoderado`) REFERENCES `apoderado` (`id_apoderado`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detalle_deuda_ibfk_2` FOREIGN KEY (`id_concepto`) REFERENCES `concepto_apafa` (`id_concepto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_recibo`
--
ALTER TABLE `detalle_recibo`
  ADD CONSTRAINT `detalle_recibo_ibfk_3` FOREIGN KEY (`id_detalle_deuda`) REFERENCES `detalle_deuda` (`id_detalle_deuda`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `detalle_recibo_ibfk_4` FOREIGN KEY (`id_recibo`) REFERENCES `recibo` (`id_recibo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `libro_matricula`
--
ALTER TABLE `libro_matricula`
  ADD CONSTRAINT `libro_matricula_ibfk_1` FOREIGN KEY (`id_matricula`) REFERENCES `matricula` (`id_matricula`),
  ADD CONSTRAINT `libro_matricula_ibfk_2` FOREIGN KEY (`id_libro`) REFERENCES `libro` (`id_libro`);

--
-- Filtros para la tabla `matricula`
--
ALTER TABLE `matricula`
  ADD CONSTRAINT `matricula_ibfk_1` FOREIGN KEY (`id_tipo_relacion`) REFERENCES `tipo_relacion` (`id_tipo_relacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `matricula_ibfk_2` FOREIGN KEY (`id_alumno`) REFERENCES `alumno` (`id_alumno`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `matricula_ibfk_3` FOREIGN KEY (`id_anhio`) REFERENCES `anhio_lectivo` (`idanhio`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `matricula_ibfk_4` FOREIGN KEY (`id_apoderado`) REFERENCES `apoderado` (`id_apoderado`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `matricula_ibfk_5` FOREIGN KEY (`id_seccion`) REFERENCES `secciones` (`id_seccion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `recibo`
--
ALTER TABLE `recibo`
  ADD CONSTRAINT `recibo_ibfk_1` FOREIGN KEY (`id_apoderado`) REFERENCES `apoderado` (`id_apoderado`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `recibo_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `secciones`
--
ALTER TABLE `secciones`
  ADD CONSTRAINT `grado_secciones` FOREIGN KEY (`id_grado`) REFERENCES `grados` (`id_grado`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_perfil_usuario` FOREIGN KEY (`idperfil_usuario`) REFERENCES `perfil_usuario` (`idperfil_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
