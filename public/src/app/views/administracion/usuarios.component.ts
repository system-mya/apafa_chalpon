import { Component, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource,TooltipPosition} from '@angular/material';
import {ModalDirective} from 'ngx-bootstrap/modal';
import 'rxjs/add/operator/map';
import { UsuariosService } from './usuarios.service';
import {clsUsuario,clsBusqueda} from '../../app.datos';
import { ToastrService } from 'ngx-toastr';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
declare var swal: any;
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
function headRows() {
  return [{id: 'ID', name: 'Name', email: 'Email', city: 'City', expenses: 'Sum'}];
}

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
  displayedColumns: string[] = ['apellidos_usu', 'nom_usu', 'contacto_usu','perfil_usu','estado_usu','opciones_usu'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('myForm') mytemplateForm : NgForm;
  public min = new Date();
  public usuario : clsUsuario;
  public DatoBusqueda : clsBusqueda;
  public Editusuario : clsUsuario;
  public usu_valid : boolean = false;
  public usu_invalido : boolean = false;
  public  chooseView : string;
  public body : any = [];
  constructor(private _UsuariosServicios:UsuariosService,private toastr: ToastrService) {
    this.Listar_Usuario();
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
      fecha_usu: this.min.getFullYear() + '-' + (this.min.getMonth()+1).toString().padStart(2, "0") + '-' + this.min.getDate().toString().padStart(2, "0"),
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
      fecha_usu: this.min.getFullYear() + '-' + (this.min.getMonth()+1).toString().padStart(2, "0") + '-' + this.min.getDate().toString().padStart(2, "0"),
      obser_usu:'',
      perfil_usu:0,
      baja_usu:''
   };
    this.DatoBusqueda = {
      idbusqueda:0
    }


    this.body = [
      {
       pname: "abc",
       numbers: [{num:"123"},{num:"234"}]
      },
     {
       pname: "mno",
       numbers: [{num:"125"},{num:"237"}]
      },
      {
        pname: "abc",
        numbers: [{num:"123"},{num:"234"}]
       },
      {
        pname: "mno",
        numbers: [{num:"125"},{num:"237"}]
       },
       {
        pname: "abc",
        numbers: [{num:"123"},{num:"234"}]
       },
      {
        pname: "mno",
        numbers: [{num:"125"},{num:"237"}]
       }]
  }
  alerts: any[] = [];
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  
  public VerPDF()
  {
    var doc = new jspdf({orientation: 'portrait',unit: 'mm',format: 'A4'});
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFontStyle('bold');
    doc.text('Rowspan and colspan', 40, 50);
     // From HTML
    //  doc.autoTable({html: '.table', tableWidth: 'wrap',
    //  theme: 'grid'});
    var head = [{num:'N°'}];
  
    for(var j = 0; j < this.body.length; j++){
      let body2 = this.body[j].numbers;
      for (var i = 0; i < body2.length; i++) {
         var row = body2[i];
         row['pname'] = {rowSpan: body2.length, content: this.body[j].pname, styles: {valign: 'middle', halign: 'center'}};
      }
      doc.autoTable({
        head: head,
        body: body2,
        theme: 'grid',
        pageBreak: 'avoid',
    });
  
    }
  
    doc.output('save', 'reporte.pdf');
  }
  ngOnInit() {
    
    
  }
 

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
      fecha_usu: this.min.getFullYear() + '-' + (this.min.getMonth()+1).toString().padStart(2, "0") + '-' + this.min.getDate().toString().padStart(2, "0"),
      obser_usu:'',
      perfil_usu:0
    };
    this.ListarPerfiles();
    this.usu_valid  = false;
    this.usu_invalido   = false;
  }

 
  onSubmit(form:NgForm){    
    if(form.value['perfil_usu']!=0){
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
          this._UsuariosServicios.nvo_usuario(form.value)
          .then(data => {
            if(data.status==1){
              this.NvoUsuarioModal.hide();
              swal({
                  title: 'Aviso!',
                  text: data.message,
                  type: 'success',
                  allowOutsideClick: false,
                  allowEscapeKey:false
              })
              this.Listar_Usuario();
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
  

 Listar_Usuario(){
   this._UsuariosServicios.getListarUsiarios().subscribe(
     data => {
       if(data.status==1){
        this.DataArray = data.data;
       this.dataSource = new MatTableDataSource(this.DataArray);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
       }else{
        this.toastr.error(data.message, 'Aviso!',{
          positionClass: 'toast-top-right'
        });
        this.DataArray = data.data;
        this.dataSource = new MatTableDataSource(this.DataArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
       }
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
      }
      
    }
  )
}


DataUsuario : any =[];

btnDetalle_Usuario(idusuario){
  this.DatoBusqueda.idbusqueda=idusuario; 
    this._UsuariosServicios.obtener_usuario(this.DatoBusqueda)
    .then(data => {
      if(data.status==1){
        this.DataUsuario = data.data[0];
        if(data.data[0].sexo_usu=='M'){
          this.DataUsuario.sexo_usu='MASCULINO';
        }else{
          this.DataUsuario.sexo_usu='FEMENINO';
        }
        this.DetUsuarioModal.show(); 
        this.toastr.success(data.message, 'Aviso!',{positionClass: 'toast-top-right',timeOut: 500});
      }else{
        this.toastr.error(data.message, 'Aviso!');
       }
    } )
    .catch(err => console.log(err))
  }

  nomusu_original : string;
  btnEdit_Usuario(idusuario){
    this.DatoBusqueda.idbusqueda=idusuario;    
      this._UsuariosServicios.obtener_usuario(this.DatoBusqueda)
      .then(data => {
        if(data.status==1){
          this.ListarPerfiles();
          this.EditUsuarioModal.show(); 
          this.toastr.success(data.message, 'Aviso!',{positionClass: 'toast-top-right',timeOut: 500});
          this.Editusuario = data.data[0];
          this.Editusuario.perfil_usu = data.data[0].idperfil_usuario;
          this.nomusu_original = data.data[0].nom_usu;
          this.Editusuario.baja_usu=null;
        }else{
          this.toastr.error(data.message, 'Aviso!',{positionClass: 'toast-top-right'});
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

  // Listar_Usuario (){
  //   this._UsuariosServicios.getListarUsiarios()
  //   .map(this.extractData)
  //   .subscribe(persons => {
  //       this.persons = persons;
  //       // Calling the DT trigger to manually render the table
  //       this.dtTrigger.next();
  //     }
  //   )
  // }

 btnReset_Usuario(idusuario) {
    swal({
      title: '¿Esta seguro que desea resetear usuario?',
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
        this.DatoBusqueda.idbusqueda=idusuario;
          //console.log(this.DatoBusqueda.idbusqueda);
          //this.DetUsuarioModal.show(); 
            this._UsuariosServicios.resetear_usuario(this.DatoBusqueda)
            .then(data => {
              if(data.status==1){
                swal({
                  title: 'Aviso!',
                  text: data.message,
                  type: 'success',
                  allowOutsideClick: false,
                  allowEscapeKey:false
              })
              this.Listar_Usuario();
              }else{
                this.toastr.error(data.message, 'Aviso!');
               }
            } )
            .catch(err => console.log(err))
      }
    })
  }
 
  
  changeNomUsu(opc,dato){
    if(dato!=null){
      if(dato!=' '){
        if(opc=='E'){
          if(dato==this.nomusu_original){
            this.usu_valid=false;
            this.usu_invalido=false;
          }else{
            this.DatoBusqueda.datobusqueda=dato;
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
          }
        }else{
          this.DatoBusqueda.datobusqueda=dato;
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
        }
      }else{
        this.usu_valid=false;
        this.usu_invalido=false;
      }
    }else{
      this.usu_valid=false;
      this.usu_invalido=false;
    }
    }

    fecha_usu : string;
    FechaBajaUsu(dato){
      console.log(dato);
      if(dato=='SI'){
        this.fecha_usu=new Date().toISOString().substring(0, 10);
        this.Editusuario.fecha_usu=this.fecha_usu;
        console.log(this.Editusuario.fecha_usu);
      }
    }


    updateUsuario(frmEdit:NgForm){    
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
          this._UsuariosServicios.update_usuario(frmEdit.value)
          .then(data => {
            if(data.status==1){
              this.EditUsuarioModal.hide();
              swal({
                  title: 'Aviso!',
                  text: data.message,
                  type: 'success',
                  allowOutsideClick: false,
                  allowEscapeKey:false
              })
              this.Listar_Usuario();
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

    
   btnEliminar_Usuario(idusuario) {
          swal({
            title: '¿Esta seguro que desea eliminar usuario?',
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
              this.DatoBusqueda.idbusqueda=idusuario;
                //console.log(this.DatoBusqueda.idbusqueda);
                //this.DetUsuarioModal.show(); 
                  this._UsuariosServicios.eliminar_usuario(this.DatoBusqueda)
                  .then(data => {
                    if(data.status==1){
                      swal({
                        title: 'Aviso!',
                        text: data.message,
                        type: 'success',
                        allowOutsideClick: false,
                        allowEscapeKey:false
                    })
                    this.Listar_Usuario();
                    }else{
                      this.toastr.error(data.message, 'Aviso!');
                     }
                  } )
                  .catch(err => console.log(err))
            }
          })
   }
    
  
}
