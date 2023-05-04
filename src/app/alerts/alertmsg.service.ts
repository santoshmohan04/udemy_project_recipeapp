import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AlertMessageService {
  private successSubject = new Subject<string>();
  public dangerSubject = new Subject<string>();
  private warningSubject = new Subject<string>();
  private infoSubject = new Subject<string>();

  alertSuccess(data: string) {
    this.successSubject.next(data);
  }

  alertDanger(data: string) {
    this.dangerSubject.next(data);
  }

  alertWarning(data: string) {
    this.warningSubject.next(data);
  }

  alertInfo(data: string) {
    this.infoSubject.next(data);
  }

  successClickEvent(): Observable<string> {
    return this.successSubject.asObservable();
  }

  dangerClickEvent(): Observable<string> {
    return this.dangerSubject.asObservable();
  }

  warningClickEvent(): Observable<string> {
    return this.warningSubject.asObservable();
  }

  infoClickEvent(): Observable<string> {
    return this.infoSubject.asObservable();
  }
}
