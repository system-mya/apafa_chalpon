import { Component,ViewChild,ViewEncapsulation,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {clsConcepto,clsBusqueda} from '../../app.datos';
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
  @ViewChild('EditConceptoModal') public EditConceptoModal: ModalDirective;
  displayedColumns: string[] = ['descripcion_concepto', 'tipo_concepto', 'monto_concepto','opciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('myForm') mytemplateForm: NgForm;
  @ViewChild('myEdit') myEditForm: NgForm;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  public DatoBusqueda: clsBusqueda;
  public concepto : clsConcepto = {};
  constructor(private toastr: ToastrService,private loadingBar: LoadingBarService,
    private _ConceptosServicios: ConceptosService,
    @Inject(DOCUMENT) private document: Document,) { 
    this.DatoBusqueda = {
        datobusqueda: ''
      };
    this.ListarConceptosxPeriodo();
  }

 DataConceptos: any = [];
 ListarConceptosxPeriodo () {
  this.DatoBusqueda.datobusqueda = localStorage.getItem('_anhio');
  this._ConceptosServicios.Listar_todos_conceptos(this.DatoBusqueda).subscribe(
    data => {
      if (data.status === 1) {
       this.DataConceptos = data.data;
       this.dataSource = new MatTableDataSource(this.DataConceptos);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
      } else {
        this.toastr.error(data.message, 'Aviso!');
        this.DataConceptos = data.data;
        this.dataSource = new MatTableDataSource(this.DataConceptos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }

    }
  );
}

applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}


btnNuevo_Concepto(){
  this.NvoConceptoModal.show();
  this.concepto.tipo_concepto='';
}

onSubmit(form: clsConcepto) {
  if(form.tipo_concepto!=''){
    swal({
      title: '¿Esta seguro que desea guardar?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar!',
      cancelButtonText: 'Cancelar',
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
            this.ListarConceptosxPeriodo();
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

frmConceptos_hide(opt){
  if(opt=='N'){
     this.NvoConceptoModal.hide();
     this.mytemplateForm.resetForm();
  }else{
    this.EditConceptoModal.hide();
    this.myEditForm.resetForm();
  }
}

btnEliminar_Concepto(idconcepto:number) {
  swal({
    title: '¿Esta seguro que desea eliminar concepto?',
    type: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Guardar!',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false,
    allowEscapeKey:false,
  }).then((result) => {
    //console.log(result.value);
    if (result.value==true) {
      this.DatoBusqueda.idbusqueda=idconcepto;
        //console.log(this.DatoBusqueda.idbusqueda);
        //this.DetUsuarioModal.show(); 
          this._ConceptosServicios.eliminar_concepto(this.DatoBusqueda)
          .then(data => {
            if(data.status==1){
              swal({
                title: 'Aviso!',
                text: data.message,
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey:false
            })
            this.ListarConceptosxPeriodo();
            }else{
              this.toastr.error(data.message, 'Aviso!');
             }
          } )
          .catch(err => console.log(err))
    }
  })
}

btnEditar_Concepto(dato){
  this.concepto.id_concepto=dato.id_concepto;
  this.concepto.descripcion_concepto=dato.descripcion_concepto;
  this.concepto.tipo_concepto=dato.tipo_concepto.charAt(0);
  this.concepto.monto_concepto=dato.monto_concepto.toFixed(2);
  this.EditConceptoModal.show();
  console.log(dato);
}

Update_Concepto(form: clsConcepto) {
  swal({
    title: '¿Esta seguro que desea guardar?',
    type: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Guardar!',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false,
    allowEscapeKey: false,
  }).then((result) => {
    if (result.value == true) {
      form.anhio = localStorage.getItem('_anhio');
      this._ConceptosServicios.update_concepto(form)
      .then(data => {
        if (data.status == 1) {
          swal({
              title: 'Aviso!',
              text: data.message,
              type: 'success',
              allowOutsideClick: false,
              allowEscapeKey: false
          })
          this.ListarConceptosxPeriodo();
          this.EditConceptoModal.hide();
          this.myEditForm.resetForm();
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



