import { Component,ViewEncapsulation,OnInit } from '@angular/core';
import { AnhiosService } from './../administracion/anhios.service';
import { ReportesService } from './../reportes/reportes.service';
import { ToastrService } from 'ngx-toastr';
import {clsBusqueda} from '../../app.datos';
import 'rxjs/add/operator/map';
import { LoadingBarService } from '@ngx-loading-bar/core';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';

@Component({
  templateUrl: 'lstoficial_apoderados.component.html',
  styleUrls: ['reportes.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ListaOficialApoderadosComponent implements OnInit {
  public anhio_lectivo:number;
  public finicio_anhio:string;
  public ffin_anhio:string;
  public body : any = [];
  public DatoBusqueda : clsBusqueda = {};
  searchString:string;
  constructor(private _AnhiosServicios:AnhiosService,private toastr: ToastrService,
    private _ReportesServicios: ReportesService,private loadingBar: LoadingBarService) { 
    this.ListarAnhiosLectivos();
    this.anhio_lectivo=0;
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
 
 public DataApoderado : any;
 public panel_tabla:boolean;
 BuscarListaApoderados(a){
  this.panel_tabla=false;
   for(var i=0; i<this.DataAnhios.length;i++){
       if(this.DataAnhios[i].idanhio==a){
        var finicio=(this.DataAnhios[i].finicio_anhio.toString().slice(0,10)).split('-');
        this.finicio_anhio="Desde: " + finicio[2] +"/"+finicio[1]+"/"+finicio[0];
        var ffin=(this.DataAnhios[i].ffin_anhio.toString().slice(0,10)).split('-');
        this.ffin_anhio="Hasta: " + ffin[2] +"/"+ffin[1]+"/"+ffin[0];
       }
   }   
   this.loadingBar.start();
   this.DatoBusqueda.idbusqueda=a;
    //console.log(this.DatoBusqueda.idbusqueda);
    //this.DetUsuarioModal.show(); 
      this._ReportesServicios.listar_apoderados_xanhio(this.DatoBusqueda)
      .then(data => {
        if(data.status==1){
          this.body=[];
          this.DataApoderado=data.data;
          for (let numero of this.DataApoderado){
            this.DatoBusqueda.datobusqueda=numero.id_apoderado; 
            this._ReportesServicios.listar_alumnos_xapoderado(this.DatoBusqueda)
            .then(data_alumno => {
              if(data_alumno.status==1){
                this.body.push({
                  pname: numero.apellidos_apoderado + " " + numero.nombres_apoderado ,
                  doc:numero.doc_apoderado,
                  celular:numero.celular_apoderado,
                  numbers: data_alumno.data
                 })
                 
                this.panel_tabla=true;
              }else{
                this.toastr.error(data.message, 'Aviso!',{
                  positionClass: 'toast-top-right',
                  timeOut: 500
                });
                this.loadingBar.complete();
                this.body=[];
              }
            })
          }
          this.loadingBar.complete();
          this.toastr.success(data.message, 'Aviso!',{
            positionClass: 'toast-top-right',
            timeOut: 500
          });
          this.body.sort();
        }else{
           this.toastr.error(data.message, 'Aviso!',{
             positionClass: 'toast-top-right',
             timeOut: 500
           });
           this.loadingBar.complete();
           this.body=[];
         }
      } )
      .catch(err => console.log(err))
    
      
 }

 public VerPDF()
  {
    var doc = new jspdf({orientation: 'portrait',unit: 'mm',format: 'A4'});
    var totalPagesExp = "{total_pages_count_string}";
    var img = new Image();
    img.src = 'assets/img/cabecera_recibos.png'
    doc.addImage(img,'png',25,10,150,40);
    doc.setFontSize(12);
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.text(70, 60, 'LISTA GENERAL DE APODERADOS');
    // From HTML
     doc.autoTable({html: '.table',
     styles: {overflow: 'linebreak', cellWidth:'wrap'},
     columnStyles:{
       1: {cellWidth: 30},
       2: {cellWidth: 40},
       3: {halign: 'center',cellWidth: 15},
       4: {cellWidth: 25}
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
  
    doc.output('save', 'lista_apoderados_y_alumnos_matriculados.pdf');
  }
}
