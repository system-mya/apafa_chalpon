import { Component, ViewChild, ViewEncapsulation, ElementRef  } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource, TooltipPosition} from '@angular/material';
import {Busqueda, Otro_Ingreso,Recibo,Detalle_Deuda} from '../../app.datos';
import { IngresosService } from './ingresos.service';
import { MatriculaService } from '../apafa/matricula.service';
import { ToastrService } from 'ngx-toastr';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { LoadingBarService } from '@ngx-loading-bar/core';
declare var swal: any;
import * as jspdf from 'jspdf';
import 'jspdf-autotable';


@Component({
  templateUrl: 'ingresos.component.html',
  styleUrls: ['tesoreria.css'],
  encapsulation: ViewEncapsulation.None,
})
export class IngresosComponent {
  @ViewChild('NvoOtroIngresoModal') public NvoOtroIngresoModal: ModalDirective;
  @ViewChild('FrmImprimir') public FrmImprimir: ModalDirective;
  @ViewChild('NvoPagoModal') public NvoPagoModal: ModalDirective;
  displayedColumns: string[] = ['doc_ingreso', 'descripcion_ingreso', 'monto_ingreso', 'freg_ingreso', 'opciones_ingreso'];
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('myForm') mytemplateForm: NgForm;
  @ViewChild('myRecibo') mytemplatemyRecibo: NgForm;
  public DatoBusqueda: Busqueda;
  public otro: Otro_Ingreso = {};
  public recibo : Recibo = {};
  public DataDeuda : Detalle_Deuda ={};
  constructor(private _IngresosServicios: IngresosService, 
    private _MatriculaServicios:MatriculaService,
    private toastr: ToastrService,private loadingBar: LoadingBarService) {
    this.DatoBusqueda = {
      datobusqueda: ''
    };
    this.ListarIngresos();
    this.recibo.mtotal_recibo=0;
  }

  DataIngresos: any = [];
 ListarIngresos () {
  this.DatoBusqueda.datobusqueda = localStorage.getItem('_anhio');
  this._IngresosServicios.getLista_Ingresos(this.DatoBusqueda).subscribe(
    data => {
      if (data.status === 1) {
       this.DataIngresos = data.data;
       this.dataSource = new MatTableDataSource(this.DataIngresos);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
      } else {
        this.toastr.error(data.message, 'Aviso!', {
          positionClass: 'toast-top-right'
        });
      }

    }
  );
}

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  btnNuevo_OtroIngreso() {
    this.NvoOtroIngresoModal.show();
  }

  frmIngresos_hide(opc) {
    if (opc =='RO') {
    this.NvoOtroIngresoModal.hide();
      this.mytemplateForm.resetForm();
    } else {
      if (opc == 'R') {
        this.NvoPagoModal.hide();
        this.tabla_deuda=false;
        this.mytemplatemyRecibo.resetForm();
      } else {
        if (opc == 'E') {
        }
      }
    }
  }

  onSubmit(form: Otro_Ingreso) {
    swal({
      title: '¿Esta seguro que desea guardar?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar!',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.value == true) {
        form.id_usuario = localStorage.getItem('ID');
        this._IngresosServicios.nvo_otro_ingreso(form)
        .then(data => {
          if (data.status == 1) {
            swal({
                title: 'Aviso!',
                text: data.message,
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            this.ListarIngresos();
            this.NvoOtroIngresoModal.hide();
            this.mytemplateForm.resetForm();
          } else {
            if (data.status == 2) {
              this.toastr.error(data.message, 'Aviso!');
            } else {
              swal({
                title: 'Aviso!',
                html:
                '<span style="color:red">' +
                data.message +
                '</span>',
                type: 'error',
                allowOutsideClick: false,
                allowEscapeKey: false
              });

            }
          }
        } )
        .catch(err => console.log(err));
      }
    });
  }
  public aumento=0;
  public generatePDF()
  {
    this.loadingBar.start();
  const doc = new jspdf(
    {
      orientation: 'portrait',
      unit: 'mm',
      format: 'A5'
    }
  );
  
  

   // Add Page content
   doc.setFontSize(12);
   doc.text(30, 60, 'Numero de Recibo: 7191-20190614-123456');
   doc.text(120, 60, 'Fecha: 14/06/2019 03:14:52');
   doc.text(25, 70, 'Nombres y Apellidos: Jose Andersson Julca Vasquez');
   doc.text(25, 80, 'Documento Identidad: 719185974586237');
   doc.text(125, 80, 'Num. contacto: 978902579');
  var splitTitle = doc.splitTextToSize('Dirección: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi', 160);
  doc.text(25, 90, splitTitle);
  doc.text(25, 110, 'Nombre del Concepto');
  doc.text(150, 110, 'Monto');
  
  for (var j=0; j<5;j++){    
    doc.text(25, 120+this.aumento, 'CONCPETO APAFA');
    doc.text(150, 120+10+this.aumento, '59.00');
    this.aumento=this.aumento+10;
  }
  doc.text(150, this.aumento+10, 'Total');
   doc.addPage();
   doc.addPage();
   doc.addPage();
   doc.addPage();
   doc.addPage();
   doc.addPage();
   doc.addPage();
   var pageCount = doc.internal.getNumberOfPages();

   
   for(var i = 0; i < pageCount; i++) { 
    var img = new Image()
    img.src = 'assets/img/cabecera_recibos.png'
    doc.addImage(img, 'png', 25, 10, 150, 40);
    doc.setPage(i+1); 
    doc.text(10,10, doc.internal.getCurrentPageInfo().pageNumber + "/" + pageCount);
   }

  swal({
    title: '¿Esta seguro que desea descargar?',
    type: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si!',
    allowOutsideClick: false,
    allowEscapeKey: false,
  }).then((result) => {
    if (result.value == true) {
      doc.output('save', 'filename.pdf');
      this.loadingBar.complete();
    }
  });
  }

  public btnNuevo_Recibo(){
     this.NvoPagoModal.show();
  } 

  public tabla_deuda : boolean;
  btnBuscar_xDoc(dato:string){
    this.DatoBusqueda.idbusqueda=1;
    this.DatoBusqueda.datobusqueda=dato;
      this._MatriculaServicios.buscar_datos_xdoc(this.DatoBusqueda)
      .then(data => {
        if(data.status==1){
            this.recibo.id_apoderado = data.data[0].id_apoderado;
            this.recibo.datos_apoderado = data.data[0].apellidos_apoderado + " " + data.data[0].nombres_apoderado;
            this.recibo.celular_apoderado = data.data[0].celular_apoderado;
            this.recibo.direccion_apoderado = data.data[0].direccion_apoderado;
            this.recibo.correo_apoderado = data.data[0].correo_apoderado;
            this._IngresosServicios.Listar_Detalle_Deuda(this.recibo)
      .then(data => {
        if(data.status==1){
            this.tabla_deuda=true;
            this.DataDeuda = data.data;
        }else{
          this.toastr.error(data.message, 'Aviso!');
          this.tabla_deuda=false;
         }
      } )
      .catch(err => console.log(err))
        }else{
          this.toastr.error(data.message, 'Aviso!');
          this.tabla_deuda=false;
          this.recibo = {};
         }
      } )
      .catch(err => console.log(err))
    }

    public RegRecibo(form:Recibo){
      swal({
        title: '¿Esta seguro que desea guardar?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Guardar!',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.value == true) {
          form.anhio = localStorage.getItem('_anhio');
          form.id_usuario = localStorage.getItem('ID');
          form.detalle = this.DataDeuda;
          form.contador=0;
          this._IngresosServicios.nvo_recibo(form)
          .then(data => {
            if (data.status == 1) {
              swal({
                  title: 'Aviso!',
                  text: data.message,
                  html:
                  '<span style="color:green"> Núm. Reicbo: ' +
                  data.data +
                  '</span>',
                  type: 'success',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Ver Recibo, SI',
                  allowOutsideClick: false,
                  allowEscapeKey: false
              })
              this.ListarIngresos();
              this.tabla_deuda=false;
              this.NvoPagoModal.hide();
              this.mytemplatemyRecibo.resetForm();
            } else {
                swal({
                  title: 'Aviso!',
                  html:
                  '<span style="color:red">' +
                  data.message +
                  '</span>',
                  type: 'error',
                  allowOutsideClick: false,
                  allowEscapeKey: false
                });
            }
          } )
          .catch(err => console.log(err));
        }
      });
    }
    

    monto_cero : boolean;
    public select_tipo_pago(dato,index){
      var indice;
      this.recibo.mtotal_recibo=0;
        if(dato=='T'){
          this.DataDeuda[index].monto=this.DataDeuda[index].saldo_deuda;
          this.monto_cero=false;
        }else{
          this.DataDeuda[index].monto=0;
          this.monto_cero=true;
        }
        for(indice in this.DataDeuda){
          this.recibo.mtotal_recibo=this.recibo.mtotal_recibo + Number(this.DataDeuda[indice].monto);
        }
    }
     
    public monto_invalid : boolean;
    public monto_parcial(index,tipo){
      console.log(tipo.mytemplatemyRecibo.form.controls[index].status);
      var indice;
      this.recibo.mtotal_recibo=0;
     if(Number(this.DataDeuda[index].monto)<=Number(this.DataDeuda[index].saldo_deuda)){
      this.DataDeuda[index].monto_invalid=false;
      this.monto_invalid=false;
       this.monto_cero=false;
     }else{
      this.DataDeuda[index].monto_invalid=true;
      this.monto_invalid=true;
     }
      if(tipo.mytemplatemyRecibo.form.controls[index].status=='VALID'){
        for(indice in this.DataDeuda){
          this.recibo.mtotal_recibo=this.recibo.mtotal_recibo + Number(this.DataDeuda[indice].monto);
        }
      }
      
    }

    
}
