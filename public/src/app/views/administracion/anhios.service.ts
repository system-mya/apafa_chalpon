import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { Usuario,Busqueda } from '../../app.datos';
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
 
  
}
