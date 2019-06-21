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

@Component({
  templateUrl: 'reuniones.component.html',
  styleUrls: ['tesoreria.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ReunionesComponent implements  OnInit {
  @ViewChild('NvaReunionModal') public NvaReunionModal: ModalDirective;
  displayedColumns: string[] = ['motivo_reunion', 'fecha_reunion', 'concepto', 'monto_concepto','opciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  public DatoBusqueda: Busqueda;
  public reunion : Reunion = {};
  constructor(private toastr: ToastrService,private loadingBar: LoadingBarService,
    private _ReunionesServicio: ReunionesService,
    @Inject(DOCUMENT) private document: Document,
    private spinner: NgxSpinnerService) { 
    this.DatoBusqueda = {
        datobusqueda: ''
      };
    this.ListarReunionesxPeriodo();
  }

  ngOnInit() {
  
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

  btnNueva_Reunion(){
    //this.spinner.show();
    this.NvaReunionModal.show();
    this.ListarOtrosConceptos();
    this.reunion.id_concepto=0;
  }

  frmReunion_hide(opt){
       if(opt=='N'){
        this.NvaReunionModal.hide();
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
       console.log(form);
  }
}
