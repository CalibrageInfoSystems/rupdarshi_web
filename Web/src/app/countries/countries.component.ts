import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  @ViewChild('cu')
  private table;
  isFiltersEnabled = false;
  filterTooltip = "Enable Filters";
  countriesList:any[]=[];
  constructor(private spinner: NgxSpinnerService, private _dataService: DataService) { }

  ngOnInit() {
    this.getAllCountries();
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

getAllCountries() {
  this.spinner.show();
  this._dataService.GetAll('GeoLocation/GetAllCountries/null/null')
    .subscribe((Data) => {
      this.spinner.hide();
      if (Data.IsSuccess) {
        this.countriesList = Data.ListResult;
        
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
