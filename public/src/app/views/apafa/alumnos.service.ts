import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { clsAlumno,clsBusqueda } from '../../app.datos';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  constructor(private _http:Http) { }

  public getListarAlumnos(){
    return this._http.get('/api/apafa/listaralumnos')
     .map(res => res.json())
  }

  public nvo_alumno(alumno:clsAlumno){
    return this._http.post('/api/apafa/insertar_alumno',alumno)
     .map(data => data.json()).toPromise()
  }

  public detalle_alumno(alumno:clsBusqueda){
    return this._http.post('/api/apafa/detalle_alumno',alumno)
     .map(data => data.json()).toPromise()
  }

  // llamando al api ELIMINAR ALUMNO
public eliminar_alumno(alumno:clsBusqueda){
  return this._http.post('/api/apafa/eliminar_alumno',alumno)
   .map(data => data.json()).toPromise()
}

public update_alumno(alumno:clsAlumno){
  return this._http.post('/api/apafa/update_alumno',alumno)
   .map(data => data.json()).toPromise()
}

public historial_matricual(alumno:clsBusqueda){
  return this._http.post('/api/apafa/listar_historial_matricula',alumno)
   .map(data => data.json()).toPromise()
}
  
  
}
