import { Component,ViewEncapsulation,ViewChild,OnInit } from '@angular/core';
import { AnhiosService } from '../administracion/anhios.service';
import { GradoSeccionService } from '../administracion/grado-seccion.service';
import { MatriculaService } from '../apafa/matricula.service';
import { ReportesService } from './reportes.service';
import {MatPaginator, MatSort, MatTableDataSource,TooltipPosition} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import {clsBusqueda,clsGrados,clsSecciones} from '../../app.datos';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NgxSpinnerService } from 'ngx-spinner';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
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
  templateUrl: 'lstingresosyegresos.component.html',
  styleUrls: ['reportes.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ListaIngresosEgresosComponent implements OnInit{
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
  public anhio_lectivo:number;
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
    private spinner: NgxSpinnerService) { 
    this.ListarAnhiosLectivos();
    this.Inicializar_Tabla();
    this.criterio='';
    this.filtro='';
    this.tipo_ingreso='';
    this.tipo_egreso='';
    this.grado=0;
    this.anhio_lectivo=0;
    this.seccion=0;
  }


  ngOnInit() {   
  }

  CriterioBusqueda(){
    this.panel_tabla=false;
    this.anhio_lectivo=0;
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
      if(this.anhio_lectivo==0){
        this.toastr.warning('DEBE SELECCIONAR AÑO LECTIVO', 'Aviso!');
      }else{
            this.loadingBar.start();
            this.DatoBusqueda.datobusqueda=this.criterio;
            this.DatoBusqueda.idbusqueda=this.anhio_lectivo;
            this._ReportesServicios.listar_movimientos_xanhio(this.DatoBusqueda).subscribe(
              data => {
                if(data.status==1){
                  this.toastr.success('Todos los Movimientos', 'Aviso!');
                  this.DataIE = data.data;
                  this.dataSource = new MatTableDataSource(this.DataIE);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;      
                  console.log(this.dataSource.paginator);         
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

   Generar_Lista(){
     if(this.anhio_lectivo==0 || this.grado==0 || this.seccion==0){
      this.toastr.warning('DEBE SELECCIONAR CRITERIOS DE BUSQUEDAD', 'Aviso!');
     }else{
      if(this.anhio_lectivo!=0 && this.grado!=0 && this.seccion!=0){
        this.panel_tabla=true;
        this.GradoTodos=[];
        this.DatoBusqueda.idbusqueda=this.anhio_lectivo;
        this.DatoBusqueda.datobusqueda=this.grado + "-" + this.seccion;
        this._ReportesServicios.listar_alumnos_grado_seccion(this.DatoBusqueda).then(
          data => {
            if(data.status==1){
              this.DataMatriculados = data.data;
              this.panel_tabla=true;
            }else{
              this.panel_tabla=false;
              this.toastr.error(data.message, 'Aviso!');
              this.DataMatriculados = [];
            }        
          })
      }
     }
   }



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
    this.spinner.show();
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
      this.spinner.hide();
    }, 5000); 
    
  }

  
}
