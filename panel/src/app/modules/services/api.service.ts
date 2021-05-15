import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getFromDate(date): Observable<any> {
    let url = environment.baseUrl + 'device/bpm-from-to-date';
    console.log(date)
    return this.http.post(url,date);
  }

  checkSerial(order): Observable<any> {
    let url = environment.baseUrl + 'device/bpm';
    return this.http.post(url, order);
  }

  login(user): Observable<any> {
    let url = environment.baseUrl + 'user/login';
    return this.http.post(url, user);
  }

  signUp(user): Observable<any> {
    let url = environment.baseUrl + 'user/sign-up';
    return this.http.post(url, user);
  }

}
