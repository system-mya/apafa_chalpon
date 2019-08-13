import { Component,ViewEncapsulation,ViewChild,OnInit,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { AnhiosService } from '../administracion/anhios.service';
import { GradoSeccionService } from '../administracion/grado-seccion.service';
import { MatriculaService } from '../apafa/matricula.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ReportesService } from './reportes.service';
import {MatPaginator, MatSort, MatTableDataSource,TooltipPosition} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { IngresosService } from '../tesoreria/ingresos.service';
import { EgresosService } from '../tesoreria/egresos.service';
import { ApoderadoService } from '../apafa/apoderado.service';
import {clsBusqueda,clsGrados,clsSecciones,clsDetalle_Compra} from '../../app.datos';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NgxSpinnerService } from 'ngx-spinner';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '@angular/common';

function bodyRows(data,rowCount) {
  rowCount = rowCount;
  let body = [];
  for (var j = 0; j < rowCount; j++) {
      body.push({
          id: j+1,
          doc_alumno: data[j].doc_alumno,
          apellidos_alumno: data[j].apellidos_alumno,
          nombres_alumno: data[j].nombres_alumno,
          seccion: data[j].nombre_seccion,
      });
  }
  return body;
}

function bodyRecibo(data,rowCount) {
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

function bodyCompra(data,rowCount) {
  rowCount = rowCount;
  let body = [];
  for (var j = 0; j < rowCount; j++) {
      body.push({
          id: j+1,
          nom_producto: data[j].nom_producto,
          cantidad_compra: data[j].cantidad_compra,
          medida_compra: data[j].medida_compra,
          punit_compra: data[j].punit_compra.toFixed(2),
          total: (data[j].cantidad_compra * data[j].punit_compra).toFixed(2),
      });
  }
  return body;
}


@Component({
  templateUrl: 'lstingresosyegresos.component.html',
  styleUrls: ['reportes.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ListaIngresosEgresosComponent implements OnInit{
  @ViewChild('DetallePagoModal') public DetallePagoModal: ModalDirective;
  @ViewChild('DetalleMovimientoModal') public DetalleMovimientoModal: ModalDirective;
  @ViewChild('DetalleCompraModal') public DetalleCompraModal: ModalDirective;
  displayedColumns: string[] = ['tipo','num_doc','descripcion','fecha','monto','estado','opciones'];
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) 
  set paginator(value: MatPaginator) {
    this.dataSource.paginator = value;
  }

  @ViewChild(MatSort) 
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  }
  
  public criterio : string;
  public filtro : string;
  public estado : any;
  public tipo_ingreso : string;
  public tipo_egreso : string;
  public anhio_lectivo:string;
  public anhio:number;
  public option:string;
  public num_doc:string;
  public desc_doc:string;
  public grado:number;
  public seccion:number;
  public body : any = [];
  public DatoBusqueda : clsBusqueda = {};
  searchString:string;
  constructor(private _AnhiosServicios:AnhiosService,private toastr: ToastrService,
    private _ReportesServicios: ReportesService,private loadingBar: LoadingBarService,
    private _GradoServicios:GradoSeccionService,private _MatriculaServicios:MatriculaService,
    private _IngresosServicios: IngresosService,
    private _ApoderadoServicios : ApoderadoService,private _EgresosServicios: EgresosService,
    @Inject(DOCUMENT) private document: Document) { 
    this.ListarAnhiosLectivos();
    this.Inicializar_Tabla();
    this.criterio='';
    this.filtro='';
    this.tipo_ingreso='';
    this.tipo_egreso='';
    this.grado=0;
    this.anhio_lectivo='';
    this.seccion=0;
  }


  ngOnInit() {   
  }

  CriterioBusqueda(){
    this.panel_tabla=false;
    this.anhio_lectivo='';
  }

  FiltroBusqueda(){
    this.search='';
    this.selection='';
    this.applyFilter('');
    console.log(this.dataSource.data.length);
  }

  TipoBusqueda(){
    this.anhio=0; 
    this.option='';
    this.num_doc='';
    this.desc_doc='';
  }

  DataAnhios : any = [];
  ListarAnhiosLectivos (){
   this._AnhiosServicios.getListarAnhios().subscribe(
     data => {
       if(data.status==1){
         this.DataAnhios = data.data;
       }else{
         this.toastr.error(data.message, 'Aviso!');
       }
       
     }
   )
 }

 DataIE : any = [];
 panel_tabla:boolean;

 Inicializar_Tabla(){
  this.DataIE = null;
  this.dataSource = new MatTableDataSource(this.DataIE);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;      
 }



 BuscarIngresosyEgresos(){
   if(this.criterio!=''){
      if(this.anhio_lectivo==''){
        this.toastr.warning('DEBE SELECCIONAR AÑO LECTIVO', 'Aviso!');
      }else{
            this.loadingBar.start();
            this.DatoBusqueda.datobusqueda=this.criterio;
            if(this.criterio=='I'){
              this.DatoBusqueda.datobusqueda=this.anhio_lectivo;
              this._IngresosServicios.Lista_Ingresos(this.DatoBusqueda).subscribe(
                data => {
                  if (data.status === 1) {
                    this.DataIE=[];
                    this.toastr.success('Todos los Movimientos', 'Aviso!');
                    for(var i=0;i<data.data.length;i++){
                      this.DataIE.push(
                        { tipo: data.data[i].tipo,
                          num_doc: data.data[i].doc_ingreso,
                          descripcion: data.data[i].descripcion_ingreso,
                          fecha: data.data[i].freg_ingreso,
                          monto: data.data[i].monto_ingreso,
                          estado: data.data[i].estado,
                          color_estado: data.data[i].color_estado,
                          dato:data.data[i]
                        }
                      )
                    }
                    this.dataSource = new MatTableDataSource(this.DataIE);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;      
                    console.log(this.dataSource.paginator);         
                    this.panel_tabla=true;
                    this.loadingBar.complete();
                  } else {
                    this.panel_tabla=false;
                    this.toastr.error(data.message, 'Aviso!');
                    this.DataIE = [];
                    this.dataSource = new MatTableDataSource(this.DataIE);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;  
                    this.loadingBar.complete();
                  }
            
                }
              );
            }else{
              this.DatoBusqueda.datobusqueda=this.anhio_lectivo;
              this._EgresosServicios.getLista_compras_xperiodo(this.DatoBusqueda).subscribe(
                data => {
                  if (data.status === 1) {
                    this.DataIE=[];
                    this.toastr.success('Todos los Movimientos', 'Aviso!');
                    for(var i=0;i<data.data.length;i++){
                      this.DataIE.push(
                        { tipo: data.data[i].tipo_compra,
                          num_doc: data.data[i].num_compra,
                          descripcion: data.data[i].razon_social_compra,
                          fecha: data.data[i].freg_compra,
                          monto: data.data[i].total_compra,
                          estado: data.data[i].estado,
                          color_estado: data.data[i].color_estado,
                          dato:data.data[i]
                        }
                      )
                    }
                    this.dataSource = new MatTableDataSource(this.DataIE);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;      
                    console.log(this.dataSource.paginator);         
                    this.panel_tabla=true;
                    this.loadingBar.complete();
                  } else {
                    this.panel_tabla=false;
                    this.toastr.error(data.message, 'Aviso!');
                    this.DataIE = [];
                    this.dataSource = new MatTableDataSource(this.DataIE);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;  
                    this.loadingBar.complete();
                  }
            
                }
              );
            }
      }
   }else{
    this.toastr.warning('DEBE SELECCIONAR CRITERIO', 'Aviso!');
   }
 }

//  BuscarIngresosyEgresos_xCriterio(){
//   if(this.option==''){
//       this.toastr.warning('DEBE SELECCIONAR CRITERIO DE BUSQUEDA', 'Aviso!');
//   }else{
//       if(this.option=='A'){
//         if(this.anhio==0){
//           this.toastr.warning('DEBE SELECCIONAR AÑO LECTIVO', 'Aviso!');
//         }else{
//           if(this.criterio=='I'){
//             this.EjecutarBusqueda(this.criterio+this.tipo_ingreso+this.option,this.anhio);
//             this.num_doc='';
//             this.desc_doc='';
//           }else{

//           }
          
//         }
//       }else{
//          if(this.option=='N'){          
//           if(this.num_doc==''){
//             this.toastr.warning('DEBE INGRESAR NUM. A BUSCAR', 'Aviso!');
//           }else{
//             if(this.criterio=='I'){
//               this.EjecutarBusqueda(this.criterio+this.tipo_ingreso+this.option,this.num_doc);
//               this.anhio=0;
//               this.desc_doc='';
//             }else{
  
//             }
            
//           }
//          }else{
//            if(this.option=='D'){
//             if(this.desc_doc==''){
//               this.toastr.warning('DEBE INGRESAR NUM. A BUSCAR', 'Aviso!');
//             }else{
//               if(this.criterio=='I'){
//                 this.EjecutarBusqueda(this.criterio+this.tipo_ingreso+this.option,this.desc_doc);
//                 this.anhio=0;
//                 this.num_doc='';
//               }else{
    
//               }
              
//             }
//            }
//          }
//       }
//   }
 
// }

EjecutarBusqueda(opt,valor){
  
  this.loadingBar.start();
  this.DatoBusqueda.optbusqueda=opt;
  this.DatoBusqueda.datobusqueda=valor;
  this._ReportesServicios.listar_movimientos_xcriterio(this.DatoBusqueda).subscribe(
    data => {
      if(data.status==1){
        this.toastr.success('Lista de Movimientos', 'Aviso!');
        this.DataIE = data.data;
        this.dataSource = new MatTableDataSource(this.DataIE);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;                
        this.panel_tabla=true;
        this.loadingBar.complete();
      }else{
        this.panel_tabla=false;
        this.toastr.error(data.message, 'Aviso!');
        this.DataIE = data.data;
        this.dataSource = new MatTableDataSource(this.DataIE);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;  
        this.loadingBar.complete();
      }        
})
}
  DataGrado : clsGrados;
  grado_valor : boolean;
  ListarGrados (id){
    this.panel_tabla=false;
    this.loadingBar.start();
    this.DatoBusqueda.idbusqueda=id;
    this._ReportesServicios.listar_grados_xmatricula(this.DatoBusqueda).then(
     data => {
       if(data.status==1){
         this.DataGrado = data.data;
         this.grado=0;
         this.seccion=0;
         this.grado_valor=false;
         this.loadingBar.complete();
       }else{
         if(data.status==0){
          this.toastr.error(data.message, 'Aviso!');
          this.DataGrado = null;
          this.grado=0;
          this.seccion=0;
          this.grado_valor=true;
          this.loadingBar.complete();
         }else{
          this.toastr.warning(data.message, 'Aviso!');
          this.DataGrado = null;
          this.grado_valor=true;
          this.grado=0;
          this.seccion=0;
          this.loadingBar.complete();
         }
       }       
     })
     
 }

 DataSecciones : clsSecciones;
 Listar_Secciones_xGrado(id){
   this.panel_tabla=false;
  this.loadingBar.start();
      if(id==0){
        this.DataSecciones=null;
        this.seccion=0;
        this.loadingBar.complete();
      }else{        
        this.DatoBusqueda.idbusqueda=id;
         this._GradoServicios.listar_secciones_xgrado(this.DatoBusqueda)
         .then(data => {
           if(data.status==1){
            this.DataSecciones = data.data;
            this.loadingBar.complete();
            this.seccion=0;
           }else{
              this.toastr.error(data.message, 'Aviso!');
              this.DataSecciones=null;
              this.seccion=0;
              this.loadingBar.complete();
            }
         } )
         .catch(err => console.log(err))
      }
   } 

   GradoTodos : any = [];
   DataMatriculados : any = [];

  


   setupFilter(column: string) {
    this.dataSource.filterPredicate = (d: any, filter: string) => {
      const textToSearch = d[column] && d[column].toLowerCase() || '';
      return textToSearch.indexOf(filter) !== -1;
    };
  }
  versions=["VIGENTE","ELIMINADO"]
  search:any;
  selection : any;
  applyFilter(filterValue: string) {
    if(this.selection){
      this.dataSource.filter = this.selection.trim().toLowerCase() || this.search.trim().toLowerCase();
     
    }
    else
    {
       this.dataSource.filter = this.search.trim().toLowerCase();
    }
   
    
   console.log(this.dataSource.data);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  FilterEstado(filterValue) {
    console.log(this.dataSource);
    this.dataSource.filter = filterValue;
  }

   Matriculados:any;
   Listar_Matriculados(id){
    this.DatoBusqueda.idbusqueda=id;
    return this._MatriculaServicios.listar_matriculados_xgrado(this.DatoBusqueda).subscribe(
      function(result){
       return result;
      })
   }

   getTemperatureData(id){
    this.DatoBusqueda.idbusqueda=id;
    return new Promise((resolve, reject) => {
      this._MatriculaServicios.listar_matriculados_xgrado(this.DatoBusqueda).subscribe(
      function(result){
       resolve(result.data);
      })
    })
    }

  public VerPDF()
  {
    this.loadingBar.start();
    var doc = new jspdf({orientation: 'portrait',unit: 'mm',format: 'A4'});
    var totalPagesExp = "{total_pages_count_string}";
    var img = new Image();
    img.src = 'assets/img/cabecera_recibos.png'
    doc.addImage(img,'png',25,10,150,40);
    doc.setFontSize(12);
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.text(50, 60, "GRADO: "+this.DataMatriculados[0].descripcion_grado + " SECCION: " + this.DataMatriculados[0].nombre_seccion);
    // From HTML
     doc.autoTable({html: '.table',
     styles: {overflow: 'linebreak', cellWidth:'wrap'},
     columnStyles:{
       0: {halign: 'center',cellWidth: 5},
       1: {cellWidth: 10},
       2: {cellWidth: 25},
       3: {cellWidth: 25},
       4: {halign: 'center',cellWidth: 30},
       5: {halign: 'center',cellWidth: 5}
      },
     theme: 'grid',showHead: 'firstPage',startY: 70,
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
  }});
  if (typeof doc.putTotalPages === 'function') {
    doc.putTotalPages(totalPagesExp);
}
    // var head = [{num:'N°'}];
  
    // for(var j = 0; j < this.body.length; j++){
    //   let body2 = this.body[j].numbers;
    //   for (var i = 0; i < body2.length; i++) {
    //      var row = body2[i];
    //      row['pname'] = {rowSpan: body2.length, content: this.body[j].pname, styles: {valign: 'middle', halign: 'center'}};
    //   }
    //   doc.autoTable({
    //     head: head,
    //     body: body2,
    //     theme: 'grid',
    //     pageBreak: 'avoid',
    // });
  
    // }
    setTimeout(() => {
      doc.output('save', this.DataMatriculados[0].descripcion_grado+" "+this.DataMatriculados[0].nombre_seccion+'.pdf');
      this.toastr.success('PDF Generado', 'Aviso!');
      this.loadingBar.complete();
    }, 5000); 
    
  }


  btnVerDetalle(dato){
    if(this.criterio=='I'){
       this.Detalle_Ingreso(dato);
    }else{
      this.Detalle_Egreso(dato);
    }
     console.log(dato);
  }
  

DetApoderado : any = [];
DetMovimiento : any = [];
public detalle_recibo;
public monto_pagado;
public Detalle_Ingreso(dato){
  this.loadingBar.start();
  if(dato.dato.tipo.charAt(0)=='R'){
    this.DatoBusqueda.idbusqueda=dato.dato.id_apoderado;
    this._ApoderadoServicios.detalle_apoderado(this.DatoBusqueda)
    .then(data => {
      if(data.status==1){    
        this.DetApoderado = data.data[0];
        this.DetApoderado.doc_ingreso=dato.dato.doc_ingreso;
        this.DetApoderado.fecha_registro=dato.dato.freg_ingreso;        
        this.DatoBusqueda.idbusqueda=dato.dato.id_ingreso;        
        this._IngresosServicios.obtener_detalle_recibo(this.DatoBusqueda).subscribe(
        data_recibo => {
          if (data_recibo.status === 1) {   
            this.loadingBar.complete();             
            this.DetallePagoModal.show(); 
            this.toastr.success(data_recibo.message, 'Aviso!');
            this.detalle_recibo = data_recibo.data;
            this.monto_pagado=dato.dato.monto_ingreso;
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
    this.DatoBusqueda.idbusqueda=dato.dato.id_ingreso;
    this.DatoBusqueda.datobusqueda='I';
    this._IngresosServicios.obtener_detalle_movimiento(this.DatoBusqueda)
    .then(data => {
      if(data.status==1){    
        this.toastr.success(data.message, 'Aviso!');
        this.DetMovimiento = data.data[0];
        this.DetMovimiento.tipo = 'INGRESO';
        this.loadingBar.complete();
        this.DetalleMovimientoModal.show();
      }else{
        this.toastr.error(data.message, 'Aviso!');
        this.loadingBar.complete();
       }
    } )
    .catch(err => console.log(err))
  }
  }


  public DetalleCompra:any=[];
  public DetalleLista : clsDetalle_Compra;
  Detalle_Egreso(dato){     
     this.loadingBar.start();
     if(dato.dato.tipo_compra != "OTROS"){
      this.DetalleCompra.tipo_compra = dato.dato.tipo_compra;
      this.DetalleCompra.num_compra = dato.dato.num_compra;
      this.DetalleCompra.razon_social_compra = dato.dato.razon_social_compra;
      this.DetalleCompra.ruc_compra = dato.dato.ruc_compra;
      this.DetalleCompra.fecha_compra = dato.dato.fecha_compra;
      this.DetalleCompra.doc_encargado_compra = dato.dato.doc_encargado_compra;
      this.DetalleCompra.encargado_compra = dato.dato.encargado_compra;
      this.DetalleCompra.total_compra = dato.dato.total_compra;
      this.DatoBusqueda.idbusqueda=dato.dato.id_compra;
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
      this.DatoBusqueda.idbusqueda=dato.dato.id_compra;
    this.DatoBusqueda.datobusqueda='E';
    this._IngresosServicios.obtener_detalle_movimiento(this.DatoBusqueda)
    .then(data => {
      if(data.status==1){    
        this.toastr.success(data.message, 'Aviso!');
        this.DetMovimiento = data.data[0];
        this.DetMovimiento.tipo = 'EGRESO';
        this.loadingBar.complete();
        this.DetalleMovimientoModal.show();
      }else{
        this.toastr.error(data.message, 'Aviso!');
        this.loadingBar.complete();
       }
    } )
    .catch(err => console.log(err))
  
     }
  }

  frmModal_hide(opc) {
    if (opc =='DR') {
      this.DetallePagoModal.hide();
    }else{
      if(opc=='DM'){
         this.DetalleMovimientoModal.hide();
      }else{
        this.DetalleCompraModal.hide();
      }
    }
  }


  ImprimirPDF(dato){
    this.document.documentElement.scrollTop = 0;
    if(dato.tipo.charAt(0)=='R'){
      this.VerPDFRecibo(dato.dato.id_apoderado,dato.dato.id_ingreso,dato.dato.doc_ingreso,dato.dato.freg_ingreso);
    }else{
      if(dato.tipo.charAt(0)!='O'){
        this.VerPDFCompra(dato);
        console.log(dato);
      }else{
        if(dato.tipo.charAt(0)=='O' && this.criterio=='I'){
          this.VerPDFMovimiento(dato.dato.id_ingreso,'INGRESO');
        }else{
          this.VerPDFMovimiento(dato.dato.id_compra,'EGRESO');
        }
        
      }      
    }
}


VerPDFCompra(dato){
  this.loadingBar.start();
  const doc = new jspdf({orientation: 'portrait',unit: 'mm',format: 'A5'});
    this.DatoBusqueda.idbusqueda=dato.dato.id_compra;
   this._EgresosServicios.Obtener_Detalle_Compra(this.DatoBusqueda)
   .subscribe(
    data => {
      if (data.status === 1) {
        var ruc;
        if(dato.dato.ruc_compra==null){
             ruc = '';
        }else{
           ruc = dato.dato.ruc_compra;
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
         doc.text(70, 70, 'Núm ' +dato.dato.tipo_compra + ": " );    
         doc.text(150, 70, 'Fecha: ' );  
         doc.text(30, 80, 'Razón Social: ' );      
         doc.text(148, 80, 'RUC: ');
         doc.text(30, 90, 'Doc Encargado: ');
         doc.text(30, 100, 'Encargado Compra: ');
         doc.setFontType('normal');
         doc.text(41, 70, dato.dato.tipo_compra); 
         doc.text(101, 70,  dato.dato.num_compra);
         doc.text(168, 70, formatDate(dato.dato.fecha_compra,'dd/MM/yyyy','en-US'));
         var splitRazonSocial = doc.splitTextToSize(dato.dato.razon_social_compra, 100);
         doc.text(60, 80, splitRazonSocial);
         doc.text(161, 80, ruc);
         doc.text(63, 90, dato.dato.doc_encargado_compra);
         var splitEncargado = doc.splitTextToSize( dato.dato.encargado_compra, 100);
         doc.text(71, 100, splitEncargado);
         doc.setFontType('bold');
         doc.text(80, 110, 'DETALLE COMPRA');
         var contador= data.data.length;
         doc.autoTable({
           head: headRows,
           body: bodyCompra(data.data,contador),
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
        doc.text(150, doc.autoTable.previous.finalY + 10, ''+dato.dato.total_compra.toFixed(2));
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
            }

         setTimeout(() => {
          doc.output('save', dato.dato.tipo_compra + "-" + dato.dato.num_compra+'.pdf');
          this.toastr.success(dato.dato.tipo_compra + ' Generado', 'Aviso!');
          this.loadingBar.complete();
          this.document.documentElement.scrollTop = 0;
        }, 5000);
      } else {
        this.toastr.error(data.message, 'Aviso!');
        this.loadingBar.complete();
      }

    }
  );
}

public VerPDFRecibo(id_apoderado,id_ingreso,num,fecha)
{
this.loadingBar.start();
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
            body: bodyRecibo(this.detalle_recibo,contador),
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
            this.DetallePagoModal.hide();
            this.loadingBar.complete();
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



public VerPDFMovimiento(id,tipo)
{
this.loadingBar.start();
const doc = new jspdf({orientation: 'portrait',unit: 'mm',format: 'A5'});
this.DatoBusqueda.idbusqueda=id;
this.DatoBusqueda.datobusqueda=tipo.charAt(0);
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
          doc.text(80, 110, 'DETALLE ' + tipo);
          doc.setFontType('normal');
          var splitConcepto = doc.splitTextToSize('Concepto ' + tipo + ': ' + data.data[0].descripcion_movimiento, 160);
          doc.text(30, 120 ,splitConcepto);
          doc.text(30, 130, 'Monto '+ tipo + ': ' + data.data[0].monto_movimiento.toFixed(2));
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
            doc.output('save', tipo + ' ' + data.data[0].doc_encargado_movimiento+'.pdf');
            this.toastr.success('Recibo Generado', 'Aviso!',{positionClass: 'toast-top-right',timeOut: 500});
            this.DetallePagoModal.hide();
            this.loadingBar.complete();
            this.document.documentElement.scrollTop = 0;
          }, 5000);
  }else{
    this.toastr.error(data.message, 'Aviso!');
    this.loadingBar.complete();
   }
} )
.catch(err => console.log(err))
         
         
         
         
}
}
