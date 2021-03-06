import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
class Cookies { // cookies doesn't work with Android default browser / Ionic
  private session_id: string = null;

  delete_sessionId() {
    this.session_id = null;
    document.cookie = 'session_id=; expires=Wed, 29 Jun 2016 00:00:00 UTC';
  }

  get_sessionId() {
    return document
      .cookie.split('; ')
      .filter(x => x.indexOf('session_id') === 0)
      .map(x => x.split('=')[1])
      .pop() || this.session_id || '';
  }

  set_sessionId(val: string) {
    document.cookie = `session_id=${val}`;
    this.session_id = val;
  }
}


@Injectable({
  providedIn: 'root'
})
export class Ng6OdooRPCService {
  private cookies: Cookies;
  private uniq_id_counter = 0;
  private shouldManageSessionId = false; // try without first
  private context: Object = JSON.parse(localStorage.getItem('user_context')) || {'lang': 'en_US'};
  private headers: HttpHeaders;
  private http_auth: string;
  private odoo_server: string;
  private token: string;

  constructor(
    @Inject(HttpClient) private http: HttpClient) {
    this.cookies = new Cookies();
  }

  public init(configs: any) {
    this.odoo_server = configs.odoo_server;
    this.http_auth = configs.http_auth || null;
    
    var login=this.login('api-test','admin','admin').subscribe((data: any[])=>{
      this.token=data["token"];
    });
  }

  public setOdooServer(odoo_server: string) {
    this.odoo_server = odoo_server;
  }

  public setHttpAuth(http_auth: string) {
    this.http_auth = http_auth;
  }

  public sendRequest(url: string, params: Object): Promise<any> {
      debugger;
    const body = this.buildRequest(url, params);
    
    return this.http.post(this.odoo_server + url, body, {headers: this.headers})
      .toPromise()
      .then(this.handleOdooErrors)
      .catch(this.handleHttpErrors);
  }

//   public getParentProjects(url: string) {
//   return this.http.get(url);
// }

// public getUsersList(url: string) {
//     return this.http.get(url);
//   }

baseUrl: string='http://beta.cisin.com:5001/api';

public login(db: string, login: string, password: string) {
  const loginUrl=this.baseUrl+'/authenticate?';
  const url=loginUrl+'db='+db+'&login='+login+'&password='+password;
  return this.http.post(url,null);
}
public getReq(url: string) {
  return this.http.get(this.baseUrl+url);
}
// public createProject(url: string) {
//   return this.http.post(url,null);    
// }

public postReq(url: string) {
  return this.http.post(url,null);
}

  public getServerInfo() {
    return this.sendRequest('/web/webclient/version_info', {});
  }

  public getSessionInfo() {
    return this.sendRequest('/web/session/get_session_info', {});
  }

//   public login(db: string, login: string, password: string) {
//       debugger;
//     const params = {
//       db: db,
//       login: login,
//       password: password
//     };
//     const $this = this;
//     return this.sendRequest('api/authenticate', params).then(function (result: any) {
//       if (!result.uid) {
//         $this.cookies.delete_sessionId();
//         return Promise.reject({
//           title: 'wrong_login',
//           message: 'Username and password don\'t match',
//           fullTrace: result
//         });
//       }
//       $this.context = result.user_context;
//       localStorage.setItem('user_context', JSON.stringify($this.context));
//       $this.cookies.set_sessionId(result.session_id);
//       return result;
//     });
//   }

  public isLoggedIn(force: boolean = true) {
    if (!force) {
      return Promise.resolve(this.cookies.get_sessionId().length > 0);
    }
    return this.getSessionInfo().then((result: any) => {
      this.cookies.set_sessionId(result.session_id);
      return !!(result.uid);
    });
  }

  public logout(force: boolean = true) {
    this.cookies.delete_sessionId();
    if (force) {
      return this.getSessionInfo().then((r: any) => { // get db from sessionInfo
        if (r.db) {
          return this.login(r.db, '', '');
        }
      });
    } else {
      return Promise.resolve();
    }
  }

  public getDbList() { // only use for odoo < 9.0
    return this.sendRequest('/web/database/get_list', {});
  }

  public searchRead(model: string, domain: any, fields: any, limit: number, offset: number, context: any = {}, sort?: string) {
    const params = {
      model: model,
      domain: domain,
      fields: fields,
      limit: limit,
      offset: offset,
      context: context || this.context,
      sort: sort || ''
    };
    return this.sendRequest('/web/dataset/search_read', params);
  }

  public updateContext(context: any) {
    localStorage.setItem('user_context', JSON.stringify(context));
    const args = [[(<any>this.context).uid], context];
    this.call('res.users', 'write', args, {})
      .then(() => this.context = context)
      .catch((err: any) => this.context = context);
  }

  public getContext() {
    return this.context;
  }

  public getServer() {
    return this.odoo_server;
  }

  public call(model: string, method: string, args: any, kwargs: any) {
    kwargs = kwargs || {};
    kwargs.context = kwargs.context || {};
    (<any>Object).assign(kwargs.context, this.context);

    const params = {
      model: model,
      method: method,
      args: args,
      kwargs: kwargs,
    };
    return this.sendRequest('/web/dataset/call_kw', params);
  }

  private buildRequest(url: string, params: any) {
      debugger;
    this.uniq_id_counter += 1;
    if (this.shouldManageSessionId) {
      params.session_id = this.cookies.get_sessionId();
    }

    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Openerp-Session-Id': this.cookies.get_sessionId(),
      'Authorization': 'Basic ' + btoa(`${this.http_auth}`)
    });
    return JSON.stringify({
      jsonrpc: '2.0',
      method: 'post',
      params: params, // payload
    });
  }

  private handleOdooErrors(response: any) {
    if (!response.error) {
      return response.result;
    }

    const error = response.error;
    const errorObj = {
      title: '    ',
      message: '',
      fullTrace: error
    };

    if (error.code === 200 && error.message === 'Odoo Server Error' && error.data.name === 'werkzeug.exceptions.NotFound') {
      errorObj.title = 'page_not_found';
      errorObj.message = 'HTTP Error';
    } else if ((error.code === 100 && error.message === 'Odoo Session Expired') || // v8
      (error.code === 300 && error.message === 'OpenERP WebClient Error' && error.data.debug.match('SessionExpiredException')) // v7
    ) {
      errorObj.title = 'session_expired';
      this.cookies.delete_sessionId();
    } else if ((error.message === 'Odoo Server Error' && /FATAL:  database "(.+)" does not exist/.test(error.data.message))) {
      errorObj.title = 'database_not_found';
      errorObj.message = error.data.message;
    } else if ((error.data.name === 'openerp.exceptions.AccessError')) {
      errorObj.title = 'AccessError';
      errorObj.message = error.data.message;
    } else {
      const split = ('' + error.data.fault_code).split('\n')[0].split(' -- ');
      if (split.length > 1) {
        error.type = split.shift();
        error.data.fault_code = error.data.fault_code.substr(error.type.length + 4);
      }

      if (error.code === 200 && error.type) {
        errorObj.title = error.type;
        errorObj.message = error.data.fault_code.replace(/\n/g, '<br />');
      } else {
        errorObj.title = error.message;
        errorObj.message = error.data.debug.replace(/\n/g, '<br />');
      }
    }
    return Promise.reject(errorObj);
  }

  private handleHttpErrors(error: any) {
    return Promise.reject(error.message || error);
  }

}
