import { Component,ViewEncapsulation,OnInit } from '@angular/core';
import { AnhiosService } from './../administracion/anhios.service';
import { GradoSeccionService } from './../administracion/grado-seccion.service';
import { MatriculaService } from './../apafa/matricula.service';
import { ReportesService } from './../reportes/reportes.service';
import { ToastrService } from 'ngx-toastr';
import {clsBusqueda,clsGrados,clsSecciones} from '../../app.datos';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { LoadingBarService } from '@ngx-loading-bar/core';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
export interface Feed {
  doc_alumno: string,
  apellidos_alumno: string,
  nombres_alumno: string,
  nombre_seccion: string,
}
function bodyRows(data,rowCount) {
  data.forEach(function (elemento, indice, array) {
    console.log(array);
});
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
  templateUrl: 'lstmatriculados.component.html',
  styleUrls: ['reportes.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ListaMatriculadosComponent implements OnInit{

  public anhio_lectivo:number;
  public grado:number;
  public seccion:number;
  public body : any = [];
  public DatoBusqueda : clsBusqueda = {};
  searchString:string;
  constructor(private _AnhiosServicios:AnhiosService,private toastr: ToastrService,
    private _ReportesServicios: ReportesService,private loadingBar: LoadingBarService,
    private _GradoServicios:GradoSeccionService,private _MatriculaServicios:MatriculaService) { 
    this.ListarAnhiosLectivos();
    this.ListarGrados();
    this.grado=0;
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
         this.toastr.error("Consulta Sin Exito", 'Aviso!');
       }
       
     }
   )
 }

 DataGrado : clsGrados;
  ListarGrados (){
   this._GradoServicios.ListarGrados().subscribe(
     data => {
       if(data.status==1){
         this.DataGrado = data.data;
       }else{
         this.toastr.error("Consulta Sin Exito", 'Aviso!');
       }
       
     })
 }

 DataSecciones : clsSecciones;
 Listar_Secciones_xGrado(id){
  this.loadingBar.start();
      this.DatoBusqueda.idbusqueda=id;
         this._GradoServicios.listar_secciones_xgrado(this.DatoBusqueda)
         .then(data => {
           if(data.status==1){
            this.DataSecciones = data.data;
            this.loadingBar.complete();
             this.toastr.success(data.message, 'Aviso!');
           }else{
              this.toastr.error(data.message, 'Aviso!');
              this.DataSecciones=null;
              this.seccion=0;
              this.loadingBar.complete();
            }
         } )
         .catch(err => console.log(err))
   } 

   GradoTodos : any = [];
   public panel_tabla:boolean;
   Generar_Lista(){
    this._GradoServicios.ListarGrados().subscribe(
      data => {
        if(data.status==1){
          for(var i=0;i<data.data.length;i++){
            this.GradoTodos.push({
              id_grado: data.data[i].id_grado,
              nombre_grado:data.data[i].descripcion_grado
             })
          }
          this.panel_tabla=true;
        }else{
          this.toastr.error("Consulta Sin Exito", 'Aviso!');
        }        
      })
   }

   Matriculados:Feed;
   Listar_Matriculados(id){
    this.DatoBusqueda.idbusqueda=id;
   return this._MatriculaServicios.listar_matriculados_xgrado(this.DatoBusqueda).then(
      function(result){
       return result;
      })
   }

   getTemperatureData(id){
    this.DatoBusqueda.idbusqueda=id;
    return new Promise((resolve, reject) => {
      this._MatriculaServicios.listar_matriculados_xgrado(this.DatoBusqueda).then(
      function(result){
       resolve(result.data);
      })
    })
    }

   public VerPDF()
  {
    let body=[];
    var doc = new jspdf({orientation: 'portrait',unit: 'mm',format: 'A4'});
    var totalPagesExp = "{total_pages_count_string}";
    var img = new Image();
    img.src = 'assets/img/cabecera_recibos.png'
    doc.addImage(img,'png',25,10,150,40);
    doc.setFontSize(12);
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.text(70, 60, 'LISTA GENERAL DE MATRICULADOS');
    var headRows = [{id: 'N°', doc_alumno: 'Doc. Alumno', apellidos_alumno: 'Apellidos Completos', nombres_alumno: 'Nombres Completos', seccion: 'Seccion'}];
    this.DatoBusqueda.idbusqueda=this.GradoTodos[0].id_grado;
    var Matriculados = this.getTemperatureData(this.GradoTodos[0].id_grado)
    
     
     
      
      doc.text(this.GradoTodos[0].nombre_grado, 20, 78); 
      doc.autoTable({
        head: headRows,
        body: body,
        startY: 80,
        showHead: 'firstPage',
        theme: 'grid',
    });
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
  }
  doc.output('save', 'padron_matriculados.pdf');
    
   
            
         
  }

  
}
