import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { Reunion,Busqueda } from '../../app.datos';

@Injectable({
  providedIn: 'root'
})
export class ReunionesService {

  constructor(private _http:Http) { }

  public getLista_reuniones_xperiodo(anhio:Busqueda){
    return this._http.post('/api/tesoreria/listar_reuniones_xperiodo',anhio)
    .map(res => res.json())
  }

  public getLista_otros_conceptos(anhio:Busqueda){
    return this._http.post('/api/tesoreria/listar_otros_conceptos',anhio)
    .map(res => res.json())
  }

  public nva_reunion(reunion:Reunion){
    return this._http.post('/api/tesoreria/insertar_nva_reunion',reunion)
     .map(data => data.json()).toPromise()
  }

  public generar_lista_firmas_reunion(dato:Busqueda){
    return this._http.post('/api/tesoreria/generar_lista_firmas',dato)
     .map(data => data.json()).toPromise()
  }

  public listar_apoderados_reunion(dato:Busqueda){
    return this._http.post('/api/tesoreria/listar_apoderados_reunion',dato)
    .map(res => res.json())
  }

  public registrar_asistencia(dato:Busqueda){
    return this._http.post('/api/tesoreria/registrar_asistencia_reunion',dato)
     .map(data => data.json()).toPromise()
  }


}
