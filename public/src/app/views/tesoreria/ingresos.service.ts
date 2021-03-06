import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { clsMovimiento,clsBusqueda,clsRecibo } from '../../app.datos';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {

  constructor(private _http:Http) { }

  public Lista_Ingresos(anhio:clsBusqueda){
    return this._http.post('/api/tesoreria/listar_ingresos_xperiodo',anhio)
    .map(res => res.json())
  }

  public nvo_otro_ingreso(ingreso:clsMovimiento){
    return this._http.post('/api/tesoreria/insertar_movimiento',ingreso)
     .map(data => data.json()).toPromise()
  }

  public Listar_Detalle_Deuda(recibo:clsBusqueda){
    return this._http.post('/api/tesoreria/listar_detalle_deuda',recibo)
    .map(data => data.json()).toPromise()
  }

  public nvo_recibo(recibo:clsRecibo){
    return this._http.post('/api/tesoreria/insertar_nvo_recibo',recibo)
     .map(data => data.json()).toPromise()
  }

  public obtener_detalle_recibo(recibo:clsBusqueda){
    return this._http.post('/api/tesoreria/obtener_detalle_recibo',recibo)
    .map(res => res.json())
  }

  public obtener_detalle_movimiento(recibo:clsBusqueda){
    return this._http.post('/api/tesoreria/obtener_detalle_movimiento',recibo)
    .map(res => res.json()).toPromise()
  }

    // llamando al api ELIMINAR MOVIMIENTO
public eliminar_ingreso_egreso(movimiento:clsBusqueda){
  return this._http.post('/api/tesoreria/eliminar_ingreso_egreso',movimiento)
   .map(data => data.json()).toPromise()
}



}
