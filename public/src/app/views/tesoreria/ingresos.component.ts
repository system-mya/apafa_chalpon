import { Component, ViewChild, ViewEncapsulation, Inject  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DOCUMENT } from '@angular/platform-browser';
import {MatPaginator, MatSort, MatTableDataSource, TooltipPosition} from '@angular/material';
import {clsBusqueda,clsMovimiento,clsRecibo,clsDetalle_Deuda} from '../../app.datos';
import { IngresosService } from './ingresos.service';
import { MatriculaService } from '../apafa/matricula.service';
import { ApoderadoService } from '../apafa/apoderado.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NgxSpinnerService } from 'ngx-spinner';
declare var swal: any;
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '@angular/common';

function bodyRows(data,rowCount) {
  rowCount = rowCount;
  let body = [];
  for (var j = 0; j < rowCount; j++) {
      body.push({
          id: j+1,
          descripcion_concepto: data[j].descripcion_concepto,
          monto_detalle: data[j].monto_detalle.toFixed(2),
      });
  }
  return body;
}

@Component({
  templateUrl: 'ingresos.component.html',
  styleUrls: ['tesoreria.css'],
  encapsulation: ViewEncapsulation.None,
})
export class IngresosComponent {
  @ViewChild('NvoOtroIngresoModal') public NvoOtroIngresoModal: ModalDirective;
  @ViewChild('NvoPagoModal') public NvoPagoModal: ModalDirective;
  @ViewChild('DetallePago') public DetallePago: ModalDirective;
  @ViewChild('DetalleIngreso') public DetalleIngreso: ModalDirective;
  displayedColumns: string[] = ['doc_ingreso', 'descripcion_ingreso', 'monto_ingreso', 'freg_ingreso', 'opciones_ingreso'];
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('myForm') mytemplateForm: NgForm;
  @ViewChild('myRecibo') mytemplatemyRecibo: NgForm;
  public DatoBusqueda: clsBusqueda;
  public otro: clsMovimiento = {};
  public recibo : clsRecibo = {};
  public DataDeuda : clsDetalle_Deuda ={};
  public optAd : string;
  constructor(private _IngresosServicios: IngresosService, 
    private _MatriculaServicios:MatriculaService,
    private _ApoderadoServicios : ApoderadoService,
    @Inject(DOCUMENT) private document: Document,
    private toastr: ToastrService,private loadingBar: LoadingBarService,
    private spinner: NgxSpinnerService) {
    this.DatoBusqueda = {
      datobusqueda: ''
    };
    this.ListarIngresos();
    this.recibo.mtotal_recibo=0;
    this.optAd = localStorage.getItem('id_perfil');
  }

DataIngresos: any = [];
 ListarIngresos () {
  this.DatoBusqueda.datobusqueda = localStorage.getItem('_anhio');
  this._IngresosServicios.Lista_Ingresos(this.DatoBusqueda).subscribe(
    data => {
      if (data.status === 1) {
       this.DataIngresos = data.data;
       this.dataSource = new MatTableDataSource(this.DataIngresos);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
      } else {
        this.toastr.error(data.message, 'Aviso!');
        this.DataIngresos = data.data;
        this.dataSource = new MatTableDataSource(this.DataIngresos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
        this.seleccion_deuda=false;
      } else {
        if (opc == 'D') {
          this.DetallePago.hide();
        }else{
          this.DetalleIngreso.hide();
        }
      }
    }
  }



  onSubmit(form: clsMovimiento) {
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
        form.anhio = localStorage.getItem('_anhio');
        form.tipo_movimiento = 'I';
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
  
  ImprimirPDF(dato){
      if(dato.tipo=='R'){
           this.VerPDFRecibo(dato.id_apoderado,dato.id_ingreso,dato.doc_ingreso,dato.freg_ingreso);
      }else{
         this.VerPDFIngreso(dato.id_ingreso);
      }
  }
  public detalle_recibo;
  public VerPDFRecibo(id_apoderado,id_ingreso,num,fecha)
  {
  this.loadingBar.start();
  this.spinner.show();
  const doc = new jspdf({orientation: 'portrait',unit: 'mm',format: 'A5'});
    this.DatoBusqueda.idbusqueda=id_apoderado;
    this._ApoderadoServicios.detalle_apoderado(this.DatoBusqueda)
    .then(data => {
      if(data.status==1){
           var headRows=  [{id:'N°',descripcion_concepto: 'DESCRIPCION CONCEPTO', monto_detalle: 'MONTO'}];
           var totalPagesExp = "{total_pages_count_string}";
            var img = new Image();
            img.src = 'assets/img/cabecera_recibos.png'
            doc.addImage(img,'png',25,10,150,40);
            doc.setFontSize(12);
            doc.setFont('helvetica')
            doc.setFontType('bold')
            doc.text(30, 60, 'N° de Recibo: ' + num);
            doc.text(120, 60, 'Fecha y Hora: ' + formatDate(fecha,'dd/MM/yyyy h:mm a','en-US'));
            doc.text(25, 70, 'Sr(a) Apoderado(a): '+ data.data[0].apellidos_apoderado + " " + data.data[0].nombres_apoderado);
            doc.text(25, 80, 'Documento Identidad: '+ data.data[0].doc_apoderado);
            doc.text(125, 80, 'Num. contacto: ' + data.data[0].celular_apoderado);
           var splitTitle = doc.splitTextToSize('Dirección: ' + data.data[0].direccion_apoderado, 160);
           doc.text(25, 90, splitTitle);
        
        this.DatoBusqueda.idbusqueda=id_ingreso; 
        this._IngresosServicios.obtener_detalle_recibo(this.DatoBusqueda).subscribe(
        data_recibo => {
          if (data_recibo.status === 1) {
            this.detalle_recibo = data_recibo.data;
            var contador= data_recibo.data.length;
            doc.autoTable({
              head: headRows,
              body: bodyRows(this.detalle_recibo,contador),
              startY: 110, 
              showHead: 'firstPage',
              theme: 'grid',
              columnStyles:{
                id: {halign: 'center',cellWidth: 8},
                descripcion_concepto: {cellWidth: 82},
                monto_detalle: {halign: 'center',cellWidth: 10}
               },
              didDrawPage: function (data) {
                // Footer
                var str = "Página " + doc.internal.getNumberOfPages()
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    str = str + " de " + totalPagesExp;
                }
                doc.setFontSize(10);
          
                // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                var pageSize = doc.internal.pageSize;
                var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                doc.text(str, data.settings.margin.left, pageHeight - 10);
            }
          });
          var suma_total=0.00;
          for(var i=0;i<contador;i++){
              suma_total=suma_total+this.detalle_recibo[i].monto_detalle;
          }
          doc.text(100, doc.autoTable.previous.finalY + 10, 'Total: ');
          doc.text(150, doc.autoTable.previous.finalY + 10, ''+suma_total.toFixed(2));
              // Total page number plugin only available in jspdf v1.0+
              if (typeof doc.putTotalPages === 'function') {
                  doc.putTotalPages(totalPagesExp);
              }
              setTimeout(() => {
              doc.output('save', num+'.pdf');
              this.toastr.success('Recibo Generado', 'Aviso!');
              this.DetallePago.hide();
              this.loadingBar.complete();
              this.spinner.hide();
              this.document.documentElement.scrollTop = 0;
            }, 5000);
            }else{
            this.toastr.error(data_recibo.message, 'Aviso!');
          }
        })
      }else{
        this.toastr.error(data.message, 'Aviso!');
       }
    } )
    .catch(err => console.log(err))

           
           
           
  }

  public VerPDFIngreso(id_ingreso)
  {
  this.loadingBar.start();
  this.spinner.show();
  const doc = new jspdf({orientation: 'portrait',unit: 'mm',format: 'A5'});
  this.DatoBusqueda.idbusqueda=id_ingreso;
  this.DatoBusqueda.datobusqueda='I';
  this._IngresosServicios.obtener_detalle_movimiento(this.DatoBusqueda)
  .then(data => {
    if(data.status==1){    
           var totalPagesExp = "{total_pages_count_string}";
            var img = new Image();
            img.src = 'assets/img/cabecera_recibos.png'
            doc.addImage(img,'png',25,10,150,40);
            doc.setFontSize(12);
            doc.setFont('helvetica')
            doc.setFontType('bold');
            doc.text(80, 60, 'DETALLE MOVIMIENTO');
            doc.setFontType('normal');
            doc.text(30, 70, 'Fecha y Hora: ' + formatDate(data.data[0].freg_movimiento,'dd/MM/yyyy h:mm a','en-US'));
            doc.text(30, 80, 'Doc. Identidad Responsable: ' + data.data[0].doc_encargado_movimiento);
            var splitTitle = doc.splitTextToSize('Sr(a) Responsable Ingreso: ' + data.data[0].datos_encargado_movimiento, 160);
            doc.text(30, 90, splitTitle);
            doc.setFontType('bold');
            doc.text(80, 110, 'DETALLE INGRESO');
            doc.setFontType('normal');
            var splitConcepto = doc.splitTextToSize('Concepto Ingreso: ' + data.data[0].descripcion_movimiento, 160);
            doc.text(30, 120 ,splitConcepto);
            doc.text(30, 130, 'Monto Ingreso: '+data.data[0].monto_movimiento.toFixed(2));
            doc.setFontType('bold');
              // Footer
              var str = "Página " + doc.internal.getNumberOfPages()
              // Total page number plugin only available in jspdf v1.0+
              if (typeof doc.putTotalPages === 'function') {
                  str = str + " de " + totalPagesExp;
              }
              doc.setFontSize(10);
        
              // jsPDF 1.4+ uses getWidth, <1.4 uses .width
              var pageSize = doc.internal.pageSize;
              var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
              doc.text(str, 30, pageHeight - 10);
                 
              // Total page number plugin only available in jspdf v1.0+
              if (typeof doc.putTotalPages === 'function') {
                  doc.putTotalPages(totalPagesExp);
              }
              setTimeout(() => {
              doc.output('save', data.data[0].doc_encargado_movimiento+'.pdf');
              this.toastr.success('Recibo Generado', 'Aviso!',{positionClass: 'toast-top-right',timeOut: 500});
              this.DetallePago.hide();
              this.loadingBar.complete();
              this.spinner.hide();
              this.document.documentElement.scrollTop = 0;
            }, 5000);
    }else{
      this.toastr.error(data.message, 'Aviso!');
      this.loadingBar.complete();
     }
  } )
  .catch(err => console.log(err))
           
           
           
           
  }
    
  //https://github.com/simonbengtsson/jsPDF-AutoTable/blob/master/examples/examples.js ejemplos


  public btnNuevo_Recibo(){
     this.NvoPagoModal.show();
  } 

  public tabla_deuda : boolean;
  public seleccion_deuda : boolean;
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
            this.DatoBusqueda.idbusqueda=this.recibo.id_apoderado;
            this._IngresosServicios.Listar_Detalle_Deuda(this.DatoBusqueda)
      .then(data => {
        if(data.status==1){
            this.seleccion_deuda=false;
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
          this.seleccion_deuda=false;
         }
      } )
      .catch(err => console.log(err))
    }

    public RegRecibo(form:clsRecibo){
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
                  data.data[0] +
                  '</span>',
                  type: 'success',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Ver Recibo, SI',
                  allowOutsideClick: false,
                  allowEscapeKey: false
              }).then((result) => {
                if (result.value == true) {                  
                  this.VerPDFRecibo(data.data[1][0],data.data[1][1],data.data[0],data.data[2]);
                  
                }
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
      this.seleccion_deuda=true;
      this.recibo.mtotal_recibo=0;
      var mtotal_recibo=0.00;
        if(dato=='T'){
          this.DataDeuda[index].monto=this.DataDeuda[index].saldo_deuda.toFixed(2);
          this.monto_cero=false;
        }else{
          this.DataDeuda[index].monto=0;
          this.monto_cero=true;
        }
        for(indice in this.DataDeuda){
          mtotal_recibo=mtotal_recibo + Number(this.DataDeuda[indice].monto);
          this.recibo.mtotal_recibo = Number(mtotal_recibo);
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
  
DetApoderado : any = [];
DetIngreso : any = [];
public monto_pagado;
btnDetalle_Ingreso(dato){
  this.loadingBar.start();
  if(dato.tipo=='R'){
    this.DatoBusqueda.idbusqueda=dato.id_apoderado;
    this._ApoderadoServicios.detalle_apoderado(this.DatoBusqueda)
    .then(data => {
      if(data.status==1){    
        this.DetApoderado = data.data[0];
        this.DetApoderado.doc_ingreso=dato.doc_ingreso;
        this.DetApoderado.fecha_registro=dato.freg_ingreso;        
        this.DatoBusqueda.idbusqueda=dato.id_ingreso;        
        this._IngresosServicios.obtener_detalle_recibo(this.DatoBusqueda).subscribe(
        data_recibo => {
          if (data_recibo.status === 1) {   
            this.loadingBar.complete();             
            this.DetallePago.show(); 
            this.toastr.success(data_recibo.message, 'Aviso!');
            this.detalle_recibo = data_recibo.data;
            this.monto_pagado=dato.monto_ingreso;
          }else{
            this.toastr.error(data_recibo.message, 'Aviso!');
            this.loadingBar.complete();
          }
        })
      }else{
        this.toastr.error(data.message, 'Aviso!');
        this.loadingBar.complete();
       }
    } )
    .catch(err => console.log(err))
  }else{
    this.DatoBusqueda.idbusqueda=dato.id_ingreso;
    this.DatoBusqueda.datobusqueda='I';
    this._IngresosServicios.obtener_detalle_movimiento(this.DatoBusqueda)
    .then(data => {
      if(data.status==1){    
        this.toastr.success(data.message, 'Aviso!');
        this.DetIngreso = data.data[0];
        this.loadingBar.complete();
        this.DetalleIngreso.show();
      }else{
        this.toastr.error(data.message, 'Aviso!');
        this.loadingBar.complete();
       }
    } )
    .catch(err => console.log(err))
  }
  }

  btnEliminar_Ingreso(dato) {
    if(dato.tipo=='O'){
      this.DatoBusqueda.datobusqueda='M';
       this.DatoBusqueda.idbusqueda=dato.id_ingreso;
   }else{
    this.DatoBusqueda.datobusqueda='R';
    this.DatoBusqueda.idbusqueda=dato.id_ingreso;
   }
    swal({
      title: '¿Esta seguro que desea eliminar?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar!',
      allowOutsideClick: false,
      allowEscapeKey:false,
    }).then((result) => {
      if (result.value==true) {
            this._IngresosServicios.eliminar_ingreso_egreso(this.DatoBusqueda)
            .then(data => {
              if(data.status==1){
                swal({
                  title: 'Aviso!',
                  text: data.message,
                  type: 'success',
                  allowOutsideClick: false,
                  allowEscapeKey:false
              })
              this.ListarIngresos();
              }else{
                this.toastr.error(data.message, 'Aviso!');
               }
            } )
            .catch(err => console.log(err))
      }
    })
  }
    
}
