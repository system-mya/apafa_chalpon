import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { Apoderado,Busqueda } from '../../app.datos';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  constructor(private _http:Http) { }

  public getListarMatriculados(){
    return this._http.get('/api/apafa/listar_matriculados')
     .map(res => res.json())
 }

 public buscar_datos_xdoc(datos:Busqueda){
  return this._http.post('/api/apafa/datos_alumno_apoderado',datos)
   .map(data => data.json()).toPromise()
}
}
