import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { clsCompras,clsBusqueda,clsOtros_Movimiento } from '../../app.datos';

@Injectable({
  providedIn: 'root'
})
export class EgresosService {

  constructor(private _http:Http) { }

  public nva_compra(compra:clsCompras){
    return this._http.post('/api/tesoreria/insertar_nueva_compra',compra)
     .map(data => data.json()).toPromise()
  }

  public getLista_compras_xperiodo(anhio:clsBusqueda){
    return this._http.post('/api/tesoreria/listar_egresos_xperiodo',anhio)
    .map(res => res.json())
  }

  public Obtener_Detalle_Compra(compra:clsBusqueda){
    return this._http.post('/api/tesoreria/listar_detalle_compra',compra)
    .map(res => res.json())
  }

  public nvo_otro_egreso(movimiento:clsOtros_Movimiento){
    return this._http.post('/api/tesoreria/insertar_movimiento',movimiento)
     .map(data => data.json()).toPromise()
  }

  
    // llamando al api ELIMINAR MOVIMIENTO
public eliminar_ingreso_egreso(movimiento:clsBusqueda){
  return this._http.post('/api/tesoreria/eliminar_ingreso_egreso',movimiento)
   .map(data => data.json()).toPromise()
}


}
