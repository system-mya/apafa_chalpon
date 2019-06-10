import { Component, ViewChild, ViewEncapsulation, ElementRef  } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource, TooltipPosition} from '@angular/material';
import {Busqueda, Otro_Ingreso} from '../../app.datos';
import { IngresosService } from './ingresos.service';
import { ToastrService } from 'ngx-toastr';
import {ModalDirective} from 'ngx-bootstrap/modal';
declare var swal: any;
import * as jspdf from 'jspdf';
import 'jspdf-autotable';


@Component({
  templateUrl: 'ingresos.component.html',
  styleUrls: ['tesoreria.css'],
  encapsulation: ViewEncapsulation.None,
})
export class IngresosComponent {
  @ViewChild('NvoOtroIngresoModal') public NvoOtroIngresoModal: ModalDirective;
  @ViewChild('FrmImprimir') public FrmImprimir: ModalDirective;
  displayedColumns: string[] = ['doc_ingreso', 'descripcion_ingreso', 'monto_ingreso', 'freg_ingreso', 'opciones_ingreso'];
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('myForm') mytemplateForm: NgForm;
  public DatoBusqueda: Busqueda;
  public otro: Otro_Ingreso = {};
  constructor(private _IngresosServicios: IngresosService, private toastr: ToastrService) {
    this.DatoBusqueda = {
      datobusqueda: ''
    };
    this.ListarIngresos();
  }

  DataIngresos: any = [];
 ListarIngresos () {
  this.DatoBusqueda.datobusqueda = localStorage.getItem('_anhio');
  this._IngresosServicios.getLista_Ingresos(this.DatoBusqueda).subscribe(
    data => {
      if (data.status === 1) {
       this.DataIngresos = data.data;
       this.dataSource = new MatTableDataSource(this.DataIngresos);
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  btnNuevo_OtroIngreso() {
    this.NvoOtroIngresoModal.show();
  }

  frmIngresos_hide(opc) {
    if (opc =='RO') {
    this.NvoOtroIngresoModal.hide();
      this.mytemplateForm.resetForm();
    } else {
      if (opc == 'I') {
        this.FrmImprimir.hide();
      } else {
        if (opc == 'E') {
        }
      }
    }
  }

  onSubmit(form: Otro_Ingreso) {
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
        form.id_usuario = localStorage.getItem('ID');
        this._IngresosServicios.nvo_otro_ingreso(form)
        .then(data => {
          if (data.status == 1) {
            swal({
                title: 'Aviso!',
                text: data.message,
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            this.ListarIngresos();
            this.NvoOtroIngresoModal.hide();
            this.mytemplateForm.resetForm();
          } else {
            if (data.status == 2) {
              this.toastr.error(data.message, 'Aviso!');
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
          }
        } )
        .catch(err => console.log(err));
      }
    });
  }

  public generatePDF()
  {
  const doc = new jspdf(
    {
      orientation: 'portrait',
      unit: 'mm',
      format: 'A6'
    }
  );
  var img = new Image()
   img.src = 'assets/img/user-perfil.png'
   doc.addImage(img, 'png', 5, 10, 12, 15);
  doc.text('Algo de texto adsadasd as dfsf as fasf asfas fasf s f', 5, 10);
  var columns = ["Id", "Nombre", "Email", "Pais"];
var data = [
[1, "Hola", "hola@gmail.com", "Mexico"],
[2, "Hello", "hello@gmail.com", "Estados Unidos"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[1, "Hola", "hola@gmail.com", "Mexico"],
[2, "Hello", "hello@gmail.com", "Estados Unidos"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[1, "Hola", "hola@gmail.com", "Mexico"],
[2, "Hello", "hello@gmail.com", "Estados Unidos"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[1, "Hola", "hola@gmail.com", "Mexico"],
[2, "Hello", "hello@gmail.com", "Estados Unidos"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[1, "Hola", "hola@gmail.com", "Mexico"],
[2, "Hello", "hello@gmail.com", "Estados Unidos"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"],
[3, "Otro", "otro@gmail.com", "Otro"] ];


doc.autoTable({
  styles: {fillColor: [255, 0, 0]},
  columnStyles: {0: {halign: 'center', fillColor: [0, 255, 0]}}, // Cells in first column centered and green
  margin: {top: 80},
  body: data,
  columns:columns,
})
  swal({
    title: '¿Esta seguro que desea descargar?',
    type: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si!',
    allowOutsideClick: false,
    allowEscapeKey: false,
  }).then((result) => {
    if (result.value == true) {
      doc.output('save', 'filename.pdf');
    }
  });
  }
}
