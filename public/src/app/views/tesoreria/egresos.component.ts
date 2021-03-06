import { Component,ViewChild,ViewEncapsulation,Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DOCUMENT } from '@angular/platform-browser';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {clsCompras,clsDetalle_Compra,clsBusqueda,clsMovimiento} from '../../app.datos';
import {MatPaginator, MatSort, MatTableDataSource, TooltipPosition} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { EgresosService } from './egresos.service';
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
          nom_producto: data[j].nom_producto,
          cantidad_compra: data[j].cantidad,
          medida_compra: data[j].medida,
          punit_compra: data[j].punit.toFixed(2),
          total: (data[j].cantidad * data[j].punit).toFixed(2),
      });
  }
  return body;
}



@Component({
  templateUrl: 'egresos.component.html',
  styleUrls: ['tesoreria.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EgresosComponent {
  @ViewChild('NvaCompraModal') public NvaCompraModal: ModalDirective;
  @ViewChild('NvoOtroEgresoModal') public NvoOtroEgresoModal: ModalDirective;
  @ViewChild('DetalleCompraModal') public DetalleCompraModal: ModalDirective;
  @ViewChild('DetalleEgreso') public DetalleEgreso: ModalDirective;
  @ViewChild('MyCompra') myCompraForm: NgForm;
  @ViewChild('myForm') myEgresoForm: NgForm;
  displayedColumns: string[] = ['tipo_compra', 'num_compra', 'razon_social_compra', 'fecha_compra', 'total_compra','estado','opciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  public compra : clsCompras = {};
  public otro: clsMovimiento = {};
  public DatoBusqueda: clsBusqueda;
  public producto : clsDetalle_Compra = {};
  public panel_registro : boolean;
  public panel_tabla_egresos : boolean;
  public detalle_compra : any = [];
  public btnagregar : boolean;
  public optAd : string;
  public spinner_mensaje : string;
  constructor(private toastr: ToastrService,private loadingBar: LoadingBarService,
    private _EgresosServicios: EgresosService,
    @Inject(DOCUMENT) private document: Document,
    private spinner: NgxSpinnerService) { 
    this.DatoBusqueda = {
        datobusqueda: ''
      };
    this.panel_tabla_egresos=true;
    this.ListarEgresosxPeriodo();
    this.optAd = localStorage.getItem('id_perfil');
  }

 DataEgresos: any = [];
 ListarEgresosxPeriodo () {
  this.DatoBusqueda.datobusqueda = localStorage.getItem('_anhio');
  this._EgresosServicios.getLista_compras_xperiodo(this.DatoBusqueda).subscribe(
    data => {
      if (data.status === 1) {
       this.DataEgresos = data.data;
       this.dataSource = new MatTableDataSource(this.DataEgresos);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
      } else {
        this.toastr.error(data.message, 'Aviso!');
        this.DataEgresos = data.data;
        this.dataSource = new MatTableDataSource(this.DataEgresos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }

    }
  );
}

numdata : number;
applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
  this.numdata = this.dataSource.filteredData.length;

}


  btnNueva_Compra() {
    this.panel_registro=true;
    this.panel_tabla_egresos=false;
    this.compra.ruc_compra='';
    this.compra.tipo_compra='';
    this.producto.nom_producto='';
    this.producto.medida='';
    this.producto.punit=0;
    this.producto.cantidad=0;
    this.btnagregar=false;
    this.document.documentElement.scrollTop = 0;
    this.compra.total_compra=0;
  }

  btnagregar_producto(dato){
    var indice;
    this.compra.total_compra=0;
    if(dato.control.status=='VALID' && this.producto.nom_producto!='' && this.producto.medida!='' && this.producto.cantidad>0 && this.producto.punit>0){
      this.detalle_compra.push({
        nom_producto : this.producto.nom_producto.toUpperCase(),
        cantidad : this.producto.cantidad,
        medida : this.producto.medida.toUpperCase(),
        punit : this.producto.punit
      });
      for(indice in this.detalle_compra){
        this.compra.total_compra=this.compra.total_compra + Number(this.detalle_compra[indice].punit * this.detalle_compra[indice].cantidad);
         console.log(this.compra.total_compra);
      }
      this.producto.nom_producto='';
      this.producto.medida='';
      this.producto.punit=0;
      this.producto.cantidad=0;
      this.btnagregar=false;
    }else{
      if(this.producto.nom_producto=='' && this.producto.medida=='' && this.producto.cantidad<=0 && this.producto.punit<=0){
        this.btnagregar=true;
        this.opcnom_producto=true;
        this.opcmedida=true;
      }else{
        if(this.producto.nom_producto==''){
          this.btnagregar=true;
          this.opcnom_producto=true;        
        }else{
          if(this.producto.medida==''){
            this.btnagregar=true;
            this.opcmedida=true;
          }else{          
            if(dato.control.status=='INVALID' || (this.producto.cantidad<=0 || this.producto.punit<=0)){
              this.btnagregar=true;
            }
          }
        }
      }
    }
    if(this.detalle_compra.length>0){
      this.compra.total_compra=0;
      for(indice in this.detalle_compra){
        this.compra.total_compra=this.compra.total_compra + Number(this.detalle_compra[indice].punit * this.detalle_compra[indice].cantidad);
         console.log(this.compra.total_compra);
      }
    }
  }

  Agregar_NvaCompra(form:clsCompras){
    if(this.detalle_compra.length==0){
      this.toastr.error('No hay Detalle de la Compra', 'Aviso!',{positionClass: 'toast-top-right',timeOut: 1000});
    }else{
      this.btnagregar=false;
          swal({
        title: '¿Esta seguro que desea guardar?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Guardar!',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.value == true) {
          form.anhio = localStorage.getItem('_anhio');
          form.id_usuario = localStorage.getItem('ID');
          form.detalle = this.detalle_compra;          
          this._EgresosServicios.nva_compra(form)
          .then(data => {
            this.document.documentElement.scrollTop = 0;
            this.spinner.show();
            this.spinner_mensaje = 'Registrando Compra';
            if (data.status == 1) {              
              setTimeout(() => {
                this.spinner.hide();
                swal({
                  title: 'Aviso!',
                  text: data.message,
                  type: 'success',
                  allowOutsideClick: false,
                  allowEscapeKey:false
                }) 
                this.compra = {};
                this.detalle_compra = []; 
                this.panel_tabla_egresos=true;
                this.panel_registro=false;
                this.document.documentElement.scrollTop = 0;   
                this.ListarEgresosxPeriodo();
            }, 5000);  
           } else {
                this.spinner.hide();
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
  }

  btnElimianr_Producto(dato){
    this.detalle_compra.splice(dato, 1);
    var indice;
    if(this.detalle_compra.length>0){
      this.compra.total_compra=0;
      for(indice in this.detalle_compra){
        this.compra.total_compra=this.compra.total_compra + Number(this.detalle_compra[indice].punit * this.detalle_compra[indice].cantidad);
         console.log(this.compra.total_compra);
      }
    }else{
      this.compra.total_compra=0;
    }
  }

  frmEgresos_hide(opt){
      if(opt=='R'){
           this.panel_registro=false;
           this.panel_tabla_egresos=true;
           this.myCompraForm.resetForm();
           this.document.documentElement.scrollTop = 0;
           this.ListarEgresosxPeriodo();
           this.detalle_compra = []; 
           this.compra.total_compra=0;

      }else{
        if(opt=='D'){
          this.DetalleCompraModal.hide();
        }else{
          if(opt=='DE'){
            this.DetalleEgreso.hide();
          }else{
            this.NvoOtroEgresoModal.hide();
            this.myEgresoForm.resetForm();
          }
        }
      }
  }

  public DetalleCompra:any=[];
  public DetalleLista : clsDetalle_Compra;
  btnDetalle_Compra(dato){     
     this.loadingBar.start();
     if(dato.tipo_compra != "OTROS"){
      this.DetalleCompra.tipo_compra = dato.tipo_compra;
      this.DetalleCompra.num_compra = dato.num_compra;
      this.DetalleCompra.razon_social_compra = dato.razon_social_compra;
      this.DetalleCompra.ruc_compra = dato.ruc_compra;
      this.DetalleCompra.fecha_compra = dato.fecha_compra;
      this.DetalleCompra.doc_encargado_compra = dato.doc_encargado_compra;
      this.DetalleCompra.encargado_compra = dato.encargado_compra;
      this.DetalleCompra.total_compra = dato.total_compra;
      this.DatoBusqueda.idbusqueda=dato.id_compra;
      this._EgresosServicios.Obtener_Detalle_Compra(this.DatoBusqueda)
      .subscribe(
       data => {
         if (data.status === 1) {
            this.DetalleLista = data.data;
            this.toastr.success(data.message, 'Aviso!');
            this.DetalleCompraModal.show();
            this.loadingBar.complete();
         } else {
           this.toastr.error(data.message, 'Aviso!');
           this.loadingBar.complete();
         }
   
       }
     );
     }else{
      this.DetalleCompra.num_compra = dato.num_compra;
      this.DetalleCompra.razon_social_compra = dato.razon_social_compra;
      this.DetalleCompra.ruc_compra = dato.ruc_compra;
      this.DetalleCompra.fecha_compra = dato.fecha_compra;
      this.DetalleCompra.total_compra = dato.total_compra;
      this.toastr.success('CONSULTA EXITOSA', 'Aviso!');
      this.DetalleEgreso.show();
      this.loadingBar.complete();
     }
  }
 
  public opcnom_producto : boolean;
  public opcmedida : boolean;
  cambios_texto(opt,dato){
    if(opt==0){
      if(dato==''){
        this.opcnom_producto=true;        
      }else{
        this.opcnom_producto=false;
      }
    }else{
      if(dato==''){
        this.opcmedida=true;        
      }else{
        this.opcmedida=false;
      }
    }
  }

  ImprimirPDF(dato){
       if(dato.tipo_compra=="OTROS"){
             this.VerPDFEgreso(dato);
       }else{
            this.VerPDFCompra(dato);
       }
  }
  VerPDFCompra(dato){  
  this.document.documentElement.scrollTop = 0;
    const doc = new jspdf({orientation: 'portrait',unit: 'mm',format: 'A5'});
      this.DatoBusqueda.idbusqueda=dato.id_compra;
     this._EgresosServicios.Obtener_Detalle_Compra(this.DatoBusqueda)
     .subscribe(
      data => {
        if (data.status === 1) {
          this.spinner.show();
          this.spinner_mensaje = 'Generando Archivo PDF';
          var ruc;
          if(dato.ruc_compra==null){
               ruc = '';
          }else{
             ruc = dato.ruc_compra;
          }
          var headRows=  [{id:'N°',nom_producto: 'DESCRIPCION PRODUCTO', medida_compra: 'MEDIDA',cantidad_compra: 'CANTIDAD',punit_compra: 'PRECIO',total: 'TOTAL'}];
          var totalPagesExp = "{total_pages_count_string}";
           var img = new Image();
           img.src = 'assets/img/cabecera_recibos.png'
           doc.addImage(img,'png',25,10,150,40);
           doc.setFontSize(12);
           doc.setFont('helvetica')
           doc.setFontType('bold');
           doc.text(80, 60, 'DETALLE MOVIMIENTO');
           doc.text(30, 70, 'Tipo: '); 
           doc.text(70, 70, 'Núm ' +dato.tipo_compra + ": " );    
           doc.text(150, 70, 'Fecha: ' );  
           doc.text(30, 80, 'Razón Social: ' );      
           doc.text(148, 80, 'RUC: ');
           doc.text(30, 90, 'Doc Encargado: ');
           doc.text(30, 100, 'Encargado Compra: ');
           doc.setFontType('normal');
           doc.text(41, 70, dato.tipo_compra); 
           doc.text(101, 70,  dato.num_compra);
           doc.text(168, 70, formatDate(dato.fecha_compra,'dd/MM/yyyy','en-US'));
           var splitRazonSocial = doc.splitTextToSize(dato.razon_social_compra, 100);
           doc.text(60, 80, splitRazonSocial);
           doc.text(161, 80, ruc);
           doc.text(63, 90, dato.doc_encargado_compra);
           var splitEncargado = doc.splitTextToSize( dato.encargado_compra, 100);
           doc.text(71, 100, splitEncargado);
           doc.setFontType('bold');
           doc.text(80, 110, 'DETALLE COMPRA');
           var contador= data.data.length;
           doc.autoTable({
             head: headRows,
             body: bodyRows(data.data,contador),
             startY: 115, 
             showHead: 'firstPage',
             theme: 'grid',
             columnStyles:{
               id: {halign: 'center',cellWidth: 8},
               nom_producto: {cellWidth: 42},
               medida_compra: {halign: 'center',cellWidth: 20},
               cantidad_compra: {halign: 'center',cellWidth: 10},
               punit_compra: {halign: 'center',cellWidth: 10},
               total: {halign: 'center',cellWidth: 10}
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
          doc.text(100, doc.autoTable.previous.finalY + 10, 'Total: ');
          doc.text(150, doc.autoTable.previous.finalY + 10, ''+dato.total_compra.toFixed(2));
              // Total page number plugin only available in jspdf v1.0+
              if (typeof doc.putTotalPages === 'function') {
                  doc.putTotalPages(totalPagesExp);
              }

           setTimeout(() => {
            doc.output('save', dato.tipo_compra + "-" + dato.num_compra+'.pdf');
            this.toastr.success('Archivo PDF Generado' + dato.tipo_compra , 'Aviso!',{positionClass: 'toast-top-right',timeOut: 1000});
            this.spinner.hide();
            this.document.documentElement.scrollTop = 0;
          }, 5000);
        } else {
          this.spinner.hide();
          this.toastr.error(data.message, 'Aviso!');
        }
  
      }
    );
  }

  btnNuevo_OtroEgreso(){
    this.NvoOtroEgresoModal.show();
  }

  RegOtroEgreso(form: clsMovimiento) {
    if(form.monto_movimiento!=0){
    swal({
      title: '¿Esta seguro que desea guardar?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar!',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.value == true) {
        form.anhio = localStorage.getItem('_anhio');
        form.id_usuario = localStorage.getItem('ID');
        form.tipo_movimiento = 'E';              
        this._EgresosServicios.nvo_otro_egreso(form)
        .then(data => {
          if (data.status == 1) {
            this.spinner.show();
            this.spinner_mensaje = 'Registrando Movimiento'  
            setTimeout(() => {
              this.spinner.hide();
              swal({
                title: 'Aviso!',
                text: data.message,
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            this.NvoOtroEgresoModal.hide();
            this.ListarEgresosxPeriodo();            
            this.myEgresoForm.resetForm();
          }, 5000);        
          
          } else {
            this.spinner.hide();
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
  }else{
    swal({
      title: 'Aviso!',
      html:
      '<span style="color:red">' +
      'MONTO DEBE SER MAYOR A 0' +
      '</span>',
      type: 'error',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
   }
  }

  btnEliminar_Egreso(dato) {
    if(dato.tipo_compra=='OTROS'){
      this.DatoBusqueda.datobusqueda='M';
       this.DatoBusqueda.idbusqueda=dato.id_compra;
   }else{
    this.DatoBusqueda.datobusqueda='C';
    this.DatoBusqueda.idbusqueda=dato.id_compra;
   }   
    swal({
      title: '¿Esta seguro que desea eliminar egreso?',
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
        this.loadingBar.start();
            this._EgresosServicios.eliminar_ingreso_egreso(this.DatoBusqueda)
            .then(data => {
              if(data.status==1){
                this.loadingBar.complete();
                swal({
                  title: 'Aviso!',
                  text: data.message,
                  type: 'success',
                  allowOutsideClick: false,
                  allowEscapeKey:false
              })
              this.ListarEgresosxPeriodo();
              }else{
                this.loadingBar.complete();
                this.toastr.error(data.message, 'Aviso!');
               }
            } )
            .catch(err => console.log(err))
      }
    })
  }

  public VerPDFEgreso(dato)
  {
    this.spinner.show();
    this.spinner_mensaje = 'Generando Archivo PDF';
    this.document.documentElement.scrollTop = 0;
  const doc = new jspdf({orientation: 'portrait',unit: 'mm',format: 'A5'});
           var totalPagesExp = "{total_pages_count_string}";
            var img = new Image();
            img.src = 'assets/img/cabecera_recibos.png'
            doc.addImage(img,'png',25,10,150,40);
            doc.setFontSize(12);
            doc.setFont('helvetica')
            doc.setFontType('bold');
            doc.text(80, 60, 'DETALLE MOVIMIENTO');            
            doc.text(30, 70, 'Fecha y Hora: ');
            doc.text(30, 80, 'Doc. Identidad : ' );
            doc.text(30, 90, 'Sr(a) Datos Completos: ');            
            doc.setFontType('normal');
            doc.text(60, 70, formatDate(dato.fecha_compra,'dd/MM/yyyy h:mm a','en-US'));
            doc.text(63, 80, dato.num_compra);
            var splitTitle = doc.splitTextToSize(dato.razon_social_compra, 160);
            doc.text(80, 90, splitTitle);
            doc.setFontType('bold');
            doc.text(80, 110, 'DETALLE EGRESO');     
            doc.text(30, 120, 'Concepto Egreso: ');        
            doc.text(30, 130, 'Monto Egreso: ');
            doc.setFontType('normal');
            var splitConcepto = doc.splitTextToSize(dato.ruc_compra, 160);
            doc.text(68, 120 ,splitConcepto);
            doc.text(60, 130, dato.total_compra.toFixed(2));
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
              doc.output('save', dato.num_compra +'.pdf');
              this.toastr.success('Archivo PDF Generado', 'Aviso!',{positionClass: 'toast-top-right',timeOut: 500});
              this.spinner.hide();
              this.document.documentElement.scrollTop = 0;
            }, 5000);         
  }
    
}



