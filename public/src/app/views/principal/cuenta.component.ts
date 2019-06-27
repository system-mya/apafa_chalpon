import { Component, OnInit, ViewChild,ViewEncapsulation  } from '@angular/core';
import { NgForm } from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { UsuariosService } from '../administracion/usuarios.service';
import { LoginService } from '../login/login.service';
import { Busqueda, Usuario } from '../../app.datos';
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
  public DatoBusqueda : Busqueda = {};
  public panel_detalle : boolean;
  public panel_editar : boolean;
  public usuario : Usuario = {};
  constructor(private _UsuariosServicios:UsuariosService,private _userServices:LoginService,
    private toastr: ToastrService,private _Default: DefaultLayoutComponent) {
   this.btnEdit_Usuario();
   this.panel_detalle=true;
  }

  datausu : any = [];
  btnEdit_Usuario(){
    this.DatoBusqueda.idbusqueda=parseInt(this._userServices.get('123456$#@$^@1ERF',localStorage.getItem('ID')));
      this._UsuariosServicios.editar_usuario(this.DatoBusqueda)
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

    updateUsuario(usuario:Usuario){    
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
              })
              this.panel_detalle=true;
              this.panel_editar=false;
              this.btnEdit_Usuario();
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
  radioModel: string = 'Month';

  // lineChart1
  public lineChart1Data: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Series A'
    }
  ];
  public lineChart1Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 40 - 5,
          max: 84 + 5,
        }
      }],
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart1Colours: Array<any> = [
    {
      backgroundColor: getStyle('--primary'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart1Legend = false;
  public lineChart1Type = 'line';

  // lineChart2
  public lineChart2Data: Array<any> = [
    {
      data: [1, 18, 9, 17, 34, 22, 11],
      label: 'Series A'
    }
  ];
  public lineChart2Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart2Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 1 - 5,
          max: 34 + 5,
        }
      }],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart2Colours: Array<any> = [
    { // grey
      backgroundColor: getStyle('--info'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart2Legend = false;
  public lineChart2Type = 'line';


  // lineChart3
  public lineChart3Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'Series A'
    }
  ];
  public lineChart3Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart3Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart3Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
    }
  ];
  public lineChart3Legend = false;
  public lineChart3Type = 'line';


  // barChart1
  public barChart1Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40],
      label: 'Series A'
    }
  ];
  public barChart1Labels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
  public barChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
        barPercentage: 0.6,
      }],
      yAxes: [{
        display: false
      }]
    },
    legend: {
      display: false
    }
  };
  public barChart1Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.3)',
      borderWidth: 0
    }
  ];
  public barChart1Legend = false;
  public barChart1Type = 'bar';

  // mainChart

  public mainChartElements = 27;
  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];

  public mainChartData: Array<any> = [
    {
      data: this.mainChartData1,
      label: 'Current'
    },
    {
      data: this.mainChartData2,
      label: 'Previous'
    },
    {
      data: this.mainChartData3,
      label: 'BEP'
    }
  ];
  /* tslint:disable:max-line-length */
  public mainChartLabels: Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  /* tslint:enable:max-line-length */
  public mainChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function(tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: any) {
            return value.charAt(0);
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5),
          max: 250
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public mainChartColours: Array<any> = [
    { // brandInfo
      backgroundColor: hexToRgba(getStyle('--info'), 10),
      borderColor: getStyle('--info'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: 'transparent',
      borderColor: getStyle('--success'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: getStyle('--danger'),
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    }
  ];
  public mainChartLegend = false;
  public mainChartType = 'line';

  // social box charts

  public brandBoxChartData1: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Facebook'
    }
  ];
  public brandBoxChartData2: Array<any> = [
    {
      data: [1, 13, 9, 17, 34, 41, 38],
      label: 'Twitter'
    }
  ];
  public brandBoxChartData3: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'LinkedIn'
    }
  ];
  public brandBoxChartData4: Array<any> = [
    {
      data: [35, 23, 56, 22, 97, 23, 64],
      label: 'Google+'
    }
  ];

  public brandBoxChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public brandBoxChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false,
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public brandBoxChartColours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.55)',
      pointHoverBackgroundColor: '#fff'
    }
  ];
  public brandBoxChartLegend = false;
  public brandBoxChartType = 'line';

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ngOnInit(): void {
    // generate random values for mainChart
    for (let i = 0; i <= this.mainChartElements; i++) {
      this.mainChartData1.push(this.random(50, 200));
      this.mainChartData2.push(this.random(80, 100));
      this.mainChartData3.push(65);
    }
  }
}
