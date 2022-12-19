import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { WebRequestService } from './web-request.service';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
 

  constructor(private webService: WebRequestService, private router: Router, private http: HttpClient) { }

  login(email: string, password: string) {
    return this.webService.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        //cách 1
        //this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
        //cách 2
          this.setSession(res.body._id, res.headers.get('x-access-token')!.toString(), res.headers.get('x-refresh-token')!.toString());
          console.log("LOGGED IN!");
     
        // the auth tokens will be in the header of this response
       
      })
    )
  }


  signup(email: string, password: string) {
    return this.webService.signup(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        //cách 1
        //this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
        //cách 2
        this.setSession(res.body._id, res.headers.get('x-access-token')!.toString(), res.headers.get('x-refresh-token')!.toString());
        console.log("Successfully signed up and now logged in!");
      })
    )
  }



  logout() {
    this.removeSession();

    this.router.navigate(['/login']);
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  getUserId() {
    return localStorage.getItem('user-id');
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken)
  }
  
  //Cách 1
  // private setSession(userId: string, accessToken: string|null, refreshToken: string|null) {
  //   localStorage.setItem('user-id', userId);
  //   // if(setItem('x-access-token') == null ) {
  //   //   localStorage.setItem('x-access-token','');
  //   // }else {
  //   //   localStorage.setItem('x-access-token', accessToken!.toString());
  //   // }
  //   // if(setItem('x-refresh-token') == null ) {
  //   //   localStorage.setItem('x-refresh-token','');
  //   // }else {
  //   //   localStorage.setItem('x-refresh-token', refreshToken!.toString());
  //   // }
    
  // }
   private setSession(userId: string, accessToken: string, refreshToken: string) {
    
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
    
    
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getNewAccessToken() {
    return this.http.get(`${this.webService.ROOT_URL}/users/me/access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken()!.toString(),
        '_id': this.getUserId()!.toString(),
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
         this.setAccessToken(res.headers.get('x-access-token')!.toString());
      })
    )
  }
}

function setItem(arg0: string) {
  throw new Error('Function not implemented.');
}
