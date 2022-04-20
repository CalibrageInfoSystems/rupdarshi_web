import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-left-inner',
  templateUrl: './sidebar-left-inner.component.html'
})
export class SidebarLeftInnerComponent {
  userInfo:any;
  userActivityRights:any;
  constructor(private route:Router) {
    this.userInfo = JSON.parse(localStorage.getItem('loginUser'));
    this.userActivityRights = JSON.parse(localStorage.getItem('loginUserActivityRights'));
  }
}


