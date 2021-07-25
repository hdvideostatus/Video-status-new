import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  currentFileUpload: any = null;
  base64Image: any = null;
  deviceID: any = '03993340-1665-a36f-8692-160499703718' // = "03993340-1665-a36f-8692-160499703718";
  pageLabel: any = 'Login'
  constructor(
    private fb: FormBuilder,
    public gs: GlobalService,
    public api: ApiService,
    private navCtrl: NavController,
    private uniqueDeviceID: UniqueDeviceID
  ) {
    console.log("gs.userData>>>", gs.userData);

    this.loginForm = this.fb.group({
      user_name: ['', Validators.required],
      user_email: [''],
      user_profile: [''],
      user_profile_old: [''],
      user_instagram: [''],
      user_telegram: [''],
      user_youtube: ['']
    })
    if (this.gs.userData && this.gs.userData.user_id) {
      this.pageLabel = 'Update';
      this.setFormData(this.gs.userData);
    }
  }

  ngOnInit() {
    this.uniqueDeviceID.get().then((uuid: any) => {
      this.deviceID = uuid;
    })
  }

  // My divece kye : 03993340-1665-a36f-8692-160499703718

  loginUser() {
    if (this.loginForm.valid) {
      this.gs.presentLoading('Please Wait...');
      let formData = new FormData();
      formData.append('device_token', this.deviceID);
      formData.append('user_name', this.loginForm.value.user_name);
      formData.append('user_email', this.loginForm.value.user_email);
      formData.append('user_profile', this.currentFileUpload ? this.currentFileUpload : '');
      formData.append('user_profile_old', this.loginForm.value.user_profile);
      formData.append('user_instagram', this.loginForm.value.user_instagram);
      formData.append('user_telegram', this.loginForm.value.user_telegram);
      formData.append('user_youtube', this.loginForm.value.user_youtube);
      this.api.post('updateUserProfile', formData).then(async (res) => {
        console.log("updateUserProfile>>>>", res);
        if (res['ResponseCode'] == 1) {
          this.gs.userData = await res['ResultData'];
          setTimeout(() => {
            this.gs.dissmisLoding();
            this.gs.messageToast(res['ResponseMsg']);
            this.navCtrl.pop();
          }, 500);
        } else {
          this.gs.dissmisLoding();
          this.gs.messageToast('Something went wrong');
        }
      }, err => {
        this.gs.dissmisLoding();
        this.gs.messageToast('Something went wrong');
      })
    } else {
      this.gs.messageToast('User Name is mandatory')
    }
  }

  fileChangeEvent(event) {
    // console.log("event>>>", event[0]);
    let files = event['target']['files'][0];
    this.currentFileUpload = files
    this.encodeImageFileAsURL(files)
  }

  encodeImageFileAsURL(element) {
    var file = element;
    var reader = new FileReader();
    reader.onloadend = () => {
      console.log('RESULT', reader.result)
      this.base64Image = reader.result;
    }
    reader.readAsDataURL(file);
  }

  setFormData(formData) {
    this.loginForm.patchValue({
      user_name: formData.user_name,
      user_email: formData.user_email,
      user_profile: formData.user_profile,
      user_profile_old: formData.user_profile_old || "",
      user_instagram: formData.user_instagram,
      user_telegram: formData.user_telegram,
      user_youtube: formData.user_youtube
    })
  }

}
