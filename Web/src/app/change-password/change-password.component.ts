import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from '../shared/mustmatch';

import { Location } from '@angular/common';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';

import { filter, pairwise } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  currentUser: any;
  previousUrl: string;

  constructor(private fb: FormBuilder, private spinner: NgxSpinnerService, private _location: Location,
    private _dataService: DataService, private toastr: ToastrService, private router : Router) {

    this.currentUser = JSON.parse(localStorage.getItem('loginUser'));
    this.changePasswordForm = fb.group({
      oldPassword: ['', Validators.compose([Validators.required])],
      newPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });

    this.router.events
            .pipe(filter((e: any) => e instanceof RoutesRecognized),
                pairwise()
            ).subscribe((e: any) => {
                console.log(e[0].urlAfterRedirects); // previous url
                this.previousUrl=e[0].urlAfterRedirects;
            });
  }

  ngOnInit() {
    $("#passwordModal").modal("show");
  }


  changePasswordClick() {
    debugger
    this.spinner.show();
    var req = {
      "UserId": this.currentUser.UserId,
      "OldPassword": this.changePasswordForm.value.oldPassword,
      "NewPassword": this.changePasswordForm.value.newPassword,
      "ConfirmPassword": this.changePasswordForm.value.confirmPassword
    }

    this._dataService.Post('User/ChangePassword', req).subscribe((response) => {
      if (response.IsSuccess) {
        this.spinner.hide();
        this.changePasswordForm.reset();
        this.toastr.success(response.EndUserMessage);
        $("#passwordModal").modal("hide");
        
       this._location.back();

      }
      else {
        this.spinner.hide();
        this.toastr.error(response.EndUserMessage);
      }
    },
      (error) => {
        this.spinner.hide();
        this.toastr.error("An error has occured");
      });
  }

  onCancelClick(){
    $("#passwordModal").modal("hide");
    this._location.back();
  }
}
