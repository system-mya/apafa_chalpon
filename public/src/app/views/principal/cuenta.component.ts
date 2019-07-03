import { Component, OnInit, ViewChild,ViewEncapsulation  } from '@angular/core';
import { NgForm } from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { UsuariosService } from '../administracion/usuarios.service';
import { LoginService } from '../login/login.service';
import { clsBusqueda, clsUsuario } from '../../app.datos';
import { ToastrService } from 'ngx-toastr';
import { DefaultLayoutComponent } from '../../containers/default-layout/default-layout.component'
declare var swal: any;
@Component({
  templateUrl: 'cuenta.component.html',
  styleUrls: ['principal.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CuentaComponent implements OnInit {
  @ViewChild('CambiarClaveModal') public CambiarClaveModal: ModalDirective;
  @ViewChild('myClave') myClaveform : NgForm;
  public DatoBusqueda : clsBusqueda = {};
  public panel_detalle : boolean;
  public panel_editar : boolean;
  public usuario : clsUsuario = {};
  constructor(private _UsuariosServicios:UsuariosService,private _userServices:LoginService,
    private toastr: ToastrService,private _Default: DefaultLayoutComponent) {
   this.btnEdit_Usuario();
   this.panel_detalle=true;
  }

  datausu : any = [];
  btnEdit_Usuario(){
    this.DatoBusqueda.idbusqueda=parseInt(this._userServices.get('123456$#@$^@1ERF',localStorage.getItem('ID')));
      this._UsuariosServicios.obtener_usuario(this.DatoBusqueda)
      .then(data => {
        if(data.status==1){
          this.datausu= data.data[0];          
        }else{
          this.toastr.error(data.message, 'Aviso!',{positionClass: 'toast-top-right'});
         }
      } )
      .catch(err => console.log(err))
    }

    nomusu_original : string;
    btnDetalle_Usuario(dato){
         this.panel_detalle=false;
         this.panel_editar=true;
         this.usuario.idusuario=dato.idusuario;
         this.usuario.perfil_usu=dato.idperfil_usuario;
         this.usuario.nombre_perfil=dato.nombre_perfil;
         this.usuario.dni_usu=dato.dni_usu;
         this.usuario.nom_usu=dato.nom_usu;
         this.usuario.nombres_usu=dato.nombres_usu;
         this.usuario.apellidos_usu=dato.apellidos_usu;
         this.usuario.sexo_usu=dato.sexo_usu;
         this.usuario.celular_usu=dato.celular_usu;
         this.usuario.direccion_usu=dato.direccion_usu;
         this.usuario.correo_usu=dato.correo_usu;
         this.usuario.obser_usu=dato.obser_usu;
         this.nomusu_original = dato.nom_usu;
    }

    btnCancelar_Editar(opt:string){
         if(opt=='E'){
             this.panel_editar=false;
             this.panel_detalle=true;
         }else{
           this.CambiarClaveModal.hide();
           this.myClaveform.resetForm();
         }
    }

    updateUsuario(usuario:clsUsuario){    
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
          this._UsuariosServicios.update_usuario(usuario)
          .then(data => {
            if(data.status==1){
              swal({
                  title: 'Aviso!',
                  text: data.message,
                  type: 'success',
                  allowOutsideClick: false,
                  allowEscapeKey:false
              }).then((result) => {
                if((result.value==true)){
                 this._Default.logout();
                }
             })
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

     public usu_valid : boolean = false;
     public usu_invalido : boolean = false;

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

      btnCambiar_Clave(){
        this.CambiarClaveModal.show();
      }
         
      clave_usu:string;
      rep_clave_usu:string;
      updateClave(){
        if(this.clave_correcta==true){
          swal({
            title: '¿Esta seguro que desea cambiar clave?',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Guardar!',
            allowOutsideClick: false,
            allowEscapeKey:false,
          }).then((result) => {
            if (result.value==true) {
              this.DatoBusqueda.datobusqueda=this.rep_clave_usu;
              this.DatoBusqueda.idbusqueda=this.usuario.idusuario;
              this._UsuariosServicios.update_clave(this.DatoBusqueda)
              .then(data => {
                if(data.status==1){
                  swal({
                      title: 'Aviso!',
                      text: data.message,
                      type: 'success',
                      allowOutsideClick: false,
                      allowEscapeKey:false
                  }).then((result) => {
                     if((result.value==true)){
                      this._Default.logout();
                     }
                  })
                  
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

     public clave_correcta : boolean = false;
     public clave_incorrecta : boolean = false;
      Verificar_Clave(rep_clave){
         if(rep_clave!=null){
           if(rep_clave!=''){
            if(this.clave_usu==rep_clave){
              console.log('clave coincide');
              this.clave_correcta=true;
              this.clave_incorrecta=false;
            }else{
              console.log('clave no coincide');
              this.clave_correcta=false;
              this.clave_incorrecta=true;
            }
           }
         }
      }
  

  ngOnInit(): void {
  }
}
