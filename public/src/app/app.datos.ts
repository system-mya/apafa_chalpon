export class Busqueda {
    idbusqueda ?: number;
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
    anhio ?: string;
    id_grado ?: number;
    id_seccion ?: number;
    id_tipo_relacion ?: number;
    estado_matricula ?: boolean;
    doc_alumno ?: string;
    doc_apoderado ?: string;
    datos_alumno ?: string;
    datos_apoderado ?: string;
    sexo_alumno ?: string;
    grado ?: string;
    seccion ?: string;
    
}

export class Tipo_Relacion
{
   id_tipo_relacion ?: number;
   nombre_relacion ?: string;
   estado_relacion ?: boolean;
}

export class Otro_Ingreso
{
    id_otro_ingres ?: number;
    descripcion_ingreso ?: string;
    monto_ingreso ?: number;
    freg_ingreso ?: string;
    doc_encargado_ingreso ?: string;
    datos_encrgado_ingreso ?: string;
    id_usuario ?: string;
    estado_ingreso ?: boolean;
}


export class Recibo 
{
    id_recibo ?: number;
    id_apoderado ?: number;
    id_usuario ?: string;
    doc_apoderado ?: string;
    anhio ?: string;
    datos_apoderado ?: string;
    direccion_apoderado ?: string;
    celular_apoderado ?: string;
    correo_apoderado ?: string;
    mtotal_recibo ?: number;
    num_recibo ?:string;
    ober_recibo ?: string;
    estado_recibo ?: boolean;
    detalle ?: Detalle_Deuda;
    contador ?: number;
}

export class Detalle_Deuda
{
    id_detalle_deuda ?: number;
    tipo_pago ?: string;
    descripcion_concepto ?: string;
    saldo_deuda ?: number;
    estado_deuda ?: string;
    monto ?: number;
    monto_invalid ?: boolean;
}


export class Compras 
{
    id_compra ?: number;
    id_usuario ?: string;
    id_anhio ?: number;
    anhio ?: string;
    tipo_compra ?: string;
    num_compra ?: string;
    razon_social_compra ?: string;
    ruc_compra ?: string;
    fecha_compra ?: string;
    freg_compra ?: string;
    doc_encargado_compra ?: string;
    encargado_compra ?: string;
    total_compra ?: number;
    estado_compra ?: boolean;
    detalle ?: any ;
}

export class Detalle_Compra
{
    id_detalle_compra ?: number;
    id_compra ?: number;
    nom_producto ?: string;
    cantidad ?: number;
    medida ?: string;
    precio_unit ?: number;
}


export class Reunion
{
    id_reunion ?: number;
    motivo_reunion ?: string;
    fecha_reunion ?: string;
    hora_reunion ?: string;
    id_concepto ?: number;
    descipcion_concepto ?: string;
    monto_concepto ?: string;
    lista_reunion ?: boolean;
    estado_reunion ?: boolean;
}

export class Concepto
{
  id_concepto ?: number;
  descripcion_concepto ?: string;
  monto_concepto ?: number;
}