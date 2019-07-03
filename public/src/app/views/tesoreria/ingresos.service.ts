import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { clsOtro_Ingreso,clsBusqueda,clsRecibo } from '../../app.datos';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {

  constructor(private _http:Http) { }

  public getLista_Ingresos(anhio:clsBusqueda){
    return this._http.post('/api/tesoreria/listar_ingresos_xperiodo',anhio)
    .map(res => res.json())
  }

  public nvo_otro_ingreso(ingreso:clsOtro_Ingreso){
    return this._http.post('/api/tesoreria/insertar_ingreso',ingreso)
     .map(data => data.json()).toPromise()
  }

  public Listar_Detalle_Deuda(recibo:clsRecibo){
    return this._http.post('/api/tesoreria/listar_detalle_deuda',recibo)
    .map(data => data.json()).toPromise()
  }

  public nvo_recibo(recibo:clsRecibo){
    return this._http.post('/api/tesoreria/insertar_nvo_recibo',recibo)
     .map(data => data.json()).toPromise()
  }

  public get_obtener_detalle_recibo(recibo:clsBusqueda){
    return this._http.post('/api/tesoreria/obtener_detalle_recibo',recibo)
    .map(res => res.json())
  }


}
