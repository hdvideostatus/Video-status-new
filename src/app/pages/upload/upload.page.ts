import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {
  allCategoryList: any = [];
  currentFileUpload: any = null;
  base64Image: any = null;
  uploadVidForm: FormGroup;
  constructor(
    public gs: GlobalService,
    public api: ApiService,
    private fb: FormBuilder,
    private navCtrl: NavController,
  ) {
    this.getCetegory();
    this.uploadVidForm = this.fb.group({
      video_file: [''],
      language_id: ['', Validators.required],
      category_id: ['', Validators.required]
    })
  }

  ngOnInit() {
  }

  getCetegory() {
    let body = {
      language_id: String(this.gs.selectedLang),
      start: 0,
    }
    this.api.post('getCategoryList', '').then((res) => {
      console.log("res>>>>", res);
      if (res['ResponseCode'] == 1) {
        this.allCategoryList = res['ResultData'];
        console.log("this.allCategoryList>>>>", this.allCategoryList);
      } else {
        this.gs.messageToast('Something went wrong');
      }
    }, err => {
      this.gs.messageToast('Something went wrong');
    })
  }

  videoUplead() {
    if (this.currentFileUpload) {
      if (this.uploadVidForm.valid) {
        this.gs.presentLoading('Uploading...');
        let formData = new FormData();
        formData.append('user_id', this.gs.userData.user_id);
        formData.append('video_file', this.currentFileUpload);
        formData.append('language_id', String(this.uploadVidForm.value.language_id));
        formData.append('category_id', String(this.uploadVidForm.value.category_id));
        console.log(this.uploadVidForm.value);
        this.api.post('uploadVideo', formData).then(async (res) => {
          console.log("uploadVideo>>>>", res);
          if (res['ResponseCode'] == 1) {
            this.gs.userData = res['ResultData'];
            await this.gs.messageToast(res['ResponseMsg']);
            this.navCtrl.pop();
            this.gs.dissmisLoding();
          } else {
            this.gs.dissmisLoding();
            this.gs.messageToast('Something went wrong');
          }
        }, err => {
          this.gs.dissmisLoding();
          this.gs.messageToast('Something went wrong');
        })
      } else {
        this.gs.messageToast('Please select language & category')
      }
    } else {
      this.gs.messageToast('Please select video')
    }
  }

  fileChangeEvent(event) {
    console.log(event['target']['files']);

    let files = event['target']['files'][0];
    console.log("event>>>", files);
    if (files.size < 5000001) {
      this.currentFileUpload = files;
      this.encodeImageFileAsURL(files)
    } else {
      this.gs.messageToast('Please upload video size maximum 5MB')
    }
  }

  encodeImageFileAsURL(element) {
    var file = element;
    var reader = new FileReader();
    reader.onloadend = () => {
      // console.log('RESULT', reader.result)
      this.base64Image = reader.result;
    }
    reader.readAsDataURL(file);
  }

  selectLangauge(event) {
    console.log("event>>>", event.target.value);
  }

}
