-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-05-2019 a las 00:11:37
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_consultar_nomusuario` (IN `nom` VARCHAR(20))  NO SQL
SELECT * FROM usuario
WHERE nom_usu=nom
AND estado_usu=1
AND fbaja_usu IS NULL$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_detalle_usuario` (IN `usuario` INT)  NO SQL
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_iniciar_sesion` (IN `nom` VARCHAR(20), IN `clave` VARCHAR(15), IN `fecha` DATE)  NO SQL
SELECT * FROM usuario u
INNER JOIN perfil_usuario pu ON u.idperfil_usuario=pu.idperfil_usuario
WHERE u.nom_usu=nom
AND u.clave_usu=SHA(clave)
AND u.estado_usu=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_insertar_usuario` (IN `nom_usu` VARCHAR(20), IN `clave` VARCHAR(15), IN `dni` CHAR(8), IN `nombres` VARCHAR(45), IN `apellidos` VARCHAR(60), IN `sexo` CHAR(1), IN `celular` CHAR(9), IN `correo` VARCHAR(80), IN `direccion` VARCHAR(80), IN `fcreacion` DATE, IN `obser` VARCHAR(50), IN `perfil` INT)  INSERT INTO usuario(nom_usu, 
clave_usu,dni_usu,nombres_usu,apellidos_usu, 
sexo_usu,celular_usu,correo_usu,
direccion_usu,fcreacion_usu,
obser_usu,idperfil_usuario)
VALUES (nom_usu,SHA(clave),dni,nombres,apellidos,sexo,
celular,correo,direccion,fcreacion,obser,perfil)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_perfil_usuario` ()  NO SQL
SELECT * FROM perfil_usuario
WHERE estado_perfil=1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_listar_usuarios` ()  NO SQL
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
WHERE u.estado_usu=1
ORDER BY u.apellidos_usu$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pa_obtener_usuario` (IN `cod` INT)  NO SQL
SELECT * FROM usuario u
INNER JOIN perfil_usuario pu ON pu.idperfil_usuario=u.idperfil_usuario
WHERE u.idusuario=cod
AND u.estado_usu=1
AND u.fbaja_usu IS NULL$$

DELIMITER ;

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
  `obser_usu` varchar(50) DEFAULT NULL,
  `estado_usu` bit(1) NOT NULL DEFAULT b'1',
  `idperfil_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idusuario`, `nom_usu`, `clave_usu`, `dni_usu`, `nombres_usu`, `apellidos_usu`, `sexo_usu`, `celular_usu`, `correo_usu`, `direccion_usu`, `fcreacion_usu`, `fbaja_usu`, `obser_usu`, `estado_usu`, `idperfil_usuario`) VALUES
(1, 'jjulcav', '0ab991f17474ae5db835f57e1f758b6fc3642239', '71919582', 'Jose Andersson', 'Julca Vasquez', 'M', '978902579', 'piscis16931@hotmail.com', 'calle chiclayo #114', '2019-04-12', '2019-12-31', '', b'1', 1),
(2, 'mvsanchezv', '7c222fb2927d828af22f592134e8932480637c0d', '73258572', 'Marita Vanessa', 'Sanchez Velasquez', 'F', '979241872', '', 'VISTA ALEGRE CRUZ DE LA ESPERANZA', '2019-04-25', '2019-04-25', 'asfasf', b'1', 1),
(36, '6546456556654', 'a642a77abd7d4f51bf9226ceaf891fcbb5b299b8', '11111111', '564654', 'rtstert', 'M', '564654654', NULL, 'hgfhf66', '2019-04-27', '2019-04-27', NULL, b'1', 1),
(37, 'jalexanderv', '8886dddebc767898396b273571507c4fb8f882bc', '97941603', 'Jose Alexander', 'Rubio Vasquez', 'M', '979416039', NULL, 'calle jose quiñones # 54', '2019-04-29', '2019-04-29', NULL, b'1', 1),
(38, 'sadfasf', '2d9e88102467bf1ca7b38b4b8875c5d142f81e97', '54165465', 'Susana Esther ', 'Vásquez Delgado', 'F', '634346346', NULL, 'fasfsfasf', '2019-04-29', NULL, NULL, b'1', 2),
(39, 'javierjz', '41987e359a4665fdbc9631c4b19624f871b80491', '16686223', 'Francisco Javier', 'Julca Zeña', 'M', '978989288', NULL, 'calle chiclayo #114', '2019-05-02', NULL, NULL, b'1', 1),
(41, 'dfgdfgdfg', '7f2f68e83f1b2b48ac9b833aa4fdfcc73dbaf5fe', '35325325', 'dfgdsg', 'dsgdsg', 'M', '342523523', NULL, 'rgfdgfdgdfgdfgdfgdfgdfg', '2019-05-09', NULL, NULL, b'1', 1),
(42, 'dfgdfgdfg', 'dc3a17f33f25c05c0effeda5238bb9c3cbec2997', '35235325', 'erewr', 'werewr', 'M', '532542353', NULL, 'rfgdfgdfgdfg', '2019-05-09', NULL, NULL, b'1', 2),
(43, '346346346', '1dd0a7bc412df95de0b48bb73d30b81a87ed2e19', '43543543', 'hdfh', 'dfhdfh', 'M', '436346346', NULL, '6346346346', '2019-05-09', NULL, NULL, b'1', 2),
(44, 'ghjghjghjghj', '426a0a1a058054bf62c65b8a4236cbea3b320741', '35754745', 'gfjngfj', 'fgjfgj', 'F', '745754745', NULL, 'hjhgjghj', '2019-05-09', NULL, NULL, b'1', 2),
(45, 'fdhdfh', '22653ab29b7d6f06608336cefb329ba8fcfe0781', '54645645', 'dffdhfdh', 'fdhdfhfdh', 'F', '525325235', NULL, 'fdgfdhdfh', '2019-05-10', NULL, NULL, b'1', 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `perfil_usuario`
--
ALTER TABLE `perfil_usuario`
  ADD PRIMARY KEY (`idperfil_usuario`);

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
-- AUTO_INCREMENT de la tabla `perfil_usuario`
--
ALTER TABLE `perfil_usuario`
  MODIFY `idperfil_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idusuario` smallint(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;
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
