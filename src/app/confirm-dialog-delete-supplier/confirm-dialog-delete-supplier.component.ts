import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DeleteSupplierComponent} from "../delete-supplier/delete-supplier.component";

@Component({
  selector: 'app-confirm-dialog-delete-supplier',
  templateUrl: './confirm-dialog-delete-supplier.component.html',
  styleUrls: ['./confirm-dialog-delete-supplier.component.css']
})
export class ConfirmDialogDeleteSupplierComponent {

  constructor(public dialogRef: MatDialogRef<DeleteSupplierComponent>, @ Inject(MAT_DIALOG_DATA) public data: DeleteSupplierComponent) {

  }

  onConfirm(): void {
    this.dialogRef.close(true); // Cierra el cuadro de diálogo y pasa true como resultado
    const backdrop = document.querySelector('.cdk-overlay-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }

  onCancel(): void {
    this.dialogRef.close(false); // Cierra el cuadro de diálogo y pasa false como resultado
    const backdrop = document.querySelector('.cdk-overlay-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }
}
