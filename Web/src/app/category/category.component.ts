import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../shared/services/data.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  isFiltersEnabled: boolean = false;
  filterTooltip = "Enable Filters";
  categoryList:any[]=[];
  @ViewChild('ca') private table;
  constructor(private spinner: NgxSpinnerService, private _dataService: DataService, private fb: FormBuilder,private toastr:ToastrService) { }

  ngOnInit() {
    this.getAllCategories();
      }
//TOGGLE FILTER
toggleFilter = function () {
  //this.table.reset();
  this.isFiltersEnabled = !this.isFiltersEnabled;
  if (this.isFiltersEnabled)
    this.filterTooltip = "Disable Filters";
  else {
    this.filterTooltip = "Enable Filters";
  }
};

// Get Categories Data
getAllCategories() {
  this.spinner.show();
  this._dataService.GetAll('Category/GetAllCategories/null/true')
    .subscribe((Data) => {
      if (Data.IsSuccess) {
        this.categoryList = Data.ListResult;       
        this,this.spinner.hide();      
      }
      else {
        this.spinner.hide();
      }
    },
      (error) => {
        this.spinner.hide();
      });
}
}
