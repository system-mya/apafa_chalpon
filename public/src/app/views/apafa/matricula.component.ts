import { Component,ViewEncapsulation,ViewChild } from '@angular/core';
import { MatriculaService } from './matricula.service';
import { NgForm } from '@angular/forms';
import { GradoSeccionService } from './../administracion/grado-seccion.service';
import { ToastrService } from 'ngx-toastr';
import {MatPaginator, MatSort, MatTableDataSource,TooltipPosition} from '@angular/material';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Matricula,Grados,Secciones,Tipo_Relacion, Busqueda} from '../../app.datos';
import { LoadingBarService } from '@ngx-loading-bar/core';
declare var swal: any;

@Component({
  templateUrl: 'matricula.component.html',
  styleUrls: ['apafa.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MatriculaComponent {
  @ViewChild('NvaMatriculaModal') public NvaMatriculaModal: ModalDirective;
  @ViewChild('myForm') mytemplateForm : NgForm;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public f = new Date();
  displayedColumns: string[] = ['doc_alumno', 'apellidos_alumno','sexo_alumno','num_contacto','opciones_alumno'];
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  public matricula : Matricula = {};
  public DatoBusqueda : Busqueda;
  constructor(private _MatriculaServicios:MatriculaService,private toastr: ToastrService,
    private _GradoServicios:GradoSeccionService,private loadingBar: LoadingBarService) { 
    this.ListarMatriculados();
    this.DatoBusqueda = {
      idbusqueda:0,
      datobusqueda:''
    }
  }

 DataApoderados : any = [];
 ListarMatriculados (){
  this._MatriculaServicios.getListarMatriculados().subscribe(
    data => {
      if(data.status==1){
       this.DataApoderados = data.data;
       this.dataSource = new MatTableDataSource(this.DataApoderados);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
      }else{
        this.toastr.error(data.message, 'Aviso!',{
          positionClass: 'toast-top-right'
        });
      }
      
    }
  )
}

btnNueva_Matricula(){
  this.NvaMatriculaModal.show();
  this.ListarGrados();
  this.ListarTipoRelacion();
  this.matricula = {
    id_grado:0,
    id_seccion:0,
    id_tipo_relacion:0,
    fecha_matricula:this.f.getFullYear() + '-' + (this.f.getMonth()+1).toString().padStart(2, "0") + '-' + this.f.getDate().toString().padStart(2, "0")
  }
}

frmMat_hide(opc){
  if(opc=="N"){
    this.NvaMatriculaModal.hide();
    this.mytemplateForm.resetForm();
  }else{
    if(opc=="D"){

    }else{
      if(opc=="E"){
        
      }
    }
  }
}

DataGrado : Grados;
  ListarGrados (){
   this._GradoServicios.ListarGradosActivos().subscribe(
     data => {
       if(data.status==1){
         this.DataGrado = data.data;
       }else{
         this.toastr.error("Consulta Sin Exito", 'Aviso!',{
           positionClass: 'toast-top-right'
         });
       }
       
     }
   )
 }

 DataRelaciones : Tipo_Relacion;
  ListarTipoRelacion (){
   this._MatriculaServicios.getListar_tipo_relacion().subscribe(
     data => {
       if(data.status==1){
         this.DataRelaciones = data.data;
       }else{
         this.toastr.error("Consulta Sin Exito", 'Aviso!',{
           positionClass: 'toast-top-right'
         });
       }
       
     }
   )
 }

 DataSecciones : Secciones;
 Listar_Secciones_xGrado(id){
  this.loadingBar.start();
      this.DatoBusqueda.idbusqueda=id;
       //console.log(this.DatoBusqueda.idbusqueda);
       //this.DetUsuarioModal.show(); 
         this._GradoServicios.listar_secciones_xgrado(this.DatoBusqueda)
         .then(data => {
           if(data.status==1){
            this.DataSecciones = data.data;
            this.loadingBar.complete();
            this.matricula.id_seccion=0;
           }else{
             if(data.status==2){
              this.toastr.error(data.message, 'Aviso!',{
                positionClass: 'toast-top-right',
                timeOut: 500
              });
              this.DataSecciones=null;
              this.loadingBar.complete();
             }else{
              this.toastr.error(data.message, 'Aviso!',{
                positionClass: 'toast-top-right',
                timeOut: 500
              });
              this.DataSecciones=null;
              this.loadingBar.complete();
             }
            }
         } )
         .catch(err => console.log(err))
}

btnBuscar_xDoc(id:number,dato:string){
  this.DatoBusqueda.idbusqueda=id;
  this.DatoBusqueda.datobusqueda=dato;
    this._MatriculaServicios.buscar_datos_xdoc(this.DatoBusqueda)
    .then(data => {
      if(data.status==1){
        if(id==0){
          this.matricula.datos_alumno = data.data[0].apellidos_alumno + " " + data.data[0].nombres_alumno;
          this.matricula.sexo_alumno = data.data[0].sexo_alumno;
          this.matricula.id_alumno = data.data[0].id_alumno;
        }else{
          this.matricula.datos_apoderado = data.data[0].apellidos_apoderado + " " + data.data[0].nombres_apoderado;
           this.matricula.id_apoderado = data.data[0].id_apoderado;
        }
      }else{
        this.toastr.error(data.message, 'Aviso!');
        if(id==0){
          this.matricula.datos_alumno = '';
          this.matricula.sexo_alumno = ''; 
        }else{
          this.matricula.datos_apoderado='';
        }
       }
    } )
    .catch(err => console.log(err))
  }

  onSubmit(form:Matricula){    
    swal({
      title: '¿Esta seguro que desea guardar?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar!',
      allowOutsideClick: false,
      allowEscapeKey:false,
    }).then((result) => {
      if (result.value==true) {
        form.id_anhio=localStorage.getItem('_anhio');
        this._MatriculaServicios.nva_matricula(form)
        .then(data => {
          if(data.status==1){
            swal({
                title: 'Aviso!',
                text: data.message,
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey:false
            })            
            this.ListarMatriculados();
          }else{
              swal({
                title: 'Aviso!',
                html:
                '<span style="color:red">' +
                data.message +
                '</span>',
                type: 'error',
                allowOutsideClick: false,
                allowEscapeKey:false
              })
          }
        } )
        .catch(err => console.log(err))
      }
    })
  }

}
