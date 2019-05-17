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

export class CHARACTERS
{
    
    public idusuario : number;
    public apellidos_usu : string;
    public celular_usu:string;
}