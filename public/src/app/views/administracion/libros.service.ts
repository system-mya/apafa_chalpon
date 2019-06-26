import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { Libro } from '../../app.datos';
@Injectable({
  providedIn: 'root'
})
export class LibrosService {

  constructor(private _http:Http) { }

  public Listar_Libros_Activos(){
    return this._http.get('/api/listar_libros_activos')
     .map(res => res.json())
  }

   //REGISTRAR NUEVO LIBRO
 public nvo_libro(libro:Libro){
  return this._http.post('/api/insertar_libro',libro)
   .map(data => data.json()).toPromise()
}

   //MODIFICAR LIBRO
   public update_libro(libro:Libro){
    return this._http.post('/api/update_libro',libro)
     .map(data => data.json()).toPromise()
  }
}
