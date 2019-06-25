// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Alert Component
import { AlertModule } from 'ngx-bootstrap/alert';
import { IngresosComponent } from './ingresos.component';
import { ComprasComponent } from './compras.component';
import { ConceptosComponent } from './conceptos.component';

// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReunionesComponent } from './reuniones.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TableFilterPipe } from './table-filter.pipe';
// Notifications Routing
import { TesoreriaRoutingModule } from './tesoreria-routing.module';
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
  imports: [
    CommonModule,
    TesoreriaRoutingModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
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
    ],
    FormsModule,
    NgxSpinnerModule
  ],
  declarations: [
    IngresosComponent,
    ComprasComponent,
    ReunionesComponent,
    TableFilterPipe,
    ConceptosComponent
  ]
})
export class TesoreriaModule { }
