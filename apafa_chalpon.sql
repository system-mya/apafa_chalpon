-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-06-2019 a las 00:37:49
-- Versión del servidor: 5.7.14
-- Versión de PHP: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `apafa_chalpon`
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
SELECT * FROM alumno
WHERE doc_alumno=doc
AND estado_alumno=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_buscar_doc_apoderado` (IN `doc` VARCHAR(15))  NO SQL
SELECT * FROM apoderado
WHERE doc_apoderado=doc
AND estado_apoderado=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_cambiar_estado_grado` (IN `grado` INT, IN `estado` BIT)  NO SQL
UPDATE grados SET estado_grado=estado 
WHERE id_grado=grado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_consultar_nomusuario` (IN `nom` VARCHAR(20))  NO SQL
SELECT * FROM usuario
WHERE nom_usu=nom
AND estado_usu=1
AND fbaja_usu IS NULL$$

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

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_detalle_usuario` (IN `usuario` SMALLINT)  NO SQL
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_alumno` (IN `id` SMALLINT)  NO SQL
UPDATE alumno SET estado_alumno=0
WHERE id_alumno=id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_anhio` (IN `anhio` SMALLINT)  NO SQL
UPDATE anhio_lectivo SET estado_anhio=0 WHERE idanhio=anhio$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_apoderado` (IN `id_apo` SMALLINT)  NO SQL
UPDATE apoderado SET estado_apoderado=0 WHERE id_apoderado=id_apo$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_usuario` (IN `id_usu` SMALLINT)  NO SQL
UPDATE usuario SET estado_usu=0
WHERE idusuario=id_usu$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_iniciar_sesion` (IN `nom` VARCHAR(20), IN `clave` VARCHAR(15))  NO SQL
SELECT u.idusuario,u.nom_usu,pu.abrev_perfil,pu.nombre_perfil,
(SELECT anhio from anhio_lectivo WHERE condicion_anhio='A') AS anhio_lectivo FROM usuario u
INNER JOIN perfil_usuario pu ON u.idperfil_usuario=pu.idperfil_usuario
WHERE u.nom_usu=nom
AND u.clave_usu=SHA(clave)
AND u.estado_usu=1$$

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

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_anhio` (IN `anhio` CHAR(4), IN `finicio` DATE, IN `ffin` DATE, IN `descripcion` VARCHAR(150))  INSERT INTO anhio_lectivo(anhio, finicio_anhio,
ffin_anhio, descripcion_anhio) 
VALUES (anhio,finicio,ffin,descripcion)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_apoderado` (IN `tdoc_apod` CHAR(3), IN `doc_apod` VARCHAR(15), IN `ape_apod` VARCHAR(60), IN `nom_apod` VARCHAR(50), IN `sex_apod` CHAR(1), IN `cel_apod` CHAR(9), IN `direc_apod` VARCHAR(80), IN `cor_apod` VARCHAR(80))  NO SQL
INSERT INTO apoderado(tdoc_apoderado, 
doc_apoderado, apellidos_apoderado, nombres_apoderado,
sexo_apoderado, celular_apoderado, direccion_apoderado,
correo_apoderado) VALUES (tdoc_apod,doc_apod,
ape_apod,nom_apod,sex_apod,cel_apod,direc_apod,cor_apod)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_seccion` (IN `nombre` VARCHAR(20), IN `grado` INT, IN `turno` CHAR(1))  NO SQL
INSERT INTO secciones(nombre_seccion,id_grado,id_turno) 
VALUES (nombre,grado,turno)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_usuario` (IN `nom_usu` VARCHAR(20), IN `clave` VARCHAR(15), IN `dni` CHAR(8), IN `nombres` VARCHAR(45), IN `apellidos` VARCHAR(60), IN `sexo` CHAR(1), IN `celular` CHAR(9), IN `correo` VARCHAR(80), IN `direccion` VARCHAR(80), IN `fcreacion` DATE, IN `obser` VARCHAR(50), IN `perfil` INT)  INSERT INTO usuario(nom_usu, 
clave_usu,dni_usu,nombres_usu,apellidos_usu, 
sexo_usu,celular_usu,correo_usu,
direccion_usu,fcreacion_usu,
obser_usu,idperfil_usuario)
VALUES (nom_usu,SHA(clave),dni,nombres,apellidos,sexo,
celular,correo,direccion,fcreacion,obser,perfil)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_alumnos` ()  NO SQL
SELECT id_alumno,apellidos_alumno,
nombres_alumno,tdoc_alumno,doc_alumno,
(CASE
   WHEN sexo_alumno='M' THEN 'MASCULINO'
   ELSE 'FEMENINO'
 END) as sexo_alumno,celular_alumno FROM alumno
WHERE estado_alumno=1
ORDER BY apellidos_alumno$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_anhio` ()  NO SQL
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_apoderados` ()  NO SQL
SELECT id_apoderado,doc_apoderado,apellidos_apoderado,
nombres_apoderado,(CASE WHEN sexo_apoderado='M' THEN 'MASCULINO' ELSE 'FEMENINO' END) AS sexo_apoderado,
celular_apoderado
FROM apoderado
WHERE estado_apoderado=1
ORDER BY apellidos_apoderado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_grados` (IN `nivel` CHAR(1))  NO SQL
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_grados_activos` (IN `nivel` CHAR(1))  NO SQL
SELECT * FROM grados g
 WHERE g.nivel_grado=nivel
 AND g.estado_grado=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_matriculados` ()  NO SQL
SELECT * FROM matricula m 
INNER JOIN apoderado ap ON m.id_apoderado=ap.id_apoderado
INNER JOIN alumno a ON a.id_alumno=m.id_alumno
INNER JOIN anhio_lectivo an ON an.idanhio=m.id_anhio
INNER JOIN secciones s ON s.id_seccion=m.id_seccion
INNER JOIN tipo_relacion tr ON tr.id_tipo_relacion=m.id_tipo_relacion
WHERE m.estado_matricula=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_perfil_usuario` ()  NO SQL
SELECT * FROM perfil_usuario
WHERE estado_perfil=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_secciones_xgrado` (IN `grado` INT)  NO SQL
SELECT s.id_seccion,s.nombre_seccion,g.descripcion_grado,g.id_grado,
(CASE 
     WHEN s.id_turno='M' THEN 'MAÑANA'
     ELSE 'TARDE'
END) as turno FROM secciones s 
INNER JOIN grados g ON g.id_grado=s.id_grado 
WHERE s.estado_seccion=1
AND g.id_grado=grado$$

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
WHERE u.estado_usu=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_obtener_usuario` (IN `cod` INT)  NO SQL
SELECT * FROM usuario u
INNER JOIN perfil_usuario pu ON pu.idperfil_usuario=u.idperfil_usuario
WHERE u.idusuario=cod
AND u.estado_usu=1
AND u.fbaja_usu IS NULL$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_resetear_clave` (IN `id_usu` SMALLINT)  NO SQL
UPDATE usuario SET clave_usu=SHA('1A2B3C4D')
WHERE idusuario=id_usu$$

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

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_apoderado` (IN `id_apo` SMALLINT, IN `ape_apod` VARCHAR(60), IN `nom_apod` VARCHAR(50), IN `sex_apod` CHAR(1), IN `cel_apod` CHAR(9), IN `dir_apod` VARCHAR(80), IN `cor_apod` VARCHAR(80))  NO SQL
UPDATE apoderado SET apellidos_apoderado=ape_apod,
nombres_apoderado=nom_apod,sexo_apoderado=sex_apod,
celular_apoderado=cel_apod,
direccion_apoderado=dir_apod,correo_apoderado=cor_apod
WHERE id_apoderado=id_apo$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_usuario` (IN `idusu` INT, IN `nom_usu` VARCHAR(20), IN `nombres` VARCHAR(45), IN `apellidos` VARCHAR(60), IN `sexo` CHAR(1), IN `celular` CHAR(9), IN `correo` VARCHAR(80), IN `direccion` VARCHAR(80), IN `fbaja` DATE, IN `obser` VARCHAR(50), IN `perfil` INT)  UPDATE usuario SET nom_usu=nom_usu,nombres_usu=nombres,apellidos_usu=apellidos,sexo_usu=sexo,celular_usu=celular,correo_usu=correo,direccion_usu=direccion,fbaja_usu=fbaja,obser_usu=obser,idperfil_usuario=perfil
WHERE idusuario=idusu$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_anhio` (IN `dato` CHAR(4))  SELECT
    anhio,idanhio
    FROM anhio_lectivo
    WHERE anhio=dato AND estado_anhio=1
    UNION
    SELECT 'AÑO LECTIVO AUN APERTURADO',NULL FROM DUAL
    WHERE EXISTS
    ( SELECT idanhio
    FROM anhio_lectivo
    WHERE condicion_anhio='A' AND estado_anhio=1)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_verificar_seccion` (IN `nombre` VARCHAR(20), IN `turno` CHAR(1), IN `grado` INT)  NO SQL
SELECT * FROM secciones
WHERE nombre_seccion=nombre
AND id_turno=turno
AND id_grado=grado
AND estado_seccion=1$$

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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `alumno`
--

INSERT INTO `alumno` (`id_alumno`, `tdoc_alumno`, `doc_alumno`, `apellidos_alumno`, `nombres_alumno`, `fnac_alumno`, `sexo_alumno`, `telefono_alumno`, `celular_alumno`, `direccion_alumno`, `correo_alumno`, `procedencia_alumno`, `apellidos_padre`, `nombres_padre`, `celular_padre`, `correo_padre`, `apellidos_madre`, `nombres_madre`, `celular_madre`, `correo_madre`, `estado_alumno`) VALUES
(1, 'DNI', '71919582', 'Julca Vasquez', 'Jose Andersson', '0000-00-00', 'M', NULL, '978902579', 'Calle chiclayo # 114', NULL, NULL, 'Julca Zeña', 'Francisco Javier', NULL, NULL, 'Vasquez Delgado', 'Susana Esther', NULL, NULL, b'1'),
(2, 'DNI', '16686223', 'Julca Zeña', 'Francisco Javier', '0000-00-00', 'M', NULL, '978989288', 'calle chiclayo # 114', NULL, NULL, 'Julca Venegas', 'Segundo', NULL, NULL, 'Zeña Orreaga', 'Alejandrina', NULL, NULL, b'1'),
(3, 'OTR', '751654654M65484', 'Flores Aguilar', 'Diego', '0000-00-00', 'M', NULL, '312113313', 'La Posada SN', NULL, NULL, 'Fadad', 'Rqewwf', NULL, NULL, 'Fasdfasf', 'Radafasff', NULL, NULL, b'1'),
(4, 'DNI', '73258572', 'Sanchez Velasquez', 'Marita Vanessa', '1992-08-28', 'F', NULL, '979241872', 'VISTA ALEGRE MZ H LT 22', NULL, NULL, 'Sanchez Granados', 'Luis', NULL, NULL, 'Velasquez Torres', 'Lila', NULL, NULL, b'1'),
(5, 'DNI', '16729503', 'Julca Vasquez', 'Alejandra Sayuri', '0000-00-00', 'F', NULL, '979013530', 'CALLE CHICALYO # 114', NULL, NULL, 'Julca Zeña', 'Francisco Javier', NULL, NULL, 'Vasquez Delgado', 'Susana', NULL, NULL, b'1'),
(6, 'DNI', '21654684', 'Rubio Vasquez', 'Jose Alexander', '0000-00-00', 'M', NULL, '979416039', 'calle jose quinones # 54', NULL, NULL, 'Rubio Marin', 'Alex', NULL, NULL, 'Vasquez Delgado', 'Luz', NULL, NULL, b'1'),
(7, 'DNI', '12412412', 'Dadad', 'Dadad', '2007-01-30', 'M', NULL, '325325325', 'sfasfasfsaf', NULL, NULL, 'Aadad', 'Aasad', NULL, NULL, 'Aad', 'Dadad', NULL, NULL, b'0'),
(8, 'DNI', '13415315', 'Aasadad', 'Fadadad', '2019-06-06', 'M', NULL, '325326236', 'ADADAD', NULL, NULL, 'Aadada', 'Dadadad', NULL, NULL, 'Fadad', 'Aaadad', NULL, NULL, b'0'),
(9, 'DNI', '34532532', 'Aadad', 'Fadad', '2019-06-14', 'M', NULL, '325325325', 'fasfsafsaf', NULL, NULL, 'Adadad', 'Fadad', NULL, NULL, 'Dadad', 'Fadad', NULL, NULL, b'0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `anhio_lectivo`
--

CREATE TABLE `anhio_lectivo` (
  `idanhio` smallint(6) NOT NULL,
  `anhio` char(4) NOT NULL,
  `finicio_anhio` date NOT NULL,
  `ffin_anhio` date NOT NULL,
  `descripcion_anhio` varchar(150) DEFAULT NULL,
  `condicion_anhio` char(1) NOT NULL DEFAULT 'A',
  `estado_anhio` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
(1, 'DNI', '16686223', 'Julca Zeña', 'Francisco Javier', 'M', '978902579', 'calle chiclayo # 54', NULL, b'1'),
(2, 'DNI', '16729503', 'Vasquez Delgado', 'Susana Esther', 'F', '979013530', 'calle jose quiñones S/N', NULL, b'1'),
(3, 'DNI', '73258572', 'Sanchez Velasquez', 'Marita Vanessa', 'F', '979241872', 'vista alegre MZ H LT 22', NULL, b'1'),
(4, 'DNI', '32523523', 'Aguilar Diaz', 'Daniel', 'M', '111111111', 'fhdfhdfh', NULL, b'1'),
(5, 'OTR', 'SF43634634636', 'Fadad', 'Radad', 'M', '626432634', 'fdhndfhdfh', NULL, b'0'),
(6, 'DNI', '63463463', 'Aadad', 'Fadad', 'M', '375754745', 'rdh', NULL, b'0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grados`
--

CREATE TABLE `grados` (
  `id_grado` int(11) NOT NULL,
  `descripcion_grado` varchar(40) NOT NULL,
  `nivel_grado` char(1) NOT NULL,
  `estado_grado` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `grados`
--

INSERT INTO `grados` (`id_grado`, `descripcion_grado`, `nivel_grado`, `estado_grado`) VALUES
(1, 'PRIMER GRADO SECUNDARIA', 'S', b'0'),
(2, 'SEGUNDO GRADO SECUNDARIA', 'S', b'1'),
(3, 'TERCER GRADO SECUNDARIA', 'S', b'1'),
(4, 'CUARTO GRADO SECUNDARIA', 'S', b'1'),
(5, 'QUINTO GRADO SECUNDARIA', 'S', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `matricula`
--

CREATE TABLE `matricula` (
  `id_matricula` smallint(6) NOT NULL,
  `fecha_matricula` date NOT NULL,
  `id_apoderado` smallint(6) NOT NULL,
  `id_alumno` smallint(6) NOT NULL,
  `id_anhio` smallint(6) NOT NULL,
  `id_seccion` smallint(6) NOT NULL,
  `id_tipo_relacion` smallint(6) NOT NULL,
  `estado_matricula` bit(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil_usuario`
--

CREATE TABLE `perfil_usuario` (
  `idperfil_usuario` int(11) NOT NULL,
  `nombre_perfil` varchar(25) NOT NULL,
  `abrev_perfil` char(2) NOT NULL,
  `estado_perfil` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `perfil_usuario`
--

INSERT INTO `perfil_usuario` (`idperfil_usuario`, `nombre_perfil`, `abrev_perfil`, `estado_perfil`) VALUES
(1, 'ADMINISTRADOR', 'AD', b'1'),
(2, 'SECRETARIA', 'SE', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secciones`
--

CREATE TABLE `secciones` (
  `id_seccion` smallint(11) NOT NULL,
  `nombre_seccion` varchar(20) NOT NULL,
  `id_grado` int(11) NOT NULL,
  `id_turno` char(1) NOT NULL,
  `estado_seccion` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

CREATE TABLE `tipo_relacion` (
  `id_tipo_relacion` smallint(11) NOT NULL,
  `cod_relacion` char(2) NOT NULL,
  `nombre_relacion` varchar(20) NOT NULL,
  `estado_relacion` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idusuario` smallint(11) NOT NULL,
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
  `idperfil_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idusuario`, `nom_usu`, `clave_usu`, `dni_usu`, `nombres_usu`, `apellidos_usu`, `sexo_usu`, `celular_usu`, `correo_usu`, `direccion_usu`, `fcreacion_usu`, `fbaja_usu`, `obser_usu`, `estado_usu`, `idperfil_usuario`) VALUES
(46, 'jjulcav', 'ea8d414fe25b078a9b8e1516862bddf210e686bd', '71919582', 'Jose Andersson', 'Julca Vasquez', 'M', '978902579', NULL, 'calle chiclayo # 114', '2019-05-24', NULL, NULL, b'1', 1),
(47, 'maritasv', 'a6b7354b8ec74b0550233c5cbf8773c6d28ceef4', '73258572', 'Marita Vanessa ', 'Sanchez Velasquez', 'F', '979241872', NULL, 'CP VISTA ALEGE MZ H LT 22', '2019-05-24', NULL, NULL, b'1', 2),
(48, 'ryeryeryer', '21af3f2067e4c9cbd160a7c3cda809416ef1f849', '85678678', 'Karina', 'Lopez Vilela', 'F', '456786786', NULL, 'dhdhdfhdfh', '2019-05-24', NULL, NULL, b'1', 1);

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
-- Indices de la tabla `grados`
--
ALTER TABLE `grados`
  ADD PRIMARY KEY (`id_grado`);

--
-- Indices de la tabla `matricula`
--
ALTER TABLE `matricula`
  ADD PRIMARY KEY (`id_matricula`);

--
-- Indices de la tabla `perfil_usuario`
--
ALTER TABLE `perfil_usuario`
  ADD PRIMARY KEY (`idperfil_usuario`);

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
  ADD KEY `fk_usuario_perfil_usuario` (`idperfil_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alumno`
--
ALTER TABLE `alumno`
  MODIFY `id_alumno` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT de la tabla `anhio_lectivo`
--
ALTER TABLE `anhio_lectivo`
  MODIFY `idanhio` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `apoderado`
--
ALTER TABLE `apoderado`
  MODIFY `id_apoderado` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT de la tabla `grados`
--
ALTER TABLE `grados`
  MODIFY `id_grado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT de la tabla `matricula`
--
ALTER TABLE `matricula`
  MODIFY `id_matricula` smallint(6) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `perfil_usuario`
--
ALTER TABLE `perfil_usuario`
  MODIFY `idperfil_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `secciones`
--
ALTER TABLE `secciones`
  MODIFY `id_seccion` smallint(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT de la tabla `tipo_relacion`
--
ALTER TABLE `tipo_relacion`
  MODIFY `id_tipo_relacion` smallint(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idusuario` smallint(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;
--
-- Restricciones para tablas volcadas
--

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
