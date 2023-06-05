import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Time{
  hours: number;
  minutes: number;
  seconds: number;
}

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private _reloj$ = new BehaviorSubject<Time>(this.currentTime);

  constructor() {

    setInterval(() => {
      this._reloj$.next(this.currentTime);
    }, 1000);

  }
  get reloj$(): Observable<Time>{
    return this._reloj$.asObservable();
  }
  get currentTime(): Time{
    const now = new Date();
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds()
    }
  }
}
