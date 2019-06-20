import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { Compras,Busqueda } from '../../app.datos';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  constructor(private _http:Http) { }

  public nva_compra(compra:Compras){
    return this._http.post('/api/tesoreria/insertar_nueva_compra',compra)
     .map(data => data.json()).toPromise()
  }

  public getLista_compras_xperiodo(anhio:Busqueda){
    return this._http.post('/api/tesoreria/listar_compras_xperiodo',anhio)
    .map(res => res.json())
  }

  public getObtener_Detalle_Compra(compra:Busqueda){
    return this._http.post('/api/tesoreria/listar_detalle_compra',compra)
    .map(res => res.json())
  }

}
