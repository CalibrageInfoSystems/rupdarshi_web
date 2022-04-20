import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../shared/services/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {  
  @ViewChild('sr')
  private table;
  storesList: any[] = [];
  isFiltersEnabled: boolean = false;
  filterTooltip = "Enable Filters";
  addStore: boolean = false;
  addStoreForm: FormGroup;
  editStore:boolean;
  editStoreForm:FormGroup;
  BASE64_MARKER: string = ';base64,';
  fileExtension:any;
  image:any;
  image1;any;
  base64string:any;
  currentUser:any;
  storeEdit:any;  
  BASE64_MARKEREdit: string = ';base64,';
  editFileExtension:any;
  base64stringEdit:any;
  @Input() allowedImageExtension: string = "jpeg , jpg , png";
  @ViewChild("fileInput") myInputVariable: ElementRef;
  @ViewChild("fileInput1") myInputVariable1: ElementRef;
  validfile:boolean=false;
  userActivityRights:any;
  modal: HTMLElement;
  modalImg: HTMLElement;
  
  constructor(private spinner: NgxSpinnerService, private _dataService: DataService, private fb: FormBuilder,private toastr:ToastrService) {
    this.currentUser=JSON.parse(localStorage.getItem('loginUser'));
    this.userActivityRights = JSON.parse(localStorage.getItem('loginUserActivityRights'));
    this.addBuildForm();
    this.editBuildForm();
  }

  ngOnInit() {
    this.getAllStores();
  }
  private addBuildForm() {
    this.addStoreForm = this.fb.group({
      name1: ['', Validators.required],
      name2: ['', Validators.required],
      address: ['', Validators.required],
      landmark: ['', Validators.required],
      city: ['', Validators.required],
      postelCode: ['', Validators.required],
      file:['', Validators.required]
    })

  }
  private editBuildForm() {
    this.editStoreForm = this.fb.group({
      name1: ['', Validators.required],
      name2: ['', Validators.required],
      address: ['', Validators.required],
      landmark: ['', Validators.required],
      city: ['', Validators.required],
      postelCode: ['', Validators.required],
      file:['']
    })

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

  getAllStores() {
    this._dataService.GetAll('Store/GetAllStores/null/true')
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.storesList = Data.ListResult;
        }
        else {
          this.spinner.hide();
        }
      },
        (error) => {
          this.spinner.hide();
        });
  }
  onCancelAddStore(){
    this.addStore=false;    
    this.image=null;
  }
   // To convert file to base64 string
   onSelectFiles(event) {
    this.fileExtension='';
    var file = event.target.files[0];
    var extensions = (this.allowedImageExtension.split(',')).map(function (x) { return x.toLocaleUpperCase().trim() });
    this.fileExtension = '.' + file.name.split('.').pop();
    // Get file extension
    var ext = file.name.toUpperCase().split('.').pop() || file.name;
    // Check the extension exists
    var exists = extensions.includes(ext);
    if (!exists) {
      this.toastr.error("This File is not allowed. Allowed File Extensions are " + this.allowedImageExtension + " only.");
      this.myInputVariable.nativeElement.value = '';
      this.validfile = false;
    }
    else {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.image = e.target.result;
        var base64Index = e.target.result.indexOf(this.BASE64_MARKER) + this.BASE64_MARKER.length;
        this.base64string = e.target.result.substring(base64Index);
        this.validfile = true;
      }
      reader.readAsDataURL(file);
    }
   
  }

  
  onEditSelectFiles(event){
    this.editFileExtension='';
    var file = event.target.files[0];
    var extensions = (this.allowedImageExtension.split(',')).map(function (x) { return x.toLocaleUpperCase().trim() });
    this.editFileExtension = '.' + file.name.split('.').pop();
    // Get file extension
    var ext = file.name.toUpperCase().split('.').pop() || file.name;
    // Check the extension exists
    var exists = extensions.includes(ext);
    if (!exists) {
      this.toastr.error("This File is not allowed. Allowed File Extensions are " + this.allowedImageExtension + " only.");
      this.myInputVariable1.nativeElement.value = '';
      this.validfile = false;
    }
    else {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.image1 = e.target.result;
        var base64Index = e.target.result.indexOf(this.BASE64_MARKEREdit) + this.BASE64_MARKEREdit.length;
        this.base64stringEdit = e.target.result.substring(base64Index);
        this.validfile = true;
      }
      reader.readAsDataURL(file);
    }
  }
  onSaveAddStore(){
    var storeData=this.addStoreForm.value
    var req=
      {
        "Id": 0,
        "Name1":storeData.name1,
        "Name2": storeData.name2,
        "Address":storeData.address,
        "LandMark":storeData.landmark,
        "CityName":storeData.city,
        "PostelCode":storeData.postelCode,
        "IsActive": true,
        "CreatedByUserId": this.currentUser.Id,
        "CreatedDate": new Date(),
        "UpdatedByUserId": this.currentUser.Id,
        "UpdatedDate": new Date(),
        "FileName":null,
        "FileLocation": null,
        "FileExtension": this.fileExtension,
        "FileBytes": this.base64string
      }
     
    this._dataService.Post('Store/AddUpdateStore',req)
    .subscribe((result:any) => {
      this.spinner.hide();
      if (result.IsSuccess) { 
        this.addStore=false;
       this.getAllStores();
       this.toastr.success(result.EndUserMessage);
      } else {
        this.toastr.error('An error occured');              
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('An error occured');       
    });
  }

  onAddStoreClick(){
    this.addStoreForm.reset();
    this.image=null;
    this.addStore=true;
  }
  
  onEditStore(row){
    this.editStoreForm.reset();
    this.editStore=true;
    this.validfile = true;
    this.storeEdit=row;
    this.image1=null;
  }

  onCancelEditStore(){
    this.editStore=false;
  }
  onUpDateStore(){
    alert('edit')
    var storeData=this.editStoreForm.value
    var req=
      {
        "Id": this.storeEdit.Id,
        "Name1":storeData.name1,
        "Name2": storeData.name2,
        "Address":storeData.address,
        "LandMark":storeData.landmark,
        "CityName":storeData.city,
        "PostelCode":storeData.postelCode,
        "IsActive": true,
        "CreatedByUserId": this.currentUser.Id,
        "CreatedDate": new Date(),
        "UpdatedByUserId": this.currentUser.Id,
        "UpdatedDate": new Date(),        
        "FileName": this.editFileExtension==null || this.editFileExtension ==undefined || this.editFileExtension =="" ?storeData.FileName : null,
        "FileLocation":this.editFileExtension==null || this.editFileExtension ==undefined || this.editFileExtension =="" ? storeData.FileLocation : null,
        "FileExtension":this.editFileExtension==null || this.editFileExtension ==undefined || this.editFileExtension =="" ?storeData.FileExtension : this.editFileExtension,
        "FileBytes": this.base64stringEdit==null || this.base64stringEdit ==undefined || this.base64stringEdit =="" ? null : this.base64stringEdit,
      }
   
    this._dataService.Post('Store/AddUpdateStore',req)
    .subscribe((result:any) => {
      this.spinner.hide();
      if (result.IsSuccess) { 
        this.editStore=false;
       this.getAllStores();
       this.toastr.success(result.EndUserMessage);
      } else {
        this.toastr.error('An error occured');              
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('An error occured');       
    });

  }

    //On Image Click
    onStoreImage(picture) {
      this.modal = document.getElementById('storeModal');
      this.modalImg = document.getElementById("storeImage");
      this.modal.style.display = "block";
  
      this.modalImg = picture;
    }
 
}
