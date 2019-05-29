import { Component,ViewChild,OnInit,ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource,TooltipPosition} from '@angular/material';
import { AnhiosService } from './anhios.service';
import 'rxjs/add/operator/map';
import { ToastrService } from 'ngx-toastr';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Anhio_Lectivo} from '../../app.datos';
declare var swal: any;


@Component({
  templateUrl: 'anhios.component.html',
  styleUrls: ['administracion.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AnhiosComponent implements OnInit {
  @ViewChild('NvoAnhioModal') public NvoAnhioModal: ModalDirective;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  displayedColumns: string[] = ['num_anhio','anhio','f_inicio','f_fin','descripcion','condicion','opciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public loading : boolean;
  public anhiolectivo : Anhio_Lectivo ={};
  @ViewChild('myForm') myFormNvoAnhio : NgForm;
  constructor(private _AnhiosServicios:AnhiosService,private toastr: ToastrService) { 
    this.ListarAnhios();
    this.Anhios();
    this.loading=true;
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
        this.DataAnhios = data.data;
        this.dataSource = new MatTableDataSource(this.DataAnhios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading=false;
      }
    )
 }

 btnNuevo_AnhioLectivo(){
  this.NvoAnhioModal.show();  
  this.anhiolectivo ={
    anhio:'0',
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
      }else{
        if(opc=="E"){
        }
      }
    }
  }

  obtener_fechas(){
    if(this.anhiolectivo.anhio!=null){
      var firstDay = new Date(parseInt(this.anhiolectivo.anhio), 0, 1); 
      var lastDay = new Date(parseInt(this.anhiolectivo.anhio), 11 + 1, 0);
      this.anhiolectivo.finicio_anhio=firstDay.toISOString().substring(0, 10);
      this.anhiolectivo.ffin_anhio=lastDay.toISOString().substring(0, 10);
    }
  }

  onSubmit(form:Anhio_Lectivo){    
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
            this.ListarAnhios();
            this.myFormNvoAnhio.resetForm();
          }else{
            if(data.data.length==2){
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
            }else{
              swal({
                title: 'Aviso!',
                html:
                '<span style="color:red">' +
                data.data[0].anhio +
                '</span>',
                type: 'error',
                allowOutsideClick: false,
                allowEscapeKey:false
              })
            }
          }
        } )
        .catch(err => console.log(err))
      }
    })
  }

}
