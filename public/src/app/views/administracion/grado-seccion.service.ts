import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
@Injectable({
  providedIn: 'root'
})
export class GradoSeccionService {

  constructor(private _http:Http) { }

  public ListarGrados(){
     return this._http.get('/api/listar_grados')
      .map(res => res.json())
  }
}
