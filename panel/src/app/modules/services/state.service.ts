import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public showLoading = new BehaviorSubject<boolean>(false);
  public count: number = 0;

  constructor() {}

  getLoadingStatus(): Observable<boolean> {
    return this.showLoading.asObservable();
  }


  startLoading() {
    this.count += 1;
    this.checkLoadingStatus();
  }

  endLoading() {
    this.count -= 1;
    this.checkLoadingStatus();
  }

  checkLoadingStatus() {
    if (this.count < 1) {
      this.showLoading.next(false);
    } else {
      this.showLoading.next(true);
    }
  }
}