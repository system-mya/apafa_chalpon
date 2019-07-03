import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { clsAnhio_Lectivo,clsBusqueda } from '../../app.datos';
@Injectable({
  providedIn: 'root'
})
export class AnhiosService {
  constructor(private _http:Http) { }


 //LISTAR AÑOS LECTIVOS
  public getListarAnhios(){
   return this._http.get('/api/listar_anhio')
    .map(res => res.json())
 }

 //REGISTRAR NUEVO AÑO LECTIVO
 public nvo_anhio(anhio:clsAnhio_Lectivo){
  return this._http.post('/api/insertar_anhio',anhio)
   .map(data => data.json()).toPromise()
}

// LLAMADO AL API REST UPDATE_ANHIO_XCRITERIO
public update_anhio_xcriterio(anhio:clsBusqueda){
  return this._http.post('/api/administracion/update_anhio_xcriterio',anhio)
   .map(data => data.json()).toPromise()
}





}
