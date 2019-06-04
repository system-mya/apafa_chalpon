import { Component,OnInit,ViewChild,ViewEncapsulation } from '@angular/core';
import { AlumnosService } from './alumnos.service';
import { NgForm } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource,TooltipPosition} from '@angular/material';
import {ModalDirective} from 'ngx-bootstrap/modal';
import 'rxjs/add/operator/map';
import {Alumno,Busqueda} from '../../app.datos';
import { ToastrService } from 'ngx-toastr';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
declare var swal: any;
@Component({
  templateUrl: 'alumnos.component.html',
  styleUrls: ['apafa.css'],
  encapsulation: ViewEncapsulation.None,
  // animations: [
  //   trigger('detailExpand', [
  //     state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
  //     state('*', style({ height: '*', visibility: 'visible' })),
  //     transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  //   ]),
  // ],
})
export class AlumnosComponent implements OnInit {
  DataArray : any = [];
  //columnsToDisplay = ['id_alumno', 'tdoc_alumno', 'doc_alumno', 'apepaterno_alumno'];
  displayedColumns: string[] = ['doc_alumno', 'apellidos_alumno','sexo_alumno','num_contacto','opciones_alumno'];
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  dataSource: MatTableDataSource<any>;
  isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public  chooseView : string;
  public panel_tabla : boolean
  public panel_registro : boolean;
  public alumno : Alumno;
  constructor(private _AlumnosServicios:AlumnosService,private toastr: ToastrService) {
    this.LoadTableData();
    this.panel_tabla=true;
    this.panel_registro=false;
   }
  
  ngOnInit() {
    this.LoadTableData();
    this.panel_tabla=true;
    this.panel_registro=false;
    
  }

  LoadTableData (){
    this._AlumnosServicios.getListarAlumnos().subscribe(
      data => {
        console.log(data.data[0]);
        this.DataArray = data.data;
        this.dataSource = new MatTableDataSource(this.DataArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  btnNuevo_Alumno(){
    this.panel_tabla=false;
    this.panel_registro=true;
    this.alumno = {
      tdoc_alumno:''

    }
  }

  btnCancelar_RegAlumno(){
    this.panel_tabla=true;
    this.panel_registro=false;
  }

}
