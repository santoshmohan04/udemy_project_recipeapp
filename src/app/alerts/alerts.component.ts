import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { AlertMessageService } from './alertmsg.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
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
