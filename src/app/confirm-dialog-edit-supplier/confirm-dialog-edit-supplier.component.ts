import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditSupplierComponent } from "../edit-supplier/edit-supplier.component";

@Component({
  selector: 'app-confirm-dialog-edit-supplier',
  templateUrl: './confirm-dialog-edit-supplier.component.html',
  styleUrls: ['./confirm-dialog-edit-supplier.component.css']
})
export class ConfirmDialogEditSupplierComponent {

  constructor(public dialogRef: MatDialogRef<EditSupplierComponent>, @ Inject(MAT_DIALOG_DATA) public data: EditSupplierComponent) {

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
