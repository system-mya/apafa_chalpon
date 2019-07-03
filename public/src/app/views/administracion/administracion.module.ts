import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';

import { UsuariosComponent } from './usuarios.component';
import { GradoSeccionComponent } from './grado_seccion.component';
import { LibrosComponent } from './libros.component';
// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AnhiosComponent } from './anhios.component';

// Buttons Routing
import { AdministracionRoutingModule } from './administracion-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';

// Angular
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

  import { OwlDateTimeModule, OwlNativeDateTimeModule,OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';

@NgModule({
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    BsDropdownModule.forRoot(),
    FormsModule,
    
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
    TooltipModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    OwlDateTimeModule, OwlNativeDateTimeModule,
    NgxSpinnerModule,

  ],
  declarations: [
    UsuariosComponent,
    AnhiosComponent,
    GradoSeccionComponent, 
    LibrosComponent
  ],
  providers: [
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'es-do'},
    
]
})
export class AdministracionModule { }
