import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AlertMessageService } from '../alerts/alertmsg.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  template: `
    <div class="d-flex justify-content-center">
      <div class="card" style="width: 400px">
        <div class="card-header bg-primary text-white text-center">
          {{ isLoginMode ? 'Login' : 'Sign Up' }}
        </div>
        <div class="card-body">
          <ng-template [ngIf]="!isLoading" [ngIfElse]="spinner">
            <form [formGroup]="authForm" (ngSubmit)="onSubmit(authForm)">
              <div class="mb-3">
                <label for="email" class="form-label">Email:</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  formControlName="email"
                  placeholder="Enter email"
                  name="email"
                />
              </div>
              <div class="mb-3">
                <label for="pwd" class="form-label">Password:</label>
                <input
                  type="password"
                  class="form-control"
                  id="pwd"
                  formControlName="password"
                  placeholder="Enter password"
                  name="pswd"
                />
              </div>
              <div class="form-check mb-3">
                <label for="remember" class="form-check-label">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="remember"
                    formControlName="remember"
                  />
                  Remember me
                </label>
              </div>
              <div>
                <button
                  class="btn btn-primary"
                  type="submit"
                  [disabled]="!authForm.valid"
                >
                  {{ isLoginMode ? 'Login' : 'Sign Up' }}
                </button>
                |
                <button
                  class="btn btn-primary"
                  (click)="onSwitchMode()"
                  type="button"
                >
                  Switch to {{ isLoginMode ? 'Sign Up' : 'Login' }}
                </button>
              </div>
            </form>
          </ng-template>
          <ng-template #spinner>
            <div class="text-center">
              <app-loading-spinner></app-loading-spinner>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  authForm!: FormGroup;
  private storeSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private alertMsg: AlertMessageService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.authForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });
    this.storeSub = this.store.select('auth').subscribe((authState) => {
      this.isLoading = authState.loading;
      let error = authState.authError;
      if (error) {
        this.showErrorAlert(error);
      }
    });
    const usr_details = JSON.parse(localStorage.getItem('usrdtl'));
    if (usr_details !== null || undefined) {
      this.authForm.patchValue({
        email: usr_details.useremail,
        password: usr_details.userpswd,
        remember: true,
      });
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: FormGroup) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const isremeber = form.value.remember;

    const usr_payload = {
      useremail: email,
      userpswd: password,
    };

    isremeber
      ? localStorage.setItem('usrdtl', JSON.stringify(usr_payload))
      : localStorage.removeItem('usrdtl');

    this.isLoading = true;

    if (this.isLoginMode) {
      this.store.dispatch(
        new AuthActions.LoginStart({ email: email, password: password })
      );
    } else {
      this.store.dispatch(
        new AuthActions.SignupStart({ email: email, password: password })
      );
    }

    form.reset();
  }

  private showErrorAlert(message: string) {
    this.alertMsg.alertDanger(message);
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
