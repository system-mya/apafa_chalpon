import { Component,ViewChild, ViewEncapsulation } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource,TooltipPosition} from '@angular/material';
import {Alumno,Busqueda} from '../../app.datos';
import { IngresosService } from './ingresos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: 'ingresos.component.html',
  styleUrls: ['tesoreria.css'],
  encapsulation: ViewEncapsulation.None,
})
export class IngresosComponent {
  displayedColumns: string[] = ['doc_ingreso', 'descripcion_ingreso','monto_ingreso','freg_ingreso','opciones_ingreso'];
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public DatoBusqueda : Busqueda;
  constructor(private _IngresosServicios:IngresosService,private toastr: ToastrService) {
    this.DatoBusqueda = {
      datobusqueda:''
    }
    this.ListarIngresos();
  }

  DataIngresos : any = [];
 ListarIngresos (){
  this.DatoBusqueda.datobusqueda=localStorage.getItem('_anhio');
  this._IngresosServicios.getLista_Ingresos(this.DatoBusqueda).subscribe(
    data => {
      if(data.status==1){
       this.DataIngresos = data.data;
       this.dataSource = new MatTableDataSource(this.DataIngresos);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
      }else{
        this.toastr.error(data.message, 'Aviso!',{
          positionClass: 'toast-top-right'
        });
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
  
}
