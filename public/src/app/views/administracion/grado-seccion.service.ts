import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { clsBusqueda,clsSecciones } from '../../app.datos';


@Injectable({
  providedIn: 'root'
})
export class GradoSeccionService {

  constructor(private _http:Http) { }

  public ListarGrados(){
     return this._http.get('/api/administracion/listar_grados')
      .map(res => res.json())
  }

  public ListarGradosActivos(){
    return this._http.get('/api/administracion/listar_grados_activos')
     .map(res => res.json())
 }

  public cambiar_estado(grado:clsBusqueda){
    return this._http.post('/api/administracion/cambiar_estado_grado',grado)
     .map(data => data.json()).toPromise()
  }

  public listar_secciones_xgrado(grado:clsBusqueda){
    return this._http.post('/api/administracion/listar_secciones_xgrados',grado)
     .map(data => data.json()).toPromise()
  }

  public nva_seccion(seccion:clsSecciones){
    return this._http.post('/api/administracion/insertar_seccion',seccion)
     .map(data => data.json()).toPromise()
  }

  // LLAMADO AL API REST ELIMINAR_SECCION
public eliminar_seccion(seccion:clsBusqueda){
  return this._http.post('/api/administracion/eliminar_seccion',seccion)
   .map(data => data.json()).toPromise()
}

}
