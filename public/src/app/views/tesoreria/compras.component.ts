import { Component,ViewChild,ViewEncapsulation,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {clsCompras,clsDetalle_Compra,clsBusqueda} from '../../app.datos';
import {MatPaginator, MatSort, MatTableDataSource, TooltipPosition} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ComprasService } from './compras.service';
declare var swal: any;
@Component({
  templateUrl: 'compras.component.html',
  styleUrls: ['tesoreria.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ComprasComponent {
  @ViewChild('NvaCompraModal') public NvaCompraModal: ModalDirective;
  @ViewChild('DetalleCompraModal') public DetalleCompraModal: ModalDirective;
  displayedColumns: string[] = ['tipo_compra', 'num_compra', 'razon_social_compra', 'fecha_compra', 'total_compra','opciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  public compra : clsCompras = {};
  public DatoBusqueda: clsBusqueda;
  public producto : clsDetalle_Compra = {};
  public panel_registro : boolean;
  public panel_tabla_compras : boolean;
  public detalle_compra : any = [];
  public btnagregar : boolean;
  public optAd : string;
  constructor(private toastr: ToastrService,private loadingBar: LoadingBarService,
    private _CompraServicios: ComprasService,
    @Inject(DOCUMENT) private document: Document,) { 
    this.DatoBusqueda = {
        datobusqueda: ''
      };
    this.panel_tabla_compras=true;
    this.ListarComprasxPeriodo();
    this.optAd = localStorage.getItem('id_perfil');
  }

 DataCompras: any = [];
 ListarComprasxPeriodo () {
  this.DatoBusqueda.datobusqueda = localStorage.getItem('_anhio');
  this._CompraServicios.getLista_compras_xperiodo(this.DatoBusqueda).subscribe(
    data => {
      if (data.status === 1) {
       this.DataCompras = data.data;
       this.dataSource = new MatTableDataSource(this.DataCompras);
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

  btnNueva_Compra() {
    this.panel_registro=true;
    this.panel_tabla_compras=false;
    this.compra.ruc_compra='';
    this.compra.tipo_compra='';
    this.producto.nom_producto='';
    this.producto.medida='';
    this.producto.precio_unit=0;
    this.producto.cantidad=0;
    this.btnagregar=false;
    this.document.documentElement.scrollTop = 0;
  }

  btnagregar_producto(dato){
    var indice;
    this.compra.total_compra=0;
    if(dato.control.status=='VALID' && this.producto.nom_producto!='' && this.producto.medida!='' && this.producto.cantidad>0 && this.producto.precio_unit>0){
      this.detalle_compra.push({
        nom_producto : this.producto.nom_producto.toUpperCase(),
        cantidad : this.producto.cantidad,
        medida : this.producto.medida.toUpperCase(),
        precio_unit : this.producto.precio_unit
      });
      for(indice in this.detalle_compra){
        this.compra.total_compra=this.compra.total_compra + Number(this.detalle_compra[indice].precio_unit * this.detalle_compra[indice].cantidad);
         console.log(this.compra.total_compra);
      }
      this.producto.nom_producto='';
      this.producto.medida='';
      this.producto.precio_unit=0;
      this.producto.cantidad=0;
      this.btnagregar=false;
    }else{
      this.btnagregar=true;
      this.opcmedida=true;
      this.opcnom_producto=true;
      this.producto.nom_producto='';
      this.producto.medida='';
    }
  }

  Agregar_NvaCompra(form:clsCompras){
    console.log("this.detalle_compra.length");
    if(this.detalle_compra.length==0){
      this.toastr.success('No hay Detalle de la Compra', 'Aviso!',{positionClass: 'toast-top-right',timeOut: 500});
    }else{
      this.btnagregar=false;
      this.loadingBar.start();
      swal({
        title: '¿Esta seguro que desea guardar?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Guardar!',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.value == true) {
          form.anhio = localStorage.getItem('_anhio');
          form.id_usuario = localStorage.getItem('ID');
          form.detalle = this.detalle_compra;
          //form.contador=0;
          this._CompraServicios.nva_compra(form)
          .then(data => {
            if (data.status == 1) {
              swal({
                title: 'Aviso!',
                text: data.message,
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey:false
              }) 
              this.panel_tabla_compras=true;
              this.panel_registro=false;
              this.loadingBar.complete();
              this.document.documentElement.scrollTop = 0;
              this.ListarComprasxPeriodo();
            } else {
                swal({
                  title: 'Aviso!',
                  html:
                  '<span style="color:red">' +
                  data.message +
                  '</span>',
                  type: 'error',
                  allowOutsideClick: false,
                  allowEscapeKey: false
                });
            }
          } )
          .catch(err => console.log(err));
        }
      });
    }
  }

  btnElimianr_Producto(dato){
    this.detalle_compra.splice(dato, 1);
  }

  frmCompras_hide(opt){
      if(opt=='R'){
           this.panel_registro=false;
           this.panel_tabla_compras=true;
           this.document.documentElement.scrollTop = 0;
           this.ListarComprasxPeriodo();

      }else{
        this.DetalleCompraModal.hide();
      }
  }

  public DetalleCompra:any=[];
  public DetalleLista : clsDetalle_Compra;
  btnDetalle_Compra(dato){     
     this.DetalleCompra.tipo_compra = dato.tipo_compra;
     this.DetalleCompra.num_compra = dato.num_compra;
     this.DetalleCompra.razon_social_compra = dato.razon_social_compra;
     this.DetalleCompra.ruc_compra = dato.ruc_compra;
     this.DetalleCompra.fecha_compra = dato.fecha_compra;
     this.DetalleCompra.doc_encargado_compra = dato.doc_encargado_compra;
     this.DetalleCompra.encargado_compra = dato.encargado_compra;
     this.DetalleCompra.total_compra = dato.total_compra;
     this.DatoBusqueda.idbusqueda=dato.id_compra;
     this._CompraServicios.getObtener_Detalle_Compra(this.DatoBusqueda)
     .subscribe(
      data => {
        if (data.status === 1) {
           this.DetalleLista = data.data;
           this.DetalleCompraModal.show();
        } else {
          this.toastr.error(data.message, 'Aviso!', {
            positionClass: 'toast-top-right',
            timeOut: 500
          });
        }
  
      }
    );
  }
 
  public opcnom_producto : boolean;
  public opcmedida : boolean;
  cambios_texto(opt,dato){
    if(opt==0){
      if(dato==''){
        console.log('valor vacio');
        this.opcnom_producto=true;
        
      }else{
        console.log(dato);
        this.opcnom_producto=false;
      }
    }else{
      if(dato==''){
        console.log('valor vacio');
        this.opcmedida=true;
        
      }else{
        console.log(dato);
        this.opcmedida=false;
      }
    }
  }


}



