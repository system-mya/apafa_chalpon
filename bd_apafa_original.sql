-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 30-09-2020 a las 02:50:48
-- Versión del servidor: 5.5.24-log
-- Versión de PHP: 5.4.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `bd_apafa`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_balance_xanhio`(IN `anhio` TINYINT)
SELECT 'INGRESO' as tipo,'PAGO APAFA' as descripcion, r.freg_recibo as fecha,r.mtotal_recibo as balance_i,'' as balance_e FROM recibo r
WHERE r.estado_recibo=1
AND r.id_anhio=anhio
UNION ALL
SELECT 'INGRESO' as tipo,o.descripcion_movimiento as descripcion,o.freg_movimiento as fecha,o.monto_movimiento as balance_i,'' as balance_e FROM movimiento o
WHERE o.estado_movimiento=1
AND o.id_anhio=anhio
AND o.tipo_movimiento='I'
UNION ALL
SELECT 'EGRESO' as tipo,o.descripcion_movimiento as descripcion,o.freg_movimiento as fecha,'' as balance_i,o.monto_movimiento as balance_e FROM movimiento o
WHERE o.estado_movimiento=1
AND o.id_anhio=anhio
AND o.tipo_movimiento='E'
UNION ALL 
SELECT 'EGRESO' as tipo,'COMPRAS' as descripcion,c.freg_compra as fecha,'' as balance_i,c.total_compra as balance_e FROM compra c
WHERE c.estado_compra=1
AND c.id_anhio=anhio
ORDER BY fecha ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_balance_xfechas`(IN `fini` DATE, IN `ffin` DATE)
SELECT 'INGRESO' as tipo,'PAGO APAFA' as descripcion, r.freg_recibo as fecha,r.mtotal_recibo as balance_i,'' as balance_e FROM recibo r
WHERE r.estado_recibo=1
AND (DATE(r.freg_recibo)>=fini AND DATE(r.freg_recibo)<=ffin)
UNION ALL
SELECT 'INGRESO' as tipo,o.descripcion_movimiento as descripcion,o.freg_movimiento as fecha,o.monto_movimiento as balance_i,'' as balance_e FROM movimiento o
WHERE o.estado_movimiento=1
AND (DATE(o.freg_movimiento)>=fini AND DATE(o.freg_movimiento)<=ffin)
AND o.tipo_movimiento='I'
UNION ALL
SELECT 'EGRESO' as tipo,o.descripcion_movimiento as descripcion,o.freg_movimiento as fecha,'' as balance_i,o.monto_movimiento as balance_e FROM movimiento o
WHERE o.estado_movimiento=1
AND (DATE(o.freg_movimiento)>=fini AND DATE(o.freg_movimiento)<=ffin)
AND o.tipo_movimiento='E'
UNION ALL 
SELECT 'EGRESO' as tipo,'COMPRAS' as descripcion,c.freg_compra as fecha,'' as balance_i,c.total_compra as balance_e FROM compra c
WHERE c.estado_compra=1
AND (DATE(c.freg_compra)>=fini AND DATE(c.freg_compra)<=ffin)
ORDER BY fecha ASC$$

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

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_cambiar_estado_grado`(IN `grado` TINYINT, IN `estado` BIT)
    NO SQL
UPDATE grados SET estado_grado=estado 
WHERE id_grado=grado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_cambiar_lista_reunion`(IN `reunion` SMALLINT)
    NO SQL
UPDATE reunion SET lista_reunion=1
WHERE id_reunion=reunion$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_detalle_alumno`(IN `id` SMALLINT)
    NO SQL
SELECT id_alumno,(CASE WHEN tdoc_alumno='OTR' THEN 'OTROS' ELSE 'DNI' END) AS tdoc_alumno,doc_alumno,apellidos_alumno,
nombres_alumno,fnac_alumno,(CASE WHEN sexo_alumno='M' THEN 'MASCULINO' ELSE 'FEMENINO' END) AS sexo_alumno,
telefono_alumno,celular_alumno,direccion_alumno,correo_alumno,procedencia_alumno,
(CASE WHEN tdoc_padre IS NULL THEN '' WHEN tdoc_padre='OTR' THEN 'OTROS' ELSE 'DNI' END) AS tdoc_padre,doc_padre,apellidos_padre,
nombres_padre,celular_padre,correo_padre,
(CASE WHEN tdoc_madre IS NULL THEN '' WHEN tdoc_madre='OTR' THEN 'OTROS' ELSE 'DNI' END) AS tdoc_madre,doc_madre,apellidos_madre,nombres_madre,celular_madre,correo_madre FROM alumno
WHERE id_alumno=id
AND estado_alumno=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_detalle_apoderado`(IN `id` SMALLINT)
    NO SQL
SELECT id_apoderado, (CASE WHEN tdoc_apoderado='OTR' THEN 'OTROS' ELSE 'DNI' END) AS tdoc_apoderado, doc_apoderado, apellidos_apoderado,nombres_apoderado,(CASE WHEN sexo_apoderado='M' THEN 'MASCULINO' ELSE 'FEMENINO' END) AS sexo_apoderado, celular_apoderado, direccion_apoderado, correo_apoderado FROM apoderado
WHERE id_apoderado=id
AND estado_apoderado=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_detalle_matricula`(IN `id` SMALLINT)
    NO SQL
SELECT a.doc_alumno,a.apellidos_alumno,a.nombres_alumno,a.direccion_alumno,
ap.doc_apoderado,ap.apellidos_apoderado,ap.nombres_apoderado,tr.nombre_relacion,
g.descripcion_grado,s.nombre_seccion,
(CASE WHEN s.turno_seccion='M' THEN 'MAÑANA' ELSE 'TARDE' END) as turno_seccion
FROM padron_matricula m
INNER JOIN alumno a ON a.id_alumno=m.id_alumno
INNER JOIN apoderado ap ON ap.id_apoderado=m.id_apoderado
INNER JOIN tipo_relacion tr ON tr.id_tipo_relacion=m.id_tipo_relacion
INNER JOIN secciones s ON s.id_seccion=m.id_seccion
INNER JOIN grados g ON g.id_grado=s.id_grado
WHERE m.id_matricula=id
AND m.estado_matricula=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_devolver_libro`(IN `matricula` SMALLINT, IN `libro` SMALLINT, IN `estado` BIT(1))
    NO SQL
UPDATE libro_matricula SET devolvio_libro=estado
WHERE id_matricula=matricula
AND id_libro=libro$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_alumno`(IN `id` SMALLINT)
    NO SQL
UPDATE alumno SET estado_alumno=0
WHERE id_alumno=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_apoderado`(IN `id_apo` SMALLINT)
    NO SQL
UPDATE apoderado SET estado_apoderado=0 WHERE id_apoderado=id_apo$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_concepto`(IN `id` SMALLINT)
    NO SQL
UPDATE concepto_apafa SET estado_concepto=0
WHERE id_concepto=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_deuda_apoderado`(IN `id` SMALLINT, IN `motivo` VARCHAR(50))
    NO SQL
UPDATE detalle_deuda SET motivo_eliminacion=motivo,estado_deuda='E'
WHERE id_detalle_deuda=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_ingreso_egreso`(IN `criterio` CHAR(1), IN `id` SMALLINT)
    NO SQL
IF criterio="M" THEN
        UPDATE movimiento SET estado_movimiento=0
        WHERE id_movimiento=id;
ELSEIF criterio="R" THEN
        UPDATE recibo SET estado_recibo=0
        WHERE id_recibo=id;
ELSEIF criterio="c" THEN
        UPDATE compra SET estado_compra=0
        WHERE id_compra=id;
END IF$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_libro`(IN `idlibro` TINYINT)
    NO SQL
UPDATE libro SET estado_libro=0 WHERE id_libro=idlibro$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_matricula`(IN `id` SMALLINT)
UPDATE padron_matricula SET estado_matricula=0
WHERE id_matricula=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_reunion`(IN `id` SMALLINT)
    NO SQL
UPDATE reunion SET estado_reunion=0
WHERE id_reunion=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_seccion`(IN `id` TINYINT)
    NO SQL
UPDATE secciones SET estado_seccion=0
WHERE id_seccion=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_usuario`(IN `id_usu` TINYINT)
    NO SQL
UPDATE usuario SET estado_usu=0
WHERE idusuario=id_usu$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_iniciar_sesion`(IN `nom` VARCHAR(20), IN `clave` VARCHAR(10))
SELECT u.idusuario,u.nom_usu,pu.abrev_perfil,pu.nombre_perfil,
(SELECT anhio_lectivo from anhio_lectivo WHERE condicion_anhio='I' AND estado_anhio=1) AS anhio_lectivo FROM usuario u
INNER JOIN perfil_usuario pu ON u.idperfil_usuario=pu.idperfil_usuario
WHERE u.nom_usu=nom
AND u.clave_usu=SHA(clave)
AND u.estado_usu=1
AND u.fbaja_usu IS NULL$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_iniciar_sesion_aplicativo_movil`(IN `alumno` VARCHAR(15))
SELECT a.id_alumno,ap.id_apoderado,ap.doc_apoderado,a.doc_alumno,a.apellidos_alumno,a.nombres_alumno,
a.doc_padre,a.apellidos_padre,a.nombres_padre,a.doc_madre,a.apellidos_madre,a.nombres_madre,
ap.apellidos_apoderado,ap.nombres_apoderado,an.anhio_lectivo, 
g.descripcion_grado,s.nombre_seccion FROM padron_matricula m
INNER JOIN apoderado ap ON ap.id_apoderado=m.id_apoderado
INNER JOIN anhio_lectivo an ON an.idanhio=m.id_anhio
INNER JOIN secciones s ON s.id_seccion=m.id_seccion
INNER JOIN grados g ON g.id_grado=s.id_grado
INNER JOIN alumno a ON m.id_alumno=a.id_alumno
WHERE a.doc_alumno=alumno
AND an.estado_anhio=1
AND m.estado_matricula = 1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_alumno`(IN `tdoc` CHAR(3), IN `doc` VARCHAR(15), IN `ape_alum` VARCHAR(60), IN `nom_alum` VARCHAR(50), IN `fnac` DATE, IN `sexo` CHAR(1), IN `tel_alum` CHAR(6), IN `cel_alum` CHAR(9), IN `dire_alum` VARCHAR(80), IN `correo_alum` VARCHAR(80), IN `proc_alum` VARCHAR(100), IN `ape_padre` VARCHAR(60), IN `nom_padre` VARCHAR(50), IN `cel_padre` CHAR(9), IN `correo_pa` VARCHAR(80), IN `ape_madre` VARCHAR(60), IN `nom_madre` VARCHAR(50), IN `cel_madre` CHAR(9), IN `correo_ma` VARCHAR(80), IN `td_padre` CHAR(3), IN `d_padre` VARCHAR(15), IN `td_madre` CHAR(3), IN `d_madre` VARCHAR(15))
    NO SQL
INSERT INTO alumno(tdoc_alumno, 
doc_alumno, apellidos_alumno,nombres_alumno,fnac_alumno, 
sexo_alumno,telefono_alumno,celular_alumno, 
direccion_alumno,correo_alumno, 
procedencia_alumno,tdoc_padre,doc_padre,apellidos_padre, 
nombres_padre,celular_padre,correo_padre,tdoc_madre,doc_madre,
apellidos_madre,nombres_madre,celular_madre, 
correo_madre) VALUES (tdoc,doc,ape_alum,nom_alum,fnac,
sexo,tel_alum,cel_alum,dire_alum,correo_alum,proc_alum,
td_padre,d_padre,ape_padre,
nom_padre,cel_padre,correo_pa,td_madre,d_madre,
ape_madre,nom_madre,cel_madre,
correo_ma)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_anhio`(IN `anhio` CHAR(4), IN `finicio` DATE, IN `ffin` DATE, IN `descripcion` VARCHAR(150))
INSERT INTO anhio_lectivo(anhio_lectivo, finicio_anhio,
ffin_anhio, descripcion_anhio) 
VALUES (anhio,finicio,ffin,descripcion)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_apoderado`(IN `tdoc_apod` CHAR(3), IN `doc_apod` VARCHAR(15), IN `ape_apod` VARCHAR(60), IN `nom_apod` VARCHAR(50), IN `sex_apod` CHAR(1), IN `cel_apod` CHAR(9), IN `direc_apod` VARCHAR(80), IN `cor_apod` VARCHAR(80))
    NO SQL
INSERT INTO apoderado(tdoc_apoderado, 
doc_apoderado, apellidos_apoderado, nombres_apoderado,
sexo_apoderado, celular_apoderado, direccion_apoderado,
correo_apoderado) VALUES (tdoc_apod,doc_apod,
ape_apod,nom_apod,sex_apod,cel_apod,direc_apod,cor_apod)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_compra`(IN `usu` TINYINT, IN `codanhio` CHAR(4), IN `tipo` CHAR(1), IN `num` VARCHAR(10), IN `rsocial` VARCHAR(50), IN `ruc` CHAR(11), IN `fecha` DATE, IN `doc` VARCHAR(15), IN `encargado` VARCHAR(80), IN `total` FLOAT)
INSERT INTO compra(id_usuario,id_anhio,tipo_compra,
num_compra,razon_social_compra, ruc_compra,
fecha_compra,freg_compra,doc_encargado_compra,
encargado_compra, total_compra) 
VALUES (usu,(SELECT idanhio from
anhio_lectivo WHERE condicion_anhio='A' 
AND estado_anhio=1
AND anhio_lectivo=codanhio),tipo,num,rsocial,ruc,fecha,NOW(),doc,
encargado,total)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_concepto_apafa`(IN `des_concepto` VARCHAR(100), IN `tipo` CHAR(1), IN `anhio` CHAR(4), IN `monto` FLOAT(10,2))
    NO SQL
INSERT INTO concepto_apafa (descripcion_concepto, tipo_concepto, id_anhio, monto_concepto) 
VALUES (des_concepto,tipo,(SELECT idanhio FROM anhio_lectivo WHERE anhio_lectivo=anhio AND condicion_anhio='A' AND estado_anhio=1),monto)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_detalle_compra`(IN `compra` SMALLINT, IN `producto` VARCHAR(30), IN `cant` TINYINT, IN `med` VARCHAR(10), IN `precio` FLOAT)
    NO SQL
INSERT INTO detalle_compra(id_compra,nom_producto,
cantidad,medida,punit) VALUES (compra,
producto,cant,med,precio)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_detalle_recibo`(IN `id_detalle` SMALLINT, IN `recibo` SMALLINT, IN `monto` FLOAT(10,2))
    NO SQL
INSERT INTO detalle_recibo(id_detalle_deuda, id_recibo, monto_detalle) VALUES (id_detalle,recibo,monto)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_deuda_apafa`(IN `apoderado` SMALLINT, IN `dato_anhio` CHAR(4))
    NO SQL
INSERT INTO detalle_deuda(id_concepto,id_apoderado,saldo_deuda,freg_deuda,fseg_deuda) 
VALUES ((SELECT ca.id_concepto FROM concepto_apafa ca 
INNER JOIN anhio_lectivo a ON a.idanhio=ca.id_anhio 
WHERE ca.tipo_concepto='A' AND a.anhio_lectivo=dato_anhio AND a.condicion_anhio='I' 
AND a.estado_anhio=1 AND ca.estado_concepto=1),apoderado,
(SELECT ca.monto_concepto FROM concepto_apafa ca 
INNER JOIN anhio_lectivo a ON a.idanhio=ca.id_anhio 
WHERE ca.tipo_concepto='A' AND a.anhio_lectivo=dato_anhio AND a.condicion_anhio='I' 
AND a.estado_anhio=1 AND ca.estado_concepto=1),CURDATE(),NOW())$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_deuda_apoderado`(IN `concepto` SMALLINT, IN `apoderado` SMALLINT, IN `saldo` FLOAT, IN `descripcion` VARCHAR(100))
INSERT INTO detalle_deuda(id_concepto,id_apoderado, saldo_deuda, descripcion_deuda,freg_deuda,fseg_deuda) 
VALUES (concepto,apoderado,saldo,descripcion,CURDATE(),NOW())$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_libro`(IN `titulo_lib` VARCHAR(80), IN `edit_lib` VARCHAR(20), IN `edicion` CHAR(4), IN `grado` TINYINT)
    NO SQL
INSERT INTO libro (titulo_libro, editorial_libro,edicion_libro,id_grado ) 
VALUES (titulo_lib,edit_lib,edicion,grado)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_libro_xmatricula`(IN `matricula` SMALLINT, IN `libro` TINYINT)
    NO SQL
INSERT INTO libro_matricula(id_matricula, id_libro) 
VALUES (matricula,libro)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_matricula`(IN `fecha` DATE, IN `idapo` SMALLINT, IN `idalum` SMALLINT, IN `idseccion` TINYINT, IN `idrelacion` TINYINT, IN `codanhio` CHAR(4))
INSERT INTO padron_matricula(fecha_matricula, 
id_apoderado, id_alumno,id_anhio, 
id_seccion,id_tipo_relacion) 
VALUES (fecha,idapo,idalum,(SELECT idanhio from
anhio_lectivo WHERE condicion_anhio='I' 
AND estado_anhio=1
AND anhio_lectivo=codanhio),idseccion,idrelacion)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_movimiento`(IN `tipo` CHAR(1), IN `descripcion` VARCHAR(100), IN `monto` FLOAT(10,2), IN `doc` VARCHAR(15), IN `datos` VARCHAR(100), IN `usu` TINYINT, IN `anhio` CHAR(4))
INSERT INTO movimiento(tipo_movimiento, descripcion_movimiento, monto_movimiento, freg_movimiento,doc_encargado_movimiento, datos_encargado_movimiento, id_usuario,id_anhio) VALUES (tipo,descripcion,
monto,NOW(),doc,datos,usu,(SELECT idanhio from
anhio_lectivo WHERE condicion_anhio='A' 
AND estado_anhio=1
AND anhio_lectivo=anhio))$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_nvo_recibo`(IN `apo` SMALLINT, IN `usu` SMALLINT, IN `mtotal` FLOAT, IN `num` VARCHAR(20), IN `anhio` CHAR(4), IN `nompago` VARCHAR(110), IN `docpago` VARCHAR(15), IN `celpago` VARCHAR(9), IN `descripcion` VARCHAR(150))
    NO SQL
INSERT INTO recibo(id_apoderado,id_usuario,id_anhio,
mtotal_recibo,freg_recibo,num_recibo,nompago_recibo,
docpago_recibo,celpago_recibo,
descripcion_recibo) 
VALUES (apo,usu,(SELECT idanhio from
anhio_lectivo WHERE condicion_anhio='A' 
AND estado_anhio=1
AND anhio_lectivo=anhio),mtotal,NOW(),num,nompago,
docpago,celpago,descripcion)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_reunion`(IN `motivo` VARCHAR(100), IN `fecha` DATE, IN `hora` TIME, IN `concepto` SMALLINT)
    NO SQL
INSERT INTO reunion(motivo_reunion, fecha_reunion,hora_reunion,id_concepto) 
VALUES (motivo,fecha,hora,concepto)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_reunion_apoderado`(IN `reunion` SMALLINT, IN `apoderado` SMALLINT)
    NO SQL
INSERT INTO reunion_apoderado(id_reunion,id_apoderado) 
VALUES (reunion,apoderado)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_seccion`(IN `nombre` VARCHAR(20), IN `grado` TINYINT, IN `turno` CHAR(1))
    NO SQL
INSERT INTO secciones(nombre_seccion,id_grado,turno_seccion) 
VALUES (nombre,grado,turno)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_token`(IN `token_celu` VARCHAR(200))
INSERT INTO token_celular(token) 
VALUES (token_celu)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_usuario`(IN `perfil` TINYINT, IN `nom_usu` VARCHAR(20), IN `clave` VARCHAR(10), IN `dni` CHAR(8), IN `nombres` VARCHAR(45), IN `apellidos` VARCHAR(60), IN `sexo` CHAR(1), IN `celular` CHAR(9), IN `correo` VARCHAR(80), IN `direccion` VARCHAR(80), IN `fcreacion` DATE, IN `obser` VARCHAR(50))
INSERT INTO usuario(idperfil_usuario,nom_usu, 
clave_usu,dni_usu,nombres_usu,apellidos_usu, 
sexo_usu,celular_usu,correo_usu,
direccion_usu,fcreacion_usu,
obser_usu)
VALUES (perfil,nom_usu,SHA(clave),dni,nombres,apellidos,sexo,
celular,correo,direccion,fcreacion,obser)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_alumnos`()
    NO SQL
SELECT id_alumno,apellidos_alumno,
nombres_alumno,tdoc_alumno,doc_alumno,
(CASE
   WHEN sexo_alumno='M' THEN 'MASCULINO'
   ELSE 'FEMENINO'
 END) as sexo_alumno,celular_alumno FROM alumno
WHERE estado_alumno=1
ORDER BY apellidos_alumno ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_alumnos_grado_seccion`(IN `anhio` TINYINT, IN `grado` TINYINT, IN `seccion` TINYINT)
    NO SQL
SELECT a.doc_alumno,a.apellidos_alumno,a.nombres_alumno,g.descripcion_grado,s.nombre_seccion
FROM padron_matricula m 
INNER JOIN alumno a ON a.id_alumno=m.id_alumno
INNER JOIN secciones s ON s.id_seccion=m.id_seccion
INNER JOIN grados g ON g.id_grado=s.id_grado
WHERE m.id_anhio=anhio
AND g.id_grado=grado
AND m.id_seccion=seccion
AND m.estado_matricula=1
ORDER BY a.apellidos_alumno,a.nombres_alumno$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_alumnos_xapoderado_matricula`(IN `anhio` TINYINT, IN `apo` SMALLINT)
    NO SQL
SELECT a.apellidos_alumno,a.nombres_alumno,g.id_grado,g.descripcion_grado,s.nombre_seccion 
FROM padron_matricula m
INNER JOIN alumno a ON a.id_alumno=m.id_alumno
INNER JOIN secciones s ON s.id_seccion=m.id_seccion
INNER JOIN grados g ON g.id_grado=s.id_grado
WHERE m.estado_matricula=1
AND m.id_anhio=anhio
AND m.id_apoderado=apo
ORDER BY g.id_grado ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_anhio`()
SELECT idanhio,anhio_lectivo,finicio_anhio,ffin_anhio,
LEFT(descripcion_anhio,20) as descripcion, descripcion_anhio,
(CASE
  WHEN condicion_anhio='I' THEN 'INICIADO'
  ELSE 'CERRADO'
 END) as condicion,
 (CASE
  WHEN condicion_anhio='I' THEN '#2a7703'
  ELSE '#e4040e'
 END) as color_condicion
  FROM anhio_lectivo
WHERE estado_anhio=1
ORDER BY anhio_lectivo DESC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_apoderados`()
    NO SQL
SELECT id_apoderado,doc_apoderado,apellidos_apoderado,
nombres_apoderado,(CASE WHEN sexo_apoderado='M' THEN 'MASCULINO' ELSE 'FEMENINO' END) AS sexo_apoderado,
celular_apoderado
FROM apoderado
WHERE estado_apoderado=1
ORDER BY apellidos_apoderado ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_apoderados_matricula`(IN `dato_anhio` CHAR(4))
    NO SQL
SELECT m.id_apoderado FROM padron_matricula m 
INNER JOIN anhio_lectivo a ON a.idanhio=m.id_anhio
WHERE a.anhio_lectivo=dato_anhio
GROUP BY m.id_apoderado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_apoderados_reunion`(IN `reunion` SMALLINT, IN `anhio` CHAR(4))
SELECT m.id_apoderado,ap.doc_apoderado,CONCAT(ap.apellidos_apoderado,' ',ap.nombres_apoderado) AS apoderado,GROUP_CONCAT(a.apellidos_alumno,' ',a.nombres_alumno,'
') AS matriculados,ra.asistio_reunion 
FROM padron_matricula m 
INNER JOIN alumno a ON a.id_alumno=m.id_alumno 
INNER JOIN anhio_lectivo al ON al.idanhio=m.id_anhio
INNER JOIN apoderado ap ON ap.id_apoderado=m.id_apoderado
INNER JOIN reunion_apoderado ra ON ra.id_apoderado=m.id_apoderado
WHERE al.anhio_lectivo=anhio 
AND ra.id_reunion=reunion
GROUP BY m.id_apoderado,ap.doc_apoderado,ra.asistio_reunion
ORDER BY ap.apellidos_apoderado,ap.nombres_apoderado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_apoderados_xanhio`(IN `anhio` TINYINT)
    NO SQL
SELECT m.id_apoderado,ap.apellidos_apoderado,ap.nombres_apoderado,ap.doc_apoderado,ap.celular_apoderado 
FROM padron_matricula m
INNER JOIN apoderado ap ON ap.id_apoderado=m.id_apoderado
WHERE m.estado_matricula=1
AND m.id_anhio=anhio
GROUP BY m.id_apoderado
ORDER BY ap.apellidos_apoderado,ap.nombres_apoderado ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_detalle_compra`(IN `compra` SMALLINT)
    NO SQL
SELECT * FROM detalle_compra
WHERE id_compra=compra$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_detalle_deuda_pendientes`(IN `apo` SMALLINT)
    NO SQL
SELECT de.id_detalle_deuda,ca.descripcion_concepto,de.saldo_deuda,
(CASE WHEN de.estado_deuda='P' THEN 'PENDIENTE'
ELSE 'PAGADO' END) AS estado_deuda,'' as tipo_pago,0 as monto,de.freg_deuda as fecha FROM detalle_deuda de 
INNER JOIN concepto_apafa ca ON ca.id_concepto=de.id_concepto
WHERE de.id_apoderado=apo
AND de.estado_deuda='P'$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_deudas_apo_anhio`(IN `apo` SMALLINT, IN `anhio` SMALLINT)
SELECT de.id_detalle_deuda,ca.descripcion_concepto,
de.saldo_deuda,'' as tipo_pago,0 as monto,de.freg_deuda as fecha FROM detalle_deuda de 
INNER JOIN concepto_apafa ca ON ca.id_concepto=de.id_concepto
WHERE de.id_apoderado=apo
AND ca.id_anhio=anhio
AND de.estado_deuda='P'$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_egresos_xperiodo`(IN `cod_anhio` CHAR(4))
SELECT id_compra,(CASE WHEN tipo_compra='F' THEN 'FACTURA'
                          ELSE 'BOLETA' END) as tipo_compra,num_compra, razon_social_compra,ruc_compra, fecha_compra,freg_compra, doc_encargado_compra, encargado_compra, total_compra, estado_compra,(CASE
      WHEN estado_compra=1 THEN 'VIGENTE'
      ELSE 'ELIMINADO'
     END) as estado,
      (CASE
  WHEN  estado_compra=1 THEN '#2a7703'
  ELSE '#e4040e'
 END) as color_estado FROM compra
WHERE id_anhio=(SELECT idanhio FROM anhio_lectivo WHERE condicion_anhio='A' AND estado_anhio=1 AND anhio_lectivo=cod_anhio)
UNION ALL 
SELECT id_movimiento AS id_compra,'OTROS' AS tipo_compra, 
doc_encargado_movimiento AS num_compra, 
datos_encargado_movimiento As razon_social_compra,
descripcion_movimiento AS ruc_compra,freg_movimiento AS fecha_compra,freg_movimiento AS freg_compra,
'' AS doc_encargado_compra,'' AS encargado_compra,
monto_movimiento AS total_compra,estado_movimiento as estado_compra,
(CASE
      WHEN estado_movimiento=1 THEN 'VIGENTE'
      ELSE 'ELIMINADO'
     END) as estado,
      (CASE
  WHEN  estado_movimiento=1 THEN '#2a7703'
  ELSE '#e4040e'
 END) as color_estado
FROM movimiento
WHERE tipo_movimiento='E'
AND id_anhio=(SELECT idanhio from
anhio_lectivo WHERE condicion_anhio='A' 
AND estado_anhio=1
AND anhio_lectivo=cod_anhio)
ORDER BY freg_compra DESC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_grados`(IN `nivel` CHAR(1))
    NO SQL
SELECT g.id_grado,g.descripcion_grado,g.nivel_grado,
(CASE 
     WHEN estado_grado=1 THEN 'ACTIVO'
     ELSE 'INACTIVO'
END) as estado, g.estado_grado,
(CASE
     WHEN s.total>0 THEN s.total
     ELSE 0
END) as total FROM grados g
 LEFT JOIN
  (SELECT id_grado, COUNT(*) total FROM secciones 
   WHERE estado_seccion=1
   GROUP BY id_grado) s
   ON g.id_grado = s.id_grado
 WHERE g.nivel_grado=nivel$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_grados_activos`(IN `nivel` CHAR(1))
    NO SQL
SELECT * FROM grados g
 WHERE g.nivel_grado=nivel
 AND g.estado_grado=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_grados_xmatricula`(IN `anhio` TINYINT)
SELECT g.id_grado,g.descripcion_grado 
FROM padron_matricula m 
INNER JOIN secciones s ON s.id_seccion=m.id_seccion
INNER JOIN grados g ON g.id_grado=s.id_grado
WHERE m.estado_matricula=1
AND m.id_anhio=anhio
GROUP BY g.id_grado,g.descripcion_grado
ORDER BY g.id_grado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_historial_matricula`(IN `alumno` SMALLINT)
SELECT m.id_matricula,m.id_anhio,a.anhio_lectivo,ap.id_apoderado,
ap.doc_apoderado,ap.nombres_apoderado, ap.apellidos_apoderado, g.descripcion_grado, s.nombre_seccion
FROM padron_matricula m
INNER JOIN anhio_lectivo a ON a.idanhio=m.id_anhio
INNER JOIN apoderado ap ON ap.id_apoderado = m.id_apoderado
INNER JOIN secciones s ON s.id_seccion = m.id_seccion
INNER JOIN grados g ON g.id_grado = s.id_grado
WHERE m.id_alumno =alumno
AND m.estado_matricula =1
ORDER BY a.anhio_lectivo DESC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_ingresos_xperiodo`(IN `anhio` CHAR(4))
    NO SQL
SELECT r.id_recibo AS id_ingreso,'RECIBO' AS tipo,a.id_apoderado as id_apoderado,r.num_recibo AS doc_ingreso, 
r.nompago_recibo as nompago,r.docpago_recibo as docpago,r.celpago_recibo as celupago,r.nompago_recibo as descripcion_ingreso,r.descripcion_recibo as desc_recibo,r.mtotal_recibo AS monto_ingreso, 
r.freg_recibo AS freg_ingreso, (CASE
      WHEN r.estado_recibo=1 THEN 'VIGENTE'
      ELSE 'ELIMINADO'
     END) as estado,
      (CASE
  WHEN  r.estado_recibo=1 THEN '#2a7703'
  ELSE '#e4040e'
 END) as color_estado
FROM recibo r
INNER JOIN apoderado a ON a.id_apoderado=r.id_apoderado
WHERE r.id_anhio=(SELECT idanhio from
anhio_lectivo WHERE condicion_anhio='A' 
AND estado_anhio=1
AND anhio_lectivo=anhio)
UNION ALL 
SELECT id_movimiento AS id_ingreso,'OTROS' AS tipo,'' AS id_apoderdo, 
doc_encargado_movimiento AS doc_ingreso,
'' as nompago,'' as docpago,'' as celupago,
descripcion_movimiento as descripcion_ingreso,
'' as desc_recibo,
monto_movimiento AS monto_ingreso, freg_movimiento AS freg_ingreso,
 (CASE
      WHEN estado_movimiento=1 THEN 'VIGENTE'
      ELSE 'ELIMINADO'
     END) as estado,
      (CASE
  WHEN estado_movimiento=1 THEN '#2a7703'
  ELSE '#e4040e'
 END) as color_estado
FROM movimiento
WHERE tipo_movimiento='I'
AND id_anhio=(SELECT idanhio from
anhio_lectivo WHERE condicion_anhio='A' 
AND estado_anhio=1
AND anhio_lectivo=anhio)
ORDER BY freg_ingreso DESC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_libros_activos`()
    NO SQL
SELECT * FROM libro l 
INNER JOIN grados g ON g.id_grado=l.id_grado
WHERE l.estado_libro=1
ORDER BY g.id_grado ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_libros_xgrado`(IN `grado` TINYINT, IN `matricula` SMALLINT)
SELECT * FROM libro l WHERE NOT EXISTS 
(SELECT * FROM libro_matricula lm WHERE lm.id_libro = l.id_libro
AND lm.id_matricula=matricula)
AND l.id_grado=grado
AND l.estado_libro=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_libros_xmatricula`(IN `matricula` SMALLINT)
    NO SQL
SELECT * FROM libro_matricula lm
INNER JOIN libro l ON l.id_libro=lm.id_libro
WHERE id_matricula=matricula$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_matriculados_xanhio`(IN `anhio` TINYINT)
    NO SQL
SELECT a.doc_alumno,a.apellidos_alumno,a.nombres_alumno,g.descripcion_grado,s.nombre_seccion 
FROM padron_matricula m 
INNER JOIN alumno a ON a.id_alumno=m.id_alumno
INNER JOIN secciones s ON s.id_seccion=m.id_seccion
INNER JOIN grados g ON g.id_grado=s.id_grado
WHERE m.id_anhio=anhio
AND m.estado_matricula=1
ORDER BY g.id_grado,s.nombre_seccion,a.apellidos_alumno,a.nombres_alumno ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_matriculados_xgrado`(IN `grado` TINYINT)
SELECT a.doc_alumno,a.apellidos_alumno,a.nombres_alumno,s.nombre_seccion FROM matricula m 
INNER JOIN alumno a ON a.id_alumno=m.id_alumno
INNER JOIN secciones s ON s.id_seccion=m.id_seccion
INNER JOIN grados g ON s.id_grado=g.id_grado
WHERE g.id_grado=grado
AND m.id_anhio=(SELECT idanhio FROM anhio_lectivo WHERE condicion_anhio='A' AND estado_anhio=1)
AND m.estado_matricula=1
ORDER BY a.apellidos_alumno,a.nombres_alumno,s.nombre_seccion ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_otros_conceptos`(IN `dato_anhio` CHAR(4))
    NO SQL
SELECT * FROM concepto_apafa c 
INNER JOIN anhio_lectivo a ON a.idanhio=c.id_anhio
WHERE c.estado_concepto=1
AND c.tipo_concepto='O'
AND a.anhio_lectivo=dato_anhio$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_padron_matriculados_xanhio`()
SELECT a.id_alumno,a.doc_alumno,CONCAT(a.apellidos_alumno,' ',a.nombres_alumno) as datos_alumno,m.id_matricula,
g.descripcion_grado as grado,g.id_grado,s.nombre_seccion as seccion FROM padron_matricula m 
INNER JOIN apoderado ap ON m.id_apoderado=ap.id_apoderado
INNER JOIN alumno a ON a.id_alumno=m.id_alumno
INNER JOIN anhio_lectivo an ON an.idanhio=m.id_anhio
INNER JOIN secciones s ON s.id_seccion=m.id_seccion
INNER JOIN grados g ON g.id_grado=s.id_grado
INNER JOIN tipo_relacion tr ON tr.id_tipo_relacion=m.id_tipo_relacion
WHERE m.estado_matricula=1
AND m.id_anhio=(SELECT idanhio FROM anhio_lectivo WHERE condicion_anhio='I' AND estado_anhio=1)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_perfil_usuario`()
    NO SQL
SELECT * FROM perfil_usuario
WHERE estado_perfil=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_recibos_apo_anhio`(IN `apo` SMALLINT, IN `anhio` SMALLINT)
SELECT * FROM recibo
WHERE id_apoderado=apo
AND id_anhio=anhio
AND estado_recibo=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_reuniones_apo_anhio`(IN `apo` SMALLINT, IN `anhio` SMALLINT)
SELECT r.motivo_reunion,r.fecha_reunion,ca.monto_concepto,
(CASE WHEN ra.asistio_reunion=1 THEN 'ASISTIO'
ELSE 'FALTO' END) AS estado_reunion,
(CASE WHEN ra.asistio_reunion=1 THEN 'green'
ELSE 'red' END) AS color FROM reunion_apoderado ra 
INNER JOIN reunion r ON r.id_reunion = ra.id_reunion
INNER JOIN concepto_apafa ca ON ca.id_concepto = r.id_concepto
WHERE ra.id_apoderado=apo
AND ca.id_anhio=anhio
AND r.estado_reunion = 1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_reuniones_xperiodo`(IN `dato_anhio` CHAR(4))
    NO SQL
SELECT r.id_reunion, r.motivo_reunion,CONCAT(r.fecha_reunion,' ',r.hora_reunion) AS fecha_reunion,r.lista_reunion,r.asistencia_reunion,r.id_concepto,r.estado_reunion,c.descripcion_concepto,
c.monto_concepto,a.anhio_lectivo
FROM reunion r
INNER JOIN concepto_apafa c ON c.id_concepto=r.id_concepto
INNER JOIN anhio_lectivo a ON a.idanhio=c.id_anhio
WHERE r.estado_reunion=1
AND a.anhio_lectivo=dato_anhio
ORDER BY r.fecha_reunion DESC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_secciones_xgrado`(IN `grado` TINYINT)
    NO SQL
SELECT s.id_seccion,s.nombre_seccion,g.descripcion_grado,g.id_grado,
(CASE 
     WHEN s.turno_seccion='M' THEN 'MAÑANA'
     ELSE 'TARDE'
END) as turno FROM secciones s 
INNER JOIN grados g ON g.id_grado=s.id_grado 
WHERE s.estado_seccion=1
AND g.id_grado=grado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_tipo_relacion`()
    NO SQL
SELECT * FROM tipo_relacion
WHERE estado_relacion=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_todos_conceptos`(IN `anhio` CHAR(4))
    NO SQL
SELECT id_concepto,descripcion_concepto,(CASE WHEN tipo_concepto='A'
THEN 'APAFA' ELSE 'OTROS' END) AS tipo_concepto,id_anhio,
monto_concepto FROM concepto_apafa c
INNER JOIN anhio_lectivo al ON al.idanhio=c.id_anhio
WHERE al.anhio_lectivo=anhio
AND c.estado_concepto=1
ORDER BY c.tipo_concepto$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_token_celular`()
SELECT * FROM token_celular
WHERE estado_token=1$$

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
WHERE u.estado_usu=1
ORDER BY u.apellidos_usu$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_obtener_detalle_movimiento`(IN `id` SMALLINT, IN `tipo` CHAR(1))
    NO SQL
SELECT descripcion_movimiento,monto_movimiento,freg_movimiento,
doc_encargado_movimiento,datos_encargado_movimiento 
FROM movimiento
WHERE id_movimiento=id
AND tipo_movimiento=tipo$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_obtener_detalle_recibo`(IN `id` SMALLINT)
    NO SQL
SELECT c.descripcion_concepto,convert(dr.monto_detalle, decimal(10,2)) as monto_detalle FROM detalle_recibo dr 
INNER JOIN detalle_deuda d ON dr.id_detalle_deuda=d.id_detalle_deuda
INNER JOIN recibo r ON r.id_recibo=dr.id_recibo
INNER JOIN concepto_apafa c ON c.id_concepto=d.id_concepto
WHERE r.id_recibo=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_obtener_perfil_alumno`(IN `alumno` SMALLINT)
SELECT a.id_alumno,ap.id_apoderado,ap.doc_apoderado,a.doc_alumno,a.apellidos_alumno,a.nombres_alumno,
a.apellidos_padre,a.nombres_padre,a.apellidos_madre,a.nombres_madre,
ap.apellidos_apoderado,ap.nombres_apoderado,an.anhio_lectivo, 
g.descripcion_grado,s.nombre_seccion FROM padron_matricula m
INNER JOIN apoderado ap ON ap.id_apoderado=m.id_apoderado
INNER JOIN anhio_lectivo an ON an.idanhio=m.id_anhio
INNER JOIN secciones s ON s.id_seccion=m.id_seccion
INNER JOIN grados g ON g.id_grado=s.id_grado
INNER JOIN alumno a ON m.id_alumno=a.id_alumno
WHERE a.id_alumno=alumno
AND an.estado_anhio=1
AND m.estado_matricula = 1
order by m.id_matricula DESC
LIMIT 1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_obtener_reunion`(IN `reu` SMALLINT)
SELECT * FROM reunion
WHERE id_reunion=reu
AND estado_reunion=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_obtener_total_deuda`(IN `anhio` SMALLINT, IN `apo` SMALLINT)
SELECT c.id_anhio,dd.id_apoderado, SUM( dd.saldo_deuda ) AS total
FROM detalle_deuda dd
INNER JOIN concepto_apafa c ON c.id_concepto = dd.id_concepto
WHERE dd.estado_deuda = 'P'
AND c.estado_concepto=1
AND c.id_anhio=anhio AND dd.id_apoderado=apo
GROUP BY c.id_anhio, dd.id_apoderado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_obtener_ultimo_registro`()
SELECT LAST_INSERT_ID()$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_obtener_usuario`(IN `id` INT)
    NO SQL
SELECT * FROM usuario u
INNER JOIN perfil_usuario pu ON pu.idperfil_usuario=u.idperfil_usuario
WHERE u.idusuario=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_quitar_entrega_libro`(IN `matricula` SMALLINT, IN `libro` TINYINT)
    NO SQL
DELETE FROM libro_matricula
WHERE id_matricula=matricula
AND id_libro=libro$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_registrar_asistencia_reunion`(IN `reunion` SMALLINT, IN `apoderado` SMALLINT, IN `opt` BIT(1))
    NO SQL
UPDATE reunion_apoderado SET asistio_reunion=opt
WHERE id_reunion=reunion AND id_apoderado=apoderado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_resetear_usuario`(IN `id_usu` TINYINT)
    NO SQL
UPDATE usuario SET clave_usu=SHA('1A2B3C4D'),fbaja_usu=NULL
WHERE idusuario=id_usu$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_ultimo_recibo_ingresado`(IN `anhio` CHAR(4))
SELECT id_recibo, id_apoderado, id_usuario, id_anhio, 
mtotal_recibo, freg_recibo, num_recibo, 
nompago_recibo as nompago, docpago_recibo as docpago, 
celpago_recibo as celupago,descripcion_recibo as desc_recibo, estado_recibo 
  FROM recibo
  WHERE id_anhio=(SELECT idanhio from
anhio_lectivo WHERE condicion_anhio='I' 
AND estado_anhio=1
AND anhio_lectivo=anhio)
 ORDER BY id_recibo DESC
  limit 1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_alumno`(IN `id` SMALLINT, IN `ape_alum` VARCHAR(60), IN `nom_alum` VARCHAR(50), IN `fnac` DATE, IN `sex_alum` CHAR(1), IN `tel_alum` CHAR(6), IN `cel_alum` CHAR(9), IN `direc_alum` VARCHAR(80), IN `cor_alum` VARCHAR(80), IN `proc_alum` VARCHAR(100), IN `ape_padre` VARCHAR(60), IN `nom_padre` VARCHAR(50), IN `cel_padre` CHAR(9), IN `cor_padre` VARCHAR(80), IN `ape_madre` VARCHAR(60), IN `nom_madre` VARCHAR(50), IN `cel_madre` CHAR(9), IN `cor_madre` VARCHAR(80), IN `td_padre` CHAR(3), IN `d_padre` VARCHAR(15), IN `td_madre` CHAR(3), IN `d_madre` VARCHAR(15))
    NO SQL
UPDATE alumno SET apellidos_alumno=ape_alum,
nombres_alumno=nom_alum,fnac_alumno=fnac,
sexo_alumno=sex_alum,telefono_alumno=tel_alum,
celular_alumno=cel_alum,direccion_alumno=direc_alum,
correo_alumno=cor_alum,
procedencia_alumno=proc_alum,tdoc_padre=td_padre,doc_padre=d_padre,
apellidos_padre=ape_padre,nombres_padre=nom_padre,
celular_padre=cel_padre,correo_padre=cor_padre,
tdoc_madre=td_madre,doc_madre=d_madre,
apellidos_madre=ape_madre,nombres_madre=nom_madre,
celular_madre=cel_madre,correo_madre=cor_madre
WHERE id_alumno=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_anhio_xcriterio`(IN `criterio` VARCHAR(12), IN `id` TINYINT)
IF criterio="cerrar" THEN
UPDATE anhio_lectivo SET condicion_anhio='C'
WHERE idanhio=id;
ELSEIF criterio="reiniciar" THEN
UPDATE anhio_lectivo SET condicion_anhio='I'
WHERE idanhio=id;
ELSE
UPDATE anhio_lectivo SET estado_anhio=0 
WHERE idanhio=id;
END IF$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_apoderado`(IN `id_apo` SMALLINT, IN `ape_apod` VARCHAR(60), IN `nom_apod` VARCHAR(50), IN `sex_apod` CHAR(1), IN `cel_apod` CHAR(9), IN `dir_apod` VARCHAR(80), IN `cor_apod` VARCHAR(80))
    NO SQL
UPDATE apoderado SET apellidos_apoderado=ape_apod,
nombres_apoderado=nom_apod,sexo_apoderado=sex_apod,
celular_apoderado=cel_apod,
direccion_apoderado=dir_apod,correo_apoderado=cor_apod
WHERE id_apoderado=id_apo$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_asistencia_reunion`(IN `id_reu` SMALLINT)
UPDATE reunion SET asistencia_reunion=1
WHERE id_reunion=id_reu$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_clave`(IN `clave` VARCHAR(10), IN `id` SMALLINT)
    NO SQL
UPDATE usuario SET clave_usu=SHA(clave) 
WHERE idusuario=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_concepto`(IN `id` SMALLINT, IN `descripcion` VARCHAR(100), IN `monto` FLOAT)
    NO SQL
UPDATE concepto_apafa SET descripcion_concepto=descripcion,monto_concepto=monto
WHERE id_concepto=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_deuda`(IN `id` SMALLINT, IN `monto` FLOAT, IN `estado` CHAR(1))
    NO SQL
UPDATE detalle_deuda SET saldo_deuda=saldo_deuda-monto,
fseg_deuda=NOW(),estado_deuda=estado
WHERE id_detalle_deuda=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_libro`(IN `t_libro` VARCHAR(80), IN `edit_libro` VARCHAR(20), IN `edicion` CHAR(4), IN `grado` TINYINT, IN `idlibro` TINYINT)
    NO SQL
UPDATE libro SET titulo_libro=t_libro,editorial_libro=edit_libro,edicion_libro=edicion,id_grado=grado WHERE id_libro=idlibro$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_usuario`(IN `idusu` TINYINT, IN `nom_usu` VARCHAR(20), IN `nombres` VARCHAR(45), IN `apellidos` VARCHAR(60), IN `sexo` CHAR(1), IN `celular` CHAR(9), IN `correo` VARCHAR(80), IN `direccion` VARCHAR(80), IN `fbaja` DATE, IN `obser` VARCHAR(50), IN `perfil` INT)
UPDATE usuario SET nom_usu=nom_usu,nombres_usu=nombres,apellidos_usu=apellidos,sexo_usu=sexo,celular_usu=celular,correo_usu=correo,direccion_usu=direccion,fbaja_usu=fbaja,obser_usu=obser,idperfil_usuario=perfil
WHERE idusuario=idusu$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_anhio`(IN `dato` CHAR(4))
SELECT
    anhio_lectivo,idanhio
    FROM anhio_lectivo
    WHERE anhio_lectivo=dato AND estado_anhio=1
    UNION
    SELECT 'AÑO LECTIVO AUN APERTURADO',NULL FROM DUAL
    WHERE EXISTS
    ( SELECT idanhio
    FROM anhio_lectivo
    WHERE condicion_anhio='A' AND estado_anhio=1)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_cuota_apafa_xanhio`(IN `anhio_lec` CHAR(4))
SELECT * FROM concepto_apafa c
INNER JOIN anhio_lectivo al ON al.idanhio=c.id_anhio
WHERE al.anhio_lectivo=anhio_lec
AND c.tipo_concepto='A'
AND c.estado_concepto=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_deuda_apoderado`(IN `concepto` SMALLINT, IN `apoderado` SMALLINT, IN `anhio` CHAR(4))
    NO SQL
SELECT * FROM detalle_deuda
WHERE id_concepto=concepto
AND id_apoderado=apoderado
AND  YEAR(freg_deuda)=anhio
AND estado_deuda='P'$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_matricula_alumno`(IN `alumno` SMALLINT, IN `dato_anhio` CHAR(4))
SELECT * FROM padron_matricula m
WHERE m.id_alumno=alumno
AND m.estado_matricula=1
AND m.id_anhio=(SELECT idanhio FROM anhio_lectivo WHERE condicion_anhio='I' AND estado_anhio=1 AND anhio_lectivo=dato_anhio)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_seccion`(IN `nombre` VARCHAR(20), IN `grado` TINYINT)
    NO SQL
SELECT * FROM secciones
WHERE nombre_seccion=nombre
AND id_grado=grado
AND estado_seccion=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_si_anhio_iniciado`()
SELECT * FROM anhio_lectivo
WHERE condicion_anhio='I' AND estado_anhio=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_si_cuota_apafa_registrada`(IN `apoderado` SMALLINT, IN `dato_anhio` CHAR(4))
SELECT * FROM detalle_deuda du 
INNER JOIN concepto_apafa ca ON ca.id_concepto=du.id_concepto
INNER JOIN anhio_lectivo a ON a.idanhio=ca.id_anhio
WHERE du.id_apoderado=apoderado
AND ca.tipo_concepto='A'
AND ca.id_anhio=(SELECT idanhio FROM anhio_lectivo WHERE condicion_anhio='I' AND estado_anhio=1
                AND anhio_lectivo=dato_anhio)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_token`(IN `token_celu` VARCHAR(200))
SELECT * FROM token_celular
WHERE token=token_celu
AND estado_token=1$$

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
  `tdoc_padre` char(3) DEFAULT NULL,
  `doc_padre` varchar(15) DEFAULT NULL,
  `apellidos_padre` varchar(60) NOT NULL,
  `nombres_padre` varchar(50) NOT NULL,
  `celular_padre` char(9) DEFAULT NULL,
  `correo_padre` varchar(80) DEFAULT NULL,
  `tdoc_madre` char(3) DEFAULT NULL,
  `doc_madre` varchar(15) DEFAULT NULL,
  `apellidos_madre` varchar(60) NOT NULL,
  `nombres_madre` varchar(50) NOT NULL,
  `celular_madre` char(9) DEFAULT NULL,
  `correo_madre` varchar(80) DEFAULT NULL,
  `estado_alumno` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_alumno`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=145 ;

--
-- Volcado de datos para la tabla `alumno`
--

INSERT INTO `alumno` (`id_alumno`, `tdoc_alumno`, `doc_alumno`, `apellidos_alumno`, `nombres_alumno`, `fnac_alumno`, `sexo_alumno`, `telefono_alumno`, `celular_alumno`, `direccion_alumno`, `correo_alumno`, `procedencia_alumno`, `tdoc_padre`, `doc_padre`, `apellidos_padre`, `nombres_padre`, `celular_padre`, `correo_padre`, `tdoc_madre`, `doc_madre`, `apellidos_madre`, `nombres_madre`, `celular_madre`, `correo_madre`, `estado_alumno`) VALUES
(1, 'OTR', '751654654M65484', 'Flores Aguilar', 'Diego', '2006-06-06', 'M', NULL, '928282905', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Flores Abad', 'Adler Mauro', '929151181', NULL, NULL, NULL, 'Aguilar Martinez', 'Rosa Luisa', NULL, NULL, b'1'),
(2, 'DNI', '80717855', 'Rubio Vasquez', 'Jose Alexander', '2003-08-04', 'M', '480429', '987445673', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Rubio Abad', 'Samuel', '983228426', NULL, NULL, NULL, 'Vasquez Delgado', 'Luz', NULL, NULL, b'1'),
(3, 'DNI', '70832512', 'Arroyo Maury', 'Paola Cinthia', '0000-00-00', 'F', '479474', '901929216', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Arroyo Abanto', 'Edzon ', '965426036', '', NULL, NULL, 'Maury Zamora', 'Clariliz Matilde', NULL, '', b'1'),
(4, 'DNI', '19648251', 'Carpio Zamudio', 'Angela Maria', '2003-06-20', 'F', NULL, '971006543', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Carpio Abila', 'Melchor Rogelio', NULL, '', NULL, NULL, 'Zamudio Vasquez', 'Leysi', NULL, '', b'1'),
(5, 'DNI', '20565088', 'Caycho Huaman', 'Jose Alberto', '2007-02-22', 'M', NULL, '910692871', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Caycho Accilio', 'Henry', NULL, '', NULL, NULL, 'Huaman Baca', 'Mirelly Jasmin', NULL, '', b'1'),
(6, 'DNI', '24678923', 'Cieza Nuñez', 'Luis Carlos', '2007-02-28', 'M', NULL, '977343983', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Cieza Acharte', 'Jhonatan', NULL, '', NULL, NULL, 'Nuñez Bustamante', 'Yeni', NULL, '', b'1'),
(7, 'DNI', '70937066', 'Dumet Poma', 'Lisset Marilyn', '2003-02-06', 'F', NULL, '938497198', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Dumet Acosta', 'Fernando', NULL, '', NULL, NULL, 'Poma Carrera', 'Lesdy', NULL, '', b'1'),
(8, 'DNI', '63138772', 'Fujishima Urteaga', 'Begona Saori', '2007-08-31', 'F', NULL, '911544034', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Fujishima Abendaño', 'Nicolas', NULL, '', NULL, NULL, 'Urteaga Cruz', 'Yannina', NULL, '', b'1'),
(9, 'DNI', '53002208', 'Longa Gamarra', 'Yurlik Roger', '2005-05-30', 'M', NULL, '934442634', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Longa Zuñiga', 'Miguel Angel', NULL, '', NULL, NULL, 'Gamarra Cubas', 'Sarita Janet', NULL, '', b'1'),
(10, 'DNI', '90325173', 'Miranda Casas', 'Elvira Adriana', '2006-09-04', 'F', NULL, '914822125', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Miranda Aguirre', 'Dan Nefeg', NULL, '', NULL, NULL, 'Casas Sanchez', 'Aurora', NULL, '', b'1'),
(11, 'DNI', '61939607', 'Ramirez Soplin', 'Magally Loidit', '2005-04-19', 'F', NULL, '923978763', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Ramirez Aique', 'Enrique', NULL, '', NULL, NULL, 'Soplin Cornejo', 'Sindy', '963878818', '', b'1'),
(12, 'DNI', '10904092', 'Tapia Alva', 'Juana Rafaela', '2003-04-16', 'F', NULL, '900206988', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Tapia Agüero', 'Neyl Paul', NULL, '', NULL, NULL, 'Alva Daza', 'Katia', '908595796', '', b'1'),
(13, 'DNI', '82868877', 'Tovar Jimenez', 'Victor Guadalupe', '2003-11-30', 'M', NULL, '939790953', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Tovar Alanya', 'Estiven Rafael', NULL, '', NULL, NULL, 'Jimenez De La Cruz', 'Ines', '997980941', '', b'1'),
(14, 'DNI', '58231260', 'Vergara Cohen', 'David', '2007-02-23', 'M', NULL, '948215267', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Vergara Alarcon', 'Luis', NULL, '', NULL, NULL, 'Cohen Delgado', 'Yoly', '920875746', '', b'1'),
(15, 'DNI', '15653385', 'Aguado López', 'Mayra', '2006-06-16', 'M', NULL, '973119361', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Aguado Baltazar', 'Wilfredo', NULL, '', NULL, NULL, 'López Dueñas', 'Marizol', '911672102', '', b'1'),
(16, 'DNI', '51519494', 'Alberola Robles', 'Rafael', '2005-11-08', 'F', NULL, '900021817', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Alberola Balderon', 'Jorge Silverio', NULL, '', NULL, NULL, 'Robles Fernandez', 'Gladis', '964720201', '', b'1'),
(17, 'DNI', '79190077', 'Alonso López', 'Francisca', '2005-02-03', 'F', '488318', '917136863', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Alonso Barros', 'Kevin', NULL, '', NULL, NULL, 'López Diaz', 'Magdalena', NULL, '', b'1'),
(18, 'DNI', '74529930', 'Álvarado Martinez', 'Juan Carlos', '2006-01-17', 'M', '485625', '999018736', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Álvarado Barboza', 'Michael', NULL, '', NULL, NULL, 'Martinez Vilchez', 'Berta', NULL, '', b'1'),
(19, 'DNI', '52714297', 'Arias Brenes', 'Guido Giancarlo', '2003-06-24', 'M', '455765', '947555043', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Arias Bardales', 'Christian Daeive', '947236763', '', NULL, NULL, 'Brenes Cruzado', 'Doraly', NULL, '', b'1'),
(20, 'DNI', '25778260', 'Bastida Lopez', 'Dolores Margarita', '2007-03-04', 'F', '400375', '955070840', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Bastida Bartolo', 'Jonas Darwin', '927903915', '', NULL, NULL, 'Lopez Tocto', 'Haydee', NULL, '', b'1'),
(21, 'DNI', '84601834', 'Blasco Boix', 'Jos? Manuel', '2006-09-30', 'M', '469563', '955464959', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Blasco Balvin', 'Neyer Ivan', '930392751', '', NULL, NULL, 'Boix Uriol', 'Edith', NULL, '', b'1'),
(22, 'DNI', '86208143', 'Casas Bosca', 'Juan F?lix', '2003-06-12', 'M', '477441', '986304167', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Casas Barzola', 'Michael Willian', '987738404', '', NULL, NULL, 'Bosca Baldera', 'Cory', NULL, '', b'1'),
(23, 'DNI', '29043534', 'Chavez Fallas', 'Liliana', '2005-05-02', 'F', '414840', '945826249', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Chavez Bonilla', 'Mequias', '993488621', '', NULL, NULL, 'Fallas Alva', 'Mercedes', NULL, '', b'1'),
(24, 'DNI', '38657266', 'Cruz De Freitas', 'Marcos Paulo', '2006-08-10', 'M', '442712', '998517880', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Cruz Bocanegra', 'Junior Jhasiro', '922930427', '', NULL, NULL, 'De Freitas Catpo', 'Militza', NULL, '', b'1'),
(25, 'DNI', '74742679', 'Fernández Talavera', 'Mar?a Luisa', '2003-01-20', 'F', '407137', '955110505', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Fernández Borja', 'John Frank', '985295597', '', NULL, NULL, 'Talavera Diaz', 'Zulema', NULL, '', b'1'),
(26, 'DNI', '62833455', 'Flores Cantillano', 'Gernando Andr?s', '2007-09-30', 'M', '467193', '957415288', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Flores Boza', 'Jaime', '967246574', '', NULL, NULL, 'Cantillano Ocampo', 'Luzmelita', NULL, '', b'1'),
(27, 'DNI', '84804541', 'García Blaya', '?ngela Sofia', '2005-01-25', 'F', NULL, '967105110', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'García Cabello', 'Reynaldo', '969910377', '', NULL, NULL, 'Blaya Arce', 'Dorali', '950632290', '', b'1'),
(28, 'DNI', '72830841', 'García Blaya', 'Mar?a Sonia', '2003-12-31', 'F', NULL, '901196560', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'García Cabanillas', 'Gilbert', '953134643', '', NULL, NULL, 'Blaya Arce', 'Dorali', '950632290', '', b'1'),
(29, 'DNI', '3170868', 'García García', 'Mar?a', '2006-11-17', 'F', NULL, '988182877', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'García Cabrera', 'Wilber', '924440964', '', NULL, NULL, 'García Huaman', 'Clarita', '958031062', '', b'1'),
(30, 'DNI', '28981540', 'García Gómez', 'Sonia', '2003-12-06', 'F', NULL, '922626668', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'García Cabia', 'Raul', '932139978', '', NULL, NULL, 'Minchan Gutierrez', 'Luz Clarita', '933488368', '', b'1'),
(31, 'DNI', '10469570', 'García Martínez', 'Andr?s Odilio', '2004-10-22', 'M', NULL, '962426153', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'García Cachay', 'Richard Raul', '950340931', '', NULL, NULL, 'Martínez Paucar', 'Patricia', '920105997', '', b'1'),
(32, 'DNI', '35261289', 'Garca Nicolás', 'Rosa Mar?a', '2003-09-06', 'F', NULL, '928319953', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Garca Cajaleon', 'Victor', '951736299', '', NULL, NULL, 'Nicolás Mesia', 'Blanca', '920940279', '', b'1'),
(33, 'DNI', '45898445', 'Jiménez Manzano', 'Laura Del Rosario', '2007-10-30', 'F', NULL, '969335752', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Jiménez Caceres', 'Manuel Guido', NULL, '', NULL, NULL, 'Manzano Espinoza', 'Xiomara', '903717042', '', b'1'),
(34, 'DNI', '22699649', 'López Calvo', 'Rebeca', '2006-04-12', 'M', NULL, '934614768', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'López Caicedo', 'Remigio', NULL, '', NULL, NULL, 'Calvo Machado', 'Medally', '985538389', '', b'1'),
(35, 'DNI', '30796276', 'López García', 'Andr?s', '2003-04-21', 'M', NULL, '978939666', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'López Cadillo', 'Javier', NULL, '', NULL, NULL, 'García Lazaro', 'Isabel', '952909129', '', b'1'),
(36, 'DNI', '66637196', 'López Rueda', 'Jose Javier', '2004-06-02', 'M', NULL, '929572233', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'López Caldas', 'Alex', NULL, '', NULL, NULL, 'Rueda Aranda', 'Maria Cecilia', NULL, '', b'1'),
(37, 'DNI', '61821438', 'Abad Chavez ', 'Romar Abad ', '2006-10-28', 'M', NULL, '988325569', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Abad Cajaleon', 'Jhans Carlos', NULL, NULL, NULL, NULL, 'Chavez Vasquez', 'Teresa', NULL, NULL, b'1'),
(38, 'DNI', '70080533', 'Acha Guerrero Acha Guerrero', 'Yasanali Yasanali Yasanali', '2004-05-19', 'F', NULL, '988118327', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Acha Casado', 'Juan Carlos', NULL, NULL, NULL, NULL, 'Guerrero Correa', 'Flor Isabel', NULL, NULL, b'1'),
(39, 'DNI', '75797998', 'Acosta Santisteban', 'Maria Gisela', '2004-08-08', 'F', NULL, '907796793', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Acosta Casimiro', 'Michael', NULL, '', NULL, NULL, 'Santisteban Ita', 'Milagros Magaly', NULL, '', b'1'),
(40, 'DNI', '42179802', 'Acuña Cervantes', 'Elmer', '2006-11-15', 'M', '436223', '957923672', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Acuña Casio', 'Emerson', NULL, '', NULL, NULL, 'Cervantes Malaspina', 'Lizbeth', NULL, '', b'1'),
(41, 'DNI', '72367755', 'Acuña Diaz ', 'Alexander', '2005-10-07', 'M', '426694', '979354840', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Acuña Casabona', 'Benito Gabriel', NULL, NULL, NULL, NULL, 'Diaz Medina', 'Giselle', NULL, NULL, b'1'),
(42, 'DNI', '76476977', 'Acuña Gil', 'Rosa Elvira', '2004-07-17', 'F', '430396', '995978265', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Acuña Castillo', 'Ernesto', NULL, '', NULL, NULL, 'Gil Rocca', 'Fernanda Luisa', NULL, '', b'1'),
(43, 'DNI', '47478285', 'Acuña Marrufo', 'José Edgardo', '2004-02-08', 'M', '493337', '910075288', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Acuña Casatañeda', 'Jenhs Joe', NULL, '', NULL, NULL, 'Marrufo Julcamoro', 'Teresa Isabel', NULL, '', b'1'),
(44, 'DNI', '44449653', 'Acuña Marrufo', 'Rosita Elvira', '2005-11-01', 'F', '480935', '944415847', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Acuña Castro', 'Luis Alberto', NULL, '', NULL, NULL, 'Marrufo Minchon', 'Gianera', NULL, '', b'1'),
(45, 'DNI', '76512864', 'Acuña Reyna', 'Juan', '2003-01-28', 'M', '484929', '974397910', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Acuña Caton', 'Yobert Rider', NULL, '', NULL, NULL, 'Reyna Perez', 'Mayra Patricia', NULL, '', b'1'),
(46, 'DNI', '43346228', 'Aguilar Coronado', 'Cecy Lucy', '2006-10-27', 'F', '480647', '941789170', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Aguilar Trujillo', 'Jesus Felix', NULL, '', NULL, NULL, 'Coronado Palma', 'Vanessa', '903158771', '', b'1'),
(47, 'DNI', '46826585', 'Aguilar Garcia', 'Janeth Carolina', '2004-11-22', 'F', '424168', '995746127', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Aguilar Solis', 'Rony', NULL, '', NULL, NULL, 'Garcia Chavez', 'Sara', '989932141', '', b'1'),
(48, 'DNI', '76795062', 'Aguilar Pérez', 'Mercy', '2005-10-16', 'F', '417304', '985029656', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Aguilar Contreras', 'Ronald Smith', '938709040', '', NULL, NULL, 'Pérez Roncal', 'Janny Patricia', '996257102', '', b'1'),
(49, 'DNI', '76398007', 'Aguinaga Fernandez', 'Toni', '2004-06-03', 'M', '408927', '927535824', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Aguinaga Campos', 'Jesus Javier', '927392044', '', NULL, NULL, 'Fernandez Flores', 'Adhely', '923397833', '', b'1'),
(50, 'DNI', '44729740', 'Alcantara Heredia', 'Lupita Kristal', '2007-09-12', 'F', '449915', '965365814', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Alcantara Romero', 'Bruno', '979645049', '', NULL, NULL, 'Heredia Sanchez', 'Erika Luzmila', '947487935', '', b'1'),
(51, 'DNI', '45373642', 'Altamirano Espinoza', 'Anshela Janelly', '2004-11-10', 'F', '465748', '975793888', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Altamirano Córdova', 'Willy', '949314658', '', NULL, NULL, 'Espinoza Saavedra', 'Jackeline', NULL, '', b'1'),
(52, 'DNI', '33649143', 'Banda Cervantes', 'Maria Zenaida', '2003-11-12', 'F', '404588', '921517763', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Banda Cori', 'Edison', '984032767', '', NULL, NULL, 'Cervantes Ramos', 'Annyle Paola', NULL, '', b'1'),
(53, 'DNI', '40383677', 'Banda Cervantes', 'Nancy', '2003-05-18', 'F', '437782', '910907104', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Banda Flores', 'Bolfgan Roy', '979937726', '', NULL, NULL, 'Cervantes Ticeran', 'Angela', NULL, '', b'1'),
(54, 'DNI', '46888936', 'Barba Leon', 'Cesar Alberto', '2004-08-29', 'M', '405262', '928991975', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Barba Cornejo', 'Sergio', '974362850', '', NULL, NULL, 'Leon Silva', 'Brenda', NULL, '', b'1'),
(55, 'DNI', '71111415', 'Barboza Abad', 'Carolay Iveth', '2006-08-03', 'F', '436380', '982476222', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Barboza Flores', 'Paolo Ronald', '905159087', '', NULL, NULL, 'Abad Torres', 'Teresa De Jesus', NULL, '', b'1'),
(56, 'DNI', '72790280', 'Barboza Cholan', 'Willian Armando', '2004-04-23', 'M', '444805', '940050628', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Barboza Roque', 'Franco Juan', '961447737', '', NULL, NULL, 'Cholan Varas', 'Maria ', NULL, '', b'1'),
(57, 'DNI', '42209198', 'Barboza Davila', 'Elena', '2004-07-04', 'F', '494960', '971190857', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Barboza Reque', 'Ernesto Luis', '903229632', '', NULL, NULL, 'Davila Rojas', 'Ines', NULL, '', b'1'),
(58, 'DNI', '74951687', 'Barboza Hurtado', 'Gisella', '2005-09-30', 'F', '473520', '953018647', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Barboza Chamorro', 'Jose Felipe', '941561693', '', NULL, NULL, 'Hurtado Chavez', 'Ruth Rosa', NULL, '', b'1'),
(59, 'DNI', '46187084', 'Bardales Panta', 'Cristhian Roy', '2007-11-08', 'M', '444976', '985436336', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Bardales Timoteo', 'Abel', '980646651', '', NULL, NULL, 'Panta Caballero', 'Vanessa Dayam', NULL, '', b'1'),
(60, 'DNI', '48094458', 'Barragan Izquierdo', 'Harletti Martha Mugny', '2005-06-14', 'F', NULL, '958530793', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Barragan Cortez', 'Dennys David', '941334712', '', NULL, NULL, 'Izquierdo Cancha', 'Mariluz Edilia', NULL, '', b'1'),
(61, 'DNI', '73111499', 'Barrantes Delgado', 'Natalhy Del Pilar', '2003-08-02', 'F', NULL, '975135510', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Barrantes Cotrina', 'Ruben', '991133414', '', NULL, NULL, 'Delgado Zorrilla', 'Eda Maritza', '941203328', '', b'1'),
(62, 'DNI', '43705925', 'Barranzuela Jimenez', 'Randy Edu', '2006-01-20', 'M', NULL, '979519233', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Barranzuela Justo', 'Huber', '938053028', '', NULL, NULL, 'Jimenez Alvarado', 'Estefany Norma', '946100390', '', b'1'),
(63, 'DNI', '10115355', 'Barreto Delgado', 'Jacqueline Dolores', '2005-09-24', 'F', NULL, '966684374', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Barreto Deza', 'Roman Arturo', NULL, '', NULL, NULL, 'Delgado Chiquillo', 'Mily Pilar', '987328918', '', b'1'),
(64, 'DNI', '72731392', 'Cabanillas Correa', 'Kattia', '2005-08-03', 'F', NULL, '997133309', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Cabanillas Davila', 'Ever', NULL, '', NULL, NULL, 'Correa Castro', 'Mirelle Stephany', '929622848', '', b'1'),
(65, 'DNI', '46914489', 'Cabanillas Diaz', 'Hulda Libni', '2006-04-13', 'F', NULL, '985299120', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Cabanillas De La Calle', 'Vladimir', NULL, '', NULL, NULL, 'Diaz Espinoza', 'Greyci', '931956718', '', b'1'),
(66, 'DNI', '48141788', 'Cabanillas Rabanal', 'Edelia Yuliana', '2006-09-23', 'F', NULL, '900367031', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Cabanillas Bravo', 'Percy', NULL, '', NULL, NULL, 'Rabanal Figueroa', 'Blanca', '992391303', '', b'1'),
(67, 'DNI', '47635540', 'Cabanillas Reyna', 'Melissa', '2007-04-28', 'F', NULL, '964534529', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Cabanillas Broncano', 'Rodolfo', NULL, '', NULL, NULL, 'Reyna Gomez', 'Mariela', '977677192', '', b'1'),
(68, 'DNI', '71829747', 'Cáceres Malca', 'Karem Saraí', '2006-04-21', 'F', NULL, '957013802', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Cáceres Cruz', 'Alejandro', NULL, '', NULL, NULL, 'Malca Barreto', 'Blanca Cesilia', '939378737', '', b'1'),
(69, 'DNI', '71095100', 'Diaz Cruz', 'Cinthia Liliana', '2004-04-27', 'F', NULL, '987795098', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Diaz Cabello', 'Carlos Edil', NULL, '', NULL, NULL, 'Cruz Trejo', 'Lourdes', NULL, '', b'1'),
(70, 'DNI', '46490465', 'Delgado Perez', 'Saema Rubi', '2007-08-21', 'F', NULL, '998618518', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Delgado Cespedes', 'Yori Yoon', NULL, '', NULL, NULL, 'Perez Macedo', 'Gloria Edith', NULL, '', b'1'),
(71, 'DNI', '46295545', 'Fernandez Bernal', 'Maria Leidy', '2003-08-23', 'F', NULL, '978911900', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Fernandez Cheppe', 'Sixto Raul', NULL, '', NULL, NULL, 'Bernal Luna', 'Karen Selene', NULL, '', b'1'),
(72, 'DNI', '41618402', 'Fernandez Campos', 'Silvia', '2005-04-29', 'F', NULL, '972601717', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Fernandez Zevallos', 'Sandro', NULL, '', NULL, NULL, 'Campos Meza', 'Melva', NULL, '', b'1'),
(73, 'DNI', '45914683', 'Flores Crespo', 'Giovana Sthefani', '2006-11-24', 'F', '439740', '974044025', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Flores Matias', 'Julio', NULL, '', NULL, NULL, 'Crespo Ureta', 'Mayumi', NULL, '', b'1'),
(74, 'DNI', '72210217', 'Flores Parinango', 'Consuelo Juneth', '2003-08-09', 'F', '411164', '988516352', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Flores Alejo', 'Federico Emerzon', NULL, '', NULL, NULL, 'Parinango Molina', 'Dominga', NULL, '', b'1'),
(75, 'DNI', '42435168', 'Gabriel Ticlla', 'Maria Magdalena', '2007-08-15', 'F', '432566', '997908461', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Gabriel Figueredo', 'William', NULL, '', NULL, NULL, 'Ticlla Palomino', 'Karen ', NULL, '', b'1'),
(76, 'DNI', '76201700', 'Gálvez Calderón', 'Guisela', '2006-12-09', 'F', '465860', '990616052', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Gálvez Ponce', 'Héctor', NULL, '', NULL, NULL, 'Calderón Mejia', 'Gaby Pilar', NULL, '', b'1'),
(77, 'DNI', '72166339', 'Gil Perez', 'Ghisela Lisseth', '2004-06-03', 'F', '441165', '972947498', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Gil Diaz', 'Guillermo Renato', NULL, '', NULL, NULL, 'Perez Santos', 'Dina', NULL, '', b'1'),
(78, 'DNI', '16711696', 'Gonzales Morales', 'Ruth Kelly', '2006-10-02', 'F', '482484', '962972628', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Gonzales Pozo', 'Luis Gustabo', '989829825', '', NULL, NULL, 'Morales Salvador', 'Norka', NULL, '', b'1'),
(79, 'DNI', '44733989', 'Hernandez Penas', 'Linda Greinsy', '2004-06-21', 'F', '479266', '990315445', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Hernandez Vilca', 'Remigio', '900266981', '', NULL, NULL, 'Penas Santos', 'Veronica', '935125680', '', b'1'),
(80, 'DNI', '70999965', 'Herrera Cieza', 'Elisbeth', '2007-05-04', 'F', '481791', '976929379', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Herrera Jesus', 'Jerson', '918624186', '', NULL, NULL, 'Cieza Alvarez', 'Mireya', '921404842', '', b'1'),
(81, 'DNI', '47853109', 'Huaman Silva', 'Luis Guilmer', '2003-03-22', 'M', '493476', '933017890', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Huaman Santa', 'Jhosimar', '970933323', '', NULL, NULL, 'Silva Lazaro', 'Karina Lourdes', '957256973', '', b'1'),
(82, 'DNI', '71910126', 'Irigoin Neira', 'Alfonso', '2005-09-04', 'M', '406975', '952452363', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Irigoin Gonzales', 'Fredy David', '952270660', '', NULL, NULL, 'Neira Santa Cruz', 'Antonieta', '941476337', '', b'1'),
(83, 'DNI', '16692016', 'Inchaustegui Degola', 'Jose Paolo', '2007-11-16', 'M', NULL, '984680974', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Inchaustegui Marrujo', 'Juan Carlos', '950490955', '', NULL, NULL, 'Degola Rivas', 'Nancy', '956126209', '', b'1'),
(84, 'DNI', '41283168', 'Julian Fernandez', 'Maria Mercedes', '2007-11-07', 'F', NULL, '941746848', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Julian Falcón', 'Carlos Alberto', NULL, '', NULL, NULL, 'Fernandez Pantoja', 'Grimaldina', NULL, '', b'1'),
(85, 'DNI', '70902618', 'Julca Tello', 'Maritza Llanet', '2005-10-26', 'F', NULL, '927387648', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Julca Colqui', 'Olimpio', NULL, '', NULL, NULL, 'Tello Guzman', 'Diana', NULL, '', b'1'),
(86, 'DNI', '43478463', 'Jimenez Carrasco', 'Jose Victor', '2007-08-05', 'M', NULL, '915607021', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Jimenez Galindo', 'Roberto Carlos', NULL, '', NULL, NULL, 'Carrasco Medrano', 'Arelis Marleny', NULL, '', b'1'),
(87, 'DNI', '61914187', 'Leon Castillo', 'Reyner Gabriel', '2005-08-08', 'F', NULL, '967305555', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Leon Dionicio', 'Javier', NULL, '', NULL, NULL, 'Castillo Soto', 'Anita', NULL, '', b'1'),
(88, 'DNI', '33674208', 'La Madrid SalinaS', 'Aldemir Daghir', '2007-04-08', 'M', NULL, '910740346', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'La Madrid Espinoza', 'Tony', NULL, '', NULL, NULL, 'Salinas Salcedo', 'Jezzy', NULL, '', b'1'),
(89, 'DNI', '47476191', 'Leon Sepulveda', 'Giovanni', '2007-10-20', 'F', NULL, '957155812', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Leon Alejandro', 'Hector Demetrio', NULL, '', NULL, NULL, 'Sepulveda Torres', 'Gabriela', NULL, '', b'1'),
(90, 'DNI', '73318797', 'Linares Carhuajulca', 'Miriam Yudith', '2006-01-20', 'F', NULL, '955575430', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Linares Bueno', 'Emerson', NULL, '', NULL, NULL, 'Carhuajulca Diaz', 'Miriam', NULL, '', b'1'),
(91, 'DNI', '42777315', 'Macalupu Rodriguez', 'Rosmery Madeleine', '2006-06-14', 'F', NULL, '909177169', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Macalupu Espíritu', 'Daniel Hermelindo', NULL, '', NULL, NULL, 'Rodriguez Guizado', 'Luz Amparo', NULL, '', b'1'),
(92, 'DNI', '71084642', 'Malca Cruz', 'Carlos Darwin', '2003-02-28', 'M', NULL, '959112363', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Malca Dominguez', 'Dare', NULL, '', NULL, NULL, 'Cruz Cardenas', 'Sumara Luz', NULL, '', b'1'),
(93, 'DNI', '78020242', 'Malca Delgado', 'Ana Isabel', '2007-09-04', 'F', NULL, '978010272', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Malca Gomez', 'Jaime', NULL, '', NULL, NULL, 'Delgado Quilla', 'Camilia Lucia', NULL, '', b'1'),
(94, 'DNI', '44747099', 'Mera Mori', 'Juan Jose', '2006-12-17', 'M', NULL, '984349968', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Mera Mariño', 'Joel', NULL, '', NULL, NULL, 'Mori Arana', 'Sofia', '926898941', '', b'1'),
(95, 'DNI', '70070480', 'Melendez Rojas', 'Manuel Gabriel', '2007-03-24', 'M', NULL, '961938069', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Melendez Duran', 'Jair ', NULL, '', NULL, NULL, 'Rojas Quispe', 'Gabriela Pamela', '933028382', '', b'1'),
(96, 'DNI', '47918678', 'Nuñez Peralta', 'Jojana Lizet', '2003-08-16', 'F', '413365', '999976367', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Nuñez Palacios', 'Rufino Joel', NULL, '', NULL, NULL, 'Peralta Chura', 'Ruby ', '920825990', '', b'1'),
(97, 'DNI', '72731413', 'Nuñez Torres', 'Raul Martin', '2004-11-24', 'M', '448060', '988368329', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Nuñez Mariño', 'Angel Gabriel', NULL, '', NULL, NULL, 'Torres Condori', 'Marat', '996665515', '', b'1'),
(98, 'DNI', '42949047', 'Oblitas Davila', 'Amberle', '2003-02-15', 'F', '465462', '980224190', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Oblitas Ramos', 'Lazaro Carlos', NULL, '', NULL, NULL, 'Davila Castelo', 'Miriam Daniela', '906779224', '', b'1'),
(99, 'DNI', '70071681', 'Obando Barboza', 'Kristian Davis', '2007-12-14', 'M', '488801', '965963122', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Obando Evaristo', 'Efrain', '950255564', '', NULL, NULL, 'Barboza Cortez', 'Mayra Isabel', NULL, '', b'1'),
(100, 'DNI', '46565370', 'Olivera Ordoñez', 'Kety Margoth', '2007-09-28', 'F', '410585', '977973750', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Olivera Alejo', 'Ever Jair', '913569942', '', NULL, NULL, 'Ordoñez Castelo', 'Zenaida', NULL, '', b'1'),
(101, 'DNI', '77042995', 'Ortiz Delgado', 'Flor Hermelinda', '2007-03-24', 'F', '490384', '940499601', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Ortiz Criollo', 'Elisio', '974165436', '', NULL, NULL, 'Delgado Medina', 'Elgia', NULL, '', b'1'),
(102, 'DNI', '47221131', 'Pacheco Pintado', 'Marcos Jhonatan', '2007-12-04', 'M', '435843', '919838605', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Pacheco Noreña', 'Nicolas', '934752890', '', NULL, NULL, 'Pintado Vilca', 'Katerine', NULL, '', b'1'),
(103, 'DNI', '48042646', 'Padilla Vasquez', 'Danitza Gisenia', '2005-09-11', 'F', '440027', '932728811', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Padilla Benites', 'Gustavo', NULL, '', NULL, NULL, 'Vasquez Cosi', 'Yulissa', NULL, '', b'1'),
(104, 'DNI', '70396966', 'Padilla Vidarte', 'Maribel', '2004-05-09', 'F', '487864', '915146561', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Padilla Orbezo', 'Liberato Elisio', NULL, '', NULL, NULL, 'Vidarte Cabana', 'Rocio', NULL, '', b'1'),
(105, 'DNI', '46856801', 'Palacios Aguilar', 'Teidy Ivan', '2003-03-11', 'F', '492916', '968221664', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Palacios Ramos', 'Lazaro', NULL, '', NULL, NULL, 'Aguilar Montes', 'Sharon', NULL, '', b'1'),
(106, 'DNI', '70397076', 'Palmer Vigil', 'Milton Eduardo', '2006-02-09', 'F', NULL, '975626622', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Palmer Retis', 'Gilberto', NULL, '', NULL, NULL, 'Vigil Ojeda', 'Pierina', NULL, '', b'1'),
(107, 'DNI', '70070396', 'Paredes Torres', 'Karen Lucely', '2007-03-07', 'F', NULL, '960477016', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Paredes Maiz', 'Rosmel', NULL, '', NULL, NULL, 'Torres Collazos', 'Antonina', NULL, '', b'1'),
(108, 'DNI', '47538478', 'Rafael Quispe', 'Lita', '2003-03-21', 'F', NULL, '912494631', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Rafael Espejo', 'Leonardo', NULL, '', NULL, NULL, 'Quispe Lima', 'Martha', NULL, '', b'1'),
(109, 'DNI', '73534041', 'Ramirez Cajahuaringa', 'Lleyzon Esmic', '2004-05-21', 'F', NULL, '906383826', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Ramirez Espinoza', 'Oscar', NULL, '', NULL, NULL, 'Cajahuaringa Santillana', 'Alexandra', '932895470', '', b'1'),
(110, 'DNI', '60647745', 'Ramirez Cruz', 'Mariela Brigitt', '2004-09-25', 'F', NULL, '964909932', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Ramirez Alvarado', 'Luciano', NULL, '', NULL, NULL, 'Cruz Cañazca', 'Solange', '966306829', '', b'1'),
(111, 'DNI', '47817557', 'Ramirez Delgado', 'Jose Neiser', '2004-05-11', 'M', NULL, '906871643', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Ramirez Rubio', 'Elmer', NULL, '', NULL, NULL, 'Delgado Del Carpio', 'Idalia', '955472585', '', b'1'),
(112, 'DNI', '73660565', 'Risco Abad', 'Fernando Heinz', '2003-10-12', 'M', NULL, '976829581', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Risco Avila', 'Bernardino', NULL, '', NULL, NULL, 'Abad Solis', 'Carmen', '913251919', '', b'1'),
(113, 'DNI', '70070446', 'Rivera Leo', 'Angelica Fabiana', '2005-01-07', 'F', NULL, '979186858', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Rivera Herrera', 'Jefferson', NULL, '', NULL, NULL, 'Leo Mojo', 'Candy', '973591530', '', b'1'),
(114, 'DNI', '77036757', 'Rodas Aguilar', 'Clin Brandoli', '2007-02-03', 'M', NULL, '945233135', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Rodas Vilela', 'Yover', NULL, '', NULL, NULL, 'Aguilar Pauca', 'Karla Luz', '941267001', '', b'1'),
(115, 'DNI', '74311928', 'Rivera Vicente', 'Junior Ivan', '2006-07-07', 'M', NULL, '996981018', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Rivera Navidad', 'Keiner', NULL, '', NULL, NULL, 'Vicente Teves', 'Rosa Leydi', NULL, '', b'1'),
(116, 'DNI', '73534140', 'Saavedra Pinedo', 'Luis Alberto', '2003-09-24', 'M', NULL, '901940021', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Saavedra Arias', 'Caleb', NULL, '', NULL, NULL, 'Pinedo Bautista', 'Maria', NULL, '', b'1'),
(117, 'DNI', '73315386', 'Salazar Cardozo', 'Yana Yarabeli', '2007-07-04', 'F', NULL, '913959213', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Salazar Azucena', 'Raymundo', NULL, '', NULL, NULL, 'Cardozo Alarcon', 'Yovani', NULL, '', b'1'),
(118, 'DNI', '74366802', 'Sanchez Hoyos', 'Yenifer Suiguey', '2005-04-08', 'F', NULL, '914610313', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Sanchez Balvin', 'Heber', '901785068', '', NULL, NULL, 'Hoyos Arevalo', 'Thalia', NULL, '', b'1'),
(119, 'DNI', '43405279', 'Sanchez Rivera', 'Lleny Rocio', '2004-07-15', 'F', '438001', '954507558', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Sanchez Alarcon', 'Richard ', '912804928', '', NULL, NULL, 'Rivera Contreras', 'Betty', NULL, '', b'1'),
(120, 'DNI', '47426937', 'Tapia Martinez', 'Ana Maria', '2005-10-23', 'F', '411783', '930729110', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Tapia Aquino', 'Juan Felix', '903899564', '', NULL, NULL, 'Martinez Garcia', 'Yocani Rene', NULL, '', b'1'),
(121, 'DNI', '45748228', 'Tantalean Marin', 'Neyser', '2007-01-11', 'M', '494665', '910248407', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Tantalean Vizcarra', 'Edwin', '917362552', '', NULL, NULL, 'Marin Castro', 'Deysi', NULL, '', b'1'),
(122, 'DNI', '46921716', 'Tarrillo Flores', 'Gisela', '2003-12-20', 'F', '429354', '914940992', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Tarrillo Ruiz', 'Rolando', '953196697', '', NULL, NULL, 'Flores Fernandez', 'Rosmery', NULL, '', b'1'),
(123, 'DNI', '33668958', 'Torres Saavedra', 'Maria Noemi', '2007-07-01', 'F', '484813', '945857349', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Torres Rosales', 'Alejandro', '960884905', '', NULL, NULL, 'Saavedra Jeri', 'Mayra ', NULL, '', b'1'),
(124, 'DNI', '43000571', 'Torres Nuñez', 'Berzabeth Veronica', '2003-05-02', 'F', '484936', '968143633', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Torres Regalado', 'Pedro Alex', '933743393', '', NULL, NULL, 'Nuñez Huaman', 'Gina Marissa', NULL, '', b'1'),
(125, 'DNI', '45334361', 'Torres Tenorio', 'Maria Mily', '2005-04-09', 'F', '454159', '921531013', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Torres Perez', 'Victor Ismael', '954100317', '', NULL, NULL, 'Tenorio Hinostroza', 'Mayra', '938566441', '', b'1'),
(126, 'DNI', '75719269', 'Uriol Rojas', 'Karina Liseth', '2003-08-07', 'F', '417894', '961930951', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Uriol Guevara', 'Feliciano', '946396077', '', NULL, NULL, 'Rojas Felices', 'Maribel', '934057150', '', b'1'),
(127, 'DNI', '76371246', 'Uriarte Ramos', 'Rosaura', '2005-02-25', 'F', '491381', '981142914', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Uriarte Cayco', 'Cesar', '962675788', '', NULL, NULL, 'Ramos Mauricio ', 'Elizabeth', '930579147', '', b'1'),
(128, 'DNI', '75392370', 'Vargas Linares', 'Yennifer Lisseth', '2004-11-13', 'F', '449483', '994239213', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Vargas Cebrian', 'France Edgar', '903506576', '', NULL, NULL, 'Linares Montes', 'Antonia', '902475890', '', b'1'),
(129, 'DNI', '74758099', 'Valderrama Ruiz', 'Maryori Steissy', '2007-04-27', 'F', '430620', '976690547', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Valderrama Nieto', 'Iván', NULL, '', NULL, NULL, 'Ruiz Carbajal', 'Zuleika', '932019461', '', b'1'),
(130, 'DNI', '73701815', 'Vásquez Guerrero', 'Shirley', '2005-03-24', 'F', NULL, '940586893', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Vásquez Esteban', 'Valentin', NULL, '', NULL, NULL, 'Guerrero Morales', 'Kendra', NULL, '', b'1'),
(131, 'DNI', '73317145', 'Vásquez Guerrero', 'Keyla', '2004-04-23', 'F', NULL, '927571884', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Vásquez Celadita', 'Marco Antonio', NULL, '', NULL, NULL, 'Guerrero Bautista', 'Manuela', NULL, '', b'1'),
(132, 'DNI', '33578773', 'Vasquez Mayra', 'Sonia Magaly', '2006-06-18', 'F', NULL, '938166337', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Vasquez Celestino', 'Alejandrino', NULL, '', NULL, NULL, 'Mayra Rimachi', 'Gloria', NULL, '', b'1'),
(133, 'DNI', '16785041', 'Vega Davila', 'William Enrique', '2007-07-28', 'M', NULL, '912370350', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Vega Hurtado', 'Abdon', NULL, '', NULL, NULL, 'Davila Sanchez', 'Loida', NULL, '', b'1'),
(134, 'DNI', '70560329', 'Vega Fernandez', 'Ramcin Anibal', '2004-11-09', 'M', NULL, '900511680', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Vega Cabello', 'Aaron Misael', NULL, '', NULL, NULL, 'Fernandez Vargas', 'Catherin', NULL, '', b'1'),
(135, 'DNI', '45444834', 'Vega Terrones', 'Esteban', '2006-03-26', 'M', NULL, '986833092', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Vega Celis', 'Miguel Angel', NULL, '', NULL, NULL, 'Terrones Gomez', 'Erika', NULL, '', b'1'),
(136, 'DNI', '44763486', 'Vilchez Castro', 'Raquel', '2006-10-26', 'M', NULL, '995116046', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Vilchez Centuno', 'Jhon', NULL, '', NULL, NULL, 'Castro Gamboa', 'Silvia Sonia', NULL, '', b'1'),
(137, 'DNI', '41650274', 'Villalobos Bellodas', 'Carlos Edison', '2003-06-07', 'M', NULL, '970115570', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Villalobos Vargas', 'David', NULL, '', NULL, NULL, 'Bellodas De La Cruz', 'Rocio', NULL, '', b'1'),
(138, 'DNI', '75263049', 'Villalobos Herrera', 'Arbel', '2006-05-03', 'M', NULL, '951178856', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Villalobos Jaramillo', 'Oliver Milton', NULL, '', NULL, NULL, 'Herrera Leon', 'Maribel Rocio', NULL, '', b'1'),
(139, 'DNI', '74421368', 'Zamora Diaz', 'Joel', '2007-12-12', 'M', NULL, '984406561', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Zamora Chavez', 'Carlos Alberto', NULL, '', NULL, NULL, 'Diaz Montoya', 'Nancy Elizabth', NULL, '', b'1'),
(140, 'DNI', '48193928', 'Zamora Perez', 'Elias', '2005-03-29', 'M', NULL, '988903562', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Zamora Solis', 'Wildo Wilfredo', NULL, '', NULL, NULL, 'Perez Jimenez', 'Zoraida', '910852396', '', b'1'),
(141, 'DNI', '72914649', 'Zegarra Olano', 'Sheyla Stefany', '2003-02-24', 'F', NULL, '952477972', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Zegarra Chogas', 'Roger Abel', NULL, '', NULL, NULL, 'Olano Medina', 'Leyda Madeli', '957631005', '', b'1'),
(142, 'DNI', '47406897', 'Zelada Medina', 'Jusbelly Jamali', '2004-04-14', 'F', NULL, '912335923', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Zelada Chinguel', 'Jhon Willian', NULL, '', NULL, NULL, 'Medina Galan', 'Lisset Vanesa', '931936960', '', b'1'),
(143, 'DNI', '76831964', 'Zuta Reyna', 'Marco Antonio', '2007-03-28', 'M', '472681', '942086226', 'Nombre de la Direccion', NULL, NULL, NULL, NULL, 'Zuta Alanya', 'Oscar Alfredo', NULL, '', NULL, NULL, 'Reyna Perez', 'Laura Raquel', '945089569', '', b'1'),
(144, 'DNI', '11111111', 'Julca Vasquez', 'Jose Andersson', '1993-03-09', 'M', NULL, '999999999', 'Nombre de la Direccion', NULL, NULL, 'DNI', '16686223', 'Julca Zeña', 'Francisco Javier', NULL, NULL, NULL, NULL, 'Vasquez Delgado', 'Susana Esther', NULL, NULL, b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `anhio_lectivo`
--

CREATE TABLE IF NOT EXISTS `anhio_lectivo` (
  `idanhio` tinyint(4) NOT NULL AUTO_INCREMENT,
  `anhio_lectivo` char(4) NOT NULL,
  `finicio_anhio` date NOT NULL,
  `ffin_anhio` date NOT NULL,
  `descripcion_anhio` varchar(150) DEFAULT NULL,
  `condicion_anhio` char(1) NOT NULL DEFAULT 'A',
  `estado_anhio` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`idanhio`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=145 ;

--
-- Volcado de datos para la tabla `apoderado`
--

INSERT INTO `apoderado` (`id_apoderado`, `tdoc_apoderado`, `doc_apoderado`, `apellidos_apoderado`, `nombres_apoderado`, `sexo_apoderado`, `celular_apoderado`, `direccion_apoderado`, `correo_apoderado`, `estado_apoderado`) VALUES
(1, 'OTR', '751678654MVEN84', 'Flores Abad', 'Adler Mauro', 'M', '929151181', 'Direccion domicilio de apoderado', NULL, b'1'),
(2, 'DNI', '17835487', 'Rubio Abad', 'Samuel', 'M', '983228426', 'Direccion domicilio de apoderado', NULL, b'1'),
(3, 'DNI', '14853811', 'Arroyo Abanto', 'Edzon ', 'M', '965426036', 'Direccion domicilio de apoderado', NULL, b'1'),
(4, 'DNI', '12662600', 'Carpio Abila', 'Melchor Rogelio', 'M', '904781140', 'Direccion domicilio de apoderado', NULL, b'1'),
(5, 'DNI', '12799608', 'Caycho Accilio', 'Henry', 'M', '967191826', 'Direccion domicilio de apoderado', NULL, b'1'),
(6, 'DNI', '10776514', 'Cieza Acharte', 'Jhonatan', 'M', '987130615', 'Direccion domicilio de apoderado', NULL, b'1'),
(7, 'DNI', '13100972', 'Dumet Acosta', 'Fernando', 'M', '993977501', 'Direccion domicilio de apoderado', NULL, b'1'),
(8, 'DNI', '16616475', 'Fujishima Abendaño', 'Nicolas', 'M', '918480901', 'Direccion domicilio de apoderado', NULL, b'1'),
(9, 'DNI', '18259879', 'Longa Zuñiga', 'Miguel Angel', 'M', '977660792', 'Direccion domicilio de apoderado', NULL, b'1'),
(10, 'DNI', '12945311', 'Miranda Aguirre', 'Dan Nefeg', 'M', '938701183', 'Direccion domicilio de apoderado', NULL, b'1'),
(11, 'DNI', '15143793', 'Ramirez Aique', 'Enrique', 'M', '912774475', 'Direccion domicilio de apoderado', NULL, b'1'),
(12, 'DNI', '13996271', 'Tapia Agüero', 'Neyl Paul', 'M', '947124162', 'Direccion domicilio de apoderado', NULL, b'1'),
(13, 'DNI', '15980886', 'Tovar Alanya', 'Estiven Rafael', 'M', '942705196', 'Direccion domicilio de apoderado', NULL, b'1'),
(14, 'DNI', '12572783', 'Vergara Alarcon', 'Luis', 'M', '906262108', 'Direccion domicilio de apoderado', NULL, b'1'),
(15, 'DNI', '15428861', 'Aguado Baltazar', 'Wilfredo', 'M', '933540808', 'Direccion domicilio de apoderado', NULL, b'1'),
(16, 'DNI', '12121792', 'Alberola Balderon', 'Jorge Silverio', 'M', '920214500', 'Direccion domicilio de apoderado', NULL, b'1'),
(17, 'DNI', '11522078', 'Alonso Barros', 'Kevin', 'M', '965521963', 'Direccion domicilio de apoderado', NULL, b'1'),
(18, 'DNI', '14865253', 'Álvarado Barboza', 'Michael', 'M', '972693949', 'Direccion domicilio de apoderado', NULL, b'1'),
(19, 'DNI', '13495791', 'Arias Bardales', 'Christian Daeive', 'M', '947236763', 'Direccion domicilio de apoderado', NULL, b'1'),
(20, 'DNI', '16984051', 'Bastida Bartolo', 'Jonas Darwin', 'M', '927903915', 'Direccion domicilio de apoderado', NULL, b'1'),
(21, 'DNI', '10789251', 'Blasco Balvin', 'Neyer Ivan', 'M', '930392751', 'Direccion domicilio de apoderado', NULL, b'1'),
(22, 'DNI', '13789955', 'Casas Barzola', 'Michael Willian', 'M', '987738404', 'Direccion domicilio de apoderado', NULL, b'1'),
(23, 'DNI', '16346494', 'Chavez Bonilla', 'Mequias', 'M', '993488621', 'Direccion domicilio de apoderado', NULL, b'1'),
(24, 'DNI', '12475496', 'Cruz Bocanegra', 'Junior Jhasiro', 'M', '922930427', 'Direccion domicilio de apoderado', NULL, b'1'),
(25, 'DNI', '11028007', 'Talavera Diaz', 'Zulema', 'F', '989151779', 'Direccion domicilio de apoderado', NULL, b'1'),
(26, 'DNI', '16617660', 'Cantillano Ocampo', 'Luzmelita', 'F', '941456123', 'Direccion domicilio de apoderado', NULL, b'1'),
(27, 'DNI', '18241214', 'Blaya Arce', 'Dorali', 'F', '950632290', 'Direccion domicilio de apoderado', NULL, b'1'),
(28, 'DNI', '17206881', 'Blaya Arce', 'Dorali', 'F', '950632290', 'Direccion domicilio de apoderado', NULL, b'1'),
(29, 'DNI', '17686224', 'García Huaman', 'Clarita', 'F', '958031062', 'Direccion domicilio de apoderado', NULL, b'1'),
(30, 'DNI', '15215578', 'Minchan Gutierrez', 'Luz Clarita', 'F', '933488368', 'Direccion domicilio de apoderado', NULL, b'1'),
(31, 'DNI', '14293627', 'Martínez Paucar', 'Patricia', 'F', '920105997', 'Direccion domicilio de apoderado', NULL, b'1'),
(32, 'DNI', '19801680', 'Nicolás Mesia', 'Blanca', 'F', '920940279', 'Direccion domicilio de apoderado', NULL, b'1'),
(33, 'DNI', '13896705', 'Manzano Espinoza', 'Xiomara', 'F', '903717042', 'Direccion domicilio de apoderado', NULL, b'1'),
(34, 'DNI', '13757095', 'Calvo Machado', 'Medally', 'F', '985538389', 'Direccion domicilio de apoderado', NULL, b'1'),
(35, 'DNI', '14071687', 'García Lazaro', 'Isabel', 'F', '952909129', 'Direccion domicilio de apoderado', NULL, b'1'),
(36, 'DNI', '19503417', 'Rueda Aranda', 'Maria Cecilia', 'F', '918634714', 'Direccion domicilio de apoderado', NULL, b'1'),
(37, 'DNI', '10344890', 'Chavez Vasquez', 'Teresa', 'F', '938943931', 'Direccion domicilio de apoderado', NULL, b'1'),
(38, 'DNI', '10285565', 'Guerrero Correa', 'Flor Isabel', 'F', '919557837', 'Direccion domicilio de apoderado', NULL, b'1'),
(39, 'DNI', '11259346', 'Santisteban Ita', 'Milagros Magaly', 'F', '923234541', 'Direccion domicilio de apoderado', NULL, b'1'),
(40, 'DNI', '18602094', 'Cervantes Malaspina', 'Lizbeth', 'F', '948165732', 'Direccion domicilio de apoderado', NULL, b'1'),
(41, 'DNI', '17471469', 'Diaz Medina', 'Giselle', 'F', '950101407', 'Direccion domicilio de apoderado', NULL, b'1'),
(42, 'DNI', '13609446', 'Gil Rocca', 'Fernanda Luisa', 'F', '997764600', 'Direccion domicilio de apoderado', NULL, b'1'),
(43, 'DNI', '18316476', 'Marrufo Julcamoro', 'Teresa Isabel', 'F', '969063943', 'Direccion domicilio de apoderado', NULL, b'1'),
(44, 'DNI', '13521095', 'Marrufo Minchon', 'Gianera', 'F', '932030645', 'Direccion domicilio de apoderado', NULL, b'1'),
(45, 'DNI', '17175729', 'Reyna Perez', 'Mayra Patricia', 'F', '959483581', 'Direccion domicilio de apoderado', NULL, b'1'),
(46, 'DNI', '13162843', 'Coronado Palma', 'Vanessa', 'F', '903158771', 'Direccion domicilio de apoderado', NULL, b'1'),
(47, 'DNI', '18260042', 'Garcia Chavez', 'Sara', 'F', '989932141', 'Direccion domicilio de apoderado', NULL, b'1'),
(48, 'DNI', '14043575', 'Pérez Roncal', 'Janny Patricia', 'F', '996257102', 'Direccion domicilio de apoderado', NULL, b'1'),
(49, 'DNI', '13317705', 'Fernandez Flores', 'Adhely', 'F', '923397833', 'Direccion domicilio de apoderado', NULL, b'1'),
(50, 'DNI', '10574796', 'Heredia Sanchez', 'Erika Luzmila', 'F', '947487935', 'Direccion domicilio de apoderado', NULL, b'1'),
(51, 'DNI', '11612714', 'Espinoza Saavedra', 'Jackeline', 'F', '907717533', 'Direccion domicilio de apoderado', NULL, b'1'),
(52, 'DNI', '18318943', 'Cervantes Ramos', 'Annyle Paola', 'F', '919338300', 'Direccion domicilio de apoderado', NULL, b'1'),
(53, 'DNI', '11895529', 'Cervantes Ticeran', 'Angela', 'F', '995647047', 'Direccion domicilio de apoderado', NULL, b'1'),
(54, 'DNI', '12417239', 'Leon Silva', 'Brenda', 'F', '997727840', 'Direccion domicilio de apoderado', NULL, b'1'),
(55, 'DNI', '15545870', 'Abad Torres', 'Teresa De Jesus', 'F', '916005010', 'Direccion domicilio de apoderado', NULL, b'1'),
(56, 'DNI', '17771572', 'Cholan Varas', 'Maria ', 'F', '992226814', 'Direccion domicilio de apoderado', NULL, b'1'),
(57, 'DNI', '16884035', 'Davila Rojas', 'Ines', 'F', '902729380', 'Direccion domicilio de apoderado', NULL, b'1'),
(58, 'DNI', '15827075', 'Hurtado Chavez', 'Ruth Rosa', 'F', '944850967', 'Direccion domicilio de apoderado', NULL, b'1'),
(59, 'DNI', '19898606', 'Panta Caballero', 'Vanessa Dayam', 'F', '911481605', 'Direccion domicilio de apoderado', NULL, b'1'),
(60, 'DNI', '14201438', 'Barragan Cortez', 'Dennys David', 'M', '941334712', 'Direccion domicilio de apoderado', NULL, b'1'),
(61, 'DNI', '18950180', 'Barrantes Cotrina', 'Ruben', 'M', '991133414', 'Direccion domicilio de apoderado', NULL, b'1'),
(62, 'DNI', '16065320', 'Barranzuela Justo', 'Huber', 'M', '938053028', 'Direccion domicilio de apoderado', NULL, b'1'),
(63, 'DNI', '15882950', 'Barreto Deza', 'Roman Arturo', 'M', '918810196', 'Direccion domicilio de apoderado', NULL, b'1'),
(64, 'DNI', '12556080', 'Cabanillas Davila', 'Ever', 'M', '957064924', 'Direccion domicilio de apoderado', NULL, b'1'),
(65, 'DNI', '18614775', 'Cabanillas De La Calle', 'Vladimir', 'M', '910348500', 'Direccion domicilio de apoderado', NULL, b'1'),
(66, 'DNI', '18079844', 'Cabanillas Bravo', 'Percy', 'M', '976259431', 'Direccion domicilio de apoderado', NULL, b'1'),
(67, 'DNI', '14714922', 'Cabanillas Broncano', 'Rodolfo', 'M', '950296960', 'Direccion domicilio de apoderado', NULL, b'1'),
(68, 'DNI', '13733114', 'Cáceres Cruz', 'Alejandro', 'M', '952735272', 'Direccion domicilio de apoderado', NULL, b'1'),
(69, 'DNI', '11370623', 'Diaz Cabello', 'Carlos Edil', 'M', '969994784', 'Direccion domicilio de apoderado', NULL, b'1'),
(70, 'DNI', '15840410', 'Delgado Cespedes', 'Yori Yoon', 'M', '936565222', 'Direccion domicilio de apoderado', NULL, b'1'),
(71, 'DNI', '13533453', 'Fernandez Cheppe', 'Sixto Raul', 'M', '960364488', 'Direccion domicilio de apoderado', NULL, b'1'),
(72, 'DNI', '18101053', 'Fernandez Zevallos', 'Sandro', 'M', '999284168', 'Direccion domicilio de apoderado', NULL, b'1'),
(73, 'DNI', '19356895', 'Flores Matias', 'Julio', 'M', '956378834', 'Direccion domicilio de apoderado', NULL, b'1'),
(74, 'DNI', '15643044', 'Flores Alejo', 'Federico Emerzon', 'M', '985194700', 'Direccion domicilio de apoderado', NULL, b'1'),
(75, 'DNI', '12535726', 'Gabriel Figueredo', 'William', 'M', '988296184', 'Direccion domicilio de apoderado', NULL, b'1'),
(76, 'DNI', '17049296', 'Gálvez Ponce', 'Héctor', 'M', '956230193', 'Direccion domicilio de apoderado', NULL, b'1'),
(77, 'DNI', '11997506', 'Gil Diaz', 'Guillermo Renato', 'M', '954909516', 'Direccion domicilio de apoderado', NULL, b'1'),
(78, 'DNI', '18873297', 'Gonzales Pozo', 'Luis Gustabo', 'M', '989829825', 'Direccion domicilio de apoderado', NULL, b'1'),
(79, 'DNI', '17566004', 'Hernandez Vilca', 'Remigio', 'M', '900266981', 'Direccion domicilio de apoderado', NULL, b'1'),
(80, 'DNI', '14994290', 'Herrera Jesus', 'Jerson', 'M', '918624186', 'Direccion domicilio de apoderado', NULL, b'1'),
(81, 'DNI', '19820382', 'Huaman Santa', 'Jhosimar', 'M', '970933323', 'Direccion domicilio de apoderado', NULL, b'1'),
(82, 'DNI', '11488705', 'Irigoin Gonzales', 'Fredy David', 'M', '952270660', 'Direccion domicilio de apoderado', NULL, b'1'),
(83, 'DNI', '10912278', 'Inchaustegui Marrujo', 'Juan Carlos', 'M', '950490955', 'Direccion domicilio de apoderado', NULL, b'1'),
(84, 'DNI', '14123305', 'Julian Falcón', 'Carlos Alberto', 'M', '930291179', 'Direccion domicilio de apoderado', NULL, b'1'),
(85, 'DNI', '13003447', 'Julca Colqui', 'Olimpio', 'M', '951593002', 'Direccion domicilio de apoderado', NULL, b'1'),
(86, 'DNI', '16260054', 'Jimenez Galindo', 'Roberto Carlos', 'M', '933172663', 'Direccion domicilio de apoderado', NULL, b'1'),
(87, 'DNI', '10517284', 'Leon Dionicio', 'Javier', 'M', '940825607', 'Direccion domicilio de apoderado', NULL, b'1'),
(88, 'DNI', '13176803', 'La Madrid Espinoza', 'Tony', 'M', '902321170', 'Direccion domicilio de apoderado', NULL, b'1'),
(89, 'DNI', '11051074', 'Leon Alejandro', 'Hector Demetrio', 'M', '900280256', 'Direccion domicilio de apoderado', NULL, b'1'),
(90, 'DNI', '15308806', 'Linares Bueno', 'Emerson', 'M', '940574368', 'Direccion domicilio de apoderado', NULL, b'1'),
(91, 'DNI', '19054788', 'Macalupu Espíritu', 'Daniel Hermelindo', 'M', '936998020', 'Direccion domicilio de apoderado', NULL, b'1'),
(92, 'DNI', '11740686', 'Malca Dominguez', 'Dare', 'M', '923909808', 'Direccion domicilio de apoderado', NULL, b'1'),
(93, 'DNI', '10400791', 'Malca Gomez', 'Jaime', 'M', '986597170', 'Direccion domicilio de apoderado', NULL, b'1'),
(94, 'DNI', '11507184', 'Mera Mariño', 'Joel', 'M', '921952701', 'Direccion domicilio de apoderado', NULL, b'1'),
(95, 'DNI', '17039621', 'Melendez Duran', 'Jair ', 'M', '985619354', 'Direccion domicilio de apoderado', NULL, b'1'),
(96, 'DNI', '13083314', 'Nuñez Palacios', 'Rufino Joel', 'M', '985176193', 'Direccion domicilio de apoderado', NULL, b'1'),
(97, 'DNI', '11715070', 'Nuñez Mariño', 'Angel Gabriel', 'M', '962151887', 'Direccion domicilio de apoderado', NULL, b'1'),
(98, 'DNI', '15562019', 'Oblitas Ramos', 'Lazaro Carlos', 'M', '969438786', 'Direccion domicilio de apoderado', NULL, b'1'),
(99, 'DNI', '10148723', 'Obando Evaristo', 'Efrain', 'M', '950255564', 'Direccion domicilio de apoderado', NULL, b'1'),
(100, 'DNI', '16098410', 'Ordoñez Castelo', 'Zenaida', 'F', '932358663', 'Direccion domicilio de apoderado', NULL, b'1'),
(101, 'DNI', '13487371', 'Delgado Medina', 'Elgia', 'F', '972884151', 'Direccion domicilio de apoderado', NULL, b'1'),
(102, 'DNI', '11659022', 'Pintado Vilca', 'Katerine', 'F', '923688687', 'Direccion domicilio de apoderado', NULL, b'1'),
(103, 'DNI', '12160361', 'Vasquez Cosi', 'Yulissa', 'F', '990187127', 'Direccion domicilio de apoderado', NULL, b'1'),
(104, 'DNI', '17893433', 'Vidarte Cabana', 'Rocio', 'F', '904061416', 'Direccion domicilio de apoderado', NULL, b'1'),
(105, 'DNI', '11113637', 'Aguilar Montes', 'Sharon', 'F', '982797828', 'Direccion domicilio de apoderado', NULL, b'1'),
(106, 'DNI', '12737797', 'Vigil Ojeda', 'Pierina', 'F', '907002269', 'Direccion domicilio de apoderado', NULL, b'1'),
(107, 'DNI', '19980306', 'Torres Collazos', 'Antonina', 'F', '904162783', 'Direccion domicilio de apoderado', NULL, b'1'),
(108, 'DNI', '10365986', 'Quispe Lima', 'Martha', 'F', '960629068', 'Direccion domicilio de apoderado', NULL, b'1'),
(109, 'DNI', '14002639', 'Cajahuaringa Santillana', 'Alexandra', 'F', '932895470', 'Direccion domicilio de apoderado', NULL, b'1'),
(110, 'DNI', '17553397', 'Cruz Cañazca', 'Solange', 'F', '966306829', 'Direccion domicilio de apoderado', NULL, b'1'),
(111, 'DNI', '19838080', 'Delgado Del Carpio', 'Idalia', 'F', '955472585', 'Direccion domicilio de apoderado', NULL, b'1'),
(112, 'DNI', '11717065', 'Abad Solis ', 'Carmen', 'F', '913251918', 'Direccion domicilio de apoderado', NULL, b'1'),
(113, 'DNI', '14268468', 'Leo Mojo', 'Candy', 'F', '973591530', 'Direccion domicilio de apoderado', NULL, b'1'),
(114, 'DNI', '17198872', 'Aguilar Pauca', 'Karla Luz', 'F', '941267001', 'Direccion domicilio de apoderado', NULL, b'0'),
(115, 'DNI', '16853284', 'Vicente Teves', 'Rosa Leydi', 'F', '935554463', 'Direccion domicilio de apoderado', NULL, b'1'),
(116, 'DNI', '14368905', 'Pinedo Bautista', 'Maria', 'F', '968495018', 'Direccion domicilio de apoderado', NULL, b'1'),
(117, 'DNI', '16783097', 'Cardozo Alarcon', 'Yovani', 'F', '974972078', 'Direccion domicilio de apoderado', NULL, b'1'),
(118, 'DNI', '11319618', 'Hoyos Arevalo', 'Thalia', 'F', '997214740', 'Direccion domicilio de apoderado', NULL, b'1'),
(119, 'DNI', '18066711', 'Rivera Contreras', 'Betty', 'F', '948806030', 'Direccion domicilio de apoderado', NULL, b'1'),
(120, 'DNI', '18141237', 'Martinez Garcia', 'Yocani Rene', 'F', '951877430', 'Direccion domicilio de apoderado', NULL, b'1'),
(121, 'DNI', '12507651', 'Marin Castro', 'Deysi', 'F', '929237907', 'Direccion domicilio de apoderado', NULL, b'1'),
(122, 'DNI', '17852010', 'Flores Fernandez', 'Rosmery', 'F', '991595538', 'Direccion domicilio de apoderado', NULL, b'1'),
(123, 'DNI', '17758113', 'Saavedra Jeri', 'Mayra ', 'F', '976729701', 'Direccion domicilio de apoderado', NULL, b'1'),
(124, 'DNI', '12677883', 'Nuñez Huaman', 'Gina Marissa', 'F', '913319958', 'Direccion domicilio de apoderado', NULL, b'1'),
(125, 'DNI', '16450817', 'Tenorio Hinostroza', 'Mayra', 'F', '938566441', 'Direccion domicilio de apoderado', NULL, b'1'),
(126, 'DNI', '14753929', 'Rojas Felices', 'Maribel', 'F', '934057150', 'Direccion domicilio de apoderado', NULL, b'1'),
(127, 'DNI', '17904666', 'Ramos Mauricio ', 'Elizabeth', 'F', '930579147', 'Direccion domicilio de apoderado', NULL, b'1'),
(128, 'DNI', '18710745', 'Linares Montes', 'Antonia', 'F', '902475890', 'Direccion domicilio de apoderado', NULL, b'1'),
(129, 'DNI', '11686012', 'Ruiz Carbajal', 'Zuleika', 'F', '932019461', 'Direccion domicilio de apoderado', NULL, b'1'),
(130, 'DNI', '16353380', 'Guerrero Morales', 'Kendra', 'F', '994422459', 'Direccion domicilio de apoderado', NULL, b'1'),
(131, 'DNI', '13511988', 'Guerrero Bautista', 'Manuela', 'F', '950871631', 'Direccion domicilio de apoderado', NULL, b'1'),
(132, 'DNI', '19042873', 'Mayra Rimachi', 'Gloria', 'F', '996317502', 'Direccion domicilio de apoderado', NULL, b'1'),
(133, 'DNI', '17769073', 'Davila Sanchez', 'Loida', 'F', '954121047', 'Direccion domicilio de apoderado', NULL, b'1'),
(134, 'DNI', '11779993', 'Fernandez Vargas', 'Catherin', 'F', '955922193', 'Direccion domicilio de apoderado', NULL, b'1'),
(135, 'DNI', '18994109', 'Terrones Gomez', 'Erika', 'F', '957486568', 'Direccion domicilio de apoderado', NULL, b'1'),
(136, 'DNI', '19039428', 'Castro Gamboa', 'Silvia Sonia', 'F', '920794125', 'Direccion domicilio de apoderado', NULL, b'1'),
(137, 'DNI', '12410826', 'Bellodas De La Cruz', 'Rocio', 'F', '978577615', 'Direccion domicilio de apoderado', NULL, b'1'),
(138, 'DNI', '19737967', 'Herrera Leon', 'Maribel Rocio', 'F', '923342311', 'Direccion domicilio de apoderado', NULL, b'1'),
(139, 'DNI', '16432341', 'Diaz Montoya', 'Nancy Elizabth', 'F', '979364374', 'Direccion domicilio de apoderado', NULL, b'1'),
(140, 'DNI', '14142960', 'Perez Jimenez', 'Zoraida', 'F', '910852396', 'Direccion domicilio de apoderado', NULL, b'1'),
(141, 'DNI', '12017303', 'Olano Medina', 'Leyda Madeli', 'F', '957631005', 'Direccion domicilio de apoderado', NULL, b'1'),
(142, 'DNI', '12718589', 'Medina Galan', 'Lisset Vanesa', 'F', '931936960', 'Direccion domicilio de apoderado', NULL, b'1'),
(143, 'DNI', '17400274', 'Reyna Perez', 'Laura Raquel', 'F', '945089569', 'Direccion domicilio de apoderado', NULL, b'1'),
(144, 'DNI', '11111111', 'Dadd', 'Eadad', 'M', '546436456', 'Direccion domicilio de apoderado', NULL, b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE IF NOT EXISTS `compra` (
  `id_compra` smallint(6) NOT NULL AUTO_INCREMENT,
  `id_usuario` tinyint(4) NOT NULL,
  `id_anhio` tinyint(4) NOT NULL,
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
  KEY `id_usuario` (`id_usuario`),
  KEY `id_anhio` (`id_anhio`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `concepto_apafa`
--

CREATE TABLE IF NOT EXISTS `concepto_apafa` (
  `id_concepto` smallint(6) NOT NULL AUTO_INCREMENT,
  `descripcion_concepto` varchar(100) NOT NULL,
  `tipo_concepto` char(1) NOT NULL,
  `id_anhio` tinyint(4) NOT NULL,
  `monto_concepto` float NOT NULL,
  `estado_concepto` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_concepto`),
  KEY `id_anhio` (`id_anhio`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=16 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_compra`
--

CREATE TABLE IF NOT EXISTS `detalle_compra` (
  `id_detalle_compra` smallint(6) NOT NULL AUTO_INCREMENT,
  `id_compra` smallint(6) NOT NULL,
  `nom_producto` varchar(30) NOT NULL,
  `cantidad` tinyint(4) NOT NULL,
  `medida` varchar(10) NOT NULL,
  `punit` float NOT NULL,
  PRIMARY KEY (`id_detalle_compra`),
  KEY `id_compra` (`id_compra`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_deuda`
--

CREATE TABLE IF NOT EXISTS `detalle_deuda` (
  `id_detalle_deuda` smallint(6) NOT NULL AUTO_INCREMENT,
  `id_concepto` smallint(6) NOT NULL,
  `id_apoderado` smallint(6) NOT NULL,
  `saldo_deuda` float NOT NULL,
  `descripcion_deuda` varchar(100) DEFAULT NULL,
  `motivo_eliminacion` varchar(50) DEFAULT NULL,
  `freg_deuda` date NOT NULL,
  `fseg_deuda` datetime NOT NULL,
  `estado_deuda` char(1) NOT NULL DEFAULT 'P',
  PRIMARY KEY (`id_detalle_deuda`),
  KEY `id_concepto` (`id_concepto`),
  KEY `id_apoderado` (`id_apoderado`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grados`
--

CREATE TABLE IF NOT EXISTS `grados` (
  `id_grado` tinyint(4) NOT NULL AUTO_INCREMENT,
  `descripcion_grado` varchar(40) NOT NULL,
  `nivel_grado` char(1) NOT NULL,
  `estado_grado` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_grado`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Volcado de datos para la tabla `grados`
--

INSERT INTO `grados` (`id_grado`, `descripcion_grado`, `nivel_grado`, `estado_grado`) VALUES
(1, 'PRIMER GRADO SECUNDARIA', 'S', b'1'),
(2, 'SEGUNDO GRADO SECUNDARIA', 'S', b'1'),
(3, 'TERCER GRADO SECUNDARIA', 'S', b'1'),
(4, 'CUARTO GRADO SECUNDARIA', 'S', b'1'),
(5, 'QUINTO GRADO SECUNDARIA', 'S', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro`
--

CREATE TABLE IF NOT EXISTS `libro` (
  `id_libro` tinyint(4) NOT NULL AUTO_INCREMENT,
  `titulo_libro` varchar(80) NOT NULL,
  `editorial_libro` varchar(20) NOT NULL,
  `edicion_libro` char(4) NOT NULL,
  `id_grado` tinyint(4) NOT NULL,
  `estado_libro` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_libro`),
  KEY `id_grado` (`id_grado`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro_matricula`
--

CREATE TABLE IF NOT EXISTS `libro_matricula` (
  `id_matricula` smallint(6) NOT NULL,
  `id_libro` tinyint(4) NOT NULL,
  `devolvio_libro` bit(1) NOT NULL DEFAULT b'0',
  KEY `id_matricula` (`id_matricula`),
  KEY `id_libro` (`id_libro`),
  KEY `id_matricula_2` (`id_matricula`),
  KEY `id_libro_2` (`id_libro`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimiento`
--

CREATE TABLE IF NOT EXISTS `movimiento` (
  `id_movimiento` smallint(6) NOT NULL AUTO_INCREMENT,
  `tipo_movimiento` char(1) NOT NULL,
  `descripcion_movimiento` varchar(100) NOT NULL,
  `monto_movimiento` float(10,2) NOT NULL,
  `freg_movimiento` datetime NOT NULL,
  `doc_encargado_movimiento` varchar(15) NOT NULL,
  `datos_encargado_movimiento` varchar(100) NOT NULL,
  `id_usuario` tinyint(4) NOT NULL,
  `id_anhio` tinyint(4) NOT NULL,
  `estado_movimiento` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_movimiento`),
  KEY `id_anhio` (`id_anhio`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `padron_matricula`
--

CREATE TABLE IF NOT EXISTS `padron_matricula` (
  `id_matricula` smallint(6) NOT NULL AUTO_INCREMENT,
  `fecha_matricula` date NOT NULL,
  `id_apoderado` smallint(6) NOT NULL,
  `id_alumno` smallint(6) NOT NULL,
  `id_anhio` tinyint(4) NOT NULL,
  `id_seccion` tinyint(4) NOT NULL,
  `id_tipo_relacion` tinyint(4) NOT NULL,
  `estado_matricula` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_matricula`),
  KEY `id_tipo_relacion` (`id_tipo_relacion`),
  KEY `id_seccion` (`id_seccion`),
  KEY `id_anhio` (`id_anhio`),
  KEY `id_alumno` (`id_alumno`),
  KEY `id_apoderado` (`id_apoderado`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil_usuario`
--

CREATE TABLE IF NOT EXISTS `perfil_usuario` (
  `idperfil_usuario` tinyint(4) NOT NULL AUTO_INCREMENT,
  `nombre_perfil` varchar(25) NOT NULL,
  `abrev_perfil` char(2) NOT NULL,
  `estado_perfil` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`idperfil_usuario`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Volcado de datos para la tabla `perfil_usuario`
--

INSERT INTO `perfil_usuario` (`idperfil_usuario`, `nombre_perfil`, `abrev_perfil`, `estado_perfil`) VALUES
(1, 'ADMINISTRADOR', 'AD', b'1'),
(2, 'PRESIDENTE (A)', 'PR', b'1'),
(3, 'SECRETARIO (A)', 'SE', b'1'),
(4, 'TESORERO (A)', 'TS', b'1'),
(5, 'DIRECTOR (A)', 'DI', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recibo`
--

CREATE TABLE IF NOT EXISTS `recibo` (
  `id_recibo` smallint(6) NOT NULL AUTO_INCREMENT,
  `id_apoderado` smallint(6) NOT NULL,
  `id_usuario` tinyint(4) NOT NULL,
  `id_anhio` tinyint(4) NOT NULL,
  `mtotal_recibo` float NOT NULL,
  `freg_recibo` datetime NOT NULL,
  `num_recibo` varchar(20) NOT NULL,
  `nompago_recibo` varchar(110) NOT NULL,
  `docpago_recibo` varchar(15) NOT NULL,
  `celpago_recibo` char(9) NOT NULL,
  `descripcion_recibo` varchar(150) DEFAULT NULL,
  `estado_recibo` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_recibo`),
  KEY `id_apoderado` (`id_apoderado`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_anhio` (`id_anhio`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

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
  `asistencia_reunion` bit(1) NOT NULL DEFAULT b'0',
  `estado_reunion` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_reunion`),
  KEY `id_concepto` (`id_concepto`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reunion_apoderado`
--

CREATE TABLE IF NOT EXISTS `reunion_apoderado` (
  `id_reunion` smallint(6) NOT NULL,
  `id_apoderado` smallint(6) NOT NULL,
  `asistio_reunion` bit(1) NOT NULL DEFAULT b'0',
  KEY `id_reunion` (`id_reunion`),
  KEY `id_apoderado` (`id_apoderado`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secciones`
--

CREATE TABLE IF NOT EXISTS `secciones` (
  `id_seccion` tinyint(4) NOT NULL AUTO_INCREMENT,
  `nombre_seccion` varchar(20) NOT NULL,
  `id_grado` tinyint(4) NOT NULL,
  `turno_seccion` char(1) NOT NULL,
  `estado_seccion` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_seccion`),
  KEY `id_grado` (`id_grado`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_relacion`
--

CREATE TABLE IF NOT EXISTS `tipo_relacion` (
  `id_tipo_relacion` tinyint(4) NOT NULL AUTO_INCREMENT,
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
-- Estructura de tabla para la tabla `token_celular`
--

CREATE TABLE IF NOT EXISTS `token_celular` (
  `id_token` smallint(6) NOT NULL AUTO_INCREMENT,
  `token` varchar(200) NOT NULL,
  `estado_token` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_token`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE IF NOT EXISTS `usuario` (
  `idusuario` tinyint(4) NOT NULL AUTO_INCREMENT,
  `idperfil_usuario` tinyint(4) NOT NULL,
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
  PRIMARY KEY (`idusuario`),
  KEY `idperfil_usuario` (`idperfil_usuario`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idusuario`, `idperfil_usuario`, `nom_usu`, `clave_usu`, `dni_usu`, `nombres_usu`, `apellidos_usu`, `sexo_usu`, `celular_usu`, `correo_usu`, `direccion_usu`, `fcreacion_usu`, `fbaja_usu`, `obser_usu`, `estado_usu`) VALUES
(1, 1, 'jjulcavas', '987a5e34ae72d97de0a7ef59c37788f0296584e2', '71919582', 'Jose Andersson', 'Julca Vásquez', 'M', '978902579', NULL, 'CALLE CHICLAYO # 114', '2019-06-28', NULL, NULL, b'1'),
(2, 4, 'maritasv', 'a6b7354b8ec74b0550233c5cbf8773c6d28ceef4', '73258572', 'Marita Vanessa', 'Sanchez Velasquez', 'F', '979241872', 'vanesa_2808@hotmail.com', 'VISTA ALEGRE M H LT 22 CRUZ DE LA ESPERANZA', '2019-06-29', NULL, NULL, b'1'),
(3, 2, 'rosafc', 'ea8d414fe25b078a9b8e1516862bddf210e686bd', '14526398', 'Rosa Magaly ', 'Fernandez Cabrejos', 'F', '987445896', '', 'calle motupe # 152', '2019-06-29', NULL, NULL, b'1'),
(4, 3, 'lishyestelita', 'ea8d414fe25b078a9b8e1516862bddf210e686bd', '45256389', 'Lishy Tatiana', 'Estela Zeña', 'F', '968574258', NULL, 'calle tucume # 150', '2019-06-29', '2020-06-05', NULL, b'1'),
(5, 1, 'admin', 'd033e22ae348aeb5660fc2140aec35850c4da997', '12345678', 'admin', 'admin', 'M', '123456789', '', '', '2020-08-20', NULL, '', b'1');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `compra_ibfk_2` FOREIGN KEY (`id_anhio`) REFERENCES `anhio_lectivo` (`idanhio`),
  ADD CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`idusuario`);

--
-- Filtros para la tabla `concepto_apafa`
--
ALTER TABLE `concepto_apafa`
  ADD CONSTRAINT `concepto_apafa_ibfk_1` FOREIGN KEY (`id_anhio`) REFERENCES `anhio_lectivo` (`idanhio`);

--
-- Filtros para la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD CONSTRAINT `detalle_compra_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id_compra`);

--
-- Filtros para la tabla `detalle_deuda`
--
ALTER TABLE `detalle_deuda`
  ADD CONSTRAINT `detalle_deuda_ibfk_2` FOREIGN KEY (`id_apoderado`) REFERENCES `apoderado` (`id_apoderado`),
  ADD CONSTRAINT `detalle_deuda_ibfk_1` FOREIGN KEY (`id_concepto`) REFERENCES `concepto_apafa` (`id_concepto`);

--
-- Filtros para la tabla `detalle_recibo`
--
ALTER TABLE `detalle_recibo`
  ADD CONSTRAINT `detalle_recibo_ibfk_2` FOREIGN KEY (`id_recibo`) REFERENCES `recibo` (`id_recibo`),
  ADD CONSTRAINT `detalle_recibo_ibfk_1` FOREIGN KEY (`id_detalle_deuda`) REFERENCES `detalle_deuda` (`id_detalle_deuda`);

--
-- Filtros para la tabla `libro`
--
ALTER TABLE `libro`
  ADD CONSTRAINT `grados_libro` FOREIGN KEY (`id_grado`) REFERENCES `grados` (`id_grado`);

--
-- Filtros para la tabla `libro_matricula`
--
ALTER TABLE `libro_matricula`
  ADD CONSTRAINT `libro_matricula_ibfk_2` FOREIGN KEY (`id_libro`) REFERENCES `libro` (`id_libro`),
  ADD CONSTRAINT `libro_matricula_ibfk_1` FOREIGN KEY (`id_matricula`) REFERENCES `padron_matricula` (`id_matricula`);

--
-- Filtros para la tabla `movimiento`
--
ALTER TABLE `movimiento`
  ADD CONSTRAINT `anhio_movimiento` FOREIGN KEY (`id_anhio`) REFERENCES `anhio_lectivo` (`idanhio`);

--
-- Filtros para la tabla `padron_matricula`
--
ALTER TABLE `padron_matricula`
  ADD CONSTRAINT `padron_matricula_ibfk_5` FOREIGN KEY (`id_tipo_relacion`) REFERENCES `tipo_relacion` (`id_tipo_relacion`),
  ADD CONSTRAINT `padron_matricula_ibfk_1` FOREIGN KEY (`id_apoderado`) REFERENCES `apoderado` (`id_apoderado`),
  ADD CONSTRAINT `padron_matricula_ibfk_2` FOREIGN KEY (`id_alumno`) REFERENCES `alumno` (`id_alumno`),
  ADD CONSTRAINT `padron_matricula_ibfk_3` FOREIGN KEY (`id_anhio`) REFERENCES `anhio_lectivo` (`idanhio`),
  ADD CONSTRAINT `padron_matricula_ibfk_4` FOREIGN KEY (`id_seccion`) REFERENCES `secciones` (`id_seccion`);

--
-- Filtros para la tabla `recibo`
--
ALTER TABLE `recibo`
  ADD CONSTRAINT `recibo_ibfk_3` FOREIGN KEY (`id_anhio`) REFERENCES `anhio_lectivo` (`idanhio`),
  ADD CONSTRAINT `recibo_ibfk_1` FOREIGN KEY (`id_apoderado`) REFERENCES `apoderado` (`id_apoderado`),
  ADD CONSTRAINT `recibo_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`idusuario`);

--
-- Filtros para la tabla `reunion`
--
ALTER TABLE `reunion`
  ADD CONSTRAINT `concepto_reunion` FOREIGN KEY (`id_concepto`) REFERENCES `concepto_apafa` (`id_concepto`);

--
-- Filtros para la tabla `reunion_apoderado`
--
ALTER TABLE `reunion_apoderado`
  ADD CONSTRAINT `reunion_apoderado_ibfk_1` FOREIGN KEY (`id_reunion`) REFERENCES `reunion` (`id_reunion`),
  ADD CONSTRAINT `reunion_apoderado_ibfk_2` FOREIGN KEY (`id_apoderado`) REFERENCES `apoderado` (`id_apoderado`);

--
-- Filtros para la tabla `secciones`
--
ALTER TABLE `secciones`
  ADD CONSTRAINT `secciones_ibfk_1` FOREIGN KEY (`id_grado`) REFERENCES `grados` (`id_grado`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idperfil_usuario`) REFERENCES `perfil_usuario` (`idperfil_usuario`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
