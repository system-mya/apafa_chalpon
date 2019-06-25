import { Component,ViewChild,ViewEncapsulation,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Concepto,Detalle_Compra,Busqueda} from '../../app.datos';
import {MatPaginator, MatSort, MatTableDataSource, TooltipPosition} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ConceptosService } from './conceptos.service';
declare var swal: any;
@Component({
  templateUrl: 'conceptos.component.html',
  styleUrls: ['tesoreria.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ConceptosComponent {
  @ViewChild('NvoConceptoModal') public NvoConceptoModal: ModalDirective;
  displayedColumns: string[] = ['descripcion_concepto', 'tipo_concepto', 'monto_concepto','opciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('myForm') mytemplateForm: NgForm;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  public DatoBusqueda: Busqueda;
  public concepto : Concepto = {};
  constructor(private toastr: ToastrService,private loadingBar: LoadingBarService,
    private _ConceptosServicios: ConceptosService,
    @Inject(DOCUMENT) private document: Document,) { 
    this.DatoBusqueda = {
        datobusqueda: ''
      };
    this.ListarComprasxPeriodo();
  }

 DataConceptos: any = [];
 ListarComprasxPeriodo () {
  this.DatoBusqueda.datobusqueda = localStorage.getItem('_anhio');
  this._ConceptosServicios.Listar_todos_conceptos(this.DatoBusqueda).subscribe(
    data => {
      if (data.status === 1) {
       this.DataConceptos = data.data;
       this.dataSource = new MatTableDataSource(this.DataConceptos);
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

btnNuevo_Concepto(){
  this.NvoConceptoModal.show();
  this.concepto.tipo_concepto='';
}

onSubmit(form: Concepto) {
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
      form.anhio = localStorage.getItem('_anhio');
      this._ConceptosServicios.nvo_concepto(form)
      .then(data => {
        if (data.status == 1) {
          swal({
              title: 'Aviso!',
              text: data.message,
              type: 'success',
              allowOutsideClick: false,
              allowEscapeKey: false
          })
          this.ListarComprasxPeriodo();
          this.NvoConceptoModal.hide();
          this.mytemplateForm.resetForm();
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


}



