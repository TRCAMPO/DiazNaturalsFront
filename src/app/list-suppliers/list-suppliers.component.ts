import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {AuthService} from "../auth.service";
import {SupplierModel} from "../create-supplier/supplier.model";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-list-suppliers',
  templateUrl: './list-suppliers.component.html',
  styleUrls: ['./list-suppliers.component.css']
})
export class ListSuppliersComponent implements OnInit{
  @Input() cartStyles: any;
  suppliers: SupplierModel[] = [];
  suppliersOrigin: SupplierModel[] = [];
  currentPage = 1;
  elementeForPage = 5;
  constructor(private toast: ToastrService, public authService: AuthService)  {

  }
  ngOnInit() {
    this.authService.getSuppliers().subscribe(
      (data) => {
        this.suppliers = data;
        this.suppliersOrigin = data;
        // @ts-ignore
      },
      () => {
        this.toast.error("No se pudieron encontrar proveedores", "Error en la Búsqueda");
      }
    );
  }

  deleteproduct(){

  }

  editproduct(){

  }

  searchEditSupplier() {
    this.authService.formDataSupplier = new SupplierModel();
    this.suppliers = this.suppliersOrigin;
    if (this.authService.formDataSearchSupplier.search) {
      this.suppliers = this.suppliers.filter(supplier =>
        supplier.nameSupplier.toLowerCase().includes(this.authService.formDataSearchSupplier.search.toLowerCase()) ||
        supplier.nitSupplier.toString().includes(this.authService.formDataSearchSupplier.search)
      );
    } else {
      this.authService.getSuppliers().subscribe(
        (data) => {
          this.suppliers = data;
        },
        () => {
          this.toast.error("No se pudieron encontrar proveedores", "Error en la Búsqueda");
        }
      );
    }
  }


}

