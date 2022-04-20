import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  @ViewChild('la')
  private table;
  isFiltersEnabled = false;
  filterTooltip = "Enable Filters";
  locationsList: any[] = [];
  constructor(private spinner: NgxSpinnerService, private _dataService: DataService) { }

  ngOnInit() {
this.getAllLocations(null,null,null);
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
    getAllLocations(cityId,id,isActive) {
      this.spinner.show();
      this._dataService.GetAll('GeoLocation/GetAllLocations/cityId/id/isActive')
        .subscribe((Data) => {
          this.spinner.hide();
          if (Data.IsSuccess) {
            this.locationsList = Data.ListResult;        
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
