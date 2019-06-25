import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { Concepto,Busqueda } from '../../app.datos';

@Injectable({
  providedIn: 'root'
})
export class ConceptosService {

  constructor(private _http:Http) { }

  public Lista_otros_conceptos(anhio:Busqueda){
    return this._http.post('/api/tesoreria/listar_otros_conceptos',anhio)
    .map(res => res.json())
  }

  public Listar_todos_conceptos(anhio:Busqueda){
    return this._http.post('/api/tesoreria/listar_todos_conceptos',anhio)
    .map(res => res.json())
  }

  public nvo_concepto(concepto:Concepto){
    return this._http.post('/api/tesoreria/insertar_nvo_concepto',concepto)
     .map(data => data.json()).toPromise()
  }

}
