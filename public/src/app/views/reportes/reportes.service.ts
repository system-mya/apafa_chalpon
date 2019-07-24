import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { clsBusqueda } from '../../app.datos';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private _http:Http) { }

  public listar_apoderados_xanhio(dato:clsBusqueda){
    return this._http.post('/api/reportes/listar_apoderados_xanhio',dato)
     .map(data => data.json()).toPromise()
  }

  public listar_alumnos_xapoderado(dato:clsBusqueda){
    return this._http.post('/api/reportes/listar_alumnos_xapoderado',dato)
     .map(data => data.json()).toPromise()
  }

  public listar_grados_xmatricula(anhio:clsBusqueda){
    return this._http.post('/api/reportes/listar_grados_xmatricula',anhio)
     .map(data => data.json()).toPromise()
  }

  public pa_listar_matriculados_xanhio(anhio:clsBusqueda){
    return this._http.post('/api/reportes/pa_listar_matriculados_xanhio',anhio)
    .map(res => res.json())
  }

  public listar_alumnos_grado_seccion(reporte:clsBusqueda){
    return this._http.post('/api/reportes/listar_alumnos_grado_seccion',reporte)
    .map(res => res.json()).toPromise()
  }

}
