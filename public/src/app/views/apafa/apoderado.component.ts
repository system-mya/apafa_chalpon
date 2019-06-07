import { Component,ViewChild,ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource,TooltipPosition} from '@angular/material';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Apoderado,Busqueda} from '../../app.datos';
import { ApoderadoService } from './apoderado.service';
import { ToastrService } from 'ngx-toastr';
declare var swal: any;

@Component({
  templateUrl: 'apoderado.component.html',   
  styleUrls: ['apafa.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ApoderdoComponent {
  @ViewChild('NvoApoderadoModal') public NvoApoderadoModal: ModalDirective;
  @ViewChild('DetApoderadoModal') public DetApoderadoModal: ModalDirective;
  @ViewChild('EditApoderadoModal') public EditApoderadoModal: ModalDirective;
  displayedColumns: string[] = ['doc_apoderado','apellidos_apoderado','sexo_apoderado','num_contacto','opciones_apoderado'];
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  public apoderado : Apoderado;
  public Editapoderado : Apoderado;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('myForm') mytemplateForm : NgForm;
  public DatoBusqueda : Busqueda;
  constructor(private _ApoderadoServicio:ApoderadoService,private toastr: ToastrService) {
    this.apoderado = {
      tdoc_apoderado:'',
      correo_apoderado:''
    }
    this.Editapoderado = {
      tdoc_apoderado:'',
      correo_apoderado:''
    }
    this.DatoBusqueda = {
      idbusqueda:0
    }
    this.ListarApoderados();
  }


  btnNuevo_Apoderado(){
    this.apoderado = {
      tdoc_apoderado:'',
      correo_apoderado:''
    }
    this.NvoApoderadoModal.show();
  }

  frmApo_hide(opc){
    if(opc=="N"){
      this.NvoApoderadoModal.hide();
      this.mytemplateForm.resetForm();
    }else{
      if(opc=="D"){
        this.DetApoderadoModal.hide();
      }else{
        if(opc=="E"){
          this.EditApoderadoModal.hide();
        }
      }
    }
  }

DataApoderados : any = [];
 ListarApoderados (){
  this._ApoderadoServicio.getListarApoderados().subscribe(
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

  onSubmit(form:Apoderado){    
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
          this._ApoderadoServicio.nvo_apoderado(form)
          .then(data => {
            if(data.status==1){
              this.NvoApoderadoModal.hide();
              swal({
                  title: 'Aviso!',
                  text: data.message,
                  type: 'success',
                  allowOutsideClick: false,
                  allowEscapeKey:false
              })
              this.ListarApoderados();
              this.mytemplateForm.resetForm();
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
  

DetApoderado : any = [];
btnDetalle_Apoderado(id){
  this.DatoBusqueda.idbusqueda=id;
  console.log(this.DatoBusqueda.idbusqueda);
  this.DetApoderadoModal.show(); 
    this._ApoderadoServicio.detalle_apoderado(this.DatoBusqueda)
    .then(data => {
      if(data.status==1){
        this.DetApoderado = data.data[0];
        //this.DataAlumno.sexo_alumno = data.data[0].sexo_alumno.charAt(0);
        this.toastr.success(data.message, 'Aviso!',{positionClass: 'toast-top-right',timeOut: 500});
      }else{
        this.toastr.error(data.message, 'Aviso!');
       }
    } )
    .catch(err => console.log(err))
  }

  btnEdit_Apoderado(id){
    this.DatoBusqueda.idbusqueda=id;
    this.EditApoderadoModal.show();
    this._ApoderadoServicio.detalle_apoderado(this.DatoBusqueda)
    .then(data => {
      if(data.status==1){
        this.Editapoderado = data.data[0];
        this.Editapoderado.id_apoderado = data.data[0].id_apoderado;
        this.Editapoderado.sexo_apoderado = data.data[0].sexo_apoderado.charAt(0);
        this.Editapoderado.tdoc_apoderado = data.data[0].tdoc_apoderado.substr(0,3);
        this.toastr.success(data.message, 'Aviso!',{positionClass: 'toast-top-right',timeOut: 500});
      }else{
        this.toastr.error(data.message, 'Aviso!');
       }
    } )
    .catch(err => console.log(err))
  }

  updateApoderado(form:Apoderado){    
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
        this._ApoderadoServicio.update_apoderado(form)
        .then(data => {
          if(data.status==1){
            this.EditApoderadoModal.hide();
            swal({
                title: 'Aviso!',
                text: data.message,
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey:false
            })
            this.ListarApoderados();
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

btnEliminar_Apoderado(id:number) {
  swal({
    title: '¿Esta seguro que desea eliminar apoderado?',
    type: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Guardar!',
    allowOutsideClick: false,
    allowEscapeKey:false,
  }).then((result) => {
    //console.log(result.value);
    if (result.value==true) {
      this.DatoBusqueda.idbusqueda=id;
        //console.log(this.DatoBusqueda.idbusqueda);
        //this.DetUsuarioModal.show(); 
          this._ApoderadoServicio.eliminar_apoderado(this.DatoBusqueda)
          .then(data => {
            if(data.status==1){
              swal({
                title: 'Aviso!',
                text: data.message,
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey:false
            })
            this.ListarApoderados();
            }else{
              this.toastr.error(data.message, 'Aviso!');
             }
          } )
          .catch(err => console.log(err))
    }
  })
}

}
