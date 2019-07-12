import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListaOficialApoderadosComponent } from './lstoficial_apoderados.component';
import { ListaMatriculadosComponent } from './lstmatriculados.component';
import { FontAwesomeComponent } from './font-awesome.component';
import { SimpleLineIconsComponent } from './simple-line-icons.component';
import { TableFilterPipe } from '../tesoreria/table-filter.pipe';
import { ReportesRoutingModule } from './reportes-routing.module';
@NgModule({
  imports: [ CommonModule,
    ReportesRoutingModule,FormsModule ],
  declarations: [
    ListaOficialApoderadosComponent,
    TableFilterPipe,
    ListaMatriculadosComponent,
    FontAwesomeComponent,
    SimpleLineIconsComponent
  ]
})
export class ReportesModule { }
