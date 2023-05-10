import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private title$ = new BehaviorSubject('')

  constructor() { }
  obtenerBreadcrumbs(): Observable<string> {
    return this.title$.asObservable();
  }
  setTitle(newTitle: string) {
    this.title$.next(newTitle);
  }

}
