import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { DataFactory } from '../shared/dataFactory';
declare var $: any;

@Component({
  selector: 'app-assigned-orders',
  templateUrl: './assigned-orders.component.html',
  styleUrls: ['./assigned-orders.component.css']
})
export class AssignedOrdersComponent implements OnInit {

  @ViewChild('or')
  private table;
  isFiltersEnabled = false;
  filterTooltip = "Enable Filters";
  
  ordersList:any[]=[];
  orderProductsList:any[]=[];
  rowEdit:any;
  deliveryStatusForm:FormGroup;
  currentUser:any;
  userStoresList:any[]=[];
  storeId:any;
  statusId:any;
  fromDate: Date=new Date();
  toDate: Date=new Date();
  today:Date;
  orderStatus:any;
  orderStoresList:any[]=[];
  cancelOrderForm:any;
  ordDetails:any;
  orderSts:any;
  userActivityRights:any;

   constructor(private fb:FormBuilder, private spinner: NgxSpinnerService, private _dataService: DataService, private toastr: ToastrService) { 
    this.currentUser = JSON.parse(localStorage.getItem('loginUser'));
    this.userActivityRights = JSON.parse(localStorage.getItem('loginUserActivityRights'));

    this.fromDate.setDate(this.fromDate.getDate() - 7);
    this.today=new Date();
    this.orderStatus=DataFactory.OrderStatus.InTransit;
    this.orderSts=DataFactory.OrderStatus.Delivered;
    this.deliveryStatusForm=fb.group({
      code:['',Validators.required],
      price:['',Validators.required],
      CustomerName:['',Validators.required],
      CustomerContactNumber:['',Validators.required],
      comments:['',Validators.required]
    })
    this.cancelOrderForm=fb.group({
      code:['',Validators.required],
      price:['',Validators.required],
      CustomerName:['',Validators.required],
      CustomerContactNumber:['',Validators.required],
      comments:['',Validators.required],
    })
  }

  ngOnInit() {
    this.storeId=null;
    this.statusId=null;
    this.getUserStoresByUser();
    this.getOrderStatus();
    this.onSearchClick();
    $('#datepicker').datepicker({
      dateFormat: 'dd/mm/yy',
      autoclose: true
    }).datepicker("setDate", this.fromDate).on('changeDate', (ev)=>{
      this.fromDate=$('#datepicker').val();
    });
    $('#datepicker1').datepicker({
      dateFormat: 'dd/mm/yy',
      autoclose: true
    }).datepicker("setDate", this.toDate).on('changeDate', (ev)=>{
      this.toDate=$('#datepicker1').val();
    });
  }

  getOrderStatus(){
    this._dataService.GetAll('TypeCdDmt/' + DataFactory.typecddmt.classType)
    .subscribe((Data) => {
      if (Data.IsSuccess) {
        this.orderStoresList = Data.ListResult==null ? [] : Data.ListResult;
      }
      else {
        this.spinner.hide();
      }
    },
      (error) => {
        this.spinner.hide();
      });
  }

  onSearchClick(){
    var req={
      "DeliveryAgentId": this.currentUser.Id,
      "StoreId": this.storeId,
      "StatusTypeId": this.statusId,
      "FromDate": this.fromDate,
      "ToDate": this.toDate
    }
    this._dataService.Post('Order/GetOrdersByAgentIdStoreId',req)
    .subscribe((Data) => {
      if (Data.IsSuccess) {
        this.ordersList = Data.ListResult==null ? [] : Data.ListResult;
      }
      else {
        this.spinner.hide();
      }
    },
      (error) => {
        this.spinner.hide();
      });
  }

  updateOrderDeliveryStatus(){
    this.spinner.show();
    var req = {
      "OrderId": this.rowEdit.Id,
      "StatusTypeId": DataFactory.OrderStatus.Delivered,
      "Comments": this.deliveryStatusForm.value.comments,
      "UpdatedByUserId": this.currentUser.Id,
      "UpdatedDate": new Date()
    }
    this._dataService.Post('Order/UpdateOrderStatus', req).subscribe((response) => {
      if (response.IsSuccess) {
        this.spinner.hide();
        this.deliveryStatusForm.reset();
        this.onUpdateDeliveryCancel();
        this.toastr.success(response.EndUserMessage);
        this.onSearchClick();
        $("#updateDeliveryStatus").modal("hide");
      }
      else {
        this.spinner.hide();
        this.toastr.error("An error has occured");
      }
    },
      (error) => {
        this.spinner.hide();
        this.toastr.error("An error has occured");
      });
  }

  getUserStoresByUser() {
    this._dataService.GetAll('Store/GetUserStoresByUser/' + this.currentUser.Id)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.userStoresList = Data.ListResult==null ? [] : Data.ListResult;
          if(this.userStoresList.length==1){
            this.storeId=this.userStoresList[0].StoreId;
            this.onSearchClick();
          }else{

          }
        }
        else {
          this.spinner.hide();
        }
      },
        (error) => {
          this.spinner.hide();
        });
  }

  getProductsDetailsByOrderId(ord){
    this._dataService.GetAll('Product/GetProductsByOrder/' + ord.Id)
    .subscribe((Data) => {
      if (Data.IsSuccess) {
        this.orderProductsList = Data.ListResult == null ? [] : Data.ListResult;    
      }
      else {
        this.orderProductsList=[];
      }
    });
  }

  updateDeliveryStatus(ord){
    this.rowEdit=ord;
  }

  onUpdateDeliveryCancel(){
    const { deliveryStatusForm: { value: formValueSnap } } = this;
    this.deliveryStatusForm.reset(formValueSnap); 
    // this.deliveryStatusForm.reset();
  }

  cancelOrder(ord){
    this.ordDetails=ord;
  }

  onCloseClick(){
    const { cancelOrderForm: { value: formValueSnap } } = this;
    this.cancelOrderForm.reset(formValueSnap); 
  }

  onOrderCancel(){
    this.spinner.show();
    var req = {
      "OrderId": this.ordDetails.Id,
      "StatusTypeId": DataFactory.OrderStatus.Rejected,
      "Comments": this.cancelOrderForm.value.comments,
      "UpdatedByUserId": this.currentUser.Id,
      "UpdatedDate": new Date()
    }
    this._dataService.Post('Order/UpdateOrderStatus', req).subscribe((response) => {
      if (response.IsSuccess) {
        this.spinner.hide();
        this.cancelOrderForm.reset();
        this.onCloseClick();
        this.toastr.success(response.EndUserMessage);
        this.onSearchClick();
        $("#cancelOrder").modal("hide");
      }
      else {
        this.spinner.hide();
        this.toastr.error("An error has occured");
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

}
