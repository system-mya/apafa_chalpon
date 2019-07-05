import { Component,ViewChild,OnInit,ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router';
import {MatPaginator, MatSort, MatTableDataSource,TooltipPosition} from '@angular/material';
import { AnhiosService } from './anhios.service';
import 'rxjs/add/operator/map';
import { ToastrService } from 'ngx-toastr';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {clsAnhio_Lectivo,clsBusqueda} from '../../app.datos';
import { DefaultLayoutComponent } from '../../containers/default-layout/default-layout.component'
declare var swal: any;


@Component({
  templateUrl: 'anhios.component.html',
  styleUrls: ['administracion.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AnhiosComponent implements OnInit {
  @ViewChild('NvoAnhioModal') public NvoAnhioModal: ModalDirective;
  @ViewChild('DetAnhioModal') public DetAnhioModal: ModalDirective;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  displayedColumns: string[] = ['anhio_lectivo','f_inicio','f_fin','descripcion','condicion','opciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public anhiolectivo : clsAnhio_Lectivo ={};
  public DatoBusqueda : clsBusqueda = {};
  @ViewChild('myForm') myFormNvoAnhio : NgForm;
  constructor(private router:Router,private _AnhiosServicios:AnhiosService,
    private toastr: ToastrService,private _Default: DefaultLayoutComponent) { 
    this.ListarAnhios();
    this.Anhios();
  }

  public year = new Date().getFullYear();
  public years = []; 
  Anhios(){
    for(var i = 0; i < 10; i++) {
    		this.years.push({id: this.year - i});
    }
   
  }

  ngOnInit() {
    
    
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  DataAnhios : any = [];
  ListarAnhios (){    
    this._AnhiosServicios.getListarAnhios().subscribe(
      data => {
        if(data.status==1){
        this.DataAnhios = data.data;
        this.dataSource = new MatTableDataSource(this.DataAnhios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        }else{
          this.toastr.error(data.message, 'Aviso!',{
            positionClass: 'toast-top-right'
          });
          this.DataAnhios = data.data;
          this.dataSource = new MatTableDataSource(this.DataAnhios);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        
      }
    )

 }

 btnNuevo_AnhioLectivo(){
  this.NvoAnhioModal.show();  
  this.anhiolectivo ={
    anhio_lectivo:'0',
    condicion_anhio:'APERTURADO',
    descripcion_anhio:''
  }
}

  frmAnhio_hide(opc){
    if(opc=="N"){
      this.NvoAnhioModal.hide();
      this.myFormNvoAnhio.resetForm();
    }else{
      if(opc=="D"){
        this.DetAnhioModal.hide();
      }else{
        if(opc=="E"){
        }
      }
    }
  }

  obtener_fechas(){
    if(this.anhiolectivo.anhio_lectivo!=null){
      var firstDay = new Date(parseInt(this.anhiolectivo.anhio_lectivo), 0, 1); 
      var lastDay = new Date(parseInt(this.anhiolectivo.anhio_lectivo), 11 + 1, 0);
      this.anhiolectivo.finicio_anhio=firstDay.toISOString().substring(0, 10);
      this.anhiolectivo.ffin_anhio=lastDay.toISOString().substring(0, 10);
    }
  }

  //BOTON REGISTRAR AÑO LECTIVO
  btnRegistrar_AnhioLectivo(form:clsAnhio_Lectivo){    
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
        this._AnhiosServicios.nvo_anhio(form)
        .then(data => {
          if(data.status==1){
            this.NvoAnhioModal.hide();
            swal({
                title: 'Aviso!',
                text: data.message,
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey:false
            })
            localStorage.removeItem('_anhio');
            localStorage.setItem('_anhio',form.anhio_lectivo);
            this._Default.anhio_lectivo=localStorage.getItem('_anhio');            
            this.ListarAnhios();
            this.myFormNvoAnhio.resetForm();
          }else{           
              if(data.status==3){
                if(data.data[0].idanhio==null){
                  swal({
                    title: 'Aviso!',
                    html:
                    '<span style="color:red">' +
                    data.data[0].anhio_lectivo +
                    '</span>',
                    type: 'error',
                    allowOutsideClick: false,
                    allowEscapeKey:false
                  })
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
              }
          }
        } )
        .catch(err => console.log(err))
      }
    })
  }

  btnUpdate_Anhio_Xcriterio(criterio,idanhio) {
    swal({
      title: '¿Esta seguro que desea ' + criterio + ' año lectivo?',
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
        this.DatoBusqueda.datobusqueda=criterio;
        this.DatoBusqueda.idbusqueda=idanhio;
          //console.log(this.DatoBusqueda.idbusqueda);
          //this.DetUsuarioModal.show(); 
            this._AnhiosServicios.update_anhio_xcriterio(this.DatoBusqueda)
            .then(data => {
              if(data.status==1){
                swal({
                  title: 'Aviso!',
                  text: data.message,
                  type: 'success',
                  allowOutsideClick: false,
                  allowEscapeKey:false
              })
              if(criterio=='cerrar'){
                localStorage.removeItem('_anhio');
                localStorage.setItem('_anhio','SIN APERTURAR');
                this._Default.anhio_lectivo=localStorage.getItem('_anhio');
              }else{
                if(criterio=='reaperturar'){
                  localStorage.removeItem('_anhio');
                  localStorage.setItem('_anhio',data.data[0].anhio_lectivo);
                  this._Default.anhio_lectivo=localStorage.getItem('_anhio');
                }else{
                  if(data.data.length==0){
                    localStorage.removeItem('_anhio');
                    localStorage.setItem('_anhio','SIN APERTURAR');
                    this._Default.anhio_lectivo=localStorage.getItem('_anhio');
                  }else{
                    localStorage.removeItem('_anhio');
                    localStorage.setItem('_anhio',data.data[0].anhio_lectivo);
                    this._Default.anhio_lectivo=localStorage.getItem('_anhio');
                  }
                }
              }
              this.ListarAnhios();
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
                });
               }
            } )
            .catch(err => console.log(err))
      }
    })
}

public DetAnhio:any=[];
btnDetalle_Anhio(anhio){
  this.DetAnhioModal.show();
  this.DetAnhio.anhio=anhio.anhio_lectivo;
  this.DetAnhio.finicio = anhio.finicio_anhio;
  this.DetAnhio.ffin = anhio.ffin_anhio;
  this.DetAnhio.condicion= anhio.condicion;
  this.DetAnhio.descripcion= anhio.descripcion_anhio;
}

}
