import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};

@Injectable()
export class AuthService {

  _base_Url: string;
  _login_Url: string;
  public userDetails = {
    access_token: null,
    userName: null,
    userId: null
  };

  constructor(private http: HttpClient, public router: Router, private config_service: ConfigService) {
    this._base_Url = config_service.getApiUrl();
    this._login_Url = config_service.getLoginUrl();
  }

  getEnvironment() {
    if (localStorage.getItem('isLiveEnvironment')) {
      let data = JSON.parse(localStorage.getItem('isLiveEnvironment'));
      return data.isLive;
    } else {
      return false;
    }
  }

  login(req: any) {
    
    var data = "grant_type=password&username=" + req.userName + "&password=" + req.password;
    return this.http.post(this._login_Url,
      data, httpOptions).pipe(
        map((response: any) => {
          
          //var res = JSON.parse(response);
          // login successful if there's a jwt token in the response                
          if (response && response.access_token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes

            this.userDetails.access_token = response.access_token;
            this.userDetails.userName = response.userName;
            this.userDetails.userId = response.UserId;

            localStorage.setItem('currentUser', JSON.stringify(this.userDetails));
          }
          return response;
        }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.clear();
    localStorage.setItem('logout-event', 'logout');
    this.router.navigateByUrl('/home');

    // localStorage.removeItem('currentUser');
    // localStorage.removeItem('loginMenus');
    // localStorage.removeItem('loginRoles');
    // localStorage.removeItem('loginVendor'); 
    // localStorage.removeItem('doctor'); 
    // localStorage.removeItem('loginPatientDetails');
    // localStorage.removeItem('selectedpatient');
    // this.router.navigateByUrl('');
    // window.location.reload();
  }

  getUserDetails(): any {
    return localStorage.getItem('currentUser');
  }

  getUserId():string{
    if(localStorage.getItem('currentUser')){
     let data = JSON.parse(localStorage.getItem('currentUser'));
     return data.userId;
    }else{
      return "";
    }
  }

  getUserName():string{
    if(localStorage.getItem('currentUser')){
     let data = JSON.parse(localStorage.getItem('currentUser'));
     return data.userName;
    }else{
      return "";
    }
  }


}
