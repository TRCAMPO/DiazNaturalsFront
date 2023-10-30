import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../auth.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-validate-payment',
  templateUrl: './validate-payment.component.html',
  styleUrls: ['./validate-payment.component.css']
})
export class ValidatePaymentComponent implements OnInit {

  imageFilePayment: File | null = null;
  imageUrlPayment: String | null = null;
  // @ts-ignore
  private blob: Blob;
  disabledInputPayment: boolean = true;
  backgroundColor: string = "rgba(0, 0, 0, 0.12)";

  constructor(public dialog: MatDialog, public authService: AuthService, public sanitizer: DomSanitizer, private route: Router, private dataService : DataService, private toast: ToastrService) {
    // APIs
  }


  ngOnInit(): void {

  }

  onSubmit() {

  }

  openConfirmationDialogPayment() {

  }

  changePagePayment() {
    this.route.navigate(['/homePage']);
  }




}
