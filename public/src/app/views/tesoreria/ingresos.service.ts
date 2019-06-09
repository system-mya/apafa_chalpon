import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { Otro_Ingreso,Busqueda } from '../../app.datos';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {

  constructor(private _http:Http) { }

  public getLista_Ingresos(anhio:Busqueda){
    return this._http.post('/api/tesoreria/listar_tipo_relacion',anhio)
    .map(res => res.json())
  }

  public nvo_otro_ingreso(ingreso:Otro_Ingreso){
    return this._http.post('/api/tesoreria/insertar_ingreso',ingreso)
     .map(data => data.json()).toPromise()
  }

}
