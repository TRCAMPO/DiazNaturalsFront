import {Component, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DeleteProductComponent} from "../delete-product/delete-product.component";

@Component({
  selector: 'app-confirm-dialog-delete-user',
  templateUrl: './confirm-dialog-delete-user.component.html',
  styleUrls: ['./confirm-dialog-delete-user.component.css']
})
export class ConfirmDialogDeleteUserComponent {
  constructor(public dialogRef: MatDialogRef<DeleteProductComponent>, @ Inject(MAT_DIALOG_DATA) public data: DeleteProductComponent) {

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
