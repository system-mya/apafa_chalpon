-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-07-2019 a las 23:36:41
-- Versión del servidor: 5.7.14
-- Versión de PHP: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `chalpon_apafa`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_buscar_dni_usuario` (IN `dni` CHAR(8))  NO SQL
SELECT * FROM usuario
WHERE dni_usu=dni
AND estado_usu=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_buscar_doc_alumno` (IN `doc` VARCHAR(15))  NO SQL
SELECT id_alumno,apellidos_alumno,nombres_alumno,
(CASE WHEN sexo_alumno='M' THEN 'MASCULINO' ELSE 'FEMENINO' END)
AS sexo_alumno FROM alumno
WHERE doc_alumno=doc
AND estado_alumno=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_buscar_doc_apoderado` (IN `doc` VARCHAR(15))  NO SQL
SELECT * FROM apoderado
WHERE doc_apoderado=doc
AND estado_apoderado=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_cambiar_estado_grado` (IN `grado` TINYINT, IN `estado` BIT)  NO SQL
UPDATE grados SET estado_grado=estado 
WHERE id_grado=grado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_cambiar_lista_reunion` (IN `reunion` SMALLINT)  NO SQL
UPDATE reunion SET lista_reunion=1
WHERE id_reunion=reunion$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_detalle_alumno` (IN `id` SMALLINT)  NO SQL
SELECT id_alumno,(CASE WHEN tdoc_alumno='OTR' THEN 'OTROS' ELSE 'DNI' END) AS tdoc_alumno,doc_alumno,apellidos_alumno,
nombres_alumno,fnac_alumno,(CASE WHEN sexo_alumno='M' THEN 'MASCULINO' ELSE 'FEMENINO' END) AS sexo_alumno,
telefono_alumno,celular_alumno,direccion_alumno,correo_alumno,procedencia_alumno,apellidos_padre,
nombres_padre,celular_padre,correo_padre,apellidos_madre,nombres_madre,celular_madre,correo_madre FROM alumno
WHERE id_alumno=id
AND estado_alumno=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_detalle_apoderado` (IN `id` SMALLINT)  NO SQL
SELECT id_apoderado, (CASE WHEN tdoc_apoderado='OTR' THEN 'OTROS' ELSE 'DNI' END) AS tdoc_apoderado, doc_apoderado, apellidos_apoderado,nombres_apoderado,(CASE WHEN sexo_apoderado='M' THEN 'MASCULINO' ELSE 'FEMENINO' END) AS sexo_apoderado, celular_apoderado, direccion_apoderado, correo_apoderado FROM apoderado
WHERE id_apoderado=id
AND estado_apoderado=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_detalle_matricula` (IN `id` SMALLINT)  NO SQL
SELECT a.doc_alumno,a.apellidos_alumno,a.nombres_alumno,a.direccion_alumno,
ap.doc_apoderado,ap.apellidos_apoderado,ap.nombres_apoderado,tr.nombre_relacion,
g.descripcion_grado,s.nombre_seccion,
(CASE WHEN s.turno_seccion='M' THEN 'MAÑANA' ELSE 'TARDE' END) as turno_seccion
FROM matricula m
INNER JOIN alumno a ON a.id_alumno=m.id_alumno
INNER JOIN apoderado ap ON ap.id_apoderado=m.id_apoderado
INNER JOIN tipo_relacion tr ON tr.id_tipo_relacion=m.id_tipo_relacion
INNER JOIN secciones s ON s.id_seccion=m.id_seccion
INNER JOIN grados g ON g.id_grado=s.id_grado
WHERE m.id_matricula=id
AND m.estado_matricula=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_devolver_libro` (IN `matricula` SMALLINT, IN `libro` SMALLINT, IN `estado` BIT(1))  NO SQL
UPDATE libro_matricula SET devolvio_libro=estado
WHERE id_matricula=matricula
AND id_libro=libro$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_alumno` (IN `id` SMALLINT)  NO SQL
UPDATE alumno SET estado_alumno=0
WHERE id_alumno=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_apoderado` (IN `id_apo` SMALLINT)  NO SQL
UPDATE apoderado SET estado_apoderado=0 WHERE id_apoderado=id_apo$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_concepto` (IN `id` SMALLINT)  NO SQL
UPDATE concepto_apafa SET estado_concepto=0
WHERE id_concepto=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_ingreso_egreso` (IN `criterio` CHAR(1), IN `id` SMALLINT)  NO SQL
IF criterio="M" THEN
        UPDATE otros_movimientos SET estado_movimiento=0
        WHERE id_movimiento=id;
ELSEIF criterio="R" THEN
        UPDATE recibo SET estado_recibo=0
        WHERE id_recibo=id;
ELSEIF criterio="c" THEN
        UPDATE compra SET estado_compra=0
        WHERE id_compra=id;
END IF$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_libro` (IN `idlibro` TINYINT)  NO SQL
UPDATE libro SET estado_libro=0 WHERE id_libro=idlibro$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_matricula` (IN `id` SMALLINT)  NO SQL
UPDATE matricula SET estado_matricula=0
WHERE id_matricula=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_reunion` (IN `id` SMALLINT)  NO SQL
UPDATE reunion SET estado_reunion=0
WHERE id_reunion=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_seccion` (IN `id` TINYINT)  NO SQL
UPDATE secciones SET estado_seccion=0
WHERE id_seccion=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_usuario` (IN `id_usu` TINYINT)  NO SQL
UPDATE usuario SET estado_usu=0
WHERE idusuario=id_usu$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_iniciar_sesion` (IN `nom` VARCHAR(20), IN `clave` VARCHAR(10))  NO SQL
SELECT u.idusuario,u.nom_usu,pu.abrev_perfil,pu.nombre_perfil,
(SELECT anhio_lectivo from anhio_lectivo WHERE condicion_anhio='A' AND estado_anhio=1) AS anhio_lectivo FROM usuario u
INNER JOIN perfil_usuario pu ON u.idperfil_usuario=pu.idperfil_usuario
WHERE u.nom_usu=nom
AND u.clave_usu=SHA(clave)
AND u.estado_usu=1
AND u.fbaja_usu IS NULL$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_alumno` (IN `tdoc` CHAR(3), IN `doc` VARCHAR(15), IN `ape_alum` VARCHAR(60), IN `nom_alum` VARCHAR(50), IN `fnac` DATE, IN `sexo` CHAR(1), IN `tel_alum` CHAR(6), IN `cel_alum` CHAR(9), IN `dire_alum` VARCHAR(80), IN `correo_alum` VARCHAR(80), IN `proc_alum` VARCHAR(100), IN `ape_padre` VARCHAR(60), IN `nom_padre` VARCHAR(50), IN `cel_padre` CHAR(9), IN `correo_pa` VARCHAR(80), IN `ape_madre` VARCHAR(60), IN `nom_madre` VARCHAR(50), IN `cel_madre` CHAR(9), IN `correo_ma` VARCHAR(80))  NO SQL
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_anhio` (IN `anhio` CHAR(4), IN `finicio` DATE, IN `ffin` DATE, IN `descripcion` VARCHAR(150))  INSERT INTO anhio_lectivo(anhio_lectivo, finicio_anhio,
ffin_anhio, descripcion_anhio) 
VALUES (anhio,finicio,ffin,descripcion)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_apoderado` (IN `tdoc_apod` CHAR(3), IN `doc_apod` VARCHAR(15), IN `ape_apod` VARCHAR(60), IN `nom_apod` VARCHAR(50), IN `sex_apod` CHAR(1), IN `cel_apod` CHAR(9), IN `direc_apod` VARCHAR(80), IN `cor_apod` VARCHAR(80))  NO SQL
INSERT INTO apoderado(tdoc_apoderado, 
doc_apoderado, apellidos_apoderado, nombres_apoderado,
sexo_apoderado, celular_apoderado, direccion_apoderado,
correo_apoderado) VALUES (tdoc_apod,doc_apod,
ape_apod,nom_apod,sex_apod,cel_apod,direc_apod,cor_apod)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_compra` (IN `usu` TINYINT, IN `codanhio` CHAR(4), IN `tipo` CHAR(1), IN `num` VARCHAR(10), IN `rsocial` VARCHAR(50), IN `ruc` CHAR(11), IN `fecha` DATE, IN `doc` VARCHAR(15), IN `encargado` VARCHAR(80), IN `total` FLOAT)  NO SQL
INSERT INTO compra(id_usuario,id_anhio,tipo_compra,
num_compra,razon_social_compra, ruc_compra,
fecha_compra,freg_compra,doc_encargado_compra,
encargado_compra, total_compra) 
VALUES (usu,(SELECT idanhio from
anhio_lectivo WHERE condicion_anhio='A' 
AND estado_anhio=1
AND anhio_lectivo=codanhio),tipo,num,rsocial,ruc,fecha,NOW(),doc,
encargado,total)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_concepto_apafa` (IN `des_concepto` VARCHAR(100), IN `tipo` CHAR(1), IN `anhio` CHAR(4), IN `monto` FLOAT(10,2))  NO SQL
INSERT INTO concepto_apafa (descripcion_concepto, tipo_concepto, id_anhio, monto_concepto) 
VALUES (des_concepto,tipo,(SELECT idanhio FROM anhio_lectivo WHERE anhio_lectivo=anhio AND condicion_anhio='A' AND estado_anhio=1),monto)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_detalle_compra` (IN `compra` SMALLINT, IN `producto` VARCHAR(30), IN `cant` TINYINT, IN `med` VARCHAR(10), IN `precio` FLOAT)  NO SQL
INSERT INTO detalle_compra(id_compra,nom_producto,
cantidad_compra,medida_compra,punit_compra) VALUES (compra,
producto,cant,med,precio)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_detalle_recibo` (IN `id_detalle` SMALLINT, IN `recibo` SMALLINT, IN `monto` FLOAT(10,2))  NO SQL
INSERT INTO detalle_recibo(id_detalle_deuda, id_recibo, monto_detalle) VALUES (id_detalle,recibo,monto)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_deuda_apafa` (IN `apoderado` SMALLINT, IN `dato_anhio` CHAR(4))  NO SQL
INSERT INTO detalle_deuda(id_concepto,id_apoderado,saldo_deuda,freg_deuda,fseg_deuda) 
VALUES ((SELECT ca.id_concepto FROM concepto_apafa ca 
INNER JOIN anhio_lectivo a ON a.idanhio=ca.id_anhio 
WHERE ca.tipo_concepto='A' AND a.anhio_lectivo=dato_anhio AND a.condicion_anhio='A' 
AND a.estado_anhio=1 AND ca.estado_concepto=1),apoderado,
(SELECT ca.monto_concepto FROM concepto_apafa ca 
INNER JOIN anhio_lectivo a ON a.idanhio=ca.id_anhio 
WHERE ca.tipo_concepto='A' AND a.anhio_lectivo=dato_anhio AND a.condicion_anhio='A' 
AND a.estado_anhio=1 AND ca.estado_concepto=1),CURDATE(),NOW())$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_deuda_apoderado` (IN `concepto` SMALLINT, IN `apoderado` SMALLINT, IN `saldo` FLOAT, IN `descripcion` VARCHAR(100))  NO SQL
INSERT INTO detalle_deuda(id_concepto,id_apoderado, saldo_deuda, descripcion_deuda,freg_deuda,fseg_deuda) 
VALUES (concepto,apoderado,saldo,descripcion,CURDATE(),NOW())$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_libro` (IN `titulo_lib` VARCHAR(80), IN `edit_lib` VARCHAR(20), IN `edicion` CHAR(4), IN `grado` TINYINT)  NO SQL
INSERT INTO libro (titulo_libro, editorial_libro,edicion_libro,id_grado ) 
VALUES (titulo_lib,edit_lib,edicion,grado)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_libro_xmatricula` (IN `matricula` SMALLINT, IN `libro` TINYINT)  NO SQL
INSERT INTO libro_matricula(id_matricula, id_libro) 
VALUES (matricula,libro)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_matricula` (IN `fecha` DATE, IN `idapo` SMALLINT, IN `idalum` SMALLINT, IN `idseccion` TINYINT, IN `idrelacion` TINYINT, IN `codanhio` CHAR(4))  NO SQL
INSERT INTO matricula(fecha_matricula, 
id_apoderado, id_alumno,id_anhio, 
id_seccion,id_tipo_relacion) 
VALUES (fecha,idapo,idalum,(SELECT idanhio from
anhio_lectivo WHERE condicion_anhio='A' 
AND estado_anhio=1
AND anhio_lectivo=codanhio),idseccion,idrelacion)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_movimientos` (IN `tipo` CHAR(1), IN `descripcion` VARCHAR(100), IN `monto` FLOAT(10,2), IN `doc` VARCHAR(15), IN `datos` VARCHAR(100), IN `usu` TINYINT)  NO SQL
INSERT INTO otros_movimientos(tipo_movimiento, descripcion_movimiento, monto_movimiento, freg_movimiento,doc_encargado_movimiento, datos_encargado_movimiento, id_usuario) VALUES (tipo,descripcion,
monto,NOW(),doc,datos,usu)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_nvo_recibo` (IN `apo` SMALLINT, IN `usu` SMALLINT, IN `mtotal` FLOAT, IN `num` VARCHAR(20))  NO SQL
INSERT INTO recibo(id_apoderado,id_usuario,mtotal_recibo,freg_recibo, num_recibo) 
VALUES (apo,usu,mtotal,NOW(),num)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_reunion` (IN `motivo` VARCHAR(100), IN `fecha` DATE, IN `hora` TIME, IN `concepto` SMALLINT)  NO SQL
INSERT INTO reunion(motivo_reunion, fecha_reunion,hora_reunion,id_concepto) 
VALUES (motivo,fecha,hora,concepto)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_reunion_apoderado` (IN `reunion` SMALLINT, IN `apoderado` SMALLINT)  NO SQL
INSERT INTO reunion_apoderado(id_reunion,id_apoderado) 
VALUES (reunion,apoderado)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_seccion` (IN `nombre` VARCHAR(20), IN `grado` TINYINT, IN `turno` CHAR(1))  NO SQL
INSERT INTO secciones(nombre_seccion,id_grado,turno_seccion) 
VALUES (nombre,grado,turno)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_usuario` (IN `perfil` TINYINT, IN `nom_usu` VARCHAR(20), IN `clave` VARCHAR(10), IN `dni` CHAR(8), IN `nombres` VARCHAR(45), IN `apellidos` VARCHAR(60), IN `sexo` CHAR(1), IN `celular` CHAR(9), IN `correo` VARCHAR(80), IN `direccion` VARCHAR(80), IN `fcreacion` DATE, IN `obser` VARCHAR(50))  INSERT INTO usuario(idperfil_usuario,nom_usu, 
clave_usu,dni_usu,nombres_usu,apellidos_usu, 
sexo_usu,celular_usu,correo_usu,
direccion_usu,fcreacion_usu,
obser_usu)
VALUES (perfil,nom_usu,SHA(clave),dni,nombres,apellidos,sexo,
celular,correo,direccion,fcreacion,obser)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_alumnos` ()  NO SQL
SELECT id_alumno,apellidos_alumno,
nombres_alumno,tdoc_alumno,doc_alumno,
(CASE
   WHEN sexo_alumno='M' THEN 'MASCULINO'
   ELSE 'FEMENINO'
 END) as sexo_alumno,celular_alumno FROM alumno
WHERE estado_alumno=1
ORDER BY apellidos_alumno ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_alumnos_xapoderado_matricula` (IN `anhio` TINYINT, IN `apo` SMALLINT)  NO SQL
SELECT a.apellidos_alumno,a.nombres_alumno,g.descripcion_grado,s.nombre_seccion FROM matricula m
INNER JOIN alumno a ON a.id_alumno=m.id_alumno
INNER JOIN secciones s ON s.id_seccion=m.id_seccion
INNER JOIN grados g ON g.id_grado=s.id_grado
WHERE m.estado_matricula=1
AND m.id_anhio=anhio
AND m.id_apoderado=apo$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_anhio` ()  NO SQL
SELECT idanhio,anhio_lectivo,finicio_anhio,ffin_anhio,
LEFT(descripcion_anhio,20) as descripcion, descripcion_anhio,
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
WHERE estado_anhio=1
ORDER BY anhio_lectivo DESC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_apoderados` ()  NO SQL
SELECT id_apoderado,doc_apoderado,apellidos_apoderado,
nombres_apoderado,(CASE WHEN sexo_apoderado='M' THEN 'MASCULINO' ELSE 'FEMENINO' END) AS sexo_apoderado,
celular_apoderado
FROM apoderado
WHERE estado_apoderado=1
ORDER BY apellidos_apoderado ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_apoderados_matricula` (IN `dato_anhio` CHAR(4))  NO SQL
SELECT m.id_apoderado FROM matricula m 
INNER JOIN anhio_lectivo a ON a.idanhio=m.id_anhio
WHERE a.anhio_lectivo=dato_anhio
GROUP BY m.id_apoderado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_apoderados_reunion` (IN `reunion` SMALLINT, IN `anhio` CHAR(4))  NO SQL
SELECT m.id_apoderado,ap.doc_apoderado,CONCAT(ap.apellidos_apoderado,' ',ap.nombres_apoderado) AS apoderado,GROUP_CONCAT(a.apellidos_alumno,' ',a.nombres_alumno,'
') AS matriculados,ra.asistio_reunion 
FROM matricula m 
INNER JOIN alumno a ON a.id_alumno=m.id_alumno 
INNER JOIN anhio_lectivo al ON al.idanhio=m.id_anhio
INNER JOIN apoderado ap ON ap.id_apoderado=m.id_apoderado
INNER JOIN reunion_apoderado ra ON ra.id_apoderado=m.id_apoderado
WHERE al.anhio_lectivo=anhio 
AND ra.id_reunion=reunion
GROUP BY m.id_apoderado,ap.doc_apoderado,ra.asistio_reunion
ORDER BY ap.apellidos_apoderado,ap.nombres_apoderado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_apoderados_xanhio` (IN `anhio` TINYINT)  NO SQL
SELECT m.id_apoderado,ap.apellidos_apoderado,ap.nombres_apoderado,ap.doc_apoderado,ap.celular_apoderado FROM matricula m
INNER JOIN apoderado ap ON ap.id_apoderado=m.id_apoderado
WHERE m.estado_matricula=1
AND m.id_anhio=anhio
GROUP BY m.id_apoderado
ORDER BY ap.apellidos_apoderado,ap.nombres_apoderado ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_detalle_compra` (IN `compra` SMALLINT)  NO SQL
SELECT * FROM detalle_compra
WHERE id_compra=compra$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_detalle_deuda_pendientes` (IN `apo` SMALLINT)  NO SQL
SELECT de.id_detalle_deuda,ca.descripcion_concepto,de.saldo_deuda,
(CASE WHEN de.estado_deuda='P' THEN 'PENDIENTE'
ELSE 'PAGADO' END) AS estado_deuda,'' as tipo_pago,0 as monto FROM detalle_deuda de 
INNER JOIN concepto_apafa ca ON ca.id_concepto=de.id_concepto
WHERE de.id_apoderado=apo
AND de.estado_deuda!='E'
AND de.estado_deuda='P'$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_egresos_xperiodo` (IN `cod_anhio` CHAR(4))  NO SQL
SELECT id_compra,(CASE WHEN tipo_compra='F' THEN 'FACTURA'
                          ELSE 'BOLETA' END) as tipo_compra,num_compra, razon_social_compra,ruc_compra, fecha_compra,freg_compra, doc_encargado_compra, encargado_compra, total_compra, estado_compra FROM compra
WHERE estado_compra=1
AND id_anhio=(SELECT idanhio FROM anhio_lectivo WHERE condicion_anhio='A' AND estado_anhio=1 AND anhio_lectivo=cod_anhio)
UNION ALL 
SELECT id_movimiento AS id_compra,'OTROS' AS tipo_compra, 
doc_encargado_movimiento AS num_compra, 
datos_encargado_movimiento As razon_social_compra,
descripcion_movimiento AS ruc_compra,freg_movimiento AS fecha_compra,freg_movimiento AS freg_compra,
'' AS doc_encargado_compra,'' AS encargado_compra,
monto_movimiento AS total_compra,estado_movimiento as estado_compra
FROM otros_movimientos
WHERE tipo_movimiento='E'
AND estado_movimiento=1 AND YEAR(freg_movimiento)=cod_anhio
ORDER BY freg_compra DESC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_grados` (IN `nivel` CHAR(1))  NO SQL
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_grados_activos` (IN `nivel` CHAR(1))  NO SQL
SELECT * FROM grados g
 WHERE g.nivel_grado=nivel
 AND g.estado_grado=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_grados_xmatricula` (IN `anhio` TINYINT)  NO SQL
SELECT g.id_grado,g.descripcion_grado FROM matricula m 
INNER JOIN secciones s ON s.id_seccion=m.id_seccion
INNER JOIN grados g ON g.id_grado=s.id_grado
WHERE m.estado_matricula=1
AND m.id_anhio=anhio
GROUP BY g.id_grado,g.descripcion_grado
ORDER BY g.id_grado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_historial_matricula` (IN `alumno` SMALLINT)  NO SQL
SELECT m.id_matricula,g.descripcion_grado,s.nombre_seccion,a.anhio_lectivo, ap.id_apoderado,ap.apellidos_apoderado,ap.nombres_apoderado,ap.doc_apoderado,deuda.total FROM apoderado ap LEFT JOIN
    (  SELECT id_apoderado, SUM(saldo_deuda) as total
       FROM detalle_deuda GROUP BY id_apoderado
    ) deuda ON ap.id_apoderado = deuda.id_apoderado
 INNER JOIN matricula m ON m.id_apoderado=ap.id_apoderado
 INNER JOIN secciones s ON s.id_seccion=m.id_seccion
 INNER JOIN grados g ON g.id_grado=s.id_grado
 INNER JOIN anhio_lectivo a ON a.idanhio=m.id_anhio
 WHERE m.id_alumno=alumno
 AND m.estado_matricula=1
 GROUP BY ap.id_apoderado,m.id_matricula,g.descripcion_grado,s.nombre_seccion,
 a.anhio_lectivo$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_ingresos_xperiodo` (IN `anhio` CHAR(4))  NO SQL
SELECT r.id_recibo AS id_ingreso,'R' AS tipo,a.id_apoderado as id_apoderado,r.num_recibo AS doc_ingreso, 
CONCAT(a.apellidos_apoderado,' ',a.nombres_apoderado) as descripcion_ingreso,r.mtotal_recibo AS monto_ingreso, 
r.freg_recibo AS freg_ingreso
FROM recibo r
INNER JOIN apoderado a ON a.id_apoderado=r.id_apoderado
WHERE r.estado_recibo =1 AND YEAR(r.freg_recibo)=anhio
UNION ALL 
SELECT id_movimiento AS id_ingreso,'O' AS tipo,'' AS id_apoderdo, 
doc_encargado_movimiento AS doc_ingreso, 
descripcion_movimiento as descripcion_ingreso,
monto_movimiento AS monto_ingreso, freg_movimiento AS freg_ingreso
FROM otros_movimientos
WHERE tipo_movimiento='I'
AND estado_movimiento=1 AND YEAR(freg_movimiento)=anhio
ORDER BY freg_ingreso DESC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_libros_activos` ()  NO SQL
SELECT * FROM libro l 
INNER JOIN grados g ON g.id_grado=l.id_grado
WHERE l.estado_libro=1
ORDER BY g.id_grado ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_libros_xgrado` (IN `grado` TINYINT, IN `matricula` SMALLINT)  NO SQL
SELECT * FROM libro l WHERE NOT EXISTS 
(SELECT * FROM libro_matricula lm WHERE lm.id_libro = l.id_libro
AND lm.id_matricula=matricula)
AND l.id_grado=grado
AND l.estado_libro=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_libros_xmatricula` (IN `matricula` SMALLINT)  NO SQL
SELECT * FROM libro_matricula lm
INNER JOIN libro l ON l.id_libro=lm.id_libro
WHERE id_matricula=matricula$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_matriculados` ()  NO SQL
SELECT a.id_alumno,a.doc_alumno,CONCAT(a.apellidos_alumno,' ',a.nombres_alumno) as datos_alumno,m.id_matricula,
g.descripcion_grado as grado,g.id_grado,s.nombre_seccion as seccion FROM matricula m 
INNER JOIN apoderado ap ON m.id_apoderado=ap.id_apoderado
INNER JOIN alumno a ON a.id_alumno=m.id_alumno
INNER JOIN anhio_lectivo an ON an.idanhio=m.id_anhio
INNER JOIN secciones s ON s.id_seccion=m.id_seccion
INNER JOIN grados g ON g.id_grado=s.id_grado
INNER JOIN tipo_relacion tr ON tr.id_tipo_relacion=m.id_tipo_relacion
WHERE m.estado_matricula=1
AND m.id_anhio=(SELECT idanhio FROM anhio_lectivo WHERE condicion_anhio='A' AND estado_anhio=1)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_matriculados_xanhio` (IN `anhio` TINYINT)  NO SQL
SELECT a.doc_alumno,a.apellidos_alumno,a.nombres_alumno,g.descripcion_grado,s.nombre_seccion FROM matricula m 
INNER JOIN alumno a ON a.id_alumno=m.id_alumno
INNER JOIN secciones s ON s.id_seccion=m.id_seccion
INNER JOIN grados g ON g.id_grado=s.id_grado
WHERE m.id_anhio=anhio
AND m.estado_matricula=1
ORDER BY g.id_grado,s.nombre_seccion,a.apellidos_alumno,a.nombres_alumno ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_matriculados_xgrado` (IN `grado` TINYINT)  SELECT a.doc_alumno,a.apellidos_alumno,a.nombres_alumno,s.nombre_seccion FROM matricula m 
INNER JOIN alumno a ON a.id_alumno=m.id_alumno
INNER JOIN secciones s ON s.id_seccion=m.id_seccion
INNER JOIN grados g ON s.id_grado=g.id_grado
WHERE g.id_grado=grado
AND m.id_anhio=(SELECT idanhio FROM anhio_lectivo WHERE condicion_anhio='A' AND estado_anhio=1)
AND m.estado_matricula=1
ORDER BY a.apellidos_alumno,a.nombres_alumno,s.nombre_seccion ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_otros_conceptos` (IN `dato_anhio` CHAR(4))  NO SQL
SELECT * FROM concepto_apafa c 
INNER JOIN anhio_lectivo a ON a.idanhio=c.id_anhio
WHERE c.estado_concepto=1
AND c.tipo_concepto='O'
AND a.anhio_lectivo=dato_anhio$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_perfil_usuario` ()  NO SQL
SELECT * FROM perfil_usuario
WHERE estado_perfil=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_reuniones_xperiodo` (IN `dato_anhio` CHAR(4))  NO SQL
SELECT r.id_reunion, r.motivo_reunion,CONCAT(r.fecha_reunion,' ',r.hora_reunion) AS fecha_reunion,r.lista_reunion,r.id_concepto,r.estado_reunion,c.descripcion_concepto,
c.monto_concepto,a.anhio_lectivo
FROM reunion r
INNER JOIN concepto_apafa c ON c.id_concepto=r.id_concepto
INNER JOIN anhio_lectivo a ON a.idanhio=c.id_anhio
WHERE r.estado_reunion=1
AND a.anhio_lectivo=dato_anhio
ORDER BY r.id_reunion DESC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_secciones_xgrado` (IN `grado` TINYINT)  NO SQL
SELECT s.id_seccion,s.nombre_seccion,g.descripcion_grado,g.id_grado,
(CASE 
     WHEN s.turno_seccion='M' THEN 'MAÑANA'
     ELSE 'TARDE'
END) as turno FROM secciones s 
INNER JOIN grados g ON g.id_grado=s.id_grado 
WHERE s.estado_seccion=1
AND g.id_grado=grado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_tipo_relacion` ()  NO SQL
SELECT * FROM tipo_relacion
WHERE estado_relacion=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_todos_conceptos` (IN `anhio` CHAR(4))  NO SQL
SELECT id_concepto,descripcion_concepto,(CASE WHEN tipo_concepto='A'
THEN 'APAFA' ELSE 'OTROS' END) AS tipo_concepto,id_anhio,
monto_concepto FROM concepto_apafa c
INNER JOIN anhio_lectivo al ON al.idanhio=c.id_anhio
WHERE al.anhio_lectivo=anhio
AND c.estado_concepto=1
ORDER BY c.tipo_concepto$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_usuarios` ()  NO SQL
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_obtener_detalle_movimiento` (IN `id` SMALLINT, IN `tipo` CHAR(1))  NO SQL
SELECT descripcion_movimiento,monto_movimiento,freg_movimiento,
doc_encargado_movimiento,datos_encargado_movimiento FROM otros_movimientos
WHERE id_movimiento=id
AND tipo_movimiento=tipo
AND estado_movimiento=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_obtener_detalle_recibo` (IN `id` SMALLINT)  NO SQL
SELECT c.descripcion_concepto,convert(dr.monto_detalle, decimal(10,2)) as monto_detalle FROM detalle_recibo dr 
INNER JOIN detalle_deuda d ON dr.id_detalle_deuda=d.id_detalle_deuda
INNER JOIN recibo r ON r.id_recibo=dr.id_recibo
INNER JOIN concepto_apafa c ON c.id_concepto=d.id_concepto
WHERE r.id_recibo=id
AND r.estado_recibo=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_obtener_usuario` (IN `id` INT)  NO SQL
SELECT * FROM usuario u
INNER JOIN perfil_usuario pu ON pu.idperfil_usuario=u.idperfil_usuario
WHERE u.idusuario=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_quitar_entrega_libro` (IN `matricula` SMALLINT, IN `libro` TINYINT)  NO SQL
DELETE FROM libro_matricula
WHERE id_matricula=matricula
AND id_libro=libro$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_registrar_asistencia_reunion` (IN `reunion` SMALLINT, IN `apoderado` SMALLINT, IN `opt` BIT(1))  NO SQL
UPDATE reunion_apoderado SET asistio_reunion=opt
WHERE id_reunion=reunion AND id_apoderado=apoderado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_resetear_usuario` (IN `id_usu` TINYINT)  NO SQL
UPDATE usuario SET clave_usu=SHA('1A2B3C4D'),fbaja_usu=NULL
WHERE idusuario=id_usu$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_ultima_compra` (IN `anhio` CHAR(4))  NO SQL
SELECT *
  FROM compra
  WHERE estado_compra=1
  AND YEAR(freg_compra)=anhio
 ORDER BY id_compra DESC
  limit 1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_ultimo_recibo_ingresado` (IN `anhio` CHAR(4))  NO SQL
SELECT *
  FROM recibo
  WHERE estado_recibo=1
  AND YEAR(freg_recibo)=anhio
 ORDER BY id_recibo DESC
  limit 1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_alumno` (IN `id` SMALLINT, IN `ape_alum` VARCHAR(60), IN `nom_alum` VARCHAR(50), IN `fnac` DATE, IN `sex_alum` CHAR(1), IN `tel_alum` CHAR(6), IN `cel_alum` CHAR(9), IN `direc_alum` VARCHAR(80), IN `cor_alum` VARCHAR(80), IN `proc_alum` VARCHAR(100), IN `ape_padre` VARCHAR(60), IN `nom_padre` VARCHAR(50), IN `cel_padre` CHAR(9), IN `cor_padre` VARCHAR(80), IN `ape_madre` VARCHAR(60), IN `nom_madre` VARCHAR(50), IN `cel_madre` CHAR(9), IN `cor_madre` VARCHAR(80))  NO SQL
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_anhio_xcriterio` (IN `criterio` VARCHAR(12), IN `id` TINYINT)  NO SQL
IF criterio="cerrar" THEN
UPDATE anhio_lectivo SET condicion_anhio='C'
WHERE idanhio=id;
ELSEIF criterio="reaperturar" THEN
UPDATE anhio_lectivo SET condicion_anhio='A'
WHERE idanhio=id;
ELSE
UPDATE anhio_lectivo SET estado_anhio=0 
WHERE idanhio=id;
END IF$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_apoderado` (IN `id_apo` SMALLINT, IN `ape_apod` VARCHAR(60), IN `nom_apod` VARCHAR(50), IN `sex_apod` CHAR(1), IN `cel_apod` CHAR(9), IN `dir_apod` VARCHAR(80), IN `cor_apod` VARCHAR(80))  NO SQL
UPDATE apoderado SET apellidos_apoderado=ape_apod,
nombres_apoderado=nom_apod,sexo_apoderado=sex_apod,
celular_apoderado=cel_apod,
direccion_apoderado=dir_apod,correo_apoderado=cor_apod
WHERE id_apoderado=id_apo$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_clave` (IN `clave` VARCHAR(10), IN `id` SMALLINT)  NO SQL
UPDATE usuario SET clave_usu=SHA(clave) 
WHERE idusuario=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_concepto` (IN `id` SMALLINT, IN `descripcion` VARCHAR(100), IN `monto` FLOAT)  NO SQL
UPDATE concepto_apafa SET descripcion_concepto=descripcion,monto_concepto=monto
WHERE id_concepto=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_deuda` (IN `id` SMALLINT, IN `monto` FLOAT, IN `estado` CHAR(1))  NO SQL
UPDATE detalle_deuda SET saldo_deuda=saldo_deuda-monto,
fseg_deuda=NOW(),estado_deuda=estado
WHERE id_detalle_deuda=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_libro` (IN `t_libro` VARCHAR(80), IN `edit_libro` VARCHAR(20), IN `edicion` CHAR(4), IN `grado` TINYINT, IN `idlibro` TINYINT)  NO SQL
UPDATE libro SET titulo_libro=t_libro,editorial_libro=edit_libro,edicion_libro=edicion,id_grado=grado WHERE id_libro=idlibro$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_usuario` (IN `idusu` TINYINT, IN `nom_usu` VARCHAR(20), IN `nombres` VARCHAR(45), IN `apellidos` VARCHAR(60), IN `sexo` CHAR(1), IN `celular` CHAR(9), IN `correo` VARCHAR(80), IN `direccion` VARCHAR(80), IN `fbaja` DATE, IN `obser` VARCHAR(50), IN `perfil` INT)  UPDATE usuario SET nom_usu=nom_usu,nombres_usu=nombres,apellidos_usu=apellidos,sexo_usu=sexo,celular_usu=celular,correo_usu=correo,direccion_usu=direccion,fbaja_usu=fbaja,obser_usu=obser,idperfil_usuario=perfil
WHERE idusuario=idusu$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_anhio` (IN `dato` CHAR(4))  SELECT
    anhio_lectivo,idanhio
    FROM anhio_lectivo
    WHERE anhio_lectivo=dato AND estado_anhio=1
    UNION
    SELECT 'AÑO LECTIVO AUN APERTURADO',NULL FROM DUAL
    WHERE EXISTS
    ( SELECT idanhio
    FROM anhio_lectivo
    WHERE condicion_anhio='A' AND estado_anhio=1)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_cuota_apafa_xanhio` (IN `anhio_lec` CHAR(4))  NO SQL
SELECT * FROM concepto_apafa c
INNER JOIN anhio_lectivo al ON al.idanhio=c.id_anhio
WHERE al.anhio_lectivo=anhio_lec
AND c.tipo_concepto='A'
AND c.estado_concepto=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_deuda_apoderado` (IN `concepto` SMALLINT, IN `apoderado` SMALLINT, IN `anhio` CHAR(4))  NO SQL
SELECT * FROM detalle_deuda
WHERE id_concepto=concepto
AND id_apoderado=apoderado
AND  YEAR(freg_deuda)=anhio
AND estado_deuda='P'$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_matricula_alumno` (IN `alumno` SMALLINT, IN `dato_anhio` CHAR(4))  NO SQL
SELECT * FROM matricula m
WHERE m.id_alumno=alumno
AND m.estado_matricula=1
AND m.id_anhio=(SELECT idanhio FROM anhio_lectivo WHERE condicion_anhio='A' AND estado_anhio=1 AND anhio_lectivo=dato_anhio)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_seccion` (IN `nombre` VARCHAR(20), IN `grado` TINYINT)  NO SQL
SELECT * FROM secciones
WHERE nombre_seccion=nombre
AND id_grado=grado
AND estado_seccion=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_si_anhio_aperturado` ()  SELECT * FROM anhio_lectivo
WHERE condicion_anhio='A' AND estado_anhio=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_si_cuota_apafa_registrada` (IN `apoderado` SMALLINT, IN `dato_anhio` CHAR(4))  NO SQL
SELECT * FROM detalle_deuda du 
INNER JOIN concepto_apafa ca ON ca.id_concepto=du.id_concepto
INNER JOIN anhio_lectivo a ON a.idanhio=ca.id_anhio
WHERE du.id_apoderado=apoderado
AND ca.tipo_concepto='A'
AND ca.id_anhio=(SELECT idanhio FROM anhio_lectivo WHERE condicion_anhio='A' AND estado_anhio=1
                AND anhio_lectivo=dato_anhio)$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumno`
--

CREATE TABLE `alumno` (
  `id_alumno` smallint(6) NOT NULL,
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
  `estado_alumno` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `alumno`
--

INSERT INTO `alumno` (`id_alumno`, `tdoc_alumno`, `doc_alumno`, `apellidos_alumno`, `nombres_alumno`, `fnac_alumno`, `sexo_alumno`, `telefono_alumno`, `celular_alumno`, `direccion_alumno`, `correo_alumno`, `procedencia_alumno`, `apellidos_padre`, `nombres_padre`, `celular_padre`, `correo_padre`, `apellidos_madre`, `nombres_madre`, `celular_madre`, `correo_madre`, `estado_alumno`) VALUES
(1, 'OTR', '751654654M65484', 'Flores Aguilar', 'Diego', '2006-06-06', 'M', NULL, '928282905', 'La Posada SN', NULL, NULL, 'Flores Abad', 'Adler Mauro', '929151181', NULL, 'Aguilar Martinez', 'Rosa Luisa', NULL, NULL, b'1'),
(2, 'DNI', '80717855', 'Rubio Vasquez', 'Jose Alexander', '2003-08-04', 'M', '480429', '987445673', 'calle jose quinones # 54', NULL, NULL, 'Rubio Abad', 'Samuel', '983228426', NULL, 'Vasquez Delgado', 'Luz', NULL, NULL, b'1'),
(3, 'DNI', '70832512', 'Arroyo Maury', 'Paola Cinthia', '0000-00-00', 'F', '479474', '901929216', '', NULL, NULL, 'Arroyo Abanto', 'Edzon ', '965426036', '', 'Maury Zamora', 'Clariliz Matilde', NULL, '', b'1'),
(4, 'DNI', '19648251', 'Carpio Zamudio', 'Angela Maria', '2003-06-20', 'F', NULL, '971006543', '', NULL, NULL, 'Carpio Abila', 'Melchor Rogelio', NULL, '', 'Zamudio Vasquez', 'Leysi', NULL, '', b'1'),
(5, 'DNI', '20565088', 'Caycho Huaman', 'Jose Alberto', '2007-02-22', 'M', NULL, '910692871', '', NULL, NULL, 'Caycho Accilio', 'Henry', NULL, '', 'Huaman Baca', 'Mirelly Jasmin', NULL, '', b'1'),
(6, 'DNI', '24678923', 'Cieza Nuñez', 'Luis Carlos', '2007-02-28', 'M', NULL, '977343983', '', NULL, NULL, 'Cieza Acharte', 'Jhonatan', NULL, '', 'Nuñez Bustamante', 'Yeni', NULL, '', b'1'),
(7, 'DNI', '70937066', 'Dumet Poma', 'Lisset Marilyn', '2003-02-06', 'F', NULL, '938497198', '', NULL, NULL, 'Dumet Acosta', 'Fernando', NULL, '', 'Poma Carrera', 'Lesdy', NULL, '', b'1'),
(8, 'DNI', '63138772', 'Fujishima Urteaga', 'Begona Saori', '2007-08-31', 'F', NULL, '911544034', '', NULL, NULL, 'Fujishima Abendaño', 'Nicolas', NULL, '', 'Urteaga Cruz', 'Yannina', NULL, '', b'1'),
(9, 'DNI', '53002208', 'Longa Gamarra', 'Yurlik Roger', '2005-05-30', 'M', NULL, '934442634', '', NULL, NULL, 'Longa Zuñiga', 'Miguel Angel', NULL, '', 'Gamarra Cubas', 'Sarita Janet', NULL, '', b'1'),
(10, 'DNI', '90325173', 'Miranda Casas', 'Elvira Adriana', '2006-09-04', 'F', NULL, '914822125', '', NULL, NULL, 'Miranda Aguirre', 'Dan Nefeg', NULL, '', 'Casas Sanchez', 'Aurora', NULL, '', b'1'),
(11, 'DNI', '61939607', 'Ramirez Soplin', 'Magally Loidit', '2005-04-19', 'F', NULL, '923978763', '', NULL, NULL, 'Ramirez Aique', 'Enrique', NULL, '', 'Soplin Cornejo', 'Sindy', '963878818', '', b'1'),
(12, 'DNI', '10904092', 'Tapia Alva', 'Juana Rafaela', '2003-04-16', 'F', NULL, '900206988', '', NULL, NULL, 'Tapia Agüero', 'Neyl Paul', NULL, '', 'Alva Daza', 'Katia', '908595796', '', b'1'),
(13, 'DNI', '82868877', 'Tovar Jimenez', 'Victor Guadalupe', '2003-11-30', 'M', NULL, '939790953', '', NULL, NULL, 'Tovar Alanya', 'Estiven Rafael', NULL, '', 'Jimenez De La Cruz', 'Ines', '997980941', '', b'1'),
(14, 'DNI', '58231260', 'Vergara Cohen', 'David', '2007-02-23', 'M', NULL, '948215267', '', NULL, NULL, 'Vergara Alarcon', 'Luis', NULL, '', 'Cohen Delgado', 'Yoly', '920875746', '', b'1'),
(15, 'DNI', '15653385', 'Aguado López', 'Mayra', '2006-06-16', 'M', NULL, '973119361', '', NULL, NULL, 'Aguado Baltazar', 'Wilfredo', NULL, '', 'López Dueñas', 'Marizol', '911672102', '', b'1'),
(16, 'DNI', '51519494', 'Alberola Robles', 'Rafael', '2005-11-08', 'F', NULL, '900021817', '', NULL, NULL, 'Alberola Balderon', 'Jorge Silverio', NULL, '', 'Robles Fernandez', 'Gladis', '964720201', '', b'1'),
(17, 'DNI', '79190077', 'Alonso López', 'Francisca', '2005-02-03', 'F', '488318', '917136863', '', NULL, NULL, 'Alonso Barros', 'Kevin', NULL, '', 'López Diaz', 'Magdalena', NULL, '', b'1'),
(18, 'DNI', '74529930', 'Álvarado Martinez', 'Juan Carlos', '2006-01-17', 'M', '485625', '999018736', '', NULL, NULL, 'Álvarado Barboza', 'Michael', NULL, '', 'Martinez Vilchez', 'Berta', NULL, '', b'1'),
(19, 'DNI', '52714297', 'Arias Brenes', 'Guido Giancarlo', '2003-06-24', 'M', '455765', '947555043', '', NULL, NULL, 'Arias Bardales', 'Christian Daeive', '947236763', '', 'Brenes Cruzado', 'Doraly', NULL, '', b'1'),
(20, 'DNI', '25778260', 'Bastida Lopez', 'Dolores Margarita', '2007-03-04', 'F', '400375', '955070840', '', NULL, NULL, 'Bastida Bartolo', 'Jonas Darwin', '927903915', '', 'Lopez Tocto', 'Haydee', NULL, '', b'1'),
(21, 'DNI', '84601834', 'Blasco Boix', 'Jos? Manuel', '2006-09-30', 'M', '469563', '955464959', '', NULL, NULL, 'Blasco Balvin', 'Neyer Ivan', '930392751', '', 'Boix Uriol', 'Edith', NULL, '', b'1'),
(22, 'DNI', '86208143', 'Casas Bosca', 'Juan F?lix', '2003-06-12', 'M', '477441', '986304167', '', NULL, NULL, 'Casas Barzola', 'Michael Willian', '987738404', '', 'Bosca Baldera', 'Cory', NULL, '', b'1'),
(23, 'DNI', '29043534', 'Chavez Fallas', 'Liliana', '2005-05-02', 'F', '414840', '945826249', '', NULL, NULL, 'Chavez Bonilla', 'Mequias', '993488621', '', 'Fallas Alva', 'Mercedes', NULL, '', b'1'),
(24, 'DNI', '38657266', 'Cruz De Freitas', 'Marcos Paulo', '2006-08-10', 'M', '442712', '998517880', '', NULL, NULL, 'Cruz Bocanegra', 'Junior Jhasiro', '922930427', '', 'De Freitas Catpo', 'Militza', NULL, '', b'1'),
(25, 'DNI', '74742679', 'Fernández Talavera', 'Mar?a Luisa', '2003-01-20', 'F', '407137', '955110505', '', NULL, NULL, 'Fernández Borja', 'John Frank', '985295597', '', 'Talavera Diaz', 'Zulema', NULL, '', b'1'),
(26, 'DNI', '62833455', 'Flores Cantillano', 'Gernando Andr?s', '2007-09-30', 'M', '467193', '957415288', '', NULL, NULL, 'Flores Boza', 'Jaime', '967246574', '', 'Cantillano Ocampo', 'Luzmelita', NULL, '', b'1'),
(27, 'DNI', '84804541', 'García Blaya', '?ngela Sofia', '2005-01-25', 'F', NULL, '967105110', '', NULL, NULL, 'García Cabello', 'Reynaldo', '969910377', '', 'Blaya Arce', 'Dorali', '950632290', '', b'1'),
(28, 'DNI', '72830841', 'García Blaya', 'Mar?a Sonia', '2003-12-31', 'F', NULL, '901196560', '', NULL, NULL, 'García Cabanillas', 'Gilbert', '953134643', '', 'Blaya Arce', 'Dorali', '950632290', '', b'1'),
(29, 'DNI', '3170868', 'García García', 'Mar?a', '2006-11-17', 'F', NULL, '988182877', '', NULL, NULL, 'García Cabrera', 'Wilber', '924440964', '', 'García Huaman', 'Clarita', '958031062', '', b'1'),
(30, 'DNI', '28981540', 'García Gómez', 'Sonia', '2003-12-06', 'F', NULL, '922626668', '', NULL, NULL, 'García Cabia', 'Raul', '932139978', '', 'Minchan Gutierrez', 'Luz Clarita', '933488368', '', b'1'),
(31, 'DNI', '10469570', 'García Martínez', 'Andr?s Odilio', '2004-10-22', 'M', NULL, '962426153', '', NULL, NULL, 'García Cachay', 'Richard Raul', '950340931', '', 'Martínez Paucar', 'Patricia', '920105997', '', b'1'),
(32, 'DNI', '35261289', 'Garca Nicolás', 'Rosa Mar?a', '2003-09-06', 'F', NULL, '928319953', '', NULL, NULL, 'Garca Cajaleon', 'Victor', '951736299', '', 'Nicolás Mesia', 'Blanca', '920940279', '', b'1'),
(33, 'DNI', '45898445', 'Jiménez Manzano', 'Laura Del Rosario', '2007-10-30', 'F', NULL, '969335752', '', NULL, NULL, 'Jiménez Caceres', 'Manuel Guido', NULL, '', 'Manzano Espinoza', 'Xiomara', '903717042', '', b'1'),
(34, 'DNI', '22699649', 'López Calvo', 'Rebeca', '2006-04-12', 'M', NULL, '934614768', '', NULL, NULL, 'López Caicedo', 'Remigio', NULL, '', 'Calvo Machado', 'Medally', '985538389', '', b'1'),
(35, 'DNI', '30796276', 'López García', 'Andr?s', '2003-04-21', 'M', NULL, '978939666', '', NULL, NULL, 'López Cadillo', 'Javier', NULL, '', 'García Lazaro', 'Isabel', '952909129', '', b'1'),
(36, 'DNI', '66637196', 'López Rueda', 'Jose Javier', '2004-06-02', 'M', NULL, '929572233', '', NULL, NULL, 'López Caldas', 'Alex', NULL, '', 'Rueda Aranda', 'Maria Cecilia', NULL, '', b'1'),
(37, 'DNI', '61821438', 'Abad Chavez ', 'Romar Abad ', '2006-10-28', 'M', NULL, '988325569', 'Calle Motupe # 114', NULL, NULL, 'Abad Cajaleon', 'Jhans Carlos', NULL, NULL, 'Chavez Vasquez', 'Teresa', NULL, NULL, b'1'),
(38, 'DNI', '70080533', 'Acha Guerrero Acha Guerrero', 'Yasanali Yasanali Yasanali', '2004-05-19', 'F', NULL, '988118327', 'LOS TUMBOS NO LOS TUMBOS', NULL, NULL, 'Acha Casado', 'Juan Carlos', NULL, NULL, 'Guerrero Correa', 'Flor Isabel', NULL, NULL, b'1'),
(39, 'DNI', '75797998', 'Acosta Santisteban', 'Maria Gisela', '2004-08-08', 'F', NULL, '907796793', '', NULL, NULL, 'Acosta Casimiro', 'Michael', NULL, '', 'Santisteban Ita', 'Milagros Magaly', NULL, '', b'1'),
(40, 'DNI', '42179802', 'Acuña Cervantes', 'Elmer', '2006-11-15', 'M', '436223', '957923672', '', NULL, NULL, 'Acuña Casio', 'Emerson', NULL, '', 'Cervantes Malaspina', 'Lizbeth', NULL, '', b'1'),
(41, 'DNI', '72367755', 'Acuña Diaz', 'Alexander', '2005-10-07', 'M', '426694', '979354840', '', NULL, NULL, 'Acuña Casabona', 'Benito Gabriel', NULL, '', 'Diaz Medina', 'Giselle', NULL, '', b'1'),
(42, 'DNI', '76476977', 'Acuña Gil', 'Rosa Elvira', '2004-07-17', 'F', '430396', '995978265', '', NULL, NULL, 'Acuña Castillo', 'Ernesto', NULL, '', 'Gil Rocca', 'Fernanda Luisa', NULL, '', b'1'),
(43, 'DNI', '47478285', 'Acuña Marrufo', 'José Edgardo', '2004-02-08', 'M', '493337', '910075288', '', NULL, NULL, 'Acuña Casatañeda', 'Jenhs Joe', NULL, '', 'Marrufo Julcamoro', 'Teresa Isabel', NULL, '', b'1'),
(44, 'DNI', '44449653', 'Acuña Marrufo', 'Rosita Elvira', '2005-11-01', 'F', '480935', '944415847', '', NULL, NULL, 'Acuña Castro', 'Luis Alberto', NULL, '', 'Marrufo Minchon', 'Gianera', NULL, '', b'1'),
(45, 'DNI', '76512864', 'Acuña Reyna', 'Juan', '2003-01-28', 'M', '484929', '974397910', '', NULL, NULL, 'Acuña Caton', 'Yobert Rider', NULL, '', 'Reyna Perez', 'Mayra Patricia', NULL, '', b'1'),
(46, 'DNI', '43346228', 'Aguilar Coronado', 'Cecy Lucy', '2006-10-27', 'F', '480647', '941789170', '', NULL, NULL, 'Aguilar Trujillo', 'Jesus Felix', NULL, '', 'Coronado Palma', 'Vanessa', '903158771', '', b'1'),
(47, 'DNI', '46826585', 'Aguilar Garcia', 'Janeth Carolina', '2004-11-22', 'F', '424168', '995746127', '', NULL, NULL, 'Aguilar Solis', 'Rony', NULL, '', 'Garcia Chavez', 'Sara', '989932141', '', b'1'),
(48, 'DNI', '76795062', 'Aguilar Pérez', 'Mercy', '2005-10-16', 'F', '417304', '985029656', '', NULL, NULL, 'Aguilar Contreras', 'Ronald Smith', '938709040', '', 'Pérez Roncal', 'Janny Patricia', '996257102', '', b'1'),
(49, 'DNI', '76398007', 'Aguinaga Fernandez', 'Toni', '2004-06-03', 'M', '408927', '927535824', '', NULL, NULL, 'Aguinaga Campos', 'Jesus Javier', '927392044', '', 'Fernandez Flores', 'Adhely', '923397833', '', b'1'),
(50, 'DNI', '44729740', 'Alcantara Heredia', 'Lupita Kristal', '2007-09-12', 'F', '449915', '965365814', '', NULL, NULL, 'Alcantara Romero', 'Bruno', '979645049', '', 'Heredia Sanchez', 'Erika Luzmila', '947487935', '', b'1'),
(51, 'DNI', '45373642', 'Altamirano Espinoza', 'Anshela Janelly', '2004-11-10', 'F', '465748', '975793888', '', NULL, NULL, 'Altamirano Córdova', 'Willy', '949314658', '', 'Espinoza Saavedra', 'Jackeline', NULL, '', b'1'),
(52, 'DNI', '33649143', 'Banda Cervantes', 'Maria Zenaida', '2003-11-12', 'F', '404588', '921517763', '', NULL, NULL, 'Banda Cori', 'Edison', '984032767', '', 'Cervantes Ramos', 'Annyle Paola', NULL, '', b'1'),
(53, 'DNI', '40383677', 'Banda Cervantes', 'Nancy', '2003-05-18', 'F', '437782', '910907104', '', NULL, NULL, 'Banda Flores', 'Bolfgan Roy', '979937726', '', 'Cervantes Ticeran', 'Angela', NULL, '', b'1'),
(54, 'DNI', '46888936', 'Barba Leon', 'Cesar Alberto', '2004-08-29', 'M', '405262', '928991975', '', NULL, NULL, 'Barba Cornejo', 'Sergio', '974362850', '', 'Leon Silva', 'Brenda', NULL, '', b'1'),
(55, 'DNI', '71111415', 'Barboza Abad', 'Carolay Iveth', '2006-08-03', 'F', '436380', '982476222', '', NULL, NULL, 'Barboza Flores', 'Paolo Ronald', '905159087', '', 'Abad Torres', 'Teresa De Jesus', NULL, '', b'1'),
(56, 'DNI', '72790280', 'Barboza Cholan', 'Willian Armando', '2004-04-23', 'M', '444805', '940050628', '', NULL, NULL, 'Barboza Roque', 'Franco Juan', '961447737', '', 'Cholan Varas', 'Maria ', NULL, '', b'1'),
(57, 'DNI', '42209198', 'Barboza Davila', 'Elena', '2004-07-04', 'F', '494960', '971190857', '', NULL, NULL, 'Barboza Reque', 'Ernesto Luis', '903229632', '', 'Davila Rojas', 'Ines', NULL, '', b'1'),
(58, 'DNI', '74951687', 'Barboza Hurtado', 'Gisella', '2005-09-30', 'F', '473520', '953018647', '', NULL, NULL, 'Barboza Chamorro', 'Jose Felipe', '941561693', '', 'Hurtado Chavez', 'Ruth Rosa', NULL, '', b'1'),
(59, 'DNI', '46187084', 'Bardales Panta', 'Cristhian Roy', '2007-11-08', 'M', '444976', '985436336', '', NULL, NULL, 'Bardales Timoteo', 'Abel', '980646651', '', 'Panta Caballero', 'Vanessa Dayam', NULL, '', b'1'),
(60, 'DNI', '48094458', 'Barragan Izquierdo', 'Harletti Martha Mugny', '2005-06-14', 'F', NULL, '958530793', '', NULL, NULL, 'Barragan Cortez', 'Dennys David', '941334712', '', 'Izquierdo Cancha', 'Mariluz Edilia', NULL, '', b'1'),
(61, 'DNI', '73111499', 'Barrantes Delgado', 'Natalhy Del Pilar', '2003-08-02', 'F', NULL, '975135510', '', NULL, NULL, 'Barrantes Cotrina', 'Ruben', '991133414', '', 'Delgado Zorrilla', 'Eda Maritza', '941203328', '', b'1'),
(62, 'DNI', '43705925', 'Barranzuela Jimenez', 'Randy Edu', '2006-01-20', 'M', NULL, '979519233', '', NULL, NULL, 'Barranzuela Justo', 'Huber', '938053028', '', 'Jimenez Alvarado', 'Estefany Norma', '946100390', '', b'1'),
(63, 'DNI', '10115355', 'Barreto Delgado', 'Jacqueline Dolores', '2005-09-24', 'F', NULL, '966684374', '', NULL, NULL, 'Barreto Deza', 'Roman Arturo', NULL, '', 'Delgado Chiquillo', 'Mily Pilar', '987328918', '', b'1'),
(64, 'DNI', '72731392', 'Cabanillas Correa', 'Kattia', '2005-08-03', 'F', NULL, '997133309', '', NULL, NULL, 'Cabanillas Davila', 'Ever', NULL, '', 'Correa Castro', 'Mirelle Stephany', '929622848', '', b'1'),
(65, 'DNI', '46914489', 'Cabanillas Diaz', 'Hulda Libni', '2006-04-13', 'F', NULL, '985299120', '', NULL, NULL, 'Cabanillas De La Calle', 'Vladimir', NULL, '', 'Diaz Espinoza', 'Greyci', '931956718', '', b'1'),
(66, 'DNI', '48141788', 'Cabanillas Rabanal', 'Edelia Yuliana', '2006-09-23', 'F', NULL, '900367031', '', NULL, NULL, 'Cabanillas Bravo', 'Percy', NULL, '', 'Rabanal Figueroa', 'Blanca', '992391303', '', b'1'),
(67, 'DNI', '47635540', 'Cabanillas Reyna', 'Melissa', '2007-04-28', 'F', NULL, '964534529', '', NULL, NULL, 'Cabanillas Broncano', 'Rodolfo', NULL, '', 'Reyna Gomez', 'Mariela', '977677192', '', b'1'),
(68, 'DNI', '71829747', 'Cáceres Malca', 'Karem Saraí', '2006-04-21', 'F', NULL, '957013802', '', NULL, NULL, 'Cáceres Cruz', 'Alejandro', NULL, '', 'Malca Barreto', 'Blanca Cesilia', '939378737', '', b'1'),
(69, 'DNI', '71095100', 'Diaz Cruz', 'Cinthia Liliana', '2004-04-27', 'F', NULL, '987795098', '', NULL, NULL, 'Diaz Cabello', 'Carlos Edil', NULL, '', 'Cruz Trejo', 'Lourdes', NULL, '', b'1'),
(70, 'DNI', '46490465', 'Delgado Perez', 'Saema Rubi', '2007-08-21', 'F', NULL, '998618518', '', NULL, NULL, 'Delgado Cespedes', 'Yori Yoon', NULL, '', 'Perez Macedo', 'Gloria Edith', NULL, '', b'1'),
(71, 'DNI', '46295545', 'Fernandez Bernal', 'Maria Leidy', '2003-08-23', 'F', NULL, '978911900', '', NULL, NULL, 'Fernandez Cheppe', 'Sixto Raul', NULL, '', 'Bernal Luna', 'Karen Selene', NULL, '', b'1'),
(72, 'DNI', '41618402', 'Fernandez Campos', 'Silvia', '2005-04-29', 'F', NULL, '972601717', '', NULL, NULL, 'Fernandez Zevallos', 'Sandro', NULL, '', 'Campos Meza', 'Melva', NULL, '', b'1'),
(73, 'DNI', '45914683', 'Flores Crespo', 'Giovana Sthefani', '2006-11-24', 'F', '439740', '974044025', '', NULL, NULL, 'Flores Matias', 'Julio', NULL, '', 'Crespo Ureta', 'Mayumi', NULL, '', b'1'),
(74, 'DNI', '72210217', 'Flores Parinango', 'Consuelo Juneth', '2003-08-09', 'F', '411164', '988516352', '', NULL, NULL, 'Flores Alejo', 'Federico Emerzon', NULL, '', 'Parinango Molina', 'Dominga', NULL, '', b'1'),
(75, 'DNI', '42435168', 'Gabriel Ticlla', 'Maria Magdalena', '2007-08-15', 'F', '432566', '997908461', '', NULL, NULL, 'Gabriel Figueredo', 'William', NULL, '', 'Ticlla Palomino', 'Karen ', NULL, '', b'1'),
(76, 'DNI', '76201700', 'Gálvez Calderón', 'Guisela', '2006-12-09', 'F', '465860', '990616052', '', NULL, NULL, 'Gálvez Ponce', 'Héctor', NULL, '', 'Calderón Mejia', 'Gaby Pilar', NULL, '', b'1'),
(77, 'DNI', '72166339', 'Gil Perez', 'Ghisela Lisseth', '2004-06-03', 'F', '441165', '972947498', '', NULL, NULL, 'Gil Diaz', 'Guillermo Renato', NULL, '', 'Perez Santos', 'Dina', NULL, '', b'1'),
(78, 'DNI', '16711696', 'Gonzales Morales', 'Ruth Kelly', '2006-10-02', 'F', '482484', '962972628', '', NULL, NULL, 'Gonzales Pozo', 'Luis Gustabo', '989829825', '', 'Morales Salvador', 'Norka', NULL, '', b'1'),
(79, 'DNI', '44733989', 'Hernandez Penas', 'Linda Greinsy', '2004-06-21', 'F', '479266', '990315445', '', NULL, NULL, 'Hernandez Vilca', 'Remigio', '900266981', '', 'Penas Santos', 'Veronica', '935125680', '', b'1'),
(80, 'DNI', '70999965', 'Herrera Cieza', 'Elisbeth', '2007-05-04', 'F', '481791', '976929379', '', NULL, NULL, 'Herrera Jesus', 'Jerson', '918624186', '', 'Cieza Alvarez', 'Mireya', '921404842', '', b'1'),
(81, 'DNI', '47853109', 'Huaman Silva', 'Luis Guilmer', '2003-03-22', 'M', '493476', '933017890', '', NULL, NULL, 'Huaman Santa', 'Jhosimar', '970933323', '', 'Silva Lazaro', 'Karina Lourdes', '957256973', '', b'1'),
(82, 'DNI', '71910126', 'Irigoin Neira', 'Alfonso', '2005-09-04', 'M', '406975', '952452363', '', NULL, NULL, 'Irigoin Gonzales', 'Fredy David', '952270660', '', 'Neira Santa Cruz', 'Antonieta', '941476337', '', b'1'),
(83, 'DNI', '16692016', 'Inchaustegui Degola', 'Jose Paolo', '2007-11-16', 'M', NULL, '984680974', '', NULL, NULL, 'Inchaustegui Marrujo', 'Juan Carlos', '950490955', '', 'Degola Rivas', 'Nancy', '956126209', '', b'1'),
(84, 'DNI', '41283168', 'Julian Fernandez', 'Maria Mercedes', '2007-11-07', 'F', NULL, '941746848', '', NULL, NULL, 'Julian Falcón', 'Carlos Alberto', NULL, '', 'Fernandez Pantoja', 'Grimaldina', NULL, '', b'1'),
(85, 'DNI', '70902618', 'Julca Tello', 'Maritza Llanet', '2005-10-26', 'F', NULL, '927387648', '', NULL, NULL, 'Julca Colqui', 'Olimpio', NULL, '', 'Tello Guzman', 'Diana', NULL, '', b'1'),
(86, 'DNI', '43478463', 'Jimenez Carrasco', 'Jose Victor', '2007-08-05', 'M', NULL, '915607021', '', NULL, NULL, 'Jimenez Galindo', 'Roberto Carlos', NULL, '', 'Carrasco Medrano', 'Arelis Marleny', NULL, '', b'1'),
(87, 'DNI', '61914187', 'Leon Castillo', 'Reyner Gabriel', '2005-08-08', 'F', NULL, '967305555', '', NULL, NULL, 'Leon Dionicio', 'Javier', NULL, '', 'Castillo Soto', 'Anita', NULL, '', b'1'),
(88, 'DNI', '33674208', 'La Madrid SalinaS', 'Aldemir Daghir', '2007-04-08', 'M', NULL, '910740346', '', NULL, NULL, 'La Madrid Espinoza', 'Tony', NULL, '', 'Salinas Salcedo', 'Jezzy', NULL, '', b'1'),
(89, 'DNI', '47476191', 'Leon Sepulveda', 'Giovanni', '2007-10-20', 'F', NULL, '957155812', '', NULL, NULL, 'Leon Alejandro', 'Hector Demetrio', NULL, '', 'Sepulveda Torres', 'Gabriela', NULL, '', b'1'),
(90, 'DNI', '73318797', 'Linares Carhuajulca', 'Miriam Yudith', '2006-01-20', 'F', NULL, '955575430', '', NULL, NULL, 'Linares Bueno', 'Emerson', NULL, '', 'Carhuajulca Diaz', 'Miriam', NULL, '', b'1'),
(91, 'DNI', '42777315', 'Macalupu Rodriguez', 'Rosmery Madeleine', '2006-06-14', 'F', NULL, '909177169', '', NULL, NULL, 'Macalupu Espíritu', 'Daniel Hermelindo', NULL, '', 'Rodriguez Guizado', 'Luz Amparo', NULL, '', b'1'),
(92, 'DNI', '71084642', 'Malca Cruz', 'Carlos Darwin', '2003-02-28', 'M', NULL, '959112363', '', NULL, NULL, 'Malca Dominguez', 'Dare', NULL, '', 'Cruz Cardenas', 'Sumara Luz', NULL, '', b'1'),
(93, 'DNI', '78020242', 'Malca Delgado', 'Ana Isabel', '2007-09-04', 'F', NULL, '978010272', '', NULL, NULL, 'Malca Gomez', 'Jaime', NULL, '', 'Delgado Quilla', 'Camilia Lucia', NULL, '', b'1'),
(94, 'DNI', '44747099', 'Mera Mori', 'Juan Jose', '2006-12-17', 'M', NULL, '984349968', '', NULL, NULL, 'Mera Mariño', 'Joel', NULL, '', 'Mori Arana', 'Sofia', '926898941', '', b'1'),
(95, 'DNI', '70070480', 'Melendez Rojas', 'Manuel Gabriel', '2007-03-24', 'M', NULL, '961938069', '', NULL, NULL, 'Melendez Duran', 'Jair ', NULL, '', 'Rojas Quispe', 'Gabriela Pamela', '933028382', '', b'1'),
(96, 'DNI', '47918678', 'Nuñez Peralta', 'Jojana Lizet', '2003-08-16', 'F', '413365', '999976367', '', NULL, NULL, 'Nuñez Palacios', 'Rufino Joel', NULL, '', 'Peralta Chura', 'Ruby ', '920825990', '', b'1'),
(97, 'DNI', '72731413', 'Nuñez Torres', 'Raul Martin', '2004-11-24', 'M', '448060', '988368329', '', NULL, NULL, 'Nuñez Mariño', 'Angel Gabriel', NULL, '', 'Torres Condori', 'Marat', '996665515', '', b'1'),
(98, 'DNI', '42949047', 'Oblitas Davila', 'Amberle', '2003-02-15', 'F', '465462', '980224190', '', NULL, NULL, 'Oblitas Ramos', 'Lazaro Carlos', NULL, '', 'Davila Castelo', 'Miriam Daniela', '906779224', '', b'1'),
(99, 'DNI', '70071681', 'Obando Barboza', 'Kristian Davis', '2007-12-14', 'M', '488801', '965963122', '', NULL, NULL, 'Obando Evaristo', 'Efrain', '950255564', '', 'Barboza Cortez', 'Mayra Isabel', NULL, '', b'1'),
(100, 'DNI', '46565370', 'Olivera Ordoñez', 'Kety Margoth', '2007-09-28', 'F', '410585', '977973750', '', NULL, NULL, 'Olivera Alejo', 'Ever Jair', '913569942', '', 'Ordoñez Castelo', 'Zenaida', NULL, '', b'1'),
(101, 'DNI', '77042995', 'Ortiz Delgado', 'Flor Hermelinda', '2007-03-24', 'F', '490384', '940499601', '', NULL, NULL, 'Ortiz Criollo', 'Elisio', '974165436', '', 'Delgado Medina', 'Elgia', NULL, '', b'1'),
(102, 'DNI', '47221131', 'Pacheco Pintado', 'Marcos Jhonatan', '2007-12-04', 'M', '435843', '919838605', '', NULL, NULL, 'Pacheco Noreña', 'Nicolas', '934752890', '', 'Pintado Vilca', 'Katerine', NULL, '', b'1'),
(103, 'DNI', '48042646', 'Padilla Vasquez', 'Danitza Gisenia', '2005-09-11', 'F', '440027', '932728811', '', NULL, NULL, 'Padilla Benites', 'Gustavo', NULL, '', 'Vasquez Cosi', 'Yulissa', NULL, '', b'1'),
(104, 'DNI', '70396966', 'Padilla Vidarte', 'Maribel', '2004-05-09', 'F', '487864', '915146561', '', NULL, NULL, 'Padilla Orbezo', 'Liberato Elisio', NULL, '', 'Vidarte Cabana', 'Rocio', NULL, '', b'1'),
(105, 'DNI', '46856801', 'Palacios Aguilar', 'Teidy Ivan', '2003-03-11', 'F', '492916', '968221664', '', NULL, NULL, 'Palacios Ramos', 'Lazaro', NULL, '', 'Aguilar Montes', 'Sharon', NULL, '', b'1'),
(106, 'DNI', '70397076', 'Palmer Vigil', 'Milton Eduardo', '2006-02-09', 'F', NULL, '975626622', '', NULL, NULL, 'Palmer Retis', 'Gilberto', NULL, '', 'Vigil Ojeda', 'Pierina', NULL, '', b'1'),
(107, 'DNI', '70070396', 'Paredes Torres', 'Karen Lucely', '2007-03-07', 'F', NULL, '960477016', '', NULL, NULL, 'Paredes Maiz', 'Rosmel', NULL, '', 'Torres Collazos', 'Antonina', NULL, '', b'1'),
(108, 'DNI', '47538478', 'Rafael Quispe', 'Lita', '2003-03-21', 'F', NULL, '912494631', '', NULL, NULL, 'Rafael Espejo', 'Leonardo', NULL, '', 'Quispe Lima', 'Martha', NULL, '', b'1'),
(109, 'DNI', '73534041', 'Ramirez Cajahuaringa', 'Lleyzon Esmic', '2004-05-21', 'F', NULL, '906383826', '', NULL, NULL, 'Ramirez Espinoza', 'Oscar', NULL, '', 'Cajahuaringa Santillana', 'Alexandra', '932895470', '', b'1'),
(110, 'DNI', '60647745', 'Ramirez Cruz', 'Mariela Brigitt', '2004-09-25', 'F', NULL, '964909932', '', NULL, NULL, 'Ramirez Alvarado', 'Luciano', NULL, '', 'Cruz Cañazca', 'Solange', '966306829', '', b'1'),
(111, 'DNI', '47817557', 'Ramirez Delgado', 'Jose Neiser', '2004-05-11', 'M', NULL, '906871643', '', NULL, NULL, 'Ramirez Rubio', 'Elmer', NULL, '', 'Delgado Del Carpio', 'Idalia', '955472585', '', b'1'),
(112, 'DNI', '73660565', 'Risco Abad', 'Fernando Heinz', '2003-10-12', 'M', NULL, '976829581', '', NULL, NULL, 'Risco Avila', 'Bernardino', NULL, '', 'Abad Solis', 'Carmen', '913251919', '', b'1'),
(113, 'DNI', '70070446', 'Rivera Leo', 'Angelica Fabiana', '2005-01-07', 'F', NULL, '979186858', '', NULL, NULL, 'Rivera Herrera', 'Jefferson', NULL, '', 'Leo Mojo', 'Candy', '973591530', '', b'1'),
(114, 'DNI', '77036757', 'Rodas Aguilar', 'Clin Brandoli', '2007-02-03', 'M', NULL, '945233135', '', NULL, NULL, 'Rodas Vilela', 'Yover', NULL, '', 'Aguilar Pauca', 'Karla Luz', '941267001', '', b'1'),
(115, 'DNI', '74311928', 'Rivera Vicente', 'Junior Ivan', '2006-07-07', 'M', NULL, '996981018', '', NULL, NULL, 'Rivera Navidad', 'Keiner', NULL, '', 'Vicente Teves', 'Rosa Leydi', NULL, '', b'1'),
(116, 'DNI', '73534140', 'Saavedra Pinedo', 'Luis Alberto', '2003-09-24', 'M', NULL, '901940021', '', NULL, NULL, 'Saavedra Arias', 'Caleb', NULL, '', 'Pinedo Bautista', 'Maria', NULL, '', b'1'),
(117, 'DNI', '73315386', 'Salazar Cardozo', 'Yana Yarabeli', '2007-07-04', 'F', NULL, '913959213', '', NULL, NULL, 'Salazar Azucena', 'Raymundo', NULL, '', 'Cardozo Alarcon', 'Yovani', NULL, '', b'1'),
(118, 'DNI', '74366802', 'Sanchez Hoyos', 'Yenifer Suiguey', '2005-04-08', 'F', NULL, '914610313', '', NULL, NULL, 'Sanchez Balvin', 'Heber', '901785068', '', 'Hoyos Arevalo', 'Thalia', NULL, '', b'1'),
(119, 'DNI', '43405279', 'Sanchez Rivera', 'Lleny Rocio', '2004-07-15', 'F', '438001', '954507558', '', NULL, NULL, 'Sanchez Alarcon', 'Richard ', '912804928', '', 'Rivera Contreras', 'Betty', NULL, '', b'1'),
(120, 'DNI', '47426937', 'Tapia Martinez', 'Ana Maria', '2005-10-23', 'F', '411783', '930729110', '', NULL, NULL, 'Tapia Aquino', 'Juan Felix', '903899564', '', 'Martinez Garcia', 'Yocani Rene', NULL, '', b'1'),
(121, 'DNI', '45748228', 'Tantalean Marin', 'Neyser', '2007-01-11', 'M', '494665', '910248407', '', NULL, NULL, 'Tantalean Vizcarra', 'Edwin', '917362552', '', 'Marin Castro', 'Deysi', NULL, '', b'1'),
(122, 'DNI', '46921716', 'Tarrillo Flores', 'Gisela', '2003-12-20', 'F', '429354', '914940992', '', NULL, NULL, 'Tarrillo Ruiz', 'Rolando', '953196697', '', 'Flores Fernandez', 'Rosmery', NULL, '', b'1'),
(123, 'DNI', '33668958', 'Torres Saavedra', 'Maria Noemi', '2007-07-01', 'F', '484813', '945857349', '', NULL, NULL, 'Torres Rosales', 'Alejandro', '960884905', '', 'Saavedra Jeri', 'Mayra ', NULL, '', b'1'),
(124, 'DNI', '43000571', 'Torres Nuñez', 'Berzabeth Veronica', '2003-05-02', 'F', '484936', '968143633', '', NULL, NULL, 'Torres Regalado', 'Pedro Alex', '933743393', '', 'Nuñez Huaman', 'Gina Marissa', NULL, '', b'1'),
(125, 'DNI', '45334361', 'Torres Tenorio', 'Maria Mily', '2005-04-09', 'F', '454159', '921531013', '', NULL, NULL, 'Torres Perez', 'Victor Ismael', '954100317', '', 'Tenorio Hinostroza', 'Mayra', '938566441', '', b'1'),
(126, 'DNI', '75719269', 'Uriol Rojas', 'Karina Liseth', '2003-08-07', 'F', '417894', '961930951', '', NULL, NULL, 'Uriol Guevara', 'Feliciano', '946396077', '', 'Rojas Felices', 'Maribel', '934057150', '', b'1'),
(127, 'DNI', '76371246', 'Uriarte Ramos', 'Rosaura', '2005-02-25', 'F', '491381', '981142914', '', NULL, NULL, 'Uriarte Cayco', 'Cesar', '962675788', '', 'Ramos Mauricio ', 'Elizabeth', '930579147', '', b'1'),
(128, 'DNI', '75392370', 'Vargas Linares', 'Yennifer Lisseth', '2004-11-13', 'F', '449483', '994239213', '', NULL, NULL, 'Vargas Cebrian', 'France Edgar', '903506576', '', 'Linares Montes', 'Antonia', '902475890', '', b'1'),
(129, 'DNI', '74758099', 'Valderrama Ruiz', 'Maryori Steissy', '2007-04-27', 'F', '430620', '976690547', '', NULL, NULL, 'Valderrama Nieto', 'Iván', NULL, '', 'Ruiz Carbajal', 'Zuleika', '932019461', '', b'1'),
(130, 'DNI', '73701815', 'Vásquez Guerrero', 'Shirley', '2005-03-24', 'F', NULL, '940586893', '', NULL, NULL, 'Vásquez Esteban', 'Valentin', NULL, '', 'Guerrero Morales', 'Kendra', NULL, '', b'1'),
(131, 'DNI', '73317145', 'Vásquez Guerrero', 'Keyla', '2004-04-23', 'F', NULL, '927571884', '', NULL, NULL, 'Vásquez Celadita', 'Marco Antonio', NULL, '', 'Guerrero Bautista', 'Manuela', NULL, '', b'1'),
(132, 'DNI', '33578773', 'Vasquez Mayra', 'Sonia Magaly', '2006-06-18', 'F', NULL, '938166337', '', NULL, NULL, 'Vasquez Celestino', 'Alejandrino', NULL, '', 'Mayra Rimachi', 'Gloria', NULL, '', b'1'),
(133, 'DNI', '16785041', 'Vega Davila', 'William Enrique', '2007-07-28', 'M', NULL, '912370350', '', NULL, NULL, 'Vega Hurtado', 'Abdon', NULL, '', 'Davila Sanchez', 'Loida', NULL, '', b'1'),
(134, 'DNI', '70560329', 'Vega Fernandez', 'Ramcin Anibal', '2004-11-09', 'M', NULL, '900511680', '', NULL, NULL, 'Vega Cabello', 'Aaron Misael', NULL, '', 'Fernandez Vargas', 'Catherin', NULL, '', b'1'),
(135, 'DNI', '45444834', 'Vega Terrones', 'Esteban', '2006-03-26', 'M', NULL, '986833092', '', NULL, NULL, 'Vega Celis', 'Miguel Angel', NULL, '', 'Terrones Gomez', 'Erika', NULL, '', b'1'),
(136, 'DNI', '44763486', 'Vilchez Castro', 'Raquel', '2006-10-26', 'M', NULL, '995116046', '', NULL, NULL, 'Vilchez Centuno', 'Jhon', NULL, '', 'Castro Gamboa', 'Silvia Sonia', NULL, '', b'1'),
(137, 'DNI', '41650274', 'Villalobos Bellodas', 'Carlos Edison', '2003-06-07', 'M', NULL, '970115570', '', NULL, NULL, 'Villalobos Vargas', 'David', NULL, '', 'Bellodas De La Cruz', 'Rocio', NULL, '', b'1'),
(138, 'DNI', '75263049', 'Villalobos Herrera', 'Arbel', '2006-05-03', 'M', NULL, '951178856', '', NULL, NULL, 'Villalobos Jaramillo', 'Oliver Milton', NULL, '', 'Herrera Leon', 'Maribel Rocio', NULL, '', b'1'),
(139, 'DNI', '74421368', 'Zamora Diaz', 'Joel', '2007-12-12', 'M', NULL, '984406561', '', NULL, NULL, 'Zamora Chavez', 'Carlos Alberto', NULL, '', 'Diaz Montoya', 'Nancy Elizabth', NULL, '', b'1'),
(140, 'DNI', '48193928', 'Zamora Perez', 'Elias', '2005-03-29', 'M', NULL, '988903562', '', NULL, NULL, 'Zamora Solis', 'Wildo Wilfredo', NULL, '', 'Perez Jimenez', 'Zoraida', '910852396', '', b'1'),
(141, 'DNI', '72914649', 'Zegarra Olano', 'Sheyla Stefany', '2003-02-24', 'F', NULL, '952477972', '', NULL, NULL, 'Zegarra Chogas', 'Roger Abel', NULL, '', 'Olano Medina', 'Leyda Madeli', '957631005', '', b'1'),
(142, 'DNI', '47406897', 'Zelada Medina', 'Jusbelly Jamali', '2004-04-14', 'F', NULL, '912335923', '', NULL, NULL, 'Zelada Chinguel', 'Jhon Willian', NULL, '', 'Medina Galan', 'Lisset Vanesa', '931936960', '', b'1'),
(143, 'DNI', '76831964', 'Zuta Reyna', 'Marco Antonio', '2007-03-28', 'M', '472681', '942086226', '', NULL, NULL, 'Zuta Alanya', 'Oscar Alfredo', NULL, '', 'Reyna Perez', 'Laura Raquel', '945089569', '', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `anhio_lectivo`
--

CREATE TABLE `anhio_lectivo` (
  `idanhio` tinyint(4) NOT NULL,
  `anhio_lectivo` char(4) NOT NULL,
  `finicio_anhio` date NOT NULL,
  `ffin_anhio` date NOT NULL,
  `descripcion_anhio` varchar(150) DEFAULT NULL,
  `condicion_anhio` char(1) NOT NULL DEFAULT 'A',
  `estado_anhio` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `anhio_lectivo`
--

INSERT INTO `anhio_lectivo` (`idanhio`, `anhio_lectivo`, `finicio_anhio`, `ffin_anhio`, `descripcion_anhio`, `condicion_anhio`, `estado_anhio`) VALUES
(1, '2018', '2018-01-31', '2018-12-31', NULL, 'C', b'0'),
(2, '2019', '2019-01-31', '2019-12-31', NULL, 'C', b'0'),
(13, '2017', '2017-01-01', '2017-12-31', NULL, 'C', b'0'),
(14, '2019', '2019-01-01', '2019-12-31', NULL, 'A', b'0'),
(15, '2019', '2019-01-01', '2019-12-31', NULL, 'C', b'0'),
(16, '2018', '2018-01-01', '2018-12-31', 'asfjasjf asjf asfjgask jagsfkjasf kjas  aksjfaskjfk g asfjkasgfkasjfg kjas gfaskjfgaskjfgaskjfasg agksjfasgfjaskfjasgf asjkf jaksfgasj asfgjaskgfaksjf', 'C', b'0'),
(17, '2017', '2017-01-01', '2017-12-31', NULL, 'C', b'0'),
(18, '2016', '2016-01-01', '2016-12-31', NULL, 'C', b'0'),
(19, '2015', '2015-01-01', '2015-12-31', NULL, 'C', b'0'),
(20, '2014', '2014-01-01', '2014-12-31', NULL, 'A', b'0'),
(21, '2013', '2013-01-01', '2013-12-31', NULL, 'C', b'0'),
(22, '2018', '2018-01-01', '2018-12-31', NULL, 'C', b'1'),
(23, '2019', '2019-01-01', '2019-12-31', NULL, 'A', b'1'),
(24, '2017', '2017-01-01', '2017-12-31', NULL, 'C', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `apoderado`
--

CREATE TABLE `apoderado` (
  `id_apoderado` smallint(6) NOT NULL,
  `tdoc_apoderado` char(3) NOT NULL,
  `doc_apoderado` varchar(15) NOT NULL,
  `apellidos_apoderado` varchar(60) NOT NULL,
  `nombres_apoderado` varchar(50) NOT NULL,
  `sexo_apoderado` char(1) NOT NULL,
  `celular_apoderado` char(9) NOT NULL,
  `direccion_apoderado` varchar(80) NOT NULL,
  `correo_apoderado` varchar(80) DEFAULT NULL,
  `estado_apoderado` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `apoderado`
--

INSERT INTO `apoderado` (`id_apoderado`, `tdoc_apoderado`, `doc_apoderado`, `apellidos_apoderado`, `nombres_apoderado`, `sexo_apoderado`, `celular_apoderado`, `direccion_apoderado`, `correo_apoderado`, `estado_apoderado`) VALUES
(1, 'OTR', '751678654MVEN84', 'Flores Abad', 'Adler Mauro', 'M', '929151181', '', NULL, b'1'),
(2, 'DNI', '17835487', 'Rubio Abad', 'Samuel', 'M', '983228426', '', NULL, b'1'),
(3, 'DNI', '14853811', 'Arroyo Abanto', 'Edzon ', 'M', '965426036', '', NULL, b'1'),
(4, 'DNI', '12662600', 'Carpio Abila', 'Melchor Rogelio', 'M', '904781140', '', NULL, b'1'),
(5, 'DNI', '12799608', 'Caycho Accilio', 'Henry', 'M', '967191826', '', NULL, b'1'),
(6, 'DNI', '10776514', 'Cieza Acharte', 'Jhonatan', 'M', '987130615', '', NULL, b'1'),
(7, 'DNI', '13100972', 'Dumet Acosta', 'Fernando', 'M', '993977501', '', NULL, b'1'),
(8, 'DNI', '16616475', 'Fujishima Abendaño', 'Nicolas', 'M', '918480901', '', NULL, b'1'),
(9, 'DNI', '18259879', 'Longa Zuñiga', 'Miguel Angel', 'M', '977660792', '', NULL, b'1'),
(10, 'DNI', '12945311', 'Miranda Aguirre', 'Dan Nefeg', 'M', '938701183', '', NULL, b'1'),
(11, 'DNI', '15143793', 'Ramirez Aique', 'Enrique', 'M', '912774475', '', NULL, b'1'),
(12, 'DNI', '13996271', 'Tapia Agüero', 'Neyl Paul', 'M', '947124162', '', NULL, b'1'),
(13, 'DNI', '15980886', 'Tovar Alanya', 'Estiven Rafael', 'M', '942705196', '', NULL, b'1'),
(14, 'DNI', '12572783', 'Vergara Alarcon', 'Luis', 'M', '906262108', '', NULL, b'1'),
(15, 'DNI', '15428861', 'Aguado Baltazar', 'Wilfredo', 'M', '933540808', '', NULL, b'1'),
(16, 'DNI', '12121792', 'Alberola Balderon', 'Jorge Silverio', 'M', '920214500', '', NULL, b'1'),
(17, 'DNI', '11522078', 'Alonso Barros', 'Kevin', 'M', '965521963', '', NULL, b'1'),
(18, 'DNI', '14865253', 'Álvarado Barboza', 'Michael', 'M', '972693949', '', NULL, b'1'),
(19, 'DNI', '13495791', 'Arias Bardales', 'Christian Daeive', 'M', '947236763', '', NULL, b'1'),
(20, 'DNI', '16984051', 'Bastida Bartolo', 'Jonas Darwin', 'M', '927903915', '', NULL, b'1'),
(21, 'DNI', '10789251', 'Blasco Balvin', 'Neyer Ivan', 'M', '930392751', '', NULL, b'1'),
(22, 'DNI', '13789955', 'Casas Barzola', 'Michael Willian', 'M', '987738404', '', NULL, b'1'),
(23, 'DNI', '16346494', 'Chavez Bonilla', 'Mequias', 'M', '993488621', '', NULL, b'1'),
(24, 'DNI', '12475496', 'Cruz Bocanegra', 'Junior Jhasiro', 'M', '922930427', '', NULL, b'1'),
(25, 'DNI', '11028007', 'Talavera Diaz', 'Zulema', 'F', '989151779', '', NULL, b'1'),
(26, 'DNI', '16617660', 'Cantillano Ocampo', 'Luzmelita', 'F', '941456123', '', NULL, b'1'),
(27, 'DNI', '18241214', 'Blaya Arce', 'Dorali', 'F', '950632290', '', NULL, b'1'),
(28, 'DNI', '17206881', 'Blaya Arce', 'Dorali', 'F', '950632290', '', NULL, b'1'),
(29, 'DNI', '17686224', 'García Huaman', 'Clarita', 'F', '958031062', '', NULL, b'1'),
(30, 'DNI', '15215578', 'Minchan Gutierrez', 'Luz Clarita', 'F', '933488368', '', NULL, b'1'),
(31, 'DNI', '14293627', 'Martínez Paucar', 'Patricia', 'F', '920105997', '', NULL, b'1'),
(32, 'DNI', '19801680', 'Nicolás Mesia', 'Blanca', 'F', '920940279', '', NULL, b'1'),
(33, 'DNI', '13896705', 'Manzano Espinoza', 'Xiomara', 'F', '903717042', '', NULL, b'1'),
(34, 'DNI', '13757095', 'Calvo Machado', 'Medally', 'F', '985538389', '', NULL, b'1'),
(35, 'DNI', '14071687', 'García Lazaro', 'Isabel', 'F', '952909129', '', NULL, b'1'),
(36, 'DNI', '19503417', 'Rueda Aranda', 'Maria Cecilia', 'F', '918634714', '', NULL, b'1'),
(37, 'DNI', '10344890', 'Chavez Vasquez', 'Teresa', 'F', '938943931', '', NULL, b'1'),
(38, 'DNI', '10285565', 'Guerrero Correa', 'Flor Isabel', 'F', '919557837', '', NULL, b'1'),
(39, 'DNI', '11259346', 'Santisteban Ita', 'Milagros Magaly', 'F', '923234541', '', NULL, b'1'),
(40, 'DNI', '18602094', 'Cervantes Malaspina', 'Lizbeth', 'F', '948165732', '', NULL, b'1'),
(41, 'DNI', '17471469', 'Diaz Medina', 'Giselle', 'F', '950101407', '', NULL, b'1'),
(42, 'DNI', '13609446', 'Gil Rocca', 'Fernanda Luisa', 'F', '997764600', '', NULL, b'1'),
(43, 'DNI', '18316476', 'Marrufo Julcamoro', 'Teresa Isabel', 'F', '969063943', '', NULL, b'1'),
(44, 'DNI', '13521095', 'Marrufo Minchon', 'Gianera', 'F', '932030645', '', NULL, b'1'),
(45, 'DNI', '17175729', 'Reyna Perez', 'Mayra Patricia', 'F', '959483581', '', NULL, b'1'),
(46, 'DNI', '13162843', 'Coronado Palma', 'Vanessa', 'F', '903158771', '', NULL, b'1'),
(47, 'DNI', '18260042', 'Garcia Chavez', 'Sara', 'F', '989932141', '', NULL, b'1'),
(48, 'DNI', '14043575', 'Pérez Roncal', 'Janny Patricia', 'F', '996257102', '', NULL, b'1'),
(49, 'DNI', '13317705', 'Fernandez Flores', 'Adhely', 'F', '923397833', '', NULL, b'1'),
(50, 'DNI', '10574796', 'Heredia Sanchez', 'Erika Luzmila', 'F', '947487935', '', NULL, b'1'),
(51, 'DNI', '11612714', 'Espinoza Saavedra', 'Jackeline', 'F', '907717533', '', NULL, b'1'),
(52, 'DNI', '18318943', 'Cervantes Ramos', 'Annyle Paola', 'F', '919338300', '', NULL, b'1'),
(53, 'DNI', '11895529', 'Cervantes Ticeran', 'Angela', 'F', '995647047', '', NULL, b'1'),
(54, 'DNI', '12417239', 'Leon Silva', 'Brenda', 'F', '997727840', '', NULL, b'1'),
(55, 'DNI', '15545870', 'Abad Torres', 'Teresa De Jesus', 'F', '916005010', '', NULL, b'1'),
(56, 'DNI', '17771572', 'Cholan Varas', 'Maria ', 'F', '992226814', '', NULL, b'1'),
(57, 'DNI', '16884035', 'Davila Rojas', 'Ines', 'F', '902729380', '', NULL, b'1'),
(58, 'DNI', '15827075', 'Hurtado Chavez', 'Ruth Rosa', 'F', '944850967', '', NULL, b'1'),
(59, 'DNI', '19898606', 'Panta Caballero', 'Vanessa Dayam', 'F', '911481605', '', NULL, b'1'),
(60, 'DNI', '14201438', 'Barragan Cortez', 'Dennys David', 'M', '941334712', '', NULL, b'1'),
(61, 'DNI', '18950180', 'Barrantes Cotrina', 'Ruben', 'M', '991133414', '', NULL, b'1'),
(62, 'DNI', '16065320', 'Barranzuela Justo', 'Huber', 'M', '938053028', '', NULL, b'1'),
(63, 'DNI', '15882950', 'Barreto Deza', 'Roman Arturo', 'M', '918810196', '', NULL, b'1'),
(64, 'DNI', '12556080', 'Cabanillas Davila', 'Ever', 'M', '957064924', '', NULL, b'1'),
(65, 'DNI', '18614775', 'Cabanillas De La Calle', 'Vladimir', 'M', '910348500', '', NULL, b'1'),
(66, 'DNI', '18079844', 'Cabanillas Bravo', 'Percy', 'M', '976259431', '', NULL, b'1'),
(67, 'DNI', '14714922', 'Cabanillas Broncano', 'Rodolfo', 'M', '950296960', '', NULL, b'1'),
(68, 'DNI', '13733114', 'Cáceres Cruz', 'Alejandro', 'M', '952735272', '', NULL, b'1'),
(69, 'DNI', '11370623', 'Diaz Cabello', 'Carlos Edil', 'M', '969994784', '', NULL, b'1'),
(70, 'DNI', '15840410', 'Delgado Cespedes', 'Yori Yoon', 'M', '936565222', '', NULL, b'1'),
(71, 'DNI', '13533453', 'Fernandez Cheppe', 'Sixto Raul', 'M', '960364488', '', NULL, b'1'),
(72, 'DNI', '18101053', 'Fernandez Zevallos', 'Sandro', 'M', '999284168', '', NULL, b'1'),
(73, 'DNI', '19356895', 'Flores Matias', 'Julio', 'M', '956378834', '', NULL, b'1'),
(74, 'DNI', '15643044', 'Flores Alejo', 'Federico Emerzon', 'M', '985194700', '', NULL, b'1'),
(75, 'DNI', '12535726', 'Gabriel Figueredo', 'William', 'M', '988296184', '', NULL, b'1'),
(76, 'DNI', '17049296', 'Gálvez Ponce', 'Héctor', 'M', '956230193', '', NULL, b'1'),
(77, 'DNI', '11997506', 'Gil Diaz', 'Guillermo Renato', 'M', '954909516', '', NULL, b'1'),
(78, 'DNI', '18873297', 'Gonzales Pozo', 'Luis Gustabo', 'M', '989829825', '', NULL, b'1'),
(79, 'DNI', '17566004', 'Hernandez Vilca', 'Remigio', 'M', '900266981', '', NULL, b'1'),
(80, 'DNI', '14994290', 'Herrera Jesus', 'Jerson', 'M', '918624186', '', NULL, b'1'),
(81, 'DNI', '19820382', 'Huaman Santa', 'Jhosimar', 'M', '970933323', '', NULL, b'1'),
(82, 'DNI', '11488705', 'Irigoin Gonzales', 'Fredy David', 'M', '952270660', '', NULL, b'1'),
(83, 'DNI', '10912278', 'Inchaustegui Marrujo', 'Juan Carlos', 'M', '950490955', '', NULL, b'1'),
(84, 'DNI', '14123305', 'Julian Falcón', 'Carlos Alberto', 'M', '930291179', '', NULL, b'1'),
(85, 'DNI', '13003447', 'Julca Colqui', 'Olimpio', 'M', '951593002', '', NULL, b'1'),
(86, 'DNI', '16260054', 'Jimenez Galindo', 'Roberto Carlos', 'M', '933172663', '', NULL, b'1'),
(87, 'DNI', '10517284', 'Leon Dionicio', 'Javier', 'M', '940825607', '', NULL, b'1'),
(88, 'DNI', '13176803', 'La Madrid Espinoza', 'Tony', 'M', '902321170', '', NULL, b'1'),
(89, 'DNI', '11051074', 'Leon Alejandro', 'Hector Demetrio', 'M', '900280256', '', NULL, b'1'),
(90, 'DNI', '15308806', 'Linares Bueno', 'Emerson', 'M', '940574368', '', NULL, b'1'),
(91, 'DNI', '19054788', 'Macalupu Espíritu', 'Daniel Hermelindo', 'M', '936998020', '', NULL, b'1'),
(92, 'DNI', '11740686', 'Malca Dominguez', 'Dare', 'M', '923909808', '', NULL, b'1'),
(93, 'DNI', '10400791', 'Malca Gomez', 'Jaime', 'M', '986597170', '', NULL, b'1'),
(94, 'DNI', '11507184', 'Mera Mariño', 'Joel', 'M', '921952701', '', NULL, b'1'),
(95, 'DNI', '17039621', 'Melendez Duran', 'Jair ', 'M', '985619354', '', NULL, b'1'),
(96, 'DNI', '13083314', 'Nuñez Palacios', 'Rufino Joel', 'M', '985176193', '', NULL, b'1'),
(97, 'DNI', '11715070', 'Nuñez Mariño', 'Angel Gabriel', 'M', '962151887', '', NULL, b'1'),
(98, 'DNI', '15562019', 'Oblitas Ramos', 'Lazaro Carlos', 'M', '969438786', '', NULL, b'1'),
(99, 'DNI', '10148723', 'Obando Evaristo', 'Efrain', 'M', '950255564', '', NULL, b'1'),
(100, 'DNI', '16098410', 'Ordoñez Castelo', 'Zenaida', 'F', '932358663', '', NULL, b'1'),
(101, 'DNI', '13487371', 'Delgado Medina', 'Elgia', 'F', '972884151', '', NULL, b'1'),
(102, 'DNI', '11659022', 'Pintado Vilca', 'Katerine', 'F', '923688687', '', NULL, b'1'),
(103, 'DNI', '12160361', 'Vasquez Cosi', 'Yulissa', 'F', '990187127', '', NULL, b'1'),
(104, 'DNI', '17893433', 'Vidarte Cabana', 'Rocio', 'F', '904061416', '', NULL, b'1'),
(105, 'DNI', '11113637', 'Aguilar Montes', 'Sharon', 'F', '982797828', '', NULL, b'1'),
(106, 'DNI', '12737797', 'Vigil Ojeda', 'Pierina', 'F', '907002269', '', NULL, b'1'),
(107, 'DNI', '19980306', 'Torres Collazos', 'Antonina', 'F', '904162783', '', NULL, b'1'),
(108, 'DNI', '10365986', 'Quispe Lima', 'Martha', 'F', '960629068', '', NULL, b'1'),
(109, 'DNI', '14002639', 'Cajahuaringa Santillana', 'Alexandra', 'F', '932895470', '', NULL, b'1'),
(110, 'DNI', '17553397', 'Cruz Cañazca', 'Solange', 'F', '966306829', '', NULL, b'1'),
(111, 'DNI', '19838080', 'Delgado Del Carpio', 'Idalia', 'F', '955472585', '', NULL, b'1'),
(112, 'DNI', '11717065', 'Abad Solis ', 'Carmen', 'F', '913251919', 'calle chiclayo # 114 MOTUPE LAMBAYEQUE CHICLAYO', NULL, b'1'),
(113, 'DNI', '14268468', 'Leo Mojo', 'Candy', 'F', '973591530', '', NULL, b'1'),
(114, 'DNI', '17198872', 'Aguilar Pauca', 'Karla Luz', 'F', '941267001', '', NULL, b'1'),
(115, 'DNI', '16853284', 'Vicente Teves', 'Rosa Leydi', 'F', '935554463', '', NULL, b'1'),
(116, 'DNI', '14368905', 'Pinedo Bautista', 'Maria', 'F', '968495018', '', NULL, b'1'),
(117, 'DNI', '16783097', 'Cardozo Alarcon', 'Yovani', 'F', '974972078', '', NULL, b'1'),
(118, 'DNI', '11319618', 'Hoyos Arevalo', 'Thalia', 'F', '997214740', '', NULL, b'1'),
(119, 'DNI', '18066711', 'Rivera Contreras', 'Betty', 'F', '948806030', '', NULL, b'1'),
(120, 'DNI', '18141237', 'Martinez Garcia', 'Yocani Rene', 'F', '951877430', '', NULL, b'1'),
(121, 'DNI', '12507651', 'Marin Castro', 'Deysi', 'F', '929237907', '', NULL, b'1'),
(122, 'DNI', '17852010', 'Flores Fernandez', 'Rosmery', 'F', '991595538', '', NULL, b'1'),
(123, 'DNI', '17758113', 'Saavedra Jeri', 'Mayra ', 'F', '976729701', '', NULL, b'1'),
(124, 'DNI', '12677883', 'Nuñez Huaman', 'Gina Marissa', 'F', '913319958', '', NULL, b'1'),
(125, 'DNI', '16450817', 'Tenorio Hinostroza', 'Mayra', 'F', '938566441', '', NULL, b'1'),
(126, 'DNI', '14753929', 'Rojas Felices', 'Maribel', 'F', '934057150', '', NULL, b'1'),
(127, 'DNI', '17904666', 'Ramos Mauricio ', 'Elizabeth', 'F', '930579147', '', NULL, b'1'),
(128, 'DNI', '18710745', 'Linares Montes', 'Antonia', 'F', '902475890', '', NULL, b'1'),
(129, 'DNI', '11686012', 'Ruiz Carbajal', 'Zuleika', 'F', '932019461', '', NULL, b'1'),
(130, 'DNI', '16353380', 'Guerrero Morales', 'Kendra', 'F', '994422459', '', NULL, b'1'),
(131, 'DNI', '13511988', 'Guerrero Bautista', 'Manuela', 'F', '950871631', '', NULL, b'1'),
(132, 'DNI', '19042873', 'Mayra Rimachi', 'Gloria', 'F', '996317502', '', NULL, b'1'),
(133, 'DNI', '17769073', 'Davila Sanchez', 'Loida', 'F', '954121047', '', NULL, b'1'),
(134, 'DNI', '11779993', 'Fernandez Vargas', 'Catherin', 'F', '955922193', '', NULL, b'1'),
(135, 'DNI', '18994109', 'Terrones Gomez', 'Erika', 'F', '957486568', '', NULL, b'1'),
(136, 'DNI', '19039428', 'Castro Gamboa', 'Silvia Sonia', 'F', '920794125', '', NULL, b'1'),
(137, 'DNI', '12410826', 'Bellodas De La Cruz', 'Rocio', 'F', '978577615', '', NULL, b'1'),
(138, 'DNI', '19737967', 'Herrera Leon', 'Maribel Rocio', 'F', '923342311', '', NULL, b'1'),
(139, 'DNI', '16432341', 'Diaz Montoya', 'Nancy Elizabth', 'F', '979364374', '', NULL, b'1'),
(140, 'DNI', '14142960', 'Perez Jimenez', 'Zoraida', 'F', '910852396', '', NULL, b'1'),
(141, 'DNI', '12017303', 'Olano Medina', 'Leyda Madeli', 'F', '957631005', '', NULL, b'1'),
(142, 'DNI', '12718589', 'Medina Galan', 'Lisset Vanesa', 'F', '931936960', '', NULL, b'1'),
(143, 'DNI', '17400274', 'Reyna Perez', 'Laura Raquel', 'F', '945089569', '', NULL, b'1'),
(144, 'DNI', '11111111', 'Dadd', 'Eadad', 'M', '546436456', 'dfdsfdsf', NULL, b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE `compra` (
  `id_compra` smallint(6) NOT NULL,
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
  `estado_compra` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `compra`
--

INSERT INTO `compra` (`id_compra`, `id_usuario`, `id_anhio`, `tipo_compra`, `num_compra`, `razon_social_compra`, `ruc_compra`, `fecha_compra`, `freg_compra`, `doc_encargado_compra`, `encargado_compra`, `total_compra`, `estado_compra`) VALUES
(11, 1, 23, 'B', '4436436436', 'fdghdfhdfh fhgdfh df hdf h dhdfhdfhdf h fdhdfh', '10719195827', '2019-07-18', '2019-07-18 15:38:47', '45654J454545', 'Fad Dadad', 400.66, b'0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `concepto_apafa`
--

CREATE TABLE `concepto_apafa` (
  `id_concepto` smallint(6) NOT NULL,
  `descripcion_concepto` varchar(100) NOT NULL,
  `tipo_concepto` char(1) NOT NULL,
  `id_anhio` tinyint(4) NOT NULL,
  `monto_concepto` float NOT NULL,
  `estado_concepto` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `concepto_apafa`
--

INSERT INTO `concepto_apafa` (`id_concepto`, `descripcion_concepto`, `tipo_concepto`, `id_anhio`, `monto_concepto`, `estado_concepto`) VALUES
(3, 'ASAMBLEA GENERAL APAFA', 'O', 2, 25, b'0'),
(4, 'ASAMBLE DE ESCUELA DE PADRES', 'O', 2, 15, b'0'),
(5, 'ASFASF', 'O', 2, 33, b'0'),
(6, 'SVDSV', 'O', 2, 677, b'0'),
(7, 'FDHNDF', 'O', 2, 42.52, b'0'),
(8, 'CUOTA DE APAFA 2019', 'A', 23, 54, b'0'),
(9, 'CUOTA DE APAFA 2019', 'A', 23, 54.5, b'1'),
(10, 'ASAMBLEA GENERAL DE PADRE DE FAMILIA DIA LUNES ', 'O', 23, 34.25, b'1'),
(11, 'ASAMBLEA DIA DE LA MADRE', 'O', 23, 15, b'1'),
(12, 'ESCUELA DE PADRES', 'O', 23, 10, b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_compra`
--

CREATE TABLE `detalle_compra` (
  `id_detalle_compra` smallint(6) NOT NULL,
  `id_compra` smallint(6) NOT NULL,
  `nom_producto` varchar(30) NOT NULL,
  `cantidad_compra` tinyint(4) NOT NULL,
  `medida_compra` varchar(10) NOT NULL,
  `punit_compra` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `detalle_compra`
--

INSERT INTO `detalle_compra` (`id_detalle_compra`, `id_compra`, `nom_producto`, `cantidad_compra`, `medida_compra`, `punit_compra`) VALUES
(1, 11, 'DFSFS', 2, 'WEWE', 2.33),
(2, 11, 'DFGDFGDFGDF FD GDFG DFG DFGDF ', 4, 'FGDFG', 44),
(3, 11, 'GDGDS DSG DG D GDSG DSG DSG DS', 4, 'TEWTEWTEWT', 55);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_deuda`
--

CREATE TABLE `detalle_deuda` (
  `id_detalle_deuda` smallint(6) NOT NULL,
  `id_concepto` smallint(6) NOT NULL,
  `id_apoderado` smallint(6) NOT NULL,
  `saldo_deuda` float NOT NULL,
  `descripcion_deuda` varchar(100) DEFAULT NULL,
  `freg_deuda` date NOT NULL,
  `fseg_deuda` datetime NOT NULL,
  `estado_deuda` char(1) NOT NULL DEFAULT 'P'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `detalle_deuda`
--

INSERT INTO `detalle_deuda` (`id_detalle_deuda`, `id_concepto`, `id_apoderado`, `saldo_deuda`, `descripcion_deuda`, `freg_deuda`, `fseg_deuda`, `estado_deuda`) VALUES
(22, 8, 3, 54, NULL, '2019-06-25', '2019-06-25 15:25:16', 'P'),
(23, 8, 112, 0, NULL, '2019-07-08', '2019-07-18 15:55:06', 'C'),
(24, 8, 55, 54, NULL, '2019-07-08', '2019-07-08 16:08:58', 'P'),
(25, 10, 112, 10, NULL, '2019-07-16', '2019-07-16 18:38:57', 'P'),
(26, 11, 112, 10, NULL, '2019-07-16', '2019-07-16 18:38:57', 'P'),
(27, 12, 112, 5, NULL, '2019-07-16', '2019-07-16 18:38:57', 'P'),
(28, 9, 112, 0, NULL, '2019-07-17', '2019-07-18 15:55:06', 'C'),
(30, 9, 55, 54.5, NULL, '2019-07-17', '2019-07-17 19:18:59', 'P'),
(31, 9, 15, 54.5, NULL, '2019-07-19', '2019-07-19 16:04:02', 'P');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_recibo`
--

CREATE TABLE `detalle_recibo` (
  `id_detalle_deuda` smallint(6) NOT NULL,
  `id_recibo` smallint(6) NOT NULL,
  `monto_detalle` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `detalle_recibo`
--

INSERT INTO `detalle_recibo` (`id_detalle_deuda`, `id_recibo`, `monto_detalle`) VALUES
(23, 23, 24),
(23, 24, 10),
(25, 24, 24.25),
(26, 24, 5),
(27, 24, 5),
(23, 25, 20),
(28, 25, 54.5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grados`
--

CREATE TABLE `grados` (
  `id_grado` tinyint(4) NOT NULL,
  `descripcion_grado` varchar(40) NOT NULL,
  `nivel_grado` char(1) NOT NULL,
  `estado_grado` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `grados`
--

INSERT INTO `grados` (`id_grado`, `descripcion_grado`, `nivel_grado`, `estado_grado`) VALUES
(1, 'PRIMER GRADO SECUNDARIA', 'S', b'1'),
(2, 'SEGUNDO GRADO SECUNDARIA', 'S', b'0'),
(3, 'TERCER GRADO SECUNDARIA', 'S', b'0'),
(4, 'CUARTO GRADO SECUNDARIA', 'S', b'1'),
(5, 'QUINTO GRADO SECUNDARIA', 'S', b'0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro`
--

CREATE TABLE `libro` (
  `id_libro` tinyint(4) NOT NULL,
  `titulo_libro` varchar(80) NOT NULL,
  `editorial_libro` varchar(20) NOT NULL,
  `edicion_libro` char(4) NOT NULL,
  `id_grado` tinyint(4) NOT NULL,
  `estado_libro` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `libro`
--

INSERT INTO `libro` (`id_libro`, `titulo_libro`, `editorial_libro`, `edicion_libro`, `id_grado`, `estado_libro`) VALUES
(1, 'DFSSDFSF SFSF G DSG DSG DS GDSG DSG SDG DSG ', 'FSF SF  DSFDS F DSFS', '2018', 1, b'1'),
(2, 'DSF', 'DSF', '2019', 1, b'1'),
(3, 'FDG', 'FRTH', '2018', 2, b'1'),
(4, 'JG', 'HJ', '2014', 1, b'1'),
(5, 'GFH', 'JGFJ', '4564', 1, b'1'),
(6, 'DFBDFB FDH FD HDFH FDHFD DFH F HDFH DFHDFH DFHDF DFH DFH FDH DFH DFH F HDFH DFHD', 'ERGJGFJGJ GJ GJGF JG', '2001', 3, b'1'),
(7, 'DSFDSF DSF DSF DSF DS FDS FDSF SDFDS DSF DSFSD WRFWQF QWF WQ FWFWQF WF WF WQ FWQ', 'WFQW FWQF WQFWQF WQF', '2015', 4, b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro_matricula`
--

CREATE TABLE `libro_matricula` (
  `id_matricula` smallint(6) NOT NULL,
  `id_libro` tinyint(4) NOT NULL,
  `devolvio_libro` bit(1) NOT NULL DEFAULT b'0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `libro_matricula`
--

INSERT INTO `libro_matricula` (`id_matricula`, `id_libro`, `devolvio_libro`) VALUES
(38, 2, b'0'),
(38, 4, b'0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `matricula`
--

CREATE TABLE `matricula` (
  `id_matricula` smallint(6) NOT NULL,
  `fecha_matricula` date NOT NULL,
  `id_apoderado` smallint(6) NOT NULL,
  `id_alumno` smallint(6) NOT NULL,
  `id_anhio` tinyint(4) NOT NULL,
  `id_seccion` tinyint(4) NOT NULL,
  `id_tipo_relacion` tinyint(4) NOT NULL,
  `estado_matricula` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `matricula`
--

INSERT INTO `matricula` (`id_matricula`, `fecha_matricula`, `id_apoderado`, `id_alumno`, `id_anhio`, `id_seccion`, `id_tipo_relacion`, `estado_matricula`) VALUES
(38, '2019-07-08', 112, 37, 23, 5, 2, b'0'),
(39, '2019-07-08', 112, 38, 23, 5, 2, b'1'),
(40, '2019-07-08', 55, 39, 23, 5, 2, b'1'),
(41, '2019-07-08', 112, 40, 23, 6, 2, b'1'),
(42, '2019-07-11', 112, 41, 23, 9, 1, b'1'),
(43, '2019-07-19', 15, 47, 23, 9, 1, b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `otros_movimientos`
--

CREATE TABLE `otros_movimientos` (
  `id_movimiento` smallint(6) NOT NULL,
  `tipo_movimiento` char(1) NOT NULL,
  `descripcion_movimiento` varchar(100) NOT NULL,
  `monto_movimiento` float(10,2) NOT NULL,
  `freg_movimiento` datetime NOT NULL,
  `doc_encargado_movimiento` varchar(15) NOT NULL,
  `datos_encargado_movimiento` varchar(100) NOT NULL,
  `id_usuario` tinyint(4) NOT NULL,
  `estado_movimiento` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `otros_movimientos`
--

INSERT INTO `otros_movimientos` (`id_movimiento`, `tipo_movimiento`, `descripcion_movimiento`, `monto_movimiento`, `freg_movimiento`, `doc_encargado_movimiento`, `datos_encargado_movimiento`, `id_usuario`, `estado_movimiento`) VALUES
(1, 'I', 'RIFA DEL DIA DEL PADRE', 2000.50, '2019-06-03 03:19:17', '565665666', 'Juan Carlos Rios Vasquez', 46, b'0'),
(2, 'I', 'BINGO POR ANIVERSARIO', 5500.00, '2019-06-08 18:27:22', '15465465465', 'Julca Zeña Javier', 46, b'0'),
(3, 'I', 'RIFA POR EL DIA DE LA MADRE', 1000.50, '2019-06-08 18:28:37', '9879989898', 'Susana Vasquez Delgado', 46, b'0'),
(4, 'I', 'SFAFAS', 100.00, '2019-07-17 14:56:21', 'DSFSD3252352352', 'Fadad', 1, b'0'),
(5, 'I', 'SFSF', 12.00, '2019-07-18 15:52:43', '325235235325235', 'Djk', 1, b'1'),
(6, 'I', 'PINTADO DE CARPETAs', 100.50, '2019-07-18 19:08:08', '546545654654654', 'Juan Jose Vasquez Delgado', 1, b'1'),
(7, 'I', 'PINTADO DE CARPETAS', 100.50, '2019-07-18 19:09:18', '45786767', 'Juan Jose Vasquez Delgado', 1, b'1'),
(8, 'E', 'PINTADO DE CARPETAs', 100.50, '2019-07-18 19:10:03', '6545646465465', 'Juan Jose Vasquez Delgado', 1, b'0'),
(9, 'E', 'DICTADO DE CLASES DE INGLES', 400.50, '2019-07-19 12:28:52', '73258572', 'Marita Vanessa Sanchez Velasquez', 1, b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil_usuario`
--

CREATE TABLE `perfil_usuario` (
  `idperfil_usuario` tinyint(4) NOT NULL,
  `nombre_perfil` varchar(25) NOT NULL,
  `abrev_perfil` char(2) NOT NULL,
  `estado_perfil` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `perfil_usuario`
--

INSERT INTO `perfil_usuario` (`idperfil_usuario`, `nombre_perfil`, `abrev_perfil`, `estado_perfil`) VALUES
(1, 'ADMINISTRADOR', 'AD', b'1'),
(2, 'SECRETARIA', 'SE', b'1'),
(3, 'TESORERIA', 'TS', b'1'),
(4, 'DIRECTOR (A)', 'DI', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recibo`
--

CREATE TABLE `recibo` (
  `id_recibo` smallint(6) NOT NULL,
  `id_apoderado` smallint(6) NOT NULL,
  `id_usuario` tinyint(4) NOT NULL,
  `mtotal_recibo` float NOT NULL,
  `freg_recibo` datetime NOT NULL,
  `num_recibo` varchar(20) NOT NULL,
  `estado_recibo` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `recibo`
--

INSERT INTO `recibo` (`id_recibo`, `id_apoderado`, `id_usuario`, `mtotal_recibo`, `freg_recibo`, `num_recibo`, `estado_recibo`) VALUES
(23, 112, 1, 24, '2019-07-16 17:59:34', '1171-20190716-1', b'0'),
(24, 112, 1, 44.25, '2019-07-16 18:38:57', '1171-20190716-2', b'0'),
(25, 112, 1, 74.5, '2019-07-18 15:55:05', '1171-20190718-1', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reunion`
--

CREATE TABLE `reunion` (
  `id_reunion` smallint(6) NOT NULL,
  `motivo_reunion` varchar(100) NOT NULL,
  `fecha_reunion` date NOT NULL,
  `hora_reunion` time NOT NULL,
  `id_concepto` smallint(6) NOT NULL,
  `lista_reunion` bit(1) NOT NULL DEFAULT b'0',
  `estado_reunion` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `reunion`
--

INSERT INTO `reunion` (`id_reunion`, `motivo_reunion`, `fecha_reunion`, `hora_reunion`, `id_concepto`, `lista_reunion`, `estado_reunion`) VALUES
(1, 'Asamblea General de padres', '2019-06-21', '14:30:00', 3, b'1', b'0'),
(2, 'Reunion de padres de familia', '2019-07-21', '16:30:00', 12, b'1', b'0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reunion_apoderado`
--

CREATE TABLE `reunion_apoderado` (
  `id_reunion` smallint(6) NOT NULL,
  `id_apoderado` smallint(6) NOT NULL,
  `asistio_reunion` bit(1) NOT NULL DEFAULT b'0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `reunion_apoderado`
--

INSERT INTO `reunion_apoderado` (`id_reunion`, `id_apoderado`, `asistio_reunion`) VALUES
(1, 2, b'0'),
(1, 4, b'0'),
(2, 55, b'0'),
(2, 112, b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secciones`
--

CREATE TABLE `secciones` (
  `id_seccion` tinyint(4) NOT NULL,
  `nombre_seccion` varchar(20) NOT NULL,
  `id_grado` tinyint(4) NOT NULL,
  `turno_seccion` char(1) NOT NULL,
  `estado_seccion` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `secciones`
--

INSERT INTO `secciones` (`id_seccion`, `nombre_seccion`, `id_grado`, `turno_seccion`, `estado_seccion`) VALUES
(1, 'A', 1, 'M', b'0'),
(2, 'A', 1, 'T', b'0'),
(3, 'A', 2, 'M', b'0'),
(4, 'A', 1, 'M', b'0'),
(5, 'A', 1, 'M', b'0'),
(6, 'B', 2, 'M', b'0'),
(7, 'B', 2, 'T', b'0'),
(8, 'B', 1, 'T', b'0'),
(9, 'A', 1, 'M', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_relacion`
--

CREATE TABLE `tipo_relacion` (
  `id_tipo_relacion` tinyint(4) NOT NULL,
  `nombre_relacion` varchar(20) NOT NULL,
  `estado_relacion` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

CREATE TABLE `usuario` (
  `idusuario` tinyint(4) NOT NULL,
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
  `estado_usu` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idusuario`, `idperfil_usuario`, `nom_usu`, `clave_usu`, `dni_usu`, `nombres_usu`, `apellidos_usu`, `sexo_usu`, `celular_usu`, `correo_usu`, `direccion_usu`, `fcreacion_usu`, `fbaja_usu`, `obser_usu`, `estado_usu`) VALUES
(1, 1, 'jjulcav', 'd0c7366cd4b8ed80d5f28120c6be80ee89e93bbf', '71919582', 'Jose Andersson', 'Julca Vásquez', 'M', '978902579', '', 'CALLE CHICLAYO # 114', '2019-06-28', NULL, NULL, b'1'),
(2, 4, 'maritasv', 'a6b7354b8ec74b0550233c5cbf8773c6d28ceef4', '73258572', 'Marita Vanessa', 'Sanchez Velasquez', 'F', '979241872', 'vanesa_2808@hotmail.com', 'VISTA ALEGRE M H LT 22 CRUZ DE LA ESPERANZA', '2019-06-29', NULL, NULL, b'1'),
(3, 2, 'rosafc', '2ef4d31ff48bb12b7c977be13909b5ae02683c7b', '14526398', 'Rosa Magaly ', 'Fernandez Cabrejos', 'F', '987445896', '', 'calle motupe # 152', '2019-06-29', '2019-07-03', NULL, b'1'),
(4, 3, 'lishyestelita', 'ea8d414fe25b078a9b8e1516862bddf210e686bd', '45256389', 'Lishy Tatiana', 'Estela Zeña', 'F', '968574258', NULL, 'calle tucume # 150', '2019-06-29', NULL, NULL, b'1');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alumno`
--
ALTER TABLE `alumno`
  ADD PRIMARY KEY (`id_alumno`);

--
-- Indices de la tabla `anhio_lectivo`
--
ALTER TABLE `anhio_lectivo`
  ADD PRIMARY KEY (`idanhio`);

--
-- Indices de la tabla `apoderado`
--
ALTER TABLE `apoderado`
  ADD PRIMARY KEY (`id_apoderado`);

--
-- Indices de la tabla `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`id_compra`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_anhio` (`id_anhio`);

--
-- Indices de la tabla `concepto_apafa`
--
ALTER TABLE `concepto_apafa`
  ADD PRIMARY KEY (`id_concepto`),
  ADD KEY `id_anhio` (`id_anhio`);

--
-- Indices de la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD PRIMARY KEY (`id_detalle_compra`),
  ADD KEY `id_compra` (`id_compra`);

--
-- Indices de la tabla `detalle_deuda`
--
ALTER TABLE `detalle_deuda`
  ADD PRIMARY KEY (`id_detalle_deuda`),
  ADD KEY `id_concepto` (`id_concepto`),
  ADD KEY `id_apoderado` (`id_apoderado`);

--
-- Indices de la tabla `detalle_recibo`
--
ALTER TABLE `detalle_recibo`
  ADD KEY `id_recibo` (`id_recibo`),
  ADD KEY `id_detalle_deuda` (`id_detalle_deuda`);

--
-- Indices de la tabla `grados`
--
ALTER TABLE `grados`
  ADD PRIMARY KEY (`id_grado`);

--
-- Indices de la tabla `libro`
--
ALTER TABLE `libro`
  ADD PRIMARY KEY (`id_libro`),
  ADD KEY `id_grado` (`id_grado`);

--
-- Indices de la tabla `libro_matricula`
--
ALTER TABLE `libro_matricula`
  ADD KEY `id_matricula` (`id_matricula`),
  ADD KEY `id_libro` (`id_libro`);

--
-- Indices de la tabla `matricula`
--
ALTER TABLE `matricula`
  ADD PRIMARY KEY (`id_matricula`),
  ADD KEY `id_tipo_relacion` (`id_tipo_relacion`),
  ADD KEY `id_seccion` (`id_seccion`),
  ADD KEY `id_anhio` (`id_anhio`),
  ADD KEY `id_alumno` (`id_alumno`),
  ADD KEY `id_apoderado` (`id_apoderado`);

--
-- Indices de la tabla `otros_movimientos`
--
ALTER TABLE `otros_movimientos`
  ADD PRIMARY KEY (`id_movimiento`);

--
-- Indices de la tabla `perfil_usuario`
--
ALTER TABLE `perfil_usuario`
  ADD PRIMARY KEY (`idperfil_usuario`);

--
-- Indices de la tabla `recibo`
--
ALTER TABLE `recibo`
  ADD PRIMARY KEY (`id_recibo`),
  ADD KEY `id_apoderado` (`id_apoderado`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `reunion`
--
ALTER TABLE `reunion`
  ADD PRIMARY KEY (`id_reunion`),
  ADD KEY `id_concepto` (`id_concepto`);

--
-- Indices de la tabla `secciones`
--
ALTER TABLE `secciones`
  ADD PRIMARY KEY (`id_seccion`),
  ADD KEY `id_grado` (`id_grado`);

--
-- Indices de la tabla `tipo_relacion`
--
ALTER TABLE `tipo_relacion`
  ADD PRIMARY KEY (`id_tipo_relacion`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idusuario`),
  ADD KEY `idperfil_usuario` (`idperfil_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alumno`
--
ALTER TABLE `alumno`
  MODIFY `id_alumno` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=144;
--
-- AUTO_INCREMENT de la tabla `anhio_lectivo`
--
ALTER TABLE `anhio_lectivo`
  MODIFY `idanhio` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT de la tabla `apoderado`
--
ALTER TABLE `apoderado`
  MODIFY `id_apoderado` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=146;
--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `id_compra` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT de la tabla `concepto_apafa`
--
ALTER TABLE `concepto_apafa`
  MODIFY `id_concepto` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT de la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  MODIFY `id_detalle_compra` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `detalle_deuda`
--
ALTER TABLE `detalle_deuda`
  MODIFY `id_detalle_deuda` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT de la tabla `grados`
--
ALTER TABLE `grados`
  MODIFY `id_grado` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT de la tabla `libro`
--
ALTER TABLE `libro`
  MODIFY `id_libro` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT de la tabla `matricula`
--
ALTER TABLE `matricula`
  MODIFY `id_matricula` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;
--
-- AUTO_INCREMENT de la tabla `otros_movimientos`
--
ALTER TABLE `otros_movimientos`
  MODIFY `id_movimiento` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT de la tabla `perfil_usuario`
--
ALTER TABLE `perfil_usuario`
  MODIFY `idperfil_usuario` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT de la tabla `recibo`
--
ALTER TABLE `recibo`
  MODIFY `id_recibo` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT de la tabla `reunion`
--
ALTER TABLE `reunion`
  MODIFY `id_reunion` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `secciones`
--
ALTER TABLE `secciones`
  MODIFY `id_seccion` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT de la tabla `tipo_relacion`
--
ALTER TABLE `tipo_relacion`
  MODIFY `id_tipo_relacion` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idusuario` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `anhio_compra` FOREIGN KEY (`id_anhio`) REFERENCES `anhio_lectivo` (`idanhio`),
  ADD CONSTRAINT `usuario_compra` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`idusuario`);

--
-- Filtros para la tabla `concepto_apafa`
--
ALTER TABLE `concepto_apafa`
  ADD CONSTRAINT `anhio_concepto` FOREIGN KEY (`id_anhio`) REFERENCES `anhio_lectivo` (`idanhio`);

--
-- Filtros para la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD CONSTRAINT `compra_detalle` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id_compra`);

--
-- Filtros para la tabla `detalle_deuda`
--
ALTER TABLE `detalle_deuda`
  ADD CONSTRAINT `apoderado_deuda` FOREIGN KEY (`id_apoderado`) REFERENCES `apoderado` (`id_apoderado`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `concepto_deuda` FOREIGN KEY (`id_concepto`) REFERENCES `concepto_apafa` (`id_concepto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_recibo`
--
ALTER TABLE `detalle_recibo`
  ADD CONSTRAINT `deuda_detalle_recibo` FOREIGN KEY (`id_detalle_deuda`) REFERENCES `detalle_deuda` (`id_detalle_deuda`),
  ADD CONSTRAINT `recibo_detalle_recibo` FOREIGN KEY (`id_recibo`) REFERENCES `recibo` (`id_recibo`);

--
-- Filtros para la tabla `libro`
--
ALTER TABLE `libro`
  ADD CONSTRAINT `grados_libro` FOREIGN KEY (`id_grado`) REFERENCES `grados` (`id_grado`);

--
-- Filtros para la tabla `matricula`
--
ALTER TABLE `matricula`
  ADD CONSTRAINT `alumno_matricula` FOREIGN KEY (`id_alumno`) REFERENCES `alumno` (`id_alumno`),
  ADD CONSTRAINT `anhio_matricula` FOREIGN KEY (`id_anhio`) REFERENCES `anhio_lectivo` (`idanhio`),
  ADD CONSTRAINT `apoderado_matricula` FOREIGN KEY (`id_apoderado`) REFERENCES `apoderado` (`id_apoderado`),
  ADD CONSTRAINT `relacion_matricula` FOREIGN KEY (`id_tipo_relacion`) REFERENCES `tipo_relacion` (`id_tipo_relacion`),
  ADD CONSTRAINT `seccion_matricula` FOREIGN KEY (`id_seccion`) REFERENCES `secciones` (`id_seccion`);

--
-- Filtros para la tabla `recibo`
--
ALTER TABLE `recibo`
  ADD CONSTRAINT `apoderado_recibo` FOREIGN KEY (`id_apoderado`) REFERENCES `apoderado` (`id_apoderado`),
  ADD CONSTRAINT `usuario_recibo` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`idusuario`);

--
-- Filtros para la tabla `reunion`
--
ALTER TABLE `reunion`
  ADD CONSTRAINT `concepto_reunion` FOREIGN KEY (`id_concepto`) REFERENCES `concepto_apafa` (`id_concepto`);

--
-- Filtros para la tabla `secciones`
--
ALTER TABLE `secciones`
  ADD CONSTRAINT `secciones_grados` FOREIGN KEY (`id_grado`) REFERENCES `grados` (`id_grado`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idperfil_usuario`) REFERENCES `perfil_usuario` (`idperfil_usuario`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
