import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { clsApoderado,clsBusqueda,clsDetalle_Deuda} from '../../app.datos';

@Injectable({
  providedIn: 'root'
})
export class ApoderadoService {

  constructor(private _http:Http) { }

  public getListarApoderados(){
    return this._http.get('/api/apafa/listar_apoderados')
     .map(res => res.json())
 }

  public nvo_apoderado(apoderado:clsApoderado){
    return this._http.post('/api/apafa/insertar_apoderado',apoderado)
     .map(data => data.json()).toPromise()
  }

  public nva_deuda_apoderado(deuda:clsDetalle_Deuda){
    return this._http.post('/api/apafa/insertar_deuda_apoderado',deuda)
     .map(data => data.json()).toPromise()
  }


  public detalle_apoderado(apoderado:clsBusqueda){
    return this._http.post('/api/apafa/detalle_apoderado',apoderado)
     .map(data => data.json()).toPromise()
  }

  public update_apoderado(apoderado:clsApoderado){
    return this._http.post('/api/apafa/update_apoderado',apoderado)
     .map(data => data.json()).toPromise()
  }

  public eliminar_apoderado(apoderado:clsBusqueda){
    return this._http.post('/api/apafa/eliminar_apoderado',apoderado)
     .map(data => data.json()).toPromise()
  }

  public eliminar_deuda(deuda:clsBusqueda){
    return this._http.post('/api/apafa/eliminar_deuda_apoderado',deuda)
     .map(data => data.json()).toPromise()
  }
}
