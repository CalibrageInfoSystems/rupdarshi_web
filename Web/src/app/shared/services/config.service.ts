import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  _base_Url = '';
  _base_Url2 = '';
    _login_Url = '';
    constructor() {
      // ****** Live urls ***********/
      // this._base_Url = 'api/api/';

      // ***** Test urls **********/
      // SPAR
      // this._base_Url = 'http://183.82.111.111/SPAR/API/api/';

      //ALSADHAN
      // this._base_Url = 'http://183.82.111.111/ALSADHAN/API/api/';

      //Test URl
      // this._base_Url = 'http://183.82.111.111/ECOM/API/api/';
      this._base_Url = 'http://localhost:61565/api/';

    }

    getLoginUrl() {
        return this._login_Url;
    }

    getApiUrl() {
        return this._base_Url;
    }

    getApiUrl2() {
        return this._base_Url2;
    }
}
