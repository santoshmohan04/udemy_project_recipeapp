import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AlertMessageService } from '../alerts/alertmsg.service';
import { User } from '../auth/user.model';
import { Subscription, debounceTime } from 'rxjs';
import { UserProfile } from './profile.model';
import * as profileActions from './store/profile.actions';
import * as fromApp from '../store/app.reducer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  userProfileData: UserProfile;
  user_details: User;
  isEditMode = false;
  isLoading = false;
  apiPayload: UserProfile;
  profileUpdateForm: FormGroup;
  private userSub: Subscription;
  private profileSub: Subscription;

  constructor(
    private alertMsg: AlertMessageService,
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userSub = this.store.select('auth').subscribe((authState) => {
      this.user_details = authState.user;
    });
    this.store.dispatch(
      new profileActions.FetchProfile({ idToken: this.user_details._token })
    );
    this.profileSub = this.store
      .select('profile')
      .pipe(debounceTime(1000))
      .subscribe((profileState) => {
        this.isLoading = profileState.loading;
        this.userProfileData = profileState.profile;
        let error = profileState.resError;
        if (error) {
          this.showErrorAlert(error);
        }
      });
    this.profileUpdateForm = this.fb.group({
      name: [null, [Validators.required]],
      photo: [null, [Validators.required]],
    });
  }

  onEdit() {
    this.profileUpdateForm.patchValue({
      name: this.userProfileData.displayName,
      photo: this.userProfileData.photoUrl,
    });
    this.isEditMode = !this.isEditMode;
  }

  editProfile() {
    this.store.dispatch(
      new profileActions.UpdateProfile({
        idToken: this.user_details._token,
        displayName: this.profileUpdateForm.value.name,
        photoUrl: this.profileUpdateForm.value.photo,
      })
    );
    this.isEditMode = !this.isEditMode;
  }

  private showErrorAlert(message: string) {
    this.alertMsg.alertDanger(message);
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.profileSub.unsubscribe();
  }
}
