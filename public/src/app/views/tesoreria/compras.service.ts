import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { clsCompras,clsBusqueda } from '../../app.datos';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  constructor(private _http:Http) { }

  public nva_compra(compra:clsCompras){
    return this._http.post('/api/tesoreria/insertar_nueva_compra',compra)
     .map(data => data.json()).toPromise()
  }

  public getLista_compras_xperiodo(anhio:clsBusqueda){
    return this._http.post('/api/tesoreria/listar_compras_xperiodo',anhio)
    .map(res => res.json())
  }

  public getObtener_Detalle_Compra(compra:clsBusqueda){
    return this._http.post('/api/tesoreria/listar_detalle_compra',compra)
    .map(res => res.json())
  }

}
