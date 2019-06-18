import { Component,OnInit,ViewChild,ViewEncapsulation,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { AlumnosService } from './alumnos.service';
import { IngresosService } from '../tesoreria/ingresos.service';
import {MatPaginator, MatSort, MatTableDataSource,TooltipPosition} from '@angular/material';
import {ModalDirective} from 'ngx-bootstrap/modal';
import 'rxjs/add/operator/map';
import {Alumno,Busqueda} from '../../app.datos';
import { ToastrService } from 'ngx-toastr';
declare var swal: any;
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  templateUrl: 'alumnos.component.html',
  styleUrls: ['apafa.css'],
  encapsulation: ViewEncapsulation.None,
  // animations: [
  //   trigger('detailExpand', [
  //     state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
  //     state('*', style({ height: '*', visibility: 'visible' })),
  //     transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  //   ]),
  // ],
})
export class AlumnosComponent implements OnInit {  
  DataArray : any = [];
  @ViewChild('DetAlumnoModal') public DetAlumnoModal: ModalDirective;
  //columnsToDisplay = ['id_alumno', 'tdoc_alumno', 'doc_alumno', 'apepaterno_alumno'];
  displayedColumns: string[] = ['doc_alumno', 'apellidos_alumno','sexo_alumno','num_contacto','opciones_alumno'];
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  dataSource: MatTableDataSource<any>;
  //isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public  chooseView : string;
  public panel_tabla : boolean
  public panel_registro : boolean;
  public panel_modificar : boolean;
  public panel_detalle : boolean;
  public alumno : Alumno;
  public Editalumno : Alumno;
  public DatoBusqueda : Busqueda;
  constructor(private _AlumnosServicios:AlumnosService,
    private _IngresosServicios:IngresosService,private toastr: ToastrService,
    @Inject(DOCUMENT) private document: Document,private loadingBar: LoadingBarService) {
    this.LoadTableData();
    this.panel_tabla=true;
    this.panel_registro=false;
    this.DatoBusqueda = {
      idbusqueda:0
    }
    this.Editalumno = {
      tdoc_alumno:'',
      telefono_alumno:'',
      correo_alumno:'',
      procedencia_alumno:'',
      celular_padre:'',
      correo_padre:'',
      celular_madre:'',
      correo_madre:''
      
    }
   }
  
  ngOnInit() {
    
  }

  LoadTableData (){
    this.loadingBar.start();
    this._AlumnosServicios.getListarAlumnos().subscribe(
      data => {
        this.loadingBar.complete();
        this.DataArray = data.data;
        this.dataSource = new MatTableDataSource(this.DataArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  btnNuevo_Alumno(){
    this.panel_tabla=false;
    this.panel_registro=true;
    this.alumno = {
      tdoc_alumno:'',
      telefono_alumno:'',
      correo_alumno:'',
      procedencia_alumno:'',
      celular_padre:'',
      correo_padre:'',
      celular_madre:'',
      correo_madre:''
      
    }
  }

  DetAlumno_hide(){
      this.DetAlumnoModal.hide();
      }

  btnCancelar_Alumno(opt){
    this.document.documentElement.scrollTop = 0;
    if(opt=='I'){
      this.panel_tabla=true;
      this.panel_registro=false;
      this.LoadTableData();
    }else{
      if(opt=='D'){
        this.panel_tabla=true;
        this.panel_detalle=false;
        this.LoadTableData(); 
      }else{
        this.panel_tabla=true;
        this.panel_modificar=false;
        this.LoadTableData(); 
      }     
    }
    
  }

  onSubmit(form:Alumno){    
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
        this._AlumnosServicios.nvo_alumno(form)
        .then(data => {
          if(data.status==1){
            swal({
                title: 'Aviso!',
                text: data.message,
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey:false
            })            
            this.LoadTableData();
            this.panel_registro=false;
            this.panel_tabla=true;
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


DataAlumno : any = [];
btnDetalle_Alumno(id){
  this.DatoBusqueda.idbusqueda=id;
  this.document.documentElement.scrollTop = 0;
  this._AlumnosServicios.detalle_alumno(this.DatoBusqueda)
    .then(data => {
      if(data.status==1){
        this.DataAlumno = data.data[0];
        this.DataAlumno.fnac_alumno = data.data[0].fnac_alumno.toString().slice(0,10);
        //this.DataAlumno.sexo_alumno = data.data[0].sexo_alumno.charAt(0);
        this.Listar_Historial_Matricula(data.data[0].id_alumno);
        this.panel_detalle=true; 
        this.panel_tabla=false;
        this.toastr.success(data.message, 'Aviso!',{positionClass: 'toast-top-right',timeOut: 500});
      }else{
        this.toastr.error(data.message, 'Aviso!');
       }
    } )
    .catch(err => console.log(err))
  }

  DetalleMatricula : any = [];
  Listar_Historial_Matricula(id){
    this.DatoBusqueda.idbusqueda=id;
    this._AlumnosServicios.historial_matricual(this.DatoBusqueda)
      .then(data => {
        if(data.status==1){
          this.DetalleMatricula = data.data; 
          console.log(this.DetalleMatricula);
        }else{
          this.toastr.error(data.message, 'Aviso!');
         }
      } )
      .catch(err => console.log(err))
    }

  btnEdit_Alumno(id){
    this.loadingBar.start();
    this.panel_tabla=false;
    this.panel_modificar=true;
    this.DatoBusqueda.idbusqueda=id;
    this.document.documentElement.scrollTop = 0;
    this._AlumnosServicios.detalle_alumno(this.DatoBusqueda)
    .then(data => {
      if(data.status==1){
        this.loadingBar.complete();
        this.Editalumno = data.data[0];
        this.Editalumno.id_alumno = data.data[0].id_alumno;
        this.Editalumno.sexo_alumno = data.data[0].sexo_alumno.charAt(0);
        this.Editalumno.tdoc_alumno = data.data[0].tdoc_alumno.substr(0,3);
        this.Editalumno.fnac_alumno = data.data[0].fnac_alumno.toString().slice(0,10);
        this.toastr.success(data.message, 'Aviso!',{positionClass: 'toast-top-right',timeOut: 500});
      }else{
        this.toastr.error(data.message, 'Aviso!');
       }
    } )
    .catch(err => console.log(err))
  }

  updateAlumno(form:Alumno){    
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
        this._AlumnosServicios.update_alumno(form)
        .then(data => {
          if(data.status==1){
            swal({
                title: 'Aviso!',
                text: data.message,
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey:false
            })            
            this.LoadTableData();
            this.panel_modificar=false;
            this.panel_tabla=true;
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

  btnEliminar_Alumno(idalumno:number) {
    swal({
      title: '¿Esta seguro que desea eliminar alumno?',
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
        this.DatoBusqueda.idbusqueda=idalumno;
          //console.log(this.DatoBusqueda.idbusqueda);
          //this.DetUsuarioModal.show(); 
            this._AlumnosServicios.eliminar_alumno(this.DatoBusqueda)
            .then(data => {
              if(data.status==1){
                swal({
                  title: 'Aviso!',
                  text: data.message,
                  type: 'success',
                  allowOutsideClick: false,
                  allowEscapeKey:false
              })
              this.LoadTableData();
              }else{
                this.toastr.error(data.message, 'Aviso!');
               }
            } )
            .catch(err => console.log(err))
      }
    })
  }

}
