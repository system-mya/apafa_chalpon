import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { Usuario,Busqueda } from '../../app.datos';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  constructor(private _http:Http) { }

  public getListarAlumnos(){
    return this._http.get('/api/listaralumnos')
     .map(res => res.json())
  }
}
