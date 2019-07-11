import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { clsUsuario,clsBusqueda } from '../../app.datos';
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private _http:Http) {}

 public getListarUsiarios(){
    return this._http.get('/api/administracion/listar_usuarios')
     .map(res => res.json())
 }

 public getListarPerfiles(){
  return this._http.get('/api/administracion/listar_perfiles')
   .map(res => res.json())
}

public nvo_usuario(user:clsUsuario){
  return this._http.post('/api/administracion/insertar_usuario',user)
   .map(data => data.json()).toPromise()
}

public obtener_usuario(user:clsBusqueda){
  return this._http.post('/api/administracion/obtener_usuario',user)
   .map(data => data.json()).toPromise()
}

public nom_usuario(user:clsBusqueda){
  return this._http.post('/api/administracion/nom_usuario',user)
   .map(data => data.json()).toPromise()
}

public update_usuario(user:clsUsuario){
  return this._http.post('/api/administracion/update_usuario',user)
   .map(data => data.json()).toPromise()
}

// llamando al api resetear usuario
public resetear_usuario(user:clsBusqueda){
  return this._http.post('/api/administracion/resetear_usuario',user)
   .map(data => data.json()).toPromise()
}

// llamando al api ELIMINAR usuario
public eliminar_usuario(user:clsBusqueda){
  return this._http.post('/api/administracion/eliminar_usuario',user)
   .map(data => data.json()).toPromise()
}

public update_clave(usuario:clsBusqueda){
  return this._http.post('/api/administracion/update_clave',usuario)
   .map(data => data.json()).toPromise()
}
}
