import { Component,ViewChild,ViewEncapsulation,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { ReunionesService } from './reuniones.service';
import { Reunion,Busqueda } from '../../app.datos';
import {MatPaginator, MatSort, MatTableDataSource, TooltipPosition} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
declare var swal: any;

@Component({
  templateUrl: 'reuniones.component.html',
  styleUrls: ['tesoreria.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ReunionesComponent {
  @ViewChild('NvaReunionModal') public NvaReunionModal: ModalDirective;
  displayedColumns: string[] = ['motivo_reunion', 'fecha_reunion', 'concepto', 'monto_concepto','opciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  public DatoBusqueda: Busqueda;
  constructor(private toastr: ToastrService,private loadingBar: LoadingBarService,
    private _ReunionesServicio: ReunionesService,
    @Inject(DOCUMENT) private document: Document,) { 
    this.DatoBusqueda = {
        datobusqueda: ''
      };
    this.ListarReunionesxPeriodo();
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
    this.NvaReunionModal.show();
  }
}
