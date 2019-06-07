export class Busqueda {
    idbusqueda : number;
    datobusqueda ?: string;
}

export class Usuario {
    public idusuario ?: number
    public nom_usu : string;
    public clave_usu:string;
    public dni_usu : string;
    public nombres_usu : string;
    public apellidos_usu : string;
    public correo_usu : string;
    public sexo_usu : string;
    public celular_usu : string;
    public direccion_usu : string;
    public fecha_usu : string;
    public obser_usu : string;
    public perfil_usu : number;
    public nombre_perfil ?: string;
    public fcreacion_usu ?: Date;
    public fbaja_usu ?: Date;
    public baja_usu ?: string;
        
}

export class Perfiles {
    public idperfil : number;
    public nom_perfil : string;
    public abrev_perfil : string;
    public estado_perfil : boolean;
    
}

export class Anhio_Lectivo
{    
    public idanhio ?: number;
    public anhio ?: string;
    public finicio_anhio ?:string;
    public ffin_anhio ?:string;
    public descripcion_anhio ?:string;
    public condicion_anhio ?:string;
    public estado_anhio ?:boolean;
}

export class Grados
{
  public id_grado ?: number;
  public descripcion_grado ?: string;
  public nivel_grado ?: string;
  public estado ?: string;
  public estado_grado ?: boolean;
  public total ?: number;
}

export class Secciones
{
    public id_seccion ?: number;
    public nombre_seccion ?: string;
    public id_grado ?: number;
    public id_turno ?: string;
    public estado_seccion ?: boolean;
}

export class Alumno
{
    id_alumno ?: number;
    tdoc_alumno ?: string;
    doc_alumno ?: string;
    apellidos_alumno ?: string;
    nombres_alumno ?: string;
    sexo_alumno ?: string;
    fnac_alumno ?: string;
    telefono_alumno ?: string;
    celular_alumno ?: string;
    direccion_alumno ?: string;
    correo_alumno ?: string;
    procedencia_alumno ?: string;
    apellidos_padre ?: string;
    nombres_padre ?: string;
    celular_padre ?: string;
    correo_padre ?: string;
    apellidos_madre ?: string;
    nombres_madre ?: string;
    celular_madre ?: string;
    correo_madre ?: string;
    estado_alumno ?: boolean;
}

export class Apoderado
{
    id_apoderado ?: number;
    tdoc_apoderado ?: string;
    doc_apoderado ?: string;
    apellidos_apoderado ?: string;
    nombres_apoderado ?: string;
    sexo_apoderado ?: string;
    celular_apoderado ?: string;
    direccion_apoderado ?: string;
    correo_apoderado ?: string;
    estado_apoderado ?: boolean;

}

export class Matricula 
{
    id_matricula ?: number;
    fecha_matricula ?: string;
    id_apoderado ?: number;
    id_alumno ?: number;
    id_anhio ?: number;
    id_grado ?: number;
    id_seccion ?: number;
    id_tipo_relacion ?: number;
    estado_matricula ?: boolean;
    doc_alumno ?: string;
    datos_alumno ?: string;
    sexo_alumno ?: string;
    
}