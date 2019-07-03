import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { clsMatricula,clsBusqueda,clsLibro_Matricula } from '../../app.datos';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  constructor(private _http:Http) { }

  public getListarMatriculados(){
    return this._http.get('/api/apafa/listar_matriculados')
     .map(res => res.json())
 }

 public buscar_datos_xdoc(datos:clsBusqueda){
  return this._http.post('/api/apafa/datos_alumno_apoderado',datos)
   .map(data => data.json()).toPromise()
}

public getListar_tipo_relacion(){
  return this._http.get('/api/apafa/listar_tipo_relacion')
   .map(res => res.json())
}

public nva_matricula(matricula:clsMatricula){
  return this._http.post('/api/apafa/insertar_matricula',matricula)
   .map(data => data.json()).toPromise()
}

public libros_xgrado(dato:clsBusqueda){
  return this._http.post('/api/apafa/listar_libros_xgrado',dato)
   .map(data => data.json()).toPromise()
}

public libros_xmatricula(dato:clsBusqueda){
  return this._http.post('/api/apafa/listar_libros_xmatricula',dato)
   .map(data => data.json()).toPromise()
}

public insertar_libro_xmatricula(libro:clsLibro_Matricula){
  return this._http.post('/api/apafa/insertar_libro_matricula',libro)
   .map(data => data.json()).toPromise()
}

public quitar_libro_alumno(dato:clsBusqueda){
  return this._http.post('/api/apafa/quitar_libro_alumno',dato)
   .map(data => data.json()).toPromise()
}

public registrar_devolucion_libro(dato:clsBusqueda){
  return this._http.post('/api/apafa/registrar_devolucion_libro',dato)
   .map(data => data.json()).toPromise()
}

}
