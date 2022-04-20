import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  citiesList:any[]=[];
  @ViewChild('ct')
  private table;
  isFiltersEnabled = false;
  filterTooltip = "Enable Filters";
  constructor(private spinner: NgxSpinnerService, private _dataService: DataService) { }

  ngOnInit() {
    this.getAllCities(null,null,null);
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
getAllCities(countryId,id,isActive) {
  this.spinner.show();
  this._dataService.GetAll('GeoLocation/GetAllCities/countryId/id/isActive')
    .subscribe((Data) => {
      this.spinner.hide();
      if (Data.IsSuccess) {
        this.citiesList = Data.ListResult;        
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
