import { Component,ViewChild,OnInit,ViewEncapsulation } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource,TooltipPosition} from '@angular/material';
import { AnhiosService } from './anhios.service';
import 'rxjs/add/operator/map';
import { ToastrService } from 'ngx-toastr';
@Component({
  templateUrl: 'anhios.component.html',
  styleUrls: ['administracion.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AnhiosComponent implements OnInit {
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  displayedColumns: string[] = ['num_anhio','anhio','f_inicio','f_fin','descripcion','condicion','opciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public loading : boolean;
 
  constructor(private _AnhiosServicios:AnhiosService,private toastr: ToastrService) { 
    this.ListarAnhios();
    this.loading=true;
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

 
}
