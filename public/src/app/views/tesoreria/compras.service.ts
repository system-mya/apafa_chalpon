import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { Compras } from '../../app.datos';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  constructor(private _http:Http) { }

  public nva_compra(compra:Compras){
    return this._http.post('/api/tesoreria/insertar_nueva_compra',compra)
     .map(data => data.json()).toPromise()
  }

}
