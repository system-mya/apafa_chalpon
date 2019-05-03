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


@Component({
  templateUrl: 'usuarios.component.html',
  styleUrls: ['administracion.css'],
  encapsulation: ViewEncapsulation.None,
})


export class UsuariosComponent implements OnInit {
  @ViewChild('NvoUsuarioModal') public NvoUsuarioModal: ModalDirective;
  @ViewChild('DetUsuarioModal') public DetUsuarioModal: ModalDirective;
  DataArray : any = [];
  // columnsToDisplay = ['idusuario', 'nom_usu', 'nombres_usu', 'apellidos_usu'];
  displayedColumns: string[] = ['num_usu', 'nom_ape_usu', 'nom_usu', 'contacto_usu','perfil_usu','estado_usu','opciones_usu'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('myForm') mytemplateForm : NgForm;
  public min = new Date().toISOString().substring(0, 10);
  public usuario : Usuario;
  public DatoBusqueda : Busqueda;
  
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

  }

 
  onSubmit(form:NgForm){    
      console.log("Login funcionando");
      this._UsuariosServicios.nvo_usuario(form.value)
      .then(data => {
        if(data.status==1){
          this.NvoUsuarioModal.hide();
          this.toastr.success(data.message, 'Aviso!');
          this.LoadTableData();
          this.mytemplateForm.resetForm();
        }else{
          if(data.status==2){
            this.toastr.error(data.message, 'Aviso!');
          }else{
            this.toastr.error("Registro sin Exito", 'Aviso!',{
              positionClass: 'toast-top-right'
            });
            this.alert_msg_danger(data.message);
          }
          
        }
      } )
      .catch(err => console.log(err))
      
      }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
 
  frmNuevoUsu_hide(){
    this.NvoUsuarioModal.hide();
    this.mytemplateForm.resetForm();
  }
  frmDetalleUsu_hide(){
    this.DetUsuarioModal.hide();
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
    this._UsuariosServicios.obtener_usuario(this.DatoBusqueda)
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

}
