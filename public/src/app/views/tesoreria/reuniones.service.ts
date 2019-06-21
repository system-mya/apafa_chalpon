import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { Compras,Busqueda } from '../../app.datos';

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
}
