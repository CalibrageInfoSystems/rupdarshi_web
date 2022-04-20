import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from '../shared/mustmatch';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataFactory } from '../shared/dataFactory';
declare var $: any;


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild('rs')
  private table;
  isFiltersEnabled = false;
  filterTooltip = "Enable Filters";
  usersList: any[] = [];
  addUserForm: FormGroup;
  storeData: any[] = [];
  storesList: any[] = [];
  selectedStores: any[] = [];
  rolesList: any[] = [];
  dropdownSettings = {};
  editUserForm: FormGroup;
  rowdata: any = {};
  storesSelected: any[] = [];
  selStores: any[] = [];
  UsersData: any[] = [];

  userInfo:any;
  userActivityRights:any;

  selectRoles:any;
  selectManager:any;
  userRole:any;
  
  constructor(private fb: FormBuilder, private _dataService: DataService, private toastr: ToastrService, private spinner: NgxSpinnerService) {
    this.userRole=DataFactory.RoleIds.customer;
    this.userInfo = JSON.parse(localStorage.getItem('loginUser'));
    this.userActivityRights = JSON.parse(localStorage.getItem('loginUserActivityRights'));
  }

  ngOnInit() { 
    this.addFormBuild();
    this.editUserForm = this.fb.group({
      FirstName: ['', Validators.required],
      MiddleName: [''],
      LastName: ['', Validators.required],
      UserName: ['', Validators.required],
      Password: ['', Validators.compose([Validators.required,Validators.minLength(6)])],
      ConformPassword: ['', Validators.required],
      Email: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')])],
      ContactNumber: ['', [Validators.required]],
      Role: ['', Validators.required],
      Manager: [''],
      Address: ['', Validators.required],
      stores: [''],
      IsActive: ['']
    }, {
      validator: MustMatch('Password', 'ConformPassword')
    })

    this.getAllUsers();
    this.getAllRoles();
    this.getAllStores();
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Store",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class",
      badgeShowLimit:2
    };
  }

  addFormBuild(){
    this.addUserForm = this.fb.group({
      FirstName: ['', Validators.required],
      MiddleName: [''],
      LastName: ['', Validators.required],
      UserName: ['', Validators.required],
      Password: ['', Validators.compose([Validators.required,Validators.minLength(6)])],
      ConformPassword: ['', Validators.required],
      Email: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')])],
      ContactNumber: ['', [Validators.required]],
      Role: ['', Validators.required],
      Manager: [''],
      Address: ['', Validators.required],
      stores: ['', Validators.required],
      IsActive:[true]
    }, {
      validator: MustMatch('Password', 'ConformPassword')
    })
  }

  getAllUsers() {
    this.spinner.show();
    this._dataService.GetAll('User/GetUserInfoById/null')
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.usersList = Data.ListResult;
          this.UsersData = Data.ListResult.map(x => Object.assign({}, x));
        }
        else {
          this.spinner.hide();
        }
      },
        (error) => {
          this.spinner.hide();
        });
  }

  getAllStores() {
    this._dataService.GetAll('Store/GetAllStores/null/true')
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.storeData = Data.ListResult;
          for (const data of this.storeData) {
            this.storesList.push({
              "id": data.Id,
              "itemName": data.Name1
            });
          }
        }
        else {
        }
      });
  }

  getAllRoles() {
    this._dataService.GetAll('Roles/GetRoles/null')
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.rolesList = Data.ListResult;
          // this.projectsData = Data.ListResult.map(x => Object.assign({}, x));
        }
        else {
        }
      });
  }

  onCancelAddUser() {
    //this.selectedProjects = [];
    this.addFormBuild();
    this.selectRoles=null;
    this.selectManager=null;
  }

  //On save Click
  onSaveUser() {
    this.storesSelected=[];
    for (var i = 0; i < this.selectedStores.length; i++) {
      this.storesSelected.push(this.selectedStores[i].id);
    }
    this.spinner.show();
    var addReq = {
      "Id": 0,
      "UserId": null,
      "FirstName": this.addUserForm.value.FirstName,
      "MiddleName": this.addUserForm.value.MiddleName,
      "LastName": this.addUserForm.value.LastName,
      "ContactNumber": this.addUserForm.value.ContactNumber,
      "UserName": this.addUserForm.value.UserName,
      "Password": this.addUserForm.value.Password,
      "ConfirmPassword": this.addUserForm.value.ConformPassword,
      "RoleId": this.addUserForm.value.Role,
      "Email": this.addUserForm.value.Email,
      "ManagerId": this.addUserForm.value.Manager,
      "IsActive": true,
      "CreatedByUserId": 1,
      "CreatedDate": new Date(),
      "UpdatedByUserId": 1,
      "UpdatedDate": new Date(),
      "Address": this.addUserForm.value.Address,
      "StoreIds": this.storesSelected.join(','),
    }
    this._dataService.Post('User/AddUpdateUserInfo', addReq).subscribe((response) => {
      if (response.IsSuccess) {
        this.spinner.hide();
        this.addUserForm.reset();
        this.onCancelAddUser();
        this.toastr.success(response.EndUserMessage);
        this.getAllUsers();
        $("#adduser").modal("hide");
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
  //TOGGLE FILTER
  toggleFilter = function () {
    this.table.reset();
    this.isFiltersEnabled = !this.isFiltersEnabled;
    if (this.isFiltersEnabled)
      this.filterTooltip = "Disable Filters";
    else {
      this.filterTooltip = "Enable Filters";
    }
  };

  // only Accept numbers only
  numberOnly(event: any) {
    const numberpattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!numberpattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onAddClick() {  
    //this.selectedProjects = [];
    this.addFormBuild();
    this.selectRoles=null;
    this.selectManager=null;
  }
  onEditClikc(row) {
    this.table.reset();
    this.selectedStores = [];
    this.isFiltersEnabled = false;
    this.rowdata =JSON.parse(JSON.stringify(row));
    this.getStoresByUserId(this.rowdata.Id)
  }

  getStoresByUserId(UserId) {
    this.selectedStores = [];
    this._dataService.GetAll('Store/GetUserStoresByUser/' + UserId)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.selStores = Data.ListResult == null ? [] : Data.ListResult;
          for (var i = 0; i < this.selStores.length; i++) {
            this.selectedStores.push({
              "id": parseInt(this.selStores[i].StoreId),
              "itemName": this.selStores[i].Name1
            })
          }
        }
        else {
        }
      });
  }


  //On save Click
  onUpdateUser() {
    this.storesSelected=[];

    for (var i = 0; i < this.selectedStores.length; i++) {
      this.storesSelected.push(this.selectedStores[i].id);
    }
    this.spinner.show();
    var editReq = {
      "Id": this.rowdata.Id,
      "UserId": this.rowdata.UserId,
      "FirstName": this.editUserForm.value.FirstName,
      "MiddleName": this.editUserForm.value.MiddleName,
      "LastName": this.editUserForm.value.LastName,
      "ContactNumber": this.editUserForm.value.ContactNumber,
      "UserName": this.editUserForm.value.UserName,
      "Password": this.editUserForm.value.Password,
      "ConfirmPassword": this.editUserForm.value.ConformPassword,
      "RoleId": this.editUserForm.value.Role,
      "Email": this.editUserForm.value.Email,
      "ManagerId": this.editUserForm.value.Manager,
      "IsActive": this.editUserForm.value.IsActive,
      "CreatedByUserId": 1,
      "CreatedDate": new Date(),
      "UpdatedByUserId": 1,
      "UpdatedDate": new Date(),
      "Address": this.editUserForm.value.Address,
      "StoreIds": this.storesSelected.join(',')
    }
    this._dataService.Post('User/UpdateUser', editReq).subscribe((response) => {
      if (response.IsSuccess) {
        this.spinner.hide();
        this.toastr.success(response.EndUserMessage);
        $("#edituser").modal("hide");
        this.selectedStores = [];
        this.storesSelected =[];
        this.getAllUsers();
        const { editUserForm: { value: formValueSnap } } = this;
        this.editUserForm.reset(formValueSnap); 
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

  onEditCancle() {
    this.selectedStores = [];
    this.usersList = this.UsersData.map(x => Object.assign({}, x));
  }

  get addPassword() {
    return this.addUserForm.get('Password');
  } 

  get editPassword() {
    return this.editUserForm.get('Password');
  } 
}
