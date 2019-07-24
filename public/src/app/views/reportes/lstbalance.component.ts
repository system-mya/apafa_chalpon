import { Component,ViewEncapsulation,ViewChild,OnInit } from '@angular/core';
import { AnhiosService } from './../administracion/anhios.service';
import { GradoSeccionService } from './../administracion/grado-seccion.service';
import { MatriculaService } from './../apafa/matricula.service';
import { ReportesService } from './../reportes/reportes.service';
import {MatPaginator, MatSort, MatTableDataSource,TooltipPosition} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import {clsBusqueda,clsGrados,clsSecciones} from '../../app.datos';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { LoadingBarService } from '@ngx-loading-bar/core';
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


@Component({
  templateUrl: 'lstbalance.component.html',
  styleUrls: ['reportes.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BalanceComponent implements OnInit{
  displayedColumns: string[] = ['doc_alumno','apellidos_alumno','nombres_alumno','descripcion_grado','nombre_seccion'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public anhio_lectivo:number;
  public criterio:number;
  public seccion:number;
  public fecha_desde : string;
  public fecha_hasta : string;
  public body : any = [];
  public DatoBusqueda : clsBusqueda = {};
  searchString:string;
  constructor(private _AnhiosServicios:AnhiosService,private toastr: ToastrService,
    private _ReportesServicios: ReportesService,private loadingBar: LoadingBarService,
    private _GradoServicios:GradoSeccionService,private _MatriculaServicios:MatriculaService) { 
    this.criterio=0;
    this.anhio_lectivo=0;
    this.seccion=0;
  }


  ngOnInit() {   
    
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

 CriterioBusqueda(){
   this.panel_tabla=false;
   if(this.criterio==1){
       this.ListarAnhiosLectivos();
       this.anhio_lectivo=0;
       this.fecha_desde='';
       this.fecha_hasta='';
   }else{
    this.anhio_lectivo=0;
     this.fecha_desde='';
     this.fecha_hasta='';
   }
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
         this.seccion=0;
         this.grado_valor=false;
         this.loadingBar.complete();
       }else{
         if(data.status==0){
          this.toastr.error(data.message, 'Aviso!');
          this.DataGrado = null;
          this.seccion=0;
          this.grado_valor=true;
          this.loadingBar.complete();
         }else{
          this.toastr.warning(data.message, 'Aviso!');
          this.DataGrado = null;
          this.grado_valor=true;
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
   DataBalance : any = [];
   public panel_tabla:boolean;

   Generar_Reporte(){
     if(this.criterio==0){
      this.toastr.warning('DEBE SELECCIONAR CRITERIOS DE BUSQUEDAD', 'Aviso!');     
     }else{
      if(this.criterio==1){
        if(this.anhio_lectivo==0){
          this.toastr.warning('DEBE SELECCIONAR CRITERIOS DE BUSQUEDAD', 'Aviso!');
         }else{
            this.loadingBar.start();
            this.DatoBusqueda.idbusqueda=this.anhio_lectivo;
            this._ReportesServicios.listar_balance_xanhio(this.DatoBusqueda).then(
              data => {
                if(data.status==1){
                  this.toastr.success(data.message, 'Aviso!');
                  this.DataBalance = data.data;
                  this.panel_tabla=true;
                  this.loadingBar.complete();
                }else{
                  this.panel_tabla=false;
                  this.toastr.error(data.message, 'Aviso!');
                  this.DataBalance = [];
                  this.loadingBar.complete();
                }        
              })
         }
       }else{
         if(this.fecha_desde==undefined || this.fecha_hasta==undefined){
          this.toastr.warning('DEBE SELECCIONAR CRITERIOS DE BUSQUEDAD', 'Aviso!');
         }else{
          this.loadingBar.start();
          this.DatoBusqueda.datobusqueda=this.fecha_desde + "*" + this.fecha_hasta;
          this._ReportesServicios.listar_balance_xfechas(this.DatoBusqueda).then(
            data => {
              if(data.status==1){
                this.toastr.success(data.message, 'Aviso!');
                this.DataBalance = data.data;
                this.panel_tabla=true;
                this.loadingBar.complete();
              }else{
                this.panel_tabla=false;
                this.toastr.error(data.message, 'Aviso!');
                this.DataBalance = [];
                this.loadingBar.complete();
              }        
            })
         }
       }
     }
   }

  //  Generar_Lista(){
  //   if(this.anhio_lectivo==0 && this.grado==0 && this.seccion==0){
  //    this.toastr.warning('DEBE SELECCIONAR CRITERIOS DE BUSQUEDAD', 'Aviso!');
  //   }else{
  //    if(this.anhio_lectivo!=0 && this.grado!=0 && this.seccion!=0){
  //      this.Lista_Matriculados_xAnhio(this.anhio_lectivo);
  //      this.panel_tabla=true;
  //      this.GradoTodos=[];
  //      this.DatoBusqueda.idbusqueda=this.anhio_lectivo;
  //      this.DatoBusqueda.datobusqueda=this.grado + "-" + this.seccion;
  //      this._ReportesServicios.listar_alumnos_grado_seccion(this.DatoBusqueda).then(
  //        data => {
  //          if(data.status==1){
  //            for (let numero of data.data){
  //              this.DatoBusqueda.idbusqueda=numero.id_grado;
  //              this._MatriculaServicios.listar_matriculados_xgrado(this.DatoBusqueda).subscribe(
  //                data_matriculados =>{
  //                  let body=[];
  //                  if(data_matriculados.data != null){
  //                    for (var j=0;j< data_matriculados.data.length;j++){
  //                      body.push({
  //                        id: j+1,
  //                        doc_alumno:  data_matriculados.data[j].doc_alumno,
  //                        apellidos_alumno:  data_matriculados.data[j].apellidos_alumno,
  //                        nombres_alumno:  data_matriculados.data[j].nombres_alumno,
  //                        nombre_seccion:  data_matriculados.data[j].nombre_seccion,
  //                    });
  //                    }
  //                    this.GradoTodos.push({
  //                      id_grado: numero.id_grado,
  //                      nombre_grado:numero.descripcion_grado,
  //                      matriculados:body
  //                     })
  //                  }
                   
  //              })
  //            }
  //            this.panel_tabla=true;
  //          }else{
  //            this.toastr.error("Consulta Sin Exito", 'Aviso!');
  //          }        
  //        })
  //    }
  //   }
  // }


   


   applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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

  //  public VerPDF()
  // {
  //   let body=[];
  //   var doc = new jspdf({orientation: 'portrait',unit: 'mm',format: 'A4'});
  //   var totalPagesExp = "{total_pages_count_string}";
  //   var img = new Image();
  //   img.src = 'assets/img/cabecera_recibos.png'
  //   doc.addImage(img,'png',25,10,150,40);
  //   doc.setFontSize(12);
  //   doc.setFont('helvetica');
  //   doc.setFontType('bold');
  //   doc.text(70, 60, 'LISTA GENERAL DE MATRICULADOS');
  //   doc.text(this.GradoTodos[0].nombre_grado, 20, 78);  
  //   for(var i=0;i<this.GradoTodos.length;i++){
  //     console.log(this.GradoTodos[i].id_grado);
  //     var headRows = [{id: 'N°',doc_alumno: 'Doc. Alumno', apellidos_alumno: 'Apellidos Completos', nombres_alumno: 'Nombres Completos', nombre_seccion: 'Seccion'}];
  //     if(i==0){
  //       doc.text(this.GradoTodos[i].nombre_grado, 20, 78);
  //       doc.autoTable({
  //           head: headRows,
  //           body: this.GradoTodos[i].matriculados,
  //           bodyStyles: {valign: 'top'},
  //           styles: {overflow: 'linebreak'},
  //           columnStyles: {
  //             id: {cellWidth: 10}, 
  //             doc_alumno: {cellWidth: 15}, 
  //             apellidos_alumno:{cellWidth:30}, 
  //             nombres_alumno: {cellWidth: 30}, 
  //             nombre_seccion: {halign: 'center',cellWidth: 15}
  //            },
  //           startY: 80,
  //           showHead: 'firstPage',
  //           theme: 'grid',
  //       });        
  //     }else{
  //       doc.text(this.GradoTodos[i].nombre_grado, 20, doc.autoTable.previous.finalY + 10);          
  //       doc.autoTable({
  //           head: headRows, 
  //           body: this.GradoTodos[i].matriculados,
  //           styles: {overflow: 'linebreak'},
  //           columnStyles: {
  //             id: {cellWidth: 10}, 
  //             doc_alumno: {cellWidth: 15}, 
  //             apellidos_alumno:{cellWidth:30}, 
  //             nombres_alumno: {cellWidth: 30}, 
  //             nombre_seccion: {halign: 'center',cellWidth: 15}
  //            },
  //           startY: doc.autoTable.previous.finalY + 12,  
  //         showHead: 'firstPage',
  //         theme: 'grid',
  //           didDrawPage: function (data) {
  //             // Footer
  //             var str = "Página " + doc.internal.getNumberOfPages()
  //             // Total page number plugin only available in jspdf v1.0+
  //             if (typeof doc.putTotalPages === 'function') {
  //                 str = str + " de " + totalPagesExp;
  //             }
  //             doc.setFontSize(10);
        
  //             // jsPDF 1.4+ uses getWidth, <1.4 uses .width
  //             var pageSize = doc.internal.pageSize;
  //             var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
  //             doc.text(str, data.settings.margin.left, pageHeight - 10);
  //         }
  //       });
  //     }

  //     if (typeof doc.putTotalPages === 'function') {
  //       doc.putTotalPages(totalPagesExp);
  //   }
           
  //     console.log(this.GradoTodos);
  //   }    

  //   doc.output('save', 'padron_alumnos.pdf');
         
  // }

  public VerPDF()
  {
    if(this.criterio==1){
      var anhio:string;
      for(var i=0;i<this.DataAnhios.length;i++){
        if(this.DataAnhios[i].idanhio==this.anhio_lectivo){
          anhio=this.DataAnhios[i].anhio_lectivo;
        }
      }
    }
    var doc = new jspdf({orientation: 'portrait',unit: 'mm',format: 'A4'});
    var totalPagesExp = "{total_pages_count_string}";
    var img = new Image();
    img.src = 'assets/img/cabecera_recibos.png'
    doc.addImage(img,'png',25,10,150,40);
    doc.setFontSize(12);
    doc.setFont('helvetica');
    doc.setFontType('bold');
    if(this.criterio==1){
      doc.text(70, 60, "BALANCE GENERAL AÑO " + anhio);
    }else{
      doc.text(45, 60, "BALANCE GENERAL DESDE: " +  formatDate(this.fecha_desde,'dd/MM/yyyy','en-US') + " HASTA: " + formatDate(this.fecha_hasta,'dd/MM/yyyy','en-US'));
    }
    
    // From HTML
     doc.autoTable({html: '.table',
     styles: {overflow: 'linebreak'},
     columnStyles:{
       0: {halign: 'center',cellWidth: 5},
       1: {cellWidth: 2},
       2: {cellWidth: 32},
       3: {cellWidth: 30},
       4: {cellWidth: 5},
       5: {cellWidth: 5}
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
  
    doc.output('save', "BALANCE GENERAL "+ this.fecha_desde + " " + this.fecha_hasta +'.pdf');
  } 

  
}
