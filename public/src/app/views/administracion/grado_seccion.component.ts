import { Component, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { GradoSeccionService } from './grado-seccion.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { clsGrados,clsBusqueda,clsSecciones } from '../../app.datos';
import {TooltipPosition} from '@angular/material';
import {ModalDirective} from 'ngx-bootstrap/modal';
import 'rxjs/add/operator/map';
declare var swal: any;
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  templateUrl: 'grado_seccion.component.html',
  styleUrls: ['administracion.css'],
  encapsulation: ViewEncapsulation.None,
})
export class GradoSeccionComponent implements OnInit {
  @ViewChild('NvaSeccionModal') public NvaSeccionModal: ModalDirective;
  @ViewChild('myForm') myFormNvaSeccion : NgForm;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  public DatoBusqueda : clsBusqueda;
  public grado : any = [];
  public seccion : clsSecciones;
  public id_grado : number;
  public nom_grado : string;
  constructor(private loadingBar: LoadingBarService,private _GradoServicios:GradoSeccionService,private toastr: ToastrService) {
    this.ListarGrados();
    this.DatoBusqueda = {
      idbusqueda:0,
      datobusqueda:''
    }
    this.grado.id_grado=0;
    this.grado.descripcion_grado='';
    this.seccion ={
      nombre_seccion:'',
      id_turno:'0'
    }
   }

  ngOnInit() {
    
    
  }

  DataGrado : clsGrados;
  ListarGrados (){
   this._GradoServicios.ListarGrados().subscribe(
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

 Cambiar_Estado(id,dato){
  this.loadingBar.start();
   if(dato[0]==1){
    this.DatoBusqueda.datobusqueda='0';
   }else{
    this.DatoBusqueda.datobusqueda='1';
   }
      this.DatoBusqueda.idbusqueda=id;
        //console.log(this.DatoBusqueda.idbusqueda);
        //this.DetUsuarioModal.show(); 
          this._GradoServicios.cambiar_estado(this.DatoBusqueda)
          .then(data => {
            if(data.status==1){
              this.toastr.success(data.message, 'Aviso!',{
                positionClass: 'toast-top-right',
                timeOut: 500
              });
            this.ListarGrados();
            this.loadingBar.complete();
            }else{
              this.toastr.error(data.message, 'Aviso!',{
                positionClass: 'toast-top-right',
                timeOut: 500
              });
              this.ListarGrados();
              this.loadingBar.complete();
             }
          } )
          .catch(err => console.log(err))
 }

 DataSecciones : clsSecciones;
 btnregistrar : boolean;
 Listar_Secciones_xGrado(id,dato){
  this.grado.id_grado = id;
  this.grado.descripcion_grado = dato;
  this.loadingBar.start();
      this.DatoBusqueda.idbusqueda=id;
       //console.log(this.DatoBusqueda.idbusqueda);
       //this.DetUsuarioModal.show(); 
         this._GradoServicios.listar_secciones_xgrado(this.DatoBusqueda)
         .then(data => {
           if(data.status==1){
            this.DataSecciones = data.data;
            this.loadingBar.complete();
             this.toastr.success(data.message, 'Aviso!',{
               positionClass: 'toast-top-right',
               timeOut: 500
             });
             this.btnregistrar=true;
           }else{
             if(data.status==2){
              this.toastr.error(data.message, 'Aviso!',{
                positionClass: 'toast-top-right',
                timeOut: 500
              });
              this.DataSecciones=null;
              this.loadingBar.complete();
              this.btnregistrar=true;
             }else{
              this.toastr.error(data.message, 'Aviso!',{
                positionClass: 'toast-top-right',
                timeOut: 500
              });
              this.DataSecciones=null;
              this.loadingBar.complete();
              this.btnregistrar=false;
             }
            }
         } )
         .catch(err => console.log(err))
}

btnNueva_Seccion(id,dato){
  this.NvaSeccionModal.show(); 
  this.seccion ={
    nombre_seccion:'',
    id_turno:''
  }  
  this.seccion.id_grado = id;
  this.nom_grado = dato;
  }

  frmSeccion_hide(){
      this.NvaSeccionModal.hide();
      this.myFormNvaSeccion.resetForm();
  }

  onSubmit(form:clsSecciones){    
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
        this._GradoServicios.nva_seccion(form)
        .then(data => {
          if(data.status==1){
            this.NvaSeccionModal.hide();
            swal({
                title: 'Aviso!',
                text: data.message,
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey:false
            })            
            this.Listar_Secciones_xGrado(this.grado.id_grado,this.grado.descripcion_grado);
            this.myFormNvaSeccion.resetForm();
            this.ListarGrados();
            console.log(this.grado.id_grado);
          }else{
            if(data.status==2){
              this.toastr.error(data.message, 'Aviso!');
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
          }
        } )
        .catch(err => console.log(err))
      }
    })
  }
}
