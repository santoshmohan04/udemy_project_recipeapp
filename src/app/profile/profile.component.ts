import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ProfileData,
  UsersList,
  UserprofileService,
} from './userprofile.service';
import { AlertMessageService } from '../alerts/alertmsg.service';
import { User } from '../auth/user.model';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  userProfileData: UsersList;
  user_details: User;
  isEditMode = false;
  isLoading = false;
  private userSub: Subscription;

  constructor(
    private userprofile: UserprofileService,
    private alertMsg: AlertMessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.UserDetails;
    this.userSub = this.authService.user.subscribe((user) => {
      this.user_details = user;
    });
    this.userprofile.getUserData().subscribe({
      next: (res: ProfileData) => {
        this.userProfileData = res.users.find(
          (t) => t.email === this.user_details.email
        );
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.alertMsg.alertDanger(err);
      },
    });
  }

  editProfile() {
    let payload = {
      idToken: this.authService.user.value._token,
      displayName: this.userProfileData.displayName,
      photoUrl: this.userProfileData.photoUrl,
    };
    this.userprofile.updateProfile(payload).subscribe({
      next: (res: any) => {
        this.userProfileData = res;
        this.isEditMode = !this.isEditMode;
      },
      error: (err: any) => {
        this.alertMsg.alertDanger(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
