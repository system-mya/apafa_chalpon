import { Component,ViewEncapsulation,ViewChild } from '@angular/core';
import { MatriculaService } from './matricula.service';
import { NgForm } from '@angular/forms';
import { GradoSeccionService } from './../administracion/grado-seccion.service';
import { ToastrService } from 'ngx-toastr';
import {MatPaginator, MatSort, MatTableDataSource,TooltipPosition} from '@angular/material';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {clsMatricula,clsGrados,clsSecciones,clsTipo_Relacion,clsBusqueda,clsLibro,clsLibro_Matricula} from '../../app.datos';
import { LoadingBarService } from '@ngx-loading-bar/core';
declare var swal: any;
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
  templateUrl: 'matricula.component.html',
  styleUrls: ['apafa.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MatriculaComponent {
  @ViewChild('NvaMatriculaModal') public NvaMatriculaModal: ModalDirective;
  @ViewChild('myForm') mytemplateForm : NgForm;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public f = new Date();
  displayedColumns: string[] = ['doc_alumno', 'datos_alumno','grado','seccion','opciones_alumno'];
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  public matricula : clsMatricula = {};
  public DatoBusqueda : clsBusqueda;
  public panel_tabla : boolean;
  public panel_registro_libro : boolean;
  public optAd : string;
  public DataGradosActivos:any=[];
  constructor(private _MatriculaServicios:MatriculaService,private toastr: ToastrService,
    private _GradoServicios:GradoSeccionService,private loadingBar: LoadingBarService) { 
    this.ListarMatriculados();
    this.panel_tabla=true;
    this.DatoBusqueda = {
      idbusqueda:0,
      datobusqueda:''
    }
    this.optAd = localStorage.getItem('id_perfil');
  }

 DataApoderados : any = [];
 ListarMatriculados (){
  this._MatriculaServicios.getListarMatriculados().subscribe(
    data => {
      if(data.status==1){
       this.DataApoderados = data.data;
       this.dataSource = new MatTableDataSource(this.DataApoderados);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
      }else{
        this.toastr.error(data.message, 'Aviso!');
      }
      
    }
  )
}

applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

btnNueva_Matricula(){
  this.NvaMatriculaModal.show();
  this.ListarGrados();
  this.ListarTipoRelacion();
  this.mytemplateForm.resetForm();
  this.matricula = {
    id_grado:0,
    id_seccion:0,
    id_tipo_relacion:0,
    fecha_matricula:this.f.getFullYear() + '-' + (this.f.getMonth()+1).toString().padStart(2, "0") + '-' + this.f.getDate().toString().padStart(2, "0")
  }
}

frmMat_hide(opc){
  if(opc=="N"){
    this.NvaMatriculaModal.hide();
    this.mytemplateForm.resetForm();
  }else{
    if(opc=="RL"){
   this.panel_tabla=true;
   this.panel_registro_libro=false;
    }else{
      if(opc=="E"){
        
      }
    }
  }
}

DataGrado : clsGrados;
  ListarGrados (){
   this._GradoServicios.ListarGradosActivos().subscribe(
     data => {
       if(data.status==1){
         this.DataGrado = data.data;
       }else{
         this.toastr.error("Consulta Sin Exito", 'Aviso!');
       }
       
     }
   )
 }

 DataRelaciones : clsTipo_Relacion;
  ListarTipoRelacion (){
   this._MatriculaServicios.getListar_tipo_relacion().subscribe(
     data => {
       if(data.status==1){
         this.DataRelaciones = data.data;
       }else{
         this.toastr.error("Consulta Sin Exito", 'Aviso!');
       }
       
     }
   )
 }

 DataSecciones : clsSecciones;
 Listar_Secciones_xGrado(id){
  this.loadingBar.start();
      this.DatoBusqueda.idbusqueda=id;
       //console.log(this.DatoBusqueda.idbusqueda);
       //this.DetUsuarioModal.show(); 
         this._GradoServicios.listar_secciones_xgrado(this.DatoBusqueda)
         .then(data => {
           if(data.status==1){
            this.DataSecciones = data.data;
            this.loadingBar.complete();
            this.matricula.id_seccion=0;
           }else{
             if(data.status==2){
              this.toastr.error(data.message, 'Aviso!');
              this.DataSecciones=null;
              this.loadingBar.complete();
             }else{
              this.toastr.error(data.message, 'Aviso!');
              this.DataSecciones=null;
              this.loadingBar.complete();
             }
             this.matricula.id_seccion=0;
            }
         })
         .catch(err => console.log(err))
 }

  btnBuscar_xDoc(id:number,dato:string){
  this.DatoBusqueda.idbusqueda=id;
  this.DatoBusqueda.datobusqueda=dato;
    this._MatriculaServicios.buscar_datos_xdoc(this.DatoBusqueda)
    .then(data => {
      if(data.status==1){
        if(id==0){
          this.matricula.datos_alumno = data.data[0].apellidos_alumno + " " + data.data[0].nombres_alumno;
          this.matricula.sexo_alumno = data.data[0].sexo_alumno;
          this.matricula.id_alumno = data.data[0].id_alumno;
        }else{
          this.matricula.datos_apoderado = data.data[0].apellidos_apoderado + " " + data.data[0].nombres_apoderado;
           this.matricula.id_apoderado = data.data[0].id_apoderado;
        }
      }else{
        this.toastr.error(data.message, 'Aviso!');
        if(id==0){
          this.matricula.datos_alumno = '';
          this.matricula.sexo_alumno = ''; 
        }else{
          this.matricula.datos_apoderado='';
        }
       }
    } )
    .catch(err => console.log(err))
  }

  onSubmit(form:clsMatricula){    
    if(form.id_tipo_relacion!=0 && form.id_grado!=0 && form.id_seccion!=0){
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
          form.anhio=localStorage.getItem('_anhio');
          this._MatriculaServicios.nva_matricula(form)
          .then(data => {
            if(data.status==1){
              swal({
                  title: 'Aviso!',
                  text: data.message,
                  type: 'success',
                  allowOutsideClick: false,
                  allowEscapeKey:false
              })            
              this.ListarMatriculados();
              this.NvaMatriculaModal.hide();
              this.mytemplateForm.resetForm();
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
          } )
          .catch(err => console.log(err))
        }
      })
    }
  }
  
  DataLibros : clsLibro;
  nivel_libro : string;
  Listar_Libros(id_grado,id_matricula,nivel){
    this.loadingBar.start();
      this.DatoBusqueda.idbusqueda=id_grado;
      this.DatoBusqueda.datobusqueda=id_matricula;
      this.nivel_libro=nivel;
         this._MatriculaServicios.libros_xgrado(this.DatoBusqueda)
         .then(data => {
           if(data.status==1){
            this.Listar_Libros_xMatricula(id_matricula);
            this.panel_tabla=false;
            this.panel_registro_libro=true;
            this.DataLibros = data.data;
            this.loadingBar.complete();
           }else{
              if(data.status==2){
                this.toastr.info(data.message, 'Aviso!');
                this.DataLibros=null;
                this.Listar_Libros_xMatricula(id_matricula);
                this.panel_tabla=false;
                this.panel_registro_libro=true;
                this.loadingBar.complete();
              }else{
                this.toastr.error(data.message, 'Aviso!');
                this.loadingBar.complete();
              }
            }
         } )
         .catch(err => console.log(err))
  }
  
  DataMisLibros : any=[];
  id_matriucla : number;
  Listar_Libros_xMatricula(id_matricula){
    this.loadingBar.start();
      this.DatoBusqueda.idbusqueda=id_matricula;
      this.id_matriucla=id_matricula;
       //console.log(this.DatoBusqueda.idbusqueda);
       //this.DetUsuarioModal.show(); 
         this._MatriculaServicios.libros_xmatricula(this.DatoBusqueda)
         .then(data => {
           if(data.status==1){
            this.DataMisLibros = data.data;
            this.loadingBar.complete();
           }else{
              if(data.status==2){
                this.DataMisLibros=null;
                this.loadingBar.complete();
              }else{
                this.toastr.error(data.message, 'Aviso!');
                this.loadingBar.complete();
              }
            }
         } )
         .catch(err => console.log(err))
  }
  
  libro_matricula:clsLibro_Matricula={};
  Entregar_Libro(id_libro,id_grado){
      this.libro_matricula.id_libro=id_libro;
      this.libro_matricula.id_matricula=this.id_matriucla;
      this._MatriculaServicios.insertar_libro_xmatricula(this.libro_matricula)
        .then(data => {
          if(data.status==1){
            swal({
                title: 'Aviso!',
                text: data.message,
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey:false
            })            
            this.Listar_Libros(id_grado,this.id_matriucla,this.nivel_libro);
          }else{
              this.toastr.error(data.message, 'Aviso!');
              this.Listar_Libros(id_grado,this.id_matriucla,this.nivel_libro);
          }
        } )
        .catch(err => console.log(err))
  }

  
  isCollapsed: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  isCollapsed_mislibros: boolean = false;
  iconCollapse_mislibros: string = 'icon-arrow-up';

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  toggleCollapse_mislibros() : void {
    this.isCollapsed_mislibros = !this.isCollapsed_mislibros;
    this.iconCollapse_mislibros = this.isCollapsed_mislibros ? 'icon-arrow-down' : 'icon-arrow-up';
  }
  
  btnquitar_libro(dato){    
    this.loadingBar.start();
    swal({
      title: '¿Esta seguro que desea quitar libro?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar!',
      allowOutsideClick: false,
      allowEscapeKey:false,
    }).then((result) => {
      //console.log(result.value);
      if (result.value==true) {
        this.DatoBusqueda.idbusqueda=dato.id_matricula;
        this.DatoBusqueda.datobusqueda=dato.id_libro;
          //console.log(this.DatoBusqueda.idbusqueda);
          //this.DetUsuarioModal.show(); 
            this._MatriculaServicios.quitar_libro_alumno(this.DatoBusqueda)
            .then(data => {
              if(data.status==1){
                swal({
                  title: 'Aviso!',
                  text: data.message,
                  type: 'success',
                  allowOutsideClick: false,
                  allowEscapeKey:false
              })
              this.Listar_Libros(dato.id_grado,dato.id_matricula,this.nivel_libro);
              this.loadingBar.complete();
              }else{
                this.toastr.error(data.message, 'Aviso!');
                this.loadingBar.complete();
               }
            } )
            .catch(err => console.log(err))
      }else{
        this.loadingBar.complete();
      }
    })
  }

  Devolucion_Libro(detalle,dato){
   if(dato[0]==1){
    this.DatoBusqueda.datobusqueda='0'+'-'+detalle.id_libro;
   }else{
    this.DatoBusqueda.datobusqueda='1'+'-'+detalle.id_libro;
   }
      this.DatoBusqueda.idbusqueda=detalle.id_matricula;
      this._MatriculaServicios.registrar_devolucion_libro(this.DatoBusqueda)
          .then(data => {
            if(data.status==1){
              this.toastr.success(data.message, 'Aviso!');
              this.Listar_Libros(detalle.id_grado,detalle.id_matricula,this.nivel_libro);
            }else{
              this.toastr.error(data.message, 'Aviso!');
              this.Listar_Libros(detalle.id_grado,detalle.id_matricula,this.nivel_libro);
             }
          })
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
    doc.text(70, 60, 'LISTA GENERAL DE MATRICULADOS');
   this._GradoServicios.ListarGrados().subscribe(
      data => {
        if(data.status==1){
          this.DatoBusqueda.idbusqueda=data.data[0].id_grado;
          doc.text(data.data[0].descripcion_grado, 20, 78); 
          this._MatriculaServicios.listar_matriculados_xgrado(this.DatoBusqueda).subscribe(
            data_matriculados => {              
              if(data_matriculados.status==1){
                var headRows = [{id: 'N°', doc_alumno: 'Doc. Alumno', apellidos_alumno: 'Apellidos Completos', nombres_alumno: 'Nombres Completos', seccion: 'Seccion'}];
              var contador= data_matriculados.data.length;
                doc.autoTable({
                  head: headRows,
                  body: bodyRows(data_matriculados.data,contador),
                  startY: 80,
                  showHead: 'firstPage',
                  theme: 'grid',
              });
             console.log(bodyRows(data_matriculados.data,contador));
              for (var j = 1; j < data.data.length; j++) {  
                doc.text(data.data[j].descripcion_grado, 20, doc.autoTable.previous.finalY + 10);          
                doc.autoTable({
                    head: headRows, 
                    body: bodyRows(data_matriculados.data,contador),
                    startY: doc.autoTable.previous.finalY + 12,  
                  showHead: 'firstPage',
                  theme: 'grid',
                  headStyles: {
                    cellWidth: 'wrap',
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
                
            }
          
          if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }
        doc.output('save', 'padron_matriculados.pdf');
                }else{
                  this.toastr.error(data_matriculados.message, 'Aviso!');
                }
              })
          
          
          
          
        
        }else{
          this.toastr.error("Consulta Sin Exito", 'Aviso!');
        }
        
        
      });
     
  
    
  }
}
