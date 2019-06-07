import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { Busqueda,Secciones } from '../../app.datos';


@Injectable({
  providedIn: 'root'
})
export class GradoSeccionService {

  constructor(private _http:Http) { }

  public ListarGrados(){
     return this._http.get('/api/listar_grados')
      .map(res => res.json())
  }

  public ListarGradosActivos(){
    return this._http.get('/api/listar_grados_activos')
     .map(res => res.json())
 }

  public cambiar_estado(grado:Busqueda){
    return this._http.post('/api/cambiar_estado_grado',grado)
     .map(data => data.json()).toPromise()
  }

  public listar_secciones_xgrado(grado:Busqueda){
    return this._http.post('/api/listar_secciones_xgrados',grado)
     .map(data => data.json()).toPromise()
  }

  public nva_seccion(seccion:Secciones){
    return this._http.post('/api/insertar_seccion',seccion)
     .map(data => data.json()).toPromise()
  }

}
