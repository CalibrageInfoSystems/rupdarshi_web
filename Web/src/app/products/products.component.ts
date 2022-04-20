import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../shared/services/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Toast, ToastrService } from 'ngx-toastr';
import { RequestOptions, Http,Headers } from '@angular/http';
import { ConfigService } from '../shared/services/config.service';
import { map } from 'rxjs/operators';
declare var $: any;


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  @ViewChild('pd')
  private table;
  productsList: any[] = [];
  modal: HTMLElement;
  modalImg: HTMLElement;
  addProduct:boolean=false;
  editProduct:boolean=false;
  isFiltersEnabled: boolean = false;
  filterTooltip = "Enable Filters";
  addProductForm:FormGroup;
  editProductForm:FormGroup;
  categoriesList:any[]=[];
  categoryId:any;
  BASE64_MARKER: string = ';base64,';
  fileExtension:any;
  image:any;
  base64string:any;
  currentUser:any;
  rowEdit:any;
  @Input() allowedImageExtension: string = "jpeg , jpg , png";
  BASE64_MARKEREdit: string = ';base64,';
  editFileExtension:any;
  image1:any;
  base64stringEdit:any;
  @ViewChild("fileInput") myInputVariable: ElementRef;
  @ViewChild("fileInput1") myInputVariable1: ElementRef;
  validfile:boolean=false;
  userActivityRights:any;
  uploadForm:FormGroup;

  fileToBeUploaded:any;
  @Input() allowedFileExtension: string = "xls,xlsx";
  @ViewChild("fileInput") myInputVariable2: ElementRef;
  validUploadfile:boolean=true;
  baseUrl:any;

  constructor(private spinner: NgxSpinnerService, private _dataService: DataService,private _fb:FormBuilder,private toastr:ToastrService,private config_service: ConfigService,private http: Http) {
    this.baseUrl = config_service.getApiUrl();
    this.currentUser=JSON.parse(localStorage.getItem('loginUser'));
    this.userActivityRights = JSON.parse(localStorage.getItem('loginUserActivityRights'));
    this.addProductForm=_fb.group({
      category:['',Validators.required],
      name1:['',Validators.required],
      name2:['',Validators.required],
      code:['',Validators.required],
      price:['',Validators.required],
      discountedPrice:[''],
      description1:['',Validators.required],
      description2:['',Validators.required],
      file:['',Validators.required]
    });
    this.editProductForm=_fb.group({
      category:['',Validators.required],
      name1:['',Validators.required],
      name2:['',Validators.required],
      code:['',Validators.required],
      price:['',Validators.required],
      discountedPrice:[''],
      description1:['',Validators.required],
      description2:['',Validators.required],
      file:['']
    });
    this.uploadForm=_fb.group({
      file :['',Validators.required]
    })
   }

  ngOnInit() {
    this.getAllCategories()
    this.getAllProducts();
  }

  onAddProduct(){
    this.addProductForm.reset();
    this.categoryId=null;
    this.image=null;
    this.addProduct=true;
  }

  getAllProducts() {
    this.spinner.show();
    var req = {
      "SearchValue": "",
      "PageNo": 1,
      "PageSize": 1000,
      "SortColumn": "Newest",
      "SortOrder": "DESC"
    }
    this._dataService.Post('Product/GetProductsByName', req)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.productsList = Data.ListResult;
        }
        else {
          this.spinner.hide();
        }
      },
        (error) => {
          this.spinner.hide();
        });
  }

  onSaveProduct(){
    this.spinner.show();
    var req={
      "Id": 0,
      "Name1": this.addProductForm.value.name1,
      "Name2": this.addProductForm.value.name2,
      "Code": this.addProductForm.value.code,
      "Description1": this.addProductForm.value.description1,
      "Description2": this.addProductForm.value.description2,
      "Price": this.addProductForm.value.price,
      "DiscountedPrice": this.addProductForm.value.discountedPrice==null || this.addProductForm.value.discountedPrice=="" || this.addProductForm.value.discountedPrice==undefined ? this.addProductForm.value.price : this.addProductForm.value.discountedPrice,
      "IsActive": true,
      "CreatedByUserId": this.currentUser.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.currentUser.Id,
      "UpdatedDate": new Date(),
      "CategoryId": this.addProductForm.value.category,
      "FileName": null,
      "FileLocation": null,
      "FileExtension": this.fileExtension,
      "FileBytes": this.base64string
    }
    this._dataService.Post('Product/AddUpdateProduct', req).subscribe((response) => {
      this.spinner.hide();
      if (response.IsSuccess) { 
        this.addProduct=false;
       this.getAllProducts();
       this.toastr.success(response.EndUserMessage);
      } else {
        this.toastr.error('An error occured');              
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('An error occured');       
    });
  }

  onUpdateProduct(){
    this.spinner.show();
    var req={
      "Id": this.rowEdit.ProductId,
      "Name1":this.editProductForm.value.name1,
      "Name2": this.editProductForm.value.name2,
      "Code": this.editProductForm.value.code,
      "Description1": this.editProductForm.value.description1,
      "Description2": this.editProductForm.value.description2,
      "Price": this.editProductForm.value.price,
      "DiscountedPrice": this.editProductForm.value.discountedPrice,
      "IsActive":  this.rowEdit.IsActive,
      "CreatedByUserId": this.rowEdit.CreatedByUserId,
      "CreatedDate": this.rowEdit.CreatedDate,
      "UpdatedByUserId": this.currentUser.Id,
      "UpdatedDate": new Date(),
      "CategoryId": this.editProductForm.value.category,
      "FileName": this.editFileExtension==null || this.editFileExtension ==undefined || this.editFileExtension =="" ? this.rowEdit.FileName : null,
      "FileLocation":this.editFileExtension==null || this.editFileExtension ==undefined || this.editFileExtension =="" ? this.rowEdit.FileLocation : null,
      "FileExtension":this.editFileExtension==null || this.editFileExtension ==undefined || this.editFileExtension =="" ? this.rowEdit.FileExtension : this.editFileExtension,
      "FileBytes": this.base64stringEdit==null || this.base64stringEdit ==undefined || this.base64stringEdit =="" ? null : this.base64stringEdit,
    }
    this._dataService.Post('Product/AddUpdateProduct', req).subscribe((response) => {
      this.spinner.hide();
      if (response.IsSuccess) { 
        this.editProduct=false;
       this.getAllProducts();
       this.toastr.success(response.EndUserMessage);
      } else {
        this.toastr.error('An error occured');              
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('An error occured');       
    });
  }

  onEditProduct(row){
    this.editProductForm.reset();
    this.editProduct=true;
    this.validfile = true;
    this.rowEdit=row;
    this.image1=null;
  }

  onCancelEditProduct(){
    this.editProduct=false;
  }

  getAllCategories(){
    this._dataService.GetAll('Category/GetAllCategories/null/true')
    .subscribe((Data) => {
      this.spinner.hide();
      if (Data.IsSuccess) {
        this.categoriesList = Data.ListResult;
      }
      else {
      }
    });
  }

  onCancelAddProduct(){
    this.image=null;
    this.addProduct=false;
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


  //On Image Click
  productImage(picture) {
    this.modal = document.getElementById('productModal');
    this.modalImg = document.getElementById("productImage");
    this.modal.style.display = "block";

    this.modalImg = picture;
  }
  //Closing Image
  closeImage() {
    this.modal.style.display = "none";
  }

  onFileSelect($event){
    this.fileToBeUploaded = $event.target.files[0];
    var extensions = (this.allowedFileExtension.split(',')).map(function (x) { return x.toLocaleUpperCase().trim() });
    this.fileExtension = '.' + this.fileToBeUploaded.name.split('.').pop();
        // Get file extension
        var ext = this.fileToBeUploaded.name.toUpperCase().split('.').pop() || this.fileToBeUploaded.name;
        // Check the extension exists
        var exists = extensions.includes(ext);
        if (!exists) {
          this.toastr.error("This File is not allowed. Allowed File Extensions are " + this.allowedFileExtension + " only.");
          this.myInputVariable.nativeElement.value = '';
          this.validUploadfile = false;
          const { uploadForm: { value: formValueSnap } } = this;
          this.uploadForm.reset(formValueSnap);
        }
        else{
          this.validUploadfile = true;
        }
  }

  onCancelClick(){
    $("#bulkUpload").modal("hide");
  }

  // only Accept numbers only
  numberOnly(event: any) {
    const numberpattern = /[0-9\+\-.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!numberpattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onUploadClick(){
    this.spinner.show();
    let formData: FormData = new FormData();
    formData.append("file", this.fileToBeUploaded, this.fileToBeUploaded.name);
    formData.append("UserId", this.currentUser.Id);

    let headers = new Headers();
    let options = new RequestOptions({ headers: headers });

    this.http.post(this.baseUrl + 'Product/UpdateProductPrice', formData, options)
    .pipe(map(res => res.json()))
      .subscribe(response => {
        this.spinner.hide();
        if (response.IsSuccess) {
          this.uploadForm.reset();
          $('#bulkUpload').modal('hide');
          this.toastr.success(response.EndUserMessage, 'Success');
          this.getAllProducts();
        }else{
          this.toastr.error('An error occured');
        }
      },
        error => {
          this.spinner.hide();
          this.toastr.error('An error occured');
        })
  }

   // only Accept numbers only
   numbersOnly(event: any) {
    const numberpattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!numberpattern.test(inputChar)) {
      event.preventDefault();
    }
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
}
