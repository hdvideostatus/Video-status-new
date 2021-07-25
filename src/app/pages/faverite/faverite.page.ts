import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faverite',
  templateUrl: './faverite.page.html',
  styleUrls: ['./faverite.page.scss'],
})
export class FaveritePage implements OnInit {
  isVidShare: boolean = false;
  constructor(
    public gs: GlobalService,
    public socialSharing: SocialSharing,
    public router: Router,
    public alertController: AlertController
  ) { }

  ngOnInit() {
  }

  viaVideoShare(vidRow) {
    this.isVidShare = true;
    this.socialSharing.share(
      '👌🏻 10,000+ 4k Full Screen Video Status  (Free)Download Now 👇🏻👇🏻👇🏻👇🏻👇🏻',
      '',
      vidRow.video_url,
      'https://play.google.com/store/apps/details?id=com.vidstatus.hdvideofullsrceenvideo'
    ).then((res) => {
      this.isVidShare = false;
      vidRow.video_share = Number(vidRow.video_share) + 1;
      this.gs.increateCount(vidRow.video_id, "2");
    }, (er) => {
      this.isVidShare = false;
    });
  }


  async unFavConfirm(video_id) {
    const alert = await this.alertController.create({
      header: 'Alert !',
      message: 'Are you sure you want to unfavourite',
      mode: 'ios',
      cssClass: 'alert_ctrl',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Unfavourite',
          cssClass: 'danger-btn',
          handler: () => {
            this.gs.removeFavVideo(video_id);
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  goVideoSlides(data, index) {
    this.router.navigate(['/video-slides'], {
      queryParams: {
        item: JSON.stringify({
          videoData: data,
          index: index,
        })
      }
    });
  }

}
