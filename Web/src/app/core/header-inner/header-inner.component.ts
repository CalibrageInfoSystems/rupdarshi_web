import { Component, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-inner',
  templateUrl: './header-inner.component.html'
})
export class HeaderInnerComponent {
  userInfo:any;
  userActivityRights:any;
  constructor(private renderer: Renderer2, private translate: TranslateService,private route:Router) {
    this.userInfo = JSON.parse(localStorage.getItem('loginUser'));
    this.userActivityRights = JSON.parse(localStorage.getItem('loginUserActivityRights'));
    // this.changeLang('ar', true);
  }
  changeLang(language: string, changeView: boolean) {
    if ( changeView ) {
      this.renderer.addClass(document.body, 'toggle-sidebar-rtl');
    } else {
      this.renderer.removeClass(document.body, 'toggle-sidebar-rtl');
    }
    this.translate.use(language);
  }

  onSignOut(){
    localStorage.clear();
    this.route.navigate(['/login']);
  }

  onChangePassword(){
    this.route.navigate(['/change-password']);
  }
}
