import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DeleteProductComponent} from "../delete-product/delete-product.component";

@Component({
  selector: 'app-confirm-dialog-create-order',
  templateUrl: './confirm-dialog-create-order.component.html',
  styleUrls: ['./confirm-dialog-create-order.component.css']
})
export class ConfirmDialogCreateOrderComponent {
  @Output() orderConfirmed: EventEmitter<void> = new EventEmitter<void>();
  constructor(public dialogRef: MatDialogRef<DeleteProductComponent>, @ Inject(MAT_DIALOG_DATA) public data: DeleteProductComponent) {

  }

  onConfirm(): void {
    this.dialogRef.close(true); // Cierra el cuadro de diálogo y pasa true como resultado
    const backdrop = document.querySelector('.cdk-overlay-backdrop');
    this.orderConfirmed.emit();
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
