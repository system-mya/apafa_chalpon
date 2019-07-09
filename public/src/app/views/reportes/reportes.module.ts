import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListaOficialApoderadosComponent } from './lstoficial_apoderados.component';
import { FlagsComponent } from './flags.component';
import { FontAwesomeComponent } from './font-awesome.component';
import { SimpleLineIconsComponent } from './simple-line-icons.component';
import { SortByPipe } from './datos-orderby.pipe';
import { ReportesRoutingModule } from './reportes-routing.module';

@NgModule({
  imports: [ CommonModule,
    ReportesRoutingModule,FormsModule ],
  declarations: [
    ListaOficialApoderadosComponent,
    SortByPipe,
    FlagsComponent,
    FontAwesomeComponent,
    SimpleLineIconsComponent
  ]
})
export class ReportesModule { }
