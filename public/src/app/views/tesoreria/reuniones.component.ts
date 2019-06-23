import { Component,ViewChild,ViewEncapsulation,Inject,OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { ReunionesService } from './reuniones.service';
import { Reunion,Busqueda,Concepto } from '../../app.datos';
import {MatPaginator, MatSort, MatTableDataSource, TooltipPosition} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NgxSpinnerService } from 'ngx-spinner';
declare var swal: any;
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '@angular/common';

function bodyRows(data,rowCount) {
  rowCount = rowCount;
  console.log(data);
  let body = [];
  for (var j = 0; j < rowCount; j++) {
      body.push({
          id: j+1,
          doc_apoderado:data[j].doc_apoderado,
          apoderado: data[j].apoderado,
          matriculados: data[j].matriculados,
          firma_apoderado:''
      });
  }
  return body;
}
@Component({
  templateUrl: 'reuniones.component.html',
  styleUrls: ['tesoreria.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ReunionesComponent implements  OnInit {
  @ViewChild('NvaReunionModal') public NvaReunionModal: ModalDirective;
  displayedColumns: string[] = ['motivo_reunion', 'fecha_reunion','concepto', 'monto_concepto','opciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  public DatoBusqueda: Busqueda;
  public reunion : Reunion = {};
  public panel_tabla:boolean;
  public panel_detalle:boolean;
  apoderado: string;
  constructor(private toastr: ToastrService,private loadingBar: LoadingBarService,
    private _ReunionesServicio: ReunionesService,
    @Inject(DOCUMENT) private document: Document,
    private spinner: NgxSpinnerService) { 
    this.DatoBusqueda = {
        datobusqueda: ''
      };
    this.ListarReunionesxPeriodo();
    this.panel_tabla=true;
  }

  ngOnInit() {
  
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  DataReuniones: any = [];
  ListarReunionesxPeriodo () {
  this.DatoBusqueda.datobusqueda = localStorage.getItem('_anhio');
  this._ReunionesServicio.getLista_reuniones_xperiodo(this.DatoBusqueda).subscribe(
    data => {
      if (data.status === 1) {
       this.DataReuniones = data.data;
       this.dataSource = new MatTableDataSource(this.DataReuniones);
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
searchString:string;
  btnNueva_Reunion(){
    //this.spinner.show();
    this.NvaReunionModal.show();
    this.ListarOtrosConceptos();
    this.reunion.id_concepto=0;
  }

  frmReunion_hide(opt){
       if(opt=='N'){
        this.NvaReunionModal.hide();
       }else{
         this.panel_tabla=true;
         this.panel_detalle=false;
         this.searchString='';
       }
  }

  DataConcepto : any = [];
  ListarOtrosConceptos(){
   this.DatoBusqueda.datobusqueda = localStorage.getItem('_anhio');
   this._ReunionesServicio.getLista_otros_conceptos(this.DatoBusqueda).subscribe(
     data => {
       if(data.status==1){
         this.DataConcepto = data.data;
       }else{
         this.toastr.error(data.message, 'Aviso!',{
           positionClass: 'toast-top-right'
         });
       }
       
     }
   )
 }

 obtener_monto(dato){
  for(var i=0;i<this.DataConcepto.length;i++){
      if(this.DataConcepto[i].id_concepto==dato){
            this.reunion.monto_concepto=this.DataConcepto[i].monto_concepto.toFixed(2);
      }
  }
     
 }


  onSubmit(form:Reunion){
    this.loadingBar.start();    
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
        //form.contador=0;
        this.spinner.show();
        this._ReunionesServicio.nva_reunion(form)
        .then(data => {
          if (data.status == 1) {
            this.NvaReunionModal.hide();
            setTimeout(() => {
            swal({
              title: 'Aviso!',
              text: data.message,
              type: 'success',
              allowOutsideClick: false,
              allowEscapeKey:false
            }) 
              this.spinner.hide();
              
            this.loadingBar.complete();
            this.document.documentElement.scrollTop = 0;
            this.ListarReunionesxPeriodo();
            }, 5000);
            
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

  Generar_Lista_Firmas(dato){       
    swal({
      title: '¿Esta seguro que desea generar lista?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Generar!',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.value == true) {
        this.DatoBusqueda.idbusqueda = dato;
        this.DatoBusqueda.datobusqueda = localStorage.getItem('_anhio');
        this.loadingBar.start(); 
        this.spinner.show();
        this._ReunionesServicio.generar_lista_firmas_reunion(this.DatoBusqueda)
        .then(data => {
          if (data.status == 1) {
            this.NvaReunionModal.hide();
            setTimeout(() => {
            swal({
              title: 'Aviso!',
              text: data.message,
              type: 'success',
              allowOutsideClick: false,
              allowEscapeKey:false
            }) 
              this.spinner.hide();
              
            this.loadingBar.complete();
            this.document.documentElement.scrollTop = 0;
            this.ListarReunionesxPeriodo();
            }, 5000);
            
          } else {
            setTimeout(() => {
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
              this.spinner.hide();              
              this.loadingBar.complete();
              this.document.documentElement.scrollTop = 0;
              this.ListarReunionesxPeriodo();
              }, 5000);
          }
        } )
        .catch(err => console.log(err));
      }
    });
  }

  public ImprimirListaFirmas(dato)
  {
    swal({
      title: '¿Esta seguro que desea imprimir lista?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Imprimir!',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.value == true) {
        this.loadingBar.start();
        this.spinner.show();
        const doc = new jspdf({orientation: 'portrait',unit: 'mm',format: 'A4'});
                 var headRows=  [{id:'N°',doc_apoderado:'Doc. Apoderado',apoderado: 'APODERADO', matriculados: 'ALUMNOS MATRICULADOS',firma_apoderado:'FIRMA APODERADO'}];
                 var totalPagesExp = "{total_pages_count_string}";
                  var img = new Image();
                  img.src = 'assets/img/cabecera_recibos.png'
                  doc.addImage(img,'png',25,10,150,40);
                  doc.setFontSize(11);
                  doc.setFont('helvetica')
                  doc.setFontType('bold')
                  doc.text(70, 60, 'Fecha y Hora: ' + formatDate(dato.fecha_reunion,'dd/MM/yyyy h:mm a','en-US'));
                  var splitTitle = doc.splitTextToSize('Motivo Reunión: ' + dato.motivo_reunion, 160);
                  doc.text(25, 70, splitTitle);
                  doc.text(25, 85, 'Bajo Concepto: '+ dato.descripcion_concepto);
                  doc.text(25, 95, 'Monto Multa: '+ dato.monto_concepto.toFixed(2));
                  this.DatoBusqueda.idbusqueda=dato.id_reunion;
              this.DatoBusqueda.datobusqueda = localStorage.getItem('_anhio');
              this._ReunionesServicio.listar_apoderados_reunion(this.DatoBusqueda).subscribe(
              data_lista => {
                if (data_lista.status === 1) {
                  var contador= data_lista.data.length;
                  doc.autoTable({
                    head: headRows,
                    body: bodyRows(data_lista.data,contador),
                    startY: 110, 
                    showHead: 'firstPage',
                    theme: 'grid',
                    headStyles: {
                      cellWidth: 'wrap'
                   },
                   bodyStyles: {
                    halign: 'justify'
                     },
                    // Override the default above for the text column
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
                  },
                });
               
               
                    // Total page number plugin only available in jspdf v1.0+
                    if (typeof doc.putTotalPages === 'function') {
                        doc.putTotalPages(totalPagesExp);
                    }
                    setTimeout(() => {
                    this.spinner.hide();
                    doc.output('save', dato.fecha_reunion+'.pdf');
                    this.toastr.success('Lista Generada', 'Aviso!',{positionClass: 'toast-top-right',timeOut: 500});
                   
                    this.loadingBar.complete();
                    this.document.documentElement.scrollTop = 0;
                  }, 5000);
                  }else{
                  this.toastr.error(data_lista.message, 'Aviso!');
                }
              }) 
      }
    });
  }

  
  public Detalle : Reunion = {};
  public DataAsistentes : any = [];
  Detalle_Lista_Reunion(dato){
      this.Detalle.id_reunion=dato.id_reunion;
      this.Detalle.motivo_reunion=dato.motivo_reunion;
      this.Detalle.fecha_reunion=formatDate(dato.fecha_reunion,'dd/MM/yyyy h:mm a','en-US');
      this.Detalle.descripcion_concepto=dato.descripcion_concepto;
      this.Detalle.monto_concepto=dato.monto_concepto.toFixed(2);
      this.DatoBusqueda.idbusqueda = dato.id_reunion;
      this.DatoBusqueda.datobusqueda = localStorage.getItem('_anhio');
      this.loadingBar.start();
              this._ReunionesServicio.listar_apoderados_reunion(this.DatoBusqueda).subscribe(
              data_lista => {
                if (data_lista.status === 1) {
                    this.DataAsistentes=data_lista.data;
                    this.panel_tabla=false;
                    this.panel_detalle=true;
                    this.loadingBar.complete();
                  }else{
                  this.toastr.error(data_lista.message, 'Aviso!');
                }
              }) 
  }

  Marcar_Asistencia(detalle,dato){
    console.log(this.Detalle.id_reunion,dato);
    this.loadingBar.start();
   if(dato[0]==1){
    this.DatoBusqueda.datobusqueda='0'+'-'+this.Detalle.id_reunion;
   }else{
    this.DatoBusqueda.datobusqueda='1'+'-'+this.Detalle.id_reunion;
   }
      this.DatoBusqueda.idbusqueda=detalle.id_apoderado;
        //console.log(this.DatoBusqueda.idbusqueda);
        //this.DetUsuarioModal.show(); 
          this._ReunionesServicio.registrar_asistencia(this.DatoBusqueda)
          .then(data => {
            if(data.status==1){
              this.toastr.success(data.message, 'Aviso!',{
                positionClass: 'toast-top-right',
                timeOut: 500
              });
              this.DatoBusqueda.idbusqueda = this.Detalle.id_reunion;
              this.DatoBusqueda.datobusqueda = localStorage.getItem('_anhio');
                      this._ReunionesServicio.listar_apoderados_reunion(this.DatoBusqueda).subscribe(
                      data_lista => {
                        if (data_lista.status === 1) {
                            this.DataAsistentes=data_lista.data;
                            this.panel_tabla=false;
                            this.panel_detalle=true;
                            this.loadingBar.complete();
                          }else{
                          this.toastr.error(data_lista.message, 'Aviso!');
                        }
                      }) 
            }else{
              this.toastr.error(data.message, 'Aviso!',{
                positionClass: 'toast-top-right',
                timeOut: 500
              });
              this.DatoBusqueda.idbusqueda = this.Detalle.id_reunion;
              this.DatoBusqueda.datobusqueda = localStorage.getItem('_anhio');
                      this._ReunionesServicio.listar_apoderados_reunion(this.DatoBusqueda).subscribe(
                      data_lista => {
                        if (data_lista.status === 1) {
                            this.DataAsistentes=data_lista.data;
                            this.panel_tabla=false;
                            this.panel_detalle=true;
                            this.loadingBar.complete();
                          }else{
                          this.toastr.error(data_lista.message, 'Aviso!');
                        }
                      }) 
              this.loadingBar.complete();
             }
          } )
          .catch(err => console.log(err))
  }
}
