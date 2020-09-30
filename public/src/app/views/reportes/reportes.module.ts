import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListaOficialApoderadosComponent } from './lstoficial_apoderados.component';
import { ListaMatriculadosComponent } from './lstmatriculados.component';
import { BalanceComponent } from './lstbalance.component';
import { ListaIngresosEgresosComponent } from './lstingresosyegresos.component';
import { SimpleLineIconsComponent } from './simple-line-icons.component';
import { TableFilterPipe } from './table-filter.pipe';
import { ReportesRoutingModule } from './reportes-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  MatFormFieldModule,} from '@angular/material';
@NgModule({
  imports: [ CommonModule,ModalModule.forRoot(),
    ReportesRoutingModule,FormsModule,NgxSpinnerModule,
    [
      MatAutocompleteModule,
      MatBadgeModule,
      MatBottomSheetModule,
      MatButtonModule,
      MatButtonToggleModule,
      MatCardModule,
      MatCheckboxModule,
      MatChipsModule,
      MatDatepickerModule,
      MatDialogModule,
      MatDividerModule,
      MatExpansionModule,
      MatGridListModule,
      MatIconModule,
      MatInputModule,
      MatListModule,
      MatMenuModule,
      MatNativeDateModule,
      MatPaginatorModule,
      MatProgressBarModule,
      MatProgressSpinnerModule,
      MatRadioModule,
      MatRippleModule,
      MatSelectModule,
      MatSidenavModule,
      MatSliderModule,
      MatSlideToggleModule,
      MatSnackBarModule,
      MatSortModule,
      MatStepperModule,
      MatTableModule,
      MatTabsModule,
      MatToolbarModule,
      MatTooltipModule,
      MatTreeModule,
      MatFormFieldModule,
    ] ],
  declarations: [
    ListaOficialApoderadosComponent,
    TableFilterPipe,
    ListaMatriculadosComponent,
    BalanceComponent,
    ListaIngresosEgresosComponent,
    SimpleLineIconsComponent,   
  ]
})
export class ReportesModule { }
