import { Component, ViewChild, ViewEncapsulation, ElementRef  } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource, TooltipPosition} from '@angular/material';
import {Busqueda, Otro_Ingreso,Recibo} from '../../app.datos';
import { IngresosService } from './ingresos.service';
import { MatriculaService } from '../apafa/matricula.service';
import { ToastrService } from 'ngx-toastr';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { LoadingBarService } from '@ngx-loading-bar/core';
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
  @ViewChild('NvoPagoModal') public NvoPagoModal: ModalDirective;
  displayedColumns: string[] = ['doc_ingreso', 'descripcion_ingreso', 'monto_ingreso', 'freg_ingreso', 'opciones_ingreso'];
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('myForm') mytemplateForm: NgForm;
  public DatoBusqueda: Busqueda;
  public otro: Otro_Ingreso = {};
  public recibo : Recibo = {};
  constructor(private _IngresosServicios: IngresosService, 
    private _MatriculaServicios:MatriculaService,
    private toastr: ToastrService,private loadingBar: LoadingBarService) {
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
      if (opc == 'R') {
        this.NvoPagoModal.hide();
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
    this.loadingBar.start();
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
      this.loadingBar.complete();
    }
  });
  }

  public btnNuevo_Recibo(){
     this.NvoPagoModal.show();
  } 

  DataDeuda : any =[];
  
  btnBuscar_xDoc(dato:string){
    this.DatoBusqueda.idbusqueda=1;
    this.DatoBusqueda.datobusqueda=dato;
      this._MatriculaServicios.buscar_datos_xdoc(this.DatoBusqueda)
      .then(data => {
        if(data.status==1){
            this.recibo.id_apoderado = data.data[0].id_apoderado;
            this.recibo.datos_apoderado = data.data[0].apellidos_apoderado + " " + data.data[0].nombres_apoderado;
            this.recibo.celular_apoderado = data.data[0].celular_apoderado;
            this.recibo.direccion_apoderado = data.data[0].direccion_apoderado;
            this.recibo.correo_apoderado = data.data[0].correo_apoderado;
            this.recibo.anhio=localStorage.getItem('_anhio');
            this._IngresosServicios.Listar_Detalle_Deuda(this.recibo)
      .then(data => {
        if(data.status==1){
            this.DataDeuda = data.data;
            console.log(this.DataDeuda);
        }else{
          this.toastr.error(data.message, 'Aviso!');
         }
      } )
      .catch(err => console.log(err))
        }else{
          this.toastr.error(data.message, 'Aviso!');
         }
      } )
      .catch(err => console.log(err))
    }

    public RegRecibo(form:any){
      console.log("funcionando recibo");
        console.log(form);
    }
}
