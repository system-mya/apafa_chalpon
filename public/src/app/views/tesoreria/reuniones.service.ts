import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { clsReunion,clsBusqueda } from '../../app.datos';

@Injectable({
  providedIn: 'root'
})
export class ReunionesService {

  constructor(private _http:Http) { }

  public getLista_reuniones_xperiodo(anhio:clsBusqueda){
    return this._http.post('/api/tesoreria/listar_reuniones_xperiodo',anhio)
    .map(res => res.json())
  }

  public nva_reunion(reunion:clsReunion){
    return this._http.post('/api/tesoreria/insertar_nva_reunion',reunion)
     .map(data => data.json()).toPromise()
  }

  public generar_lista_firmas_reunion(dato:clsBusqueda){
    return this._http.post('/api/tesoreria/generar_lista_firmas',dato)
     .map(data => data.json()).toPromise()
  }

  public listar_apoderados_reunion(dato:clsBusqueda){
    return this._http.post('/api/tesoreria/listar_apoderados_reunion',dato)
    .map(res => res.json())
  }

  public registrar_asistencia(dato:clsBusqueda){
    return this._http.post('/api/tesoreria/registrar_asistencia_reunion',dato)
     .map(data => data.json()).toPromise()
  }

  public eliminar_reunion(reunion:clsBusqueda){
    return this._http.post('/api/tesoreria/eliminar_reunion',reunion)
    .map(data => data.json()).toPromise()
  }

  public update_asistencia_reunion(reunion:clsReunion){
    return this._http.post('/api/tesoreria/update_asistencia_reunion',reunion)
    .map(data => data.json()).toPromise()
  }

  public enviar_notificaciones(reunion:clsBusqueda){
    return this._http.post('/api/tesoreria/notificaciones',reunion)
    .map(data => data.json()).toPromise()
  }



}
