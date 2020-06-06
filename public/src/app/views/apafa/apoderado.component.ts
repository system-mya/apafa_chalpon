import { Component,ViewChild,ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource,TooltipPosition} from '@angular/material';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {PopoverDirective} from 'ngx-bootstrap/popover';
import {clsApoderado,clsBusqueda,clsDetalle_Deuda} from '../../app.datos';
import { ApoderadoService } from './apoderado.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ConceptosService } from '../tesoreria/conceptos.service';
import { IngresosService } from '../tesoreria/ingresos.service';
declare var swal: any;

@Component({
  templateUrl: 'apoderado.component.html',   
  styleUrls: ['apafa.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ApoderdoComponent {
  @ViewChild('NvoApoderadoModal') public NvoApoderadoModal: ModalDirective;
  @ViewChild('DetApoderadoModal') public DetApoderadoModal: ModalDirective;
  @ViewChild('EditApoderadoModal') public EditApoderadoModal: ModalDirective;
  @ViewChild('NvoConceptoModal') public NvoConceptoModal: ModalDirective;
  @ViewChild('pop') public pop: PopoverDirective ;
  displayedColumns: string[] = ['doc_apoderado','apellidos_apoderado','sexo_apoderado','num_contacto','opciones_apoderado'];
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  public apoderado : clsApoderado;
  public deuda : clsDetalle_Deuda = {};
  public Editapoderado : clsApoderado;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('myForm') mytemplateForm : NgForm;
  @ViewChild('myDeuda') myDeudaForm : NgForm;
  public DatoBusqueda : clsBusqueda;
  public optAd : string;
  public motivodel:any={};
  constructor(private _ApoderadoServicio:ApoderadoService,private toastr: ToastrService,
    private loadingBar: LoadingBarService,private _ConceptosServicios: ConceptosService,
    private _IngresosServicios: IngresosService) {
    this.apoderado = {
      tdoc_apoderado:'',
      correo_apoderado:''
    }
    this.Editapoderado = {
      tdoc_apoderado:'',
      correo_apoderado:''
    }
    this.DatoBusqueda = {
      idbusqueda:0
    }
    this.ListarApoderados();
    this.optAd = localStorage.getItem('id_perfil');
   
     
    
  }
  btnNuevo_Apoderado(){
    this.apoderado = {
      tdoc_apoderado:'',
      correo_apoderado:''
    }
    this.NvoApoderadoModal.show();
  }

  frmApo_hide(opc){
    if(opc=="N"){
      this.NvoApoderadoModal.hide();
      this.mytemplateForm.resetForm();
    }else{
      if(opc=="D"){
        if(this.DataDeuda!=undefined){
          this.pop.hide();
        }        
        this.motivodel={};
        this.DetApoderadoModal.hide();        
      }else{
        if(opc=="E"){
          this.EditApoderadoModal.hide();
        }else{
          this.NvoConceptoModal.hide();
          this.myDeudaForm.resetForm();
        }
      }
    }
  }

DataApoderados : any = [];
 ListarApoderados (){
  this._ApoderadoServicio.getListarApoderados().subscribe(
    data => {
      if(data.status==1){
       this.DataApoderados = data.data;
       this.dataSource = new MatTableDataSource(this.DataApoderados);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
      }else{
        this.toastr.error(data.message, 'Aviso!');
        this.DataApoderados = data.data;
       this.dataSource = new MatTableDataSource(this.DataApoderados);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
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

  onSubmit(form:clsApoderado){    
      swal({
        title: '¿Esta seguro que desea guardar?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Guardar!',
        allowOutsideClick: false,
        allowEscapeKey:false,
      }).then((result) => {
        if (result.value==true) {
          this._ApoderadoServicio.nvo_apoderado(form)
          .then(data => {
            if(data.status==1){
              this.NvoApoderadoModal.hide();
              this.toastr.success(data.message, 'Aviso!');
              this.ListarApoderados();
              this.mytemplateForm.resetForm();
            }else{
              this.toastr.error(data.message, 'Aviso!');
            }
          } )
          .catch(err => console.log(err))
        }
      })
  }
  

DetApoderado : any = [];
public DataDeuda;
btnDetalle_Apoderado(id){
  this.loadingBar.start();
  this.DatoBusqueda.idbusqueda=id;
  console.log(this.DatoBusqueda.idbusqueda);
  this._ApoderadoServicio.detalle_apoderado(this.DatoBusqueda)
    .then(data => {
      if(data.status==1){        
        this.DetApoderado = data.data[0];
        this.DatoBusqueda.idbusqueda=this.DetApoderado.id_apoderado;
        this._IngresosServicios.Listar_Detalle_Deuda(this.DatoBusqueda)
      .then(data_deuda => {
        if(data_deuda.status==1){
            this.DataDeuda = data_deuda.data;
            this.toastr.success(data.message, 'Aviso!');
            this.loadingBar.complete();
            this.DetApoderadoModal.show(); 
        }else{
          this.toastr.error(data_deuda.message, 'Aviso!');
          this.loadingBar.complete();
          this.DetApoderadoModal.show(); 
          this.DataDeuda = data_deuda.data;
         }
      } )
      .catch(err => console.log(err))
        
      }else{
        this.loadingBar.complete();
        this.toastr.error(data.message, 'Aviso!');
       }
    } )
    .catch(err => console.log(err))
  }

  btnEdit_Apoderado(id){
    this.DatoBusqueda.idbusqueda=id;
    this.EditApoderadoModal.show();
    this._ApoderadoServicio.detalle_apoderado(this.DatoBusqueda)
    .then(data => {
      if(data.status==1){
        this.Editapoderado = data.data[0];
        this.Editapoderado.id_apoderado = data.data[0].id_apoderado;
        this.Editapoderado.sexo_apoderado = data.data[0].sexo_apoderado.charAt(0);
        this.Editapoderado.tdoc_apoderado = data.data[0].tdoc_apoderado.substr(0,3);
        this.toastr.success(data.message, 'Aviso!');
      }else{
        this.toastr.error(data.message, 'Aviso!');
       }
    } )
    .catch(err => console.log(err))
  }

  updateApoderado(form:clsApoderado){    
    swal({
      title: '¿Esta seguro que desea guardar?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar!',
      allowOutsideClick: false,
      allowEscapeKey:false,
    }).then((result) => {
      if (result.value==true) {
        this._ApoderadoServicio.update_apoderado(form)
        .then(data => {
          if(data.status==1){
            this.EditApoderadoModal.hide();
            this.toastr.success(data.message, 'Aviso!');
            this.ListarApoderados();
          }else{
            this.toastr.error(data.message, 'Aviso!');
          }
        } )
        .catch(err => console.log(err))
      }
    })
}

btnEliminar_Apoderado(id:number) {
  swal({
    title: '¿Esta seguro que desea eliminar apoderado?',
    type: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Guardar!',
    allowOutsideClick: false,
    allowEscapeKey:false,
  }).then((result) => {
    //console.log(result.value);
    if (result.value==true) {
        this.DatoBusqueda.idbusqueda=id;
        //console.log(this.DatoBusqueda.idbusqueda);
        //this.DetUsuarioModal.show(); 
          this._ApoderadoServicio.eliminar_apoderado(this.DatoBusqueda)
          .then(data => {
            if(data.status==1){
              swal({
                title: 'Aviso!',
                text: data.message,
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey:false
            })
            this.ListarApoderados();
            }else{
              this.toastr.error(data.message, 'Aviso!');
             }
          } )
          .catch(err => console.log(err))
    }
  })
}

btnNuevo_Concepto(id){
  this.loadingBar.start();
  this.deuda.id_apoderado=id;
  this.NvoConceptoModal.show();
  this.ListarConceptosxPeriodo();
}

DataConceptos: any = [];
 ListarConceptosxPeriodo () {
  this.DatoBusqueda.datobusqueda = localStorage.getItem('_anhio');
  this._ConceptosServicios.Lista_otros_conceptos(this.DatoBusqueda).subscribe(
    data => {
      if (data.status === 1) {        
       this.DataConceptos = data.data;       
       this.deuda.id_concepto=0;
       this.deuda.descripcion_deuda='';
       this.loadingBar.complete();
      } else {
        this.DataConceptos = data.data;
        this.toastr.error(data.message, 'Aviso!');
        this.loadingBar.complete();
      }
    }
  );
}

obtener_montos(id){
  for(var i=0;i<this.DataConceptos.length;i++){
       if(this.DataConceptos[i].id_concepto==id){
            this.deuda.monto=this.DataConceptos[i].monto_concepto.toFixed(2);
            this.deuda.monto_ingresado=this.DataConceptos[i].monto_concepto.toFixed(2);
       }
  }
}

btnRegistrar_Deuda(deuda:clsDetalle_Deuda){ 
  swal({
    title: '¿Esta seguro que desea guardar?',
    type: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Guardar!',
    allowOutsideClick: false,
    allowEscapeKey:false,
  }).then((result) => {
    if (result.value==true) {
      deuda.anhio=localStorage.getItem('_anhio');
      this._ApoderadoServicio.nva_deuda_apoderado(deuda)
      .then(data => {
        if(data.status==1){
          this.NvoConceptoModal.hide();
          swal({
              title: 'Aviso!',
              text: data.message,
              type: 'success',
              allowOutsideClick: false,
              allowEscapeKey:false
          })
          this.myDeudaForm.resetForm();
        }else{
            swal({
              title: 'Aviso!',
              html:
              '<span style="color:red">' +
              data.message +
              '</span>',
              type: 'error',
              allowOutsideClick: false,
              allowEscapeKey:false
            })
        }
      } )
      .catch(err => console.log(err))
    }
  })
}


   public valid_motivo : any = [];
   btneliminar_deuda(iddeuda,motivo,pos){     
    if(motivo!=undefined){      
      if(motivo.trim()===''){
         console.log("esta vacio");
         this.valid_motivo[pos]=true;       
      }else{
        swal({
          title: '¿Esta seguro que desea eliminar deuda?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Guardar!',
          allowOutsideClick: false,
          allowEscapeKey:false,
        }).then((result) => {
          //console.log(result.value);
          if (result.value==true) {
            this.DatoBusqueda.idbusqueda=iddeuda;
            this.DatoBusqueda.datobusqueda=motivo;
            //console.log(this.DatoBusqueda.idbusqueda);
            //this.DetUsuarioModal.show(); 
              this._ApoderadoServicio.eliminar_deuda(this.DatoBusqueda)
              .then(data => {
                if(data.status==1){
                  swal({
                    title: 'Aviso!',
                    text: data.message,
                    type: 'success',
                    allowOutsideClick: false,
                    allowEscapeKey:false
                })
                this.DetApoderadoModal.hide();
                }else{
                  this.toastr.error(data.message, 'Aviso!');
                 }
              } )
              .catch(err => console.log(err))
          }
        })
      }
    }else{
      this.valid_motivo[pos]=true;
    }
    setTimeout(() => {
      this.valid_motivo[pos]=false;
    }, 1000);
  }
}
