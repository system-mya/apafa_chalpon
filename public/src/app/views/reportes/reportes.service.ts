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

}
