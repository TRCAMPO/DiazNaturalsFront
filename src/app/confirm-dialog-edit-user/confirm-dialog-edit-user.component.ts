import {Component, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {EditProductComponent} from "../edit-product/edit-product.component";
import {EditUserComponent} from "../edit-user/edit-user.component";

@Component({
  selector: 'app-confirm-dialog-edit-user',
  templateUrl: './confirm-dialog-edit-user.component.html',
  styleUrls: ['./confirm-dialog-edit-user.component.css']
})
export class ConfirmDialogEditUserComponent {
  constructor(public dialogRef: MatDialogRef<EditUserComponent>, @ Inject(MAT_DIALOG_DATA) public data: EditUserComponent) {

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
