import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { AlertMessageService } from './alertmsg.service';

@Component({
  selector: 'app-alerts',
  template: `
    <div
      *ngIf="isSuccess || isUpdated || isError || isWarning"
      class="px-3 py-1 d-flex align-items-center justify-content-between"
      [ngClass]="{
        'bg-success': isSuccess,
        'bg-updated': isUpdated,
        'bg-error': isError,
        'bg-warning': isWarning
      }"
      id="alerts"
    >
      <div class="ms-1 me-3">
        <img
          *ngIf="isSuccess"
          src="assets/Images/successfully-icon.png"
          alt="Successfully"
        />
        <img
          *ngIf="isUpdated"
          src="assets/Images/updated-icon.png"
          alt="Updated"
        />
        <img
          *ngIf="isError"
          src=".assets/Images/error-icon.png"
          alt="Oh Snap!"
        />
        <img
          *ngIf="isWarning"
          src="assets/Images/warning-icon.png"
          alt="Warning!"
        />
      </div>
      <div class="d-flex text-white">
        <div *ngIf="isSuccess">
          <h4>Successfully</h4>
          <p>{{ successMsg }}</p>
        </div>
        <div *ngIf="isUpdated">
          <h3>Updated</h3>
          <p>{{ infoMsg }}</p>
        </div>
        <div *ngIf="isError">
          <h3>Oh Snap!</h3>
          <p>{{ errorMsg }}</p>
        </div>
        <div *ngIf="isWarning">
          <h3>Warning</h3>
          <p>{{ warningMsg }}</p>
        </div>
        <span class="material-icons text-white pointer" (click)="closeAlert()"
          >close</span
        >
      </div>
    </div>
  `,
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent implements OnDestroy {
  isSuccess: boolean = false;
  isUpdated: boolean = false;
  isError: boolean = false;
  isWarning: boolean = false;
  successMsg!: string;
  warningMsg!: string;
  errorMsg!: string;
  infoMsg!: string;
  subscription: Subscription;

  constructor(private alertMsg: AlertMessageService) {
    this.subscription = this.alertMsg
      .successClickEvent()
      .subscribe((data: string) => {
        this.alertSuccess(data);
      });

    this.subscription = this.alertMsg
      .dangerClickEvent()
      .subscribe((data: string) => {
        this.alertDanger(data);
      });

    this.subscription = this.alertMsg
      .warningClickEvent()
      .subscribe((data: string) => {
        this.alertWarning(data);
      });

    this.subscription = this.alertMsg
      .infoClickEvent()
      .subscribe((data: string) => {
        this.alertInfo(data);
      });
  }

  alertSuccess(data: string) {
    this.successMsg = data;
    this.isSuccess = true;
    setTimeout(() => {
      this.successMsg = '';
      this.isSuccess = false;
    }, 3000);
  }

  alertDanger(data: string) {
    this.errorMsg = data;
    this.isError = true;
    setTimeout(() => {
      this.errorMsg = '';
      this.isError = false;
    }, 3000);
  }

  alertWarning(data: string) {
    this.warningMsg = data;
    this.isWarning = true;
    setTimeout(() => {
      this.warningMsg = '';
      this.isWarning = false;
    }, 3000);
  }

  alertInfo(data: string) {
    this.infoMsg = data;
    this.isUpdated = true;
    setTimeout(() => {
      this.infoMsg = '';
      this.isUpdated = false;
    }, 3000);
  }

  closeAlert() {
    this.isSuccess = false;
    this.isUpdated = false;
    this.isError = false;
    this.isWarning = false;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
