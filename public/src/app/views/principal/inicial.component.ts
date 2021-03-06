import { Component, OnInit } from '@angular/core';
import { AlumnosService } from '../apafa/alumnos.service';
import { ApoderadoService } from '../apafa/apoderado.service';
import { UsuariosService } from '../administracion/usuarios.service';
import { MatriculaService } from '../apafa/matricula.service';
@Component({
  templateUrl: 'inicial.component.html'
})
export class InicialComponent implements OnInit {
  constructor(private _AlumnosServicios:AlumnosService,
    private _ApoderadoServicio:ApoderadoService,
    private _UsuariosServicios:UsuariosService,
    private _MatriculaServicios:MatriculaService) {
    this.Cargar_Alumnos();
    this.Cargar_Apoderados();
    this.Cargar_Usuarios();
    this.Cargar_Matriculados();
  }
  ngOnInit(): void {
   
  }
 public contador_alumnos : number;
  Cargar_Alumnos (){
    this._AlumnosServicios.getListarAlumnos().subscribe(
      data => {
        if(data.data!=undefined){
          this.contador_alumnos = data.data.length;
        }else{
          this.contador_alumnos = 0;
        }
        
      }
    )
  }

  public contador_apoderados : number;
 Cargar_Apoderados (){
  this._ApoderadoServicio.getListarApoderados().subscribe(
    data => {   
      if(data.data!=undefined){
        this.contador_apoderados = data.data.length;
      }else{
        this.contador_apoderados = 0;
      }
          
     })
   }
  
   public contador_usuarios : number;
   Cargar_Usuarios (){
    this._UsuariosServicios.getListarUsiarios().subscribe(
      data => {
        if(data.data!=undefined){
          this.contador_usuarios = data.data.length;
        }else{
          this.contador_usuarios = 0;
        }
        
      }
    )
  }

  public contador_matriculados : number;
  Cargar_Matriculados (){
   this._MatriculaServicios.getListarMatriculados().subscribe(
     data => {
        if(data.data!=undefined){
           this.contador_matriculados = data.data.length; 
        }else{
          this.contador_matriculados = 0;
        }     
     })
   }
}
