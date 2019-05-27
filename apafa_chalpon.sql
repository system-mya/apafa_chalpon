-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 27-05-2019 a las 23:05:45
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_consultar_nomusuario`(IN `nom` VARCHAR(20))
    NO SQL
SELECT * FROM usuario
WHERE nom_usu=nom
AND estado_usu=1
AND fbaja_usu IS NULL$$

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

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_eliminar_usuario`(IN `id_usu` SMALLINT)
    NO SQL
UPDATE usuario SET estado_usu=0
WHERE idusuario=id_usu$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_iniciar_sesion`(IN `nom` VARCHAR(20), IN `clave` VARCHAR(15), IN `fecha` DATE)
    NO SQL
SELECT * FROM usuario u
INNER JOIN perfil_usuario pu ON u.idperfil_usuario=pu.idperfil_usuario
WHERE u.nom_usu=nom
AND u.clave_usu=SHA(clave)
AND u.estado_usu=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_anhio`(IN `anhio` CHAR(4), IN `finicio` DATE, IN `ffin` INT, IN `descripcion` INT)
    NO SQL
INSERT INTO anhio_lectivo(anhio, finicio_anhio,
ffin_anhio, descripcion_anhio) 
VALUES (anhio,finicio,ffin,descripcion)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_usuario`(IN `nom_usu` VARCHAR(20), IN `clave` VARCHAR(15), IN `dni` CHAR(8), IN `nombres` VARCHAR(45), IN `apellidos` VARCHAR(60), IN `sexo` CHAR(1), IN `celular` CHAR(9), IN `correo` VARCHAR(80), IN `direccion` VARCHAR(80), IN `fcreacion` DATE, IN `obser` VARCHAR(50), IN `perfil` INT)
INSERT INTO usuario(nom_usu, 
clave_usu,dni_usu,nombres_usu,apellidos_usu, 
sexo_usu,celular_usu,correo_usu,
direccion_usu,fcreacion_usu,
obser_usu,idperfil_usuario)
VALUES (nom_usu,SHA(clave),dni,nombres,apellidos,sexo,
celular,correo,direccion,fcreacion,obser,perfil)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_anhio`()
    NO SQL
SELECT idanhio,anhio,finicio_anhio,ffin_anhio,descripcion_anhio,
(CASE
  WHEN condicion_anhio='N' THEN 'NUEVO'
  WHEN condicion_anhio='A' THEN 'APERTURADO'
  WHEN condicion_anhio='R' THEN 'REAPERTURADO'
  ELSE 'CERRADO'
 END) as condicion
  FROM anhio_lectivo
WHERE estado_anhio=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_perfil_usuario`()
    NO SQL
SELECT * FROM perfil_usuario
WHERE estado_perfil=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_usuarios`()
    NO SQL
SELECT u.idusuario,u.apellidos_usu,u.nombres_usu,
u.nom_usu,u.celular_usu,pu.nombre_perfil,
(CASE 
WHEN u.fbaja_usu IS NULL THEN 'ACTIVO'
ELSE 'INACTIVO'
END ) AS estado_usu,
(CASE 
WHEN u.fbaja_usu IS NULL THEN 'blue'
ELSE 'red'
END) as color_estado FROM usuario u
INNER JOIN perfil_usuario pu ON pu.idperfil_usuario=u.idperfil_usuario
WHERE u.estado_usu=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_obtener_usuario`(IN `cod` INT)
    NO SQL
SELECT * FROM usuario u
INNER JOIN perfil_usuario pu ON pu.idperfil_usuario=u.idperfil_usuario
WHERE u.idusuario=cod
AND u.estado_usu=1
AND u.fbaja_usu IS NULL$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_resetear_clave`(IN `id_usu` SMALLINT)
    NO SQL
UPDATE usuario SET clave_usu=SHA('1A2B3C4D')
WHERE idusuario=id_usu$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_update_usuario`(IN `idusu` INT, IN `nom_usu` VARCHAR(20), IN `nombres` VARCHAR(45), IN `apellidos` VARCHAR(60), IN `sexo` CHAR(1), IN `celular` CHAR(9), IN `correo` VARCHAR(80), IN `direccion` VARCHAR(80), IN `fbaja` DATE, IN `obser` VARCHAR(50), IN `perfil` INT)
UPDATE usuario SET nom_usu=nom_usu,nombres_usu=nombres,apellidos_usu=apellidos,sexo_usu=sexo,celular_usu=celular,correo_usu=correo,direccion_usu=direccion,fbaja_usu=fbaja,obser_usu=obser,idperfil_usuario=perfil
WHERE idusuario=idusu$$

DELIMITER ;

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
  `condicion_anhio` char(1) NOT NULL DEFAULT 'N',
  `estado_anhio` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`idanhio`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Volcado de datos para la tabla `anhio_lectivo`
--

INSERT INTO `anhio_lectivo` (`idanhio`, `anhio`, `finicio_anhio`, `ffin_anhio`, `descripcion_anhio`, `condicion_anhio`, `estado_anhio`) VALUES
(1, '2018', '2018-01-31', '2018-12-31', NULL, 'C', b'1');

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
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_perfil_usuario` FOREIGN KEY (`idperfil_usuario`) REFERENCES `perfil_usuario` (`idperfil_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
