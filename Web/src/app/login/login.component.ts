import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../shared/services/data.service';
import { DataFactory } from '../shared/dataFactory';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isValid:boolean=false;
  loginForm:FormGroup;
  public errorMessage = '';
  isLoggingIn: boolean;

  activityRights: object = {};
  userActivityRights;

  currentUser:any;

  public userDetails = {
    userName: null,
    password: null
  };
  userActivityRight: { CanViewUsers: boolean; CanManageUsers: boolean; CanViewRoles: boolean; CanManageRoles: boolean; CanViewOrders: boolean; CanAssignOrders: boolean; CanMakeOrderDelivered: boolean; CanViewStores: boolean; CanViewProducts: boolean;CanViewMasters:boolean,CanManageGeoLocations:boolean,CanManageStores:boolean,CanManageProducts:boolean,CanCancelOrder:boolean};

  constructor(private formBuilder:FormBuilder,private route:Router,private toaster:ToastrService,
    private _dataService: DataService,private spinner: NgxSpinnerService) { 
    this.currentUser=JSON.parse(localStorage.getItem('loginUser'));
      if(this.currentUser != undefined){
        if(this.currentUser.RoleId==DataFactory.RoleIds.deliveryAgent){
          this.route.navigate(['/assigned-orders']);
        }else{
          this.route.navigate(['/orders']);
        }
      }else{
        this.route.navigate(['/login']);
      }
    this.loginForm=this.formBuilder.group({
      userName:['',Validators.required],
      password:['',Validators.required]
    })
  }

  ngOnInit() {
    
  }

  onLoinClick(){
    this.isValid=true;
    this.spinner.show();
    if(!this.loginForm.valid){
      
    }else{
      var req={
        "UserName": this.loginForm.value.userName,
        "Password": this.loginForm.value.password
      }
      this._dataService.Post('User/Login', req)
      .subscribe((response) => {
        this.isLoggingIn = false;        
        this.spinner.hide();
        if (response.IsSuccess) {
          this.errorMessage='';
          localStorage.setItem('loginUser', JSON.stringify(response.Result.UserInfos)); 
          this.initActivityRights(response.Result.activityRights)
          this.currentUser=JSON.parse(localStorage.getItem('loginUser'));

          if(this.currentUser.RoleId==DataFactory.RoleIds.deliveryAgent){
            this.route.navigate(['/assigned-orders']);
          }else{
            this.route.navigate(['/orders']);
          }
        }
        else {
          this.isLoggingIn = false;
          this.spinner.hide();
          this.errorMessage = response.EndUserMessage;      
        }
      }, (error) => {
        this.isLoggingIn = false;
        this.spinner.hide();
        this.errorMessage = "Incorrect username or password";
      });
    }
  }

  //All Activity Rights
  initActivityRights(res) {
    var uar = "";
    //comma seperated                        
    for (var i = 0; i < res.length; i++) {
      uar += res[i].Id + ",";
    }

    var userActivityRights = uar.split(",")
    this.activityRights = { 
        CanViewUsers:1,
        CanManageUsers:2,
        CanViewRoles:3,
        CanManageRoles:4,
        CanViewOrders:5,
        CanAssignOrders:6,
        CanMakeOrderDelivered:7,
        CanViewStores:8,
        CanViewProducts:9,
        CanViewMasters:10,
        CanManageGeoLocations:11,
        CanManageStores:12,
        CanManageProducts:13,
        CanCancelOrder:14
    };
    
    this.userActivityRight = {
      CanViewUsers: userActivityRights.indexOf(this.activityRights["CanViewUsers"] + "") >= 0 ? true : false,
      CanManageUsers: userActivityRights.indexOf(this.activityRights["CanManageUsers"] + "") >= 0 ? true : false,
      CanViewRoles: userActivityRights.indexOf(this.activityRights["CanViewRoles"] + "") >= 0 ? true : false,
      CanManageRoles: userActivityRights.indexOf(this.activityRights["CanManageRoles"] + "") >= 0 ? true : false,
      CanViewOrders: userActivityRights.indexOf(this.activityRights["CanViewOrders"] + "") >= 0 ? true : false,
      CanAssignOrders: userActivityRights.indexOf(this.activityRights["CanAssignOrders"] + "") >= 0 ? true : false,
      CanMakeOrderDelivered: userActivityRights.indexOf(this.activityRights["CanMakeOrderDelivered"] + "") >= 0 ? true : false,
      CanViewStores: userActivityRights.indexOf(this.activityRights["CanViewStores"] + "") >= 0 ? true : false,
      CanViewProducts: userActivityRights.indexOf(this.activityRights["CanViewProducts"] + "") >= 0 ? true : false,
      CanViewMasters: userActivityRights.indexOf(this.activityRights["CanViewMasters"] + "") >= 0 ? true : false,
      CanManageGeoLocations: userActivityRights.indexOf(this.activityRights["CanManageGeoLocations"] + "") >= 0 ? true : false,
      CanManageStores: userActivityRights.indexOf(this.activityRights["CanManageStores"] + "") >= 0 ? true : false,
      CanManageProducts: userActivityRights.indexOf(this.activityRights["CanManageProducts"] + "") >= 0 ? true : false,
      CanCancelOrder: userActivityRights.indexOf(this.activityRights["CanCancelOrder"] + "") >= 0 ? true : false,
      
    }
    localStorage.setItem('loginUserActivityRights', JSON.stringify(this.userActivityRight));
  }

}
