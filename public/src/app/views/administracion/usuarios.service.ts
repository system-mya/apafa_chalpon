import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { Usuario,Busqueda } from '../../app.datos';
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private _http:Http) { }

 public getListarUsiarios(){
    return this._http.get('/api/listar_usuarios')
     .map(res => res.json())
 }

 public getListarPerfiles(){
  return this._http.get('/api/listar_perfiles')
   .map(res => res.json())
}

 public  nvo_usuario(user:Usuario){
  return this._http.post('/api/insertar_usuario',user)
   .map(data => data.json()).toPromise()
}

public detalle_usuario(user:Busqueda){
  return this._http.post('/api/detalle_usuario',user)
   .map(data => data.json()).toPromise()
}

public editar_usuario(user:Busqueda){
  return this._http.post('/api/editar_usuario',user)
   .map(data => data.json()).toPromise()
}

public nom_usuario(user:Busqueda){
  return this._http.post('/api/nom_usuario',user)
   .map(data => data.json()).toPromise()
}

public update_usuario(user:Usuario){
  return this._http.post('/api/update_usuario',user)
   .map(data => data.json()).toPromise()
}

// llamando al api resetear usuario
public resetear_usuario(user:Busqueda){
  return this._http.post('/api/resetear_usuario',user)
   .map(data => data.json()).toPromise()
}

// llamando al api ELIMINAR usuario
public eliminar_usuario(user:Busqueda){
  return this._http.post('/api/eliminar_usuario',user)
   .map(data => data.json()).toPromise()
}
}
