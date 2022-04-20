import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  @ViewChild('rs')
  private table;
  isFiltersEnabled = false;
  filterTooltip = "Enable Filters";
  rolesList:any[]=[];
  reportingRolesList:any[]=[];
  roleData:any[]=[];
  addroleForm:FormGroup;
  editroleForm:FormGroup;
  reportedRole:any;
  selectedActivityRights:any[] = [];
  dropdownSettings = {};
  activityRightsList:any[]=[];
  roleActivityRights:any[]=[];
  activityRightsSelected:any[]=[];
  activityRightsListDropdowm:any[]=[];
  rowEdit: any = [];
  selActRights:any[]=[];
  userInfo:any;
  userActivityRights:any;

  constructor(private fb:FormBuilder,private _dataService:DataService,private toastr:ToastrService,private spinner:NgxSpinnerService) { 
    this.addfromBuild();
    this.editroleForm=fb.group({
      roleName:['',Validators.required],
      reportedRole:[''],
      code:['',Validators.required],
      description:['',Validators.required],
      activityrights:[''],
      IsActive:['']
    })
    this.userInfo = JSON.parse(localStorage.getItem('loginUser'));
    this.userActivityRights = JSON.parse(localStorage.getItem('loginUserActivityRights'));
  }

  addfromBuild(){
    this.addroleForm=this.fb.group({
      roleName:['',Validators.required],
      reportedRole:[''],
      code:['',Validators.required],
      description:['',Validators.required],
      activityrights:['',Validators.required],
      isActive:[true]
    })
  }

  ngOnInit() {
    this.GetActivityRights();
   this.getAllRoles();
    this.dropdownSettings = { 
      singleSelection: false, 
      text:"Select Activity Rights",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:"myclass custom-class"
    };
  }

  onAddRole(){
    this.addfromBuild();
    this.reportedRole=null;
    this.getReportingRoles();
  }

  getAllRoles(){
    this.spinner.show();
    this._dataService.GetAll('Roles/GetAllRoles/null/null')
    .subscribe((Data) => {
      this.spinner.hide();
      if (Data.IsSuccess) {
        this.rolesList = Data.ListResult;
        this.roleData = Data.ListResult.map(x => Object.assign({}, x));
      }
      else {
      }
    });
  }

  getReportingRoles(){
    this._dataService.GetAll('Roles/GetAllRoles/null/null')
    .subscribe((Data) => {
      if (Data.IsSuccess) {
        var data=Data.ListResult;
        this.reportingRolesList = data.filter(x=>x.Id != 4);
      }
      else {
      }
    });
  }

  onSaveRole(){
    this.activityRightsSelected=[];
    for(var  i=0;i<this.selectedActivityRights.length;i++){
      this.activityRightsSelected.push(this.selectedActivityRights[i].id);
     }
     this.spinner.show();
    var req = {
      "ActivityRightIds": this.activityRightsSelected.join(','),
      "Id": 0,
      "Code": this.addroleForm.value.code,
      "NAME": this.addroleForm.value.roleName,
      "Desc": this.addroleForm.value.description,
      "ParentRoleId": parseInt(this.addroleForm.value.reportedRole),
      "IsActive": this.addroleForm.value.isActive,
      "CreatedByUserId": this.userInfo.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.userInfo.Id,
      "UpdatedDate": new Date()
    }
    this._dataService.Post('Roles/AddUpdateRole', req).subscribe((response) => {
      this.spinner.hide();
      if (response.IsSuccess) { 
       this.onCancelAddRole();
       this.getAllRoles();
       $('#addrole').modal('hide');
       this.activityRightsSelected=[];
       this.selectedActivityRights=[];
       this.reportedRole=null;
       this.toastr.success(response.EndUserMessage);
      } else {
        this.toastr.error('An error occured');              
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('An error occured');       
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

  onCancelAddRole(){
    // this.addfromBuild();
    // this.reportedRole=null;
  }

  onEditRole(row){
    this.table.reset();
    this.rowEdit=JSON.parse(JSON.stringify(row));
    this.reportedRole=this.rowEdit.ParentRoleId;    
    this.getSelectedActivityRightsByRoleId(this.rowEdit);
  }

  getSelectedActivityRightsByRoleId(role){
    this.selectedActivityRights=[];
    this._dataService.GetAll('Roles/GetActivityRightsByRoleId/'+role.Id)
    .subscribe((Data) => {
      if (Data.IsSuccess) {
        this.selActRights = Data.ListResult == null ? [] :Data.ListResult;
        for(var i=0;i<this.selActRights.length;i++){
          this.selectedActivityRights.push({
            id: parseInt(this.selActRights[i].Id),
            itemName: this.selActRights[i].Name
          })
        }
      }
      else {
      }
    });
  }

  onCancelEditRole(){
    this.rolesList = this.roleData.map(x => Object.assign({}, x));
    const { editroleForm: { value: formValueSnap } } = this;
    this.editroleForm.reset(formValueSnap); 
  }

  onUpdateRole(){
    this.activityRightsSelected=[];
    for(var  i=0;i<this.selectedActivityRights.length;i++){
      this.activityRightsSelected.push(this.selectedActivityRights[i].id);
     }
     this.spinner.show();
    var req = {
      "ActivityRightIds": this.activityRightsSelected.join(','),
      "Id": this.rowEdit.Id,
      "Code": this.rowEdit.Code,
      "NAME": this.rowEdit.NAME,
      "Desc": this.rowEdit.Desc,
      "ParentRoleId": parseInt(this.rowEdit.ParentRoleId),
      "IsActive": this.rowEdit.IsActive,
      "CreatedByUserId": this.rowEdit.CreatedByUserId,
      "CreatedDate": this.rowEdit.CreatedDate,
      "UpdatedByUserId": this.userInfo.Id,
      "UpdatedDate": new Date()
    }
    this._dataService.Post('Roles/AddUpdateRole', req).subscribe((response) => {
      this.spinner.hide();
      if (response.IsSuccess) { 
       $('#editrole').modal('hide');
       this.activityRightsSelected=[];
       this.selectedActivityRights=[];
       this.reportedRole=null;
       this.toastr.success(response.EndUserMessage);
       const { editroleForm: { value: formValueSnap } } = this;
      this.editroleForm.reset(formValueSnap); 
      this.getAllRoles();
      } else {
        this.toastr.error('An error occured');              
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('An error occured');       
    });
  }

  GetActivityRightsByRoleId(row){
    this._dataService.GetAll('Roles/GetActivityRightsByRoleId/'+ row.Id)
    .subscribe((Data) => {
      if (Data.IsSuccess) {
        this.roleActivityRights = Data.ListResult == null ? [] :Data.ListResult;
        // this.projectsData = Data.ListResult.map(x => Object.assign({}, x));
      }
      else {
      }
    });
  }

  GetActivityRights(){
    this._dataService.GetAll('Roles/GetActivityRights/null')
    .subscribe((Data) => {
      if (Data.IsSuccess) {
        this.activityRightsList = Data.ListResult == null ? [] :Data.ListResult;
        for(var i=0;i<this.activityRightsList.length;i++){
          this.activityRightsListDropdowm.push({
            id: parseInt(this.activityRightsList[i].Id),
            itemName: this.activityRightsList[i].Name
          })
        }
      }
      else {
      }
    });
  }
}
