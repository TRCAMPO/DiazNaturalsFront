import {Component, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {EditProductComponent} from "../edit-product/edit-product.component";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<EditProductComponent>, @ Inject(MAT_DIALOG_DATA) public data: EditProductComponent) {

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

