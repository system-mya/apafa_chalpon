import { Component,ViewChild,OnInit,ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource,TooltipPosition} from '@angular/material';
import { LibrosService } from './libros.service';
import { GradoSeccionService } from './grado-seccion.service';
import 'rxjs/add/operator/map';
import { ToastrService } from 'ngx-toastr';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {clsLibro,clsGrados,clsBusqueda} from '../../app.datos';
import { NgxSpinnerService } from 'ngx-spinner';
declare var swal: any;


@Component({
  templateUrl: 'libros.component.html',
  styleUrls: ['administracion.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LibrosComponent implements OnInit {
  @ViewChild('NvoLibroModal') public NvoLibroModal: ModalDirective;
  @ViewChild('EditLibroModal') public EditLibroModal: ModalDirective;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  displayedColumns: string[] = ['descripcion_grado','titulo_libro','edicion_libro','editorial_libro','opciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public libro : clsLibro ={};
  public DatoBusqueda : clsBusqueda = {};
  @ViewChild('myForm') myFormNvoLibro : NgForm;
  constructor(private _LibrosServicios:LibrosService,private toastr: ToastrService,
    private _GradoServicios:GradoSeccionService,
    private spinner: NgxSpinnerService) { 
    this.ListarLibrosActivos();
    this.Anhios();
  }

  public year = new Date().getFullYear();
  public years = []; 
  Anhios(){
    for(var i = 0; i < 10; i++) {
    		this.years.push({id: this.year - i});
    }
   
  }

  ngOnInit() {
    
    
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 DataLibros : any = [];
 ListarLibrosActivos (){
  this._LibrosServicios.Listar_Libros_Activos().subscribe(
    data => {
      if(data.status==1){
       this.DataLibros = data.data;
       this.dataSource = new MatTableDataSource(this.DataLibros);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
      }else{
        this.toastr.error(data.message, 'Aviso!',{
          positionClass: 'toast-top-right'
        });
        this.DataLibros = data.data;
        this.dataSource = new MatTableDataSource(this.DataLibros);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      
    }
  )
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

btnNuveo_Libro(){
  this.NvoLibroModal.show();  
  this.libro ={
    id_grado:0,
  }
  this.ListarGrados();
}

  frmLibro_hide(opc){
    if(opc=="N"){
      this.NvoLibroModal.hide();
      this.myFormNvoLibro.resetForm();
    }else{
      if(opc=="E"){
         this.EditLibroModal.hide();
      }
    }
  }


  onSubmit(form:clsLibro){    
    if(form.id_grado!=0){
      swal({
        title: '¿Esta seguro que desea guardar?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Guardar!',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        allowEscapeKey:false,
      }).then((result) => {
        if (result.value==true) {
          this.spinner.show();
          this._LibrosServicios.nvo_libro(form)
          .then(data => {
            if(data.status==1){              
              this.NvoLibroModal.hide();
              setTimeout(() => {
                  this.spinner.hide();
                  swal({
                    title: 'Aviso!',
                    text: data.message,
                    type: 'success',
                    allowOutsideClick: false,
                    allowEscapeKey:false
                })            
                this.ListarLibrosActivos();
              }, 5000);
              this.myFormNvoLibro.resetForm();
            }else{
              this.spinner.hide();
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
  

  btnEditar_Libro(dato){
       this.libro.id_libro=dato.id_libro;
       this.libro.titulo_libro=dato.titulo_libro;
       this.ListarGrados();
       this.libro.id_grado=dato.id_grado;
       this.libro.editorial_libro=dato.editorial_libro;
       this.libro.edicion_libro=dato.edicion_libro;
       this.EditLibroModal.show();
  }

  Actualizar_Libro(form:clsLibro){    
    swal({
      title: '¿Esta seguro que desea guardar?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar!',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      allowEscapeKey:false,
    }).then((result) => {
      if (result.value==true) {
        this._LibrosServicios.update_libro(form)
        .then(data => {
          if(data.status==1){
            this.EditLibroModal.hide();
            swal({
                title: 'Aviso!',
                text: data.message,
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey:false
            })            
            this.ListarLibrosActivos();
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

  btnEliminar_Libro(idlibro) {
    swal({
      title: '¿Esta seguro que desea eliminar libro?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar!',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      allowEscapeKey:false,
    }).then((result) => {
      //console.log(result.value);
      if (result.value==true) {
        this.DatoBusqueda.idbusqueda=idlibro;
          //console.log(this.DatoBusqueda.idbusqueda);
          //this.DetUsuarioModal.show(); 
            this._LibrosServicios.eliminar_libro(this.DatoBusqueda)
            .then(data => {
              if(data.status==1){
                swal({
                  title: 'Aviso!',
                  text: data.message,
                  type: 'success',
                  allowOutsideClick: false,
                  allowEscapeKey:false
              })
              this.ListarLibrosActivos();
              }else{
                this.toastr.error(data.message, 'Aviso!');
               }
            } )
            .catch(err => console.log(err))
      }
    })
}
}
