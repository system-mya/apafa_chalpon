import { Component, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http, Response } from '@angular/http';
import {MatPaginator, MatSort, MatTableDataSource,TooltipPosition} from '@angular/material';
import {ModalDirective,BsModalService} from 'ngx-bootstrap/modal';
import 'rxjs/add/operator/map';
import { UsuariosService } from './usuarios.service';
import {Usuario,Busqueda} from '../../app.datos';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
declare var swal: any;


@Component({
  templateUrl: 'usuarios.component.html',
  styleUrls: ['administracion.css'],
  encapsulation: ViewEncapsulation.None,
})


export class UsuariosComponent implements OnInit {
  @ViewChild('NvoUsuarioModal') public NvoUsuarioModal: ModalDirective;
  @ViewChild('DetUsuarioModal') public DetUsuarioModal: ModalDirective;
  @ViewChild('EditUsuarioModal') public EditUsuarioModal: ModalDirective;
  DataArray : any = [];
  // columnsToDisplay = ['idusuario', 'nom_usu', 'nombres_usu', 'apellidos_usu'];
  displayedColumns: string[] = ['num_usu', 'nom_ape_usu', 'nombre_usu', 'contacto_usu','perfil_usu','estado_usu','opciones_usu'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('myForm') mytemplateForm : NgForm;
  public min = new Date().toISOString().substring(0, 10);
  public usuario : Usuario;
  public DatoBusqueda : Busqueda;
  public Editusuario : Usuario;
  public usu_valid : boolean = false;
  public usu_invalido : boolean = false;
  public  chooseView : string;
  constructor(private spinner: NgxSpinnerService,private http: Http,private _UsuariosServicios:UsuariosService,private toastr: ToastrService) {
    this.LoadTableData();
    this.usuario = {
      nom_usu:'',
      clave_usu:'',
      dni_usu:'',
      nombres_usu:'',
      apellidos_usu:'',
      celular_usu:'',
      correo_usu:'',
      sexo_usu:'',
      direccion_usu:'',
      fecha_usu: this.min,
      obser_usu:'',
      perfil_usu:0
    };
    this.Editusuario = {
      nom_usu:'',
      clave_usu:'',
      dni_usu:'',
      nombres_usu:'',
      apellidos_usu:'',
      celular_usu:'',
      correo_usu:'',
      sexo_usu:'',
      direccion_usu:'',
      fecha_usu: this.min,
      obser_usu:'',
      perfil_usu:0
   };
    this.DatoBusqueda = {
      idbusqueda:0
    }

    
  }
  alerts: any[] = [];
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  

  ngOnInit() {
    
    
  }
  dismissible = true;
  alert_msg_danger(msg): void {
    this.alerts.push({
      type: 'danger',
      msg: msg,
      timeout: 5000
    });
  }

   onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
  // showSpinner() {
  //   this.spinner.show(undefined,
  //     {
  //       type: 'square-spin',
  //       size: 'medium',
  //       bdColor: 'rgba(100,149,237, .8)',
  //       color: 'white',
  //       fullScreen: false
  //     }
  //   );
  // }

  btnNuevo_Usuairo(){
    this.NvoUsuarioModal.show();    
    this.usuario = {
      nom_usu:'',
      clave_usu:'',
      dni_usu:'',
      nombres_usu:'',
      correo_usu:'',
      apellidos_usu:'',
      celular_usu:'',
      sexo_usu:'',
      direccion_usu:'',
      fecha_usu: this.min,
      obser_usu:'',
      perfil_usu:0
    };
    this.ListarPerfiles();
    this.usu_valid  = false;
    this.usu_invalido   = false;
  }

 
  onSubmit(form:NgForm){    
    swal({
      title: '¿Esta seguro que desea guardar?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar!',
      closeOnConfirm: false, //It does close the popup when I click on close button
      closeOnCancel: false,
      allowOutsideClick: false,
      allowEscapeKey:false,
    }).then((result) => {
      if (result.value==true) {
        this._UsuariosServicios.nvo_usuario(form.value)
        .then(data => {
          if(data.status==1){
            this.NvoUsuarioModal.hide();
            swal({
                title: 'Aviso!',
                text: data.message,
                type: 'success',
                closeOnConfirm: false, //It does close the popup when I click on close button
                closeOnCancel: false,
                allowOutsideClick: false,
                allowEscapeKey:false
            })
            this.LoadTableData();
            this.mytemplateForm.resetForm();
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
                closeOnConfirm: false, //It does close the popup when I click on close button
                closeOnCancel: false,
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
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
 
  frmUsu_hide(opc){
    if(opc=="N"){
      this.NvoUsuarioModal.hide();
      this.mytemplateForm.resetForm();
    }else{
      if(opc=="D"){
        this.DetUsuarioModal.hide();
      }else{
        if(opc=="E"){
          this.EditUsuarioModal.hide();
        }
      }
    }
    
  }
  

 LoadTableData (){
   this._UsuariosServicios.getListarUsiarios().subscribe(
     data => {
       this.DataArray = data;
       this.dataSource = new MatTableDataSource(this.DataArray);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
     }
   )
 }
 
 DataPerfiles : any = [];
 ListarPerfiles (){
  this._UsuariosServicios.getListarPerfiles().subscribe(
    data => {
      if(data.status==1){
        this.DataPerfiles = data.data;
      }else{
        this.toastr.error("Consulta Sin Exito", 'Aviso!',{
          positionClass: 'toast-top-right'
        });
        this.alert_msg_danger(data.message);
      }
      
    }
  )
}


DataUsuario : any =[];

btnDetalle_Usuario(idusuario){
  this.DatoBusqueda.idbusqueda=idusuario;
  console.log(this.DatoBusqueda.idbusqueda);
  this.DetUsuarioModal.show(); 
    this._UsuariosServicios.detalle_usuario(this.DatoBusqueda)
    .then(data => {
      if(data.status==1){
        this.toastr.success(data.message, 'Aviso!');
        this.DataUsuario = data.data[0];
        console.log(this.DataUsuario);
      }else{
        this.toastr.error(data.message, 'Aviso!');
       }
    } )
    .catch(err => console.log(err))
  }

  fecha_usu : string;
  btnEdit_Usuario(idusuario){
    this.DatoBusqueda.idbusqueda=idusuario;
    this.EditUsuarioModal.show(); 
      this._UsuariosServicios.editar_usuario(this.DatoBusqueda)
      .then(data => {
        if(data.status==1){
          this.ListarPerfiles();
          swal({
            toast: true,
            position: 'top-right',
            showConfirmButton: false,
            timer: 2000,
            type: 'success',
            title: data.message
          })
          this.Editusuario = data.data[0];
          this.Editusuario.perfil_usu = data.data[0].idperfil_usuario;
          this.fecha_usu=data.data[0].fcreacion_usu.split("T",10);
          this.Editusuario.fecha_usu = this.fecha_usu[0];
          console.log('DATO' + this.Editusuario.fecha_usu);
        }else{
          this.toastr.error(data.message, 'Aviso!');
         }
      } )
      .catch(err => console.log(err))
    }
//  displayedColumns: Array<string>;
//  expandedElement: Array<string>;
// toggleRow(element) {
// if (this.expandedElement === element) {
//   this.expandedElement = null;
// } else {
//    this.expandedElement = element;
// }
//  }

  // LoadTableData (){
  //   this._UsuariosServicios.getListarUsiarios()
  //   .map(this.extractData)
  //   .subscribe(persons => {
  //       this.persons = persons;
  //       // Calling the DT trigger to manually render the table
  //       this.dtTrigger.next();
  //     }
  //   )
  // }
 opc : string = 'ANDERsson'
 btnReset_Usuario() {
    swal({
      title: '¿Esta seguro que desea resetear contraseña?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Resetear!',
      closeOnConfirm: false, //It does close the popup when I click on close button
      closeOnCancel: false,
      allowOutsideClick: false,
      allowEscapeKey:false,
    }).then((result) => {
      console.log(result.value);
      if (result.value) {
        if(this.opc=='ANDER'){
          swal(
            'Deleted!',
            'Your imaginary file has been deleted.',
            'success'
          )
        }
      }
    })
  }
 
  
  changeNomUsu(dato){
    if(dato!=null){
      if(dato!=' '){
        this.DatoBusqueda.datobusqueda=dato;
      console.log(this.DatoBusqueda.datobusqueda);
        this._UsuariosServicios.nom_usuario(this.DatoBusqueda)
        .then(data => {
          if(data.status==1){
            this.usu_valid=false;
            this.usu_invalido=true;
          }else{
            this.usu_valid=true;
            this.usu_invalido=false;
           }
        } )
        .catch(err => console.log(err))
      }else{
        this.usu_valid=false;
        this.usu_invalido=false;
      }
    }else{
      this.usu_valid=false;
      this.usu_invalido=false;
    }
    }

}
