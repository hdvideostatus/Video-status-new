import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quotes-faverite',
  templateUrl: './quotes-faverite.page.html',
  styleUrls: ['./quotes-faverite.page.scss'],
})
export class QuotesFaveritePage implements OnInit {
  isVidShare: boolean = false;
  constructor(
    public gs: GlobalService,
    public socialSharing: SocialSharing,
    public router: Router,
    public alertController: AlertController
  ) { }

  ngOnInit() {
  }

  viaVideoShare(quotRow) {
    this.isVidShare = true;
    this.socialSharing.share(
      '👌🏻 10,000+ 4k Full Screen Video Status  (Free)Download Now 👇🏻👇🏻👇🏻👇🏻👇🏻',
      '',
      quotRow.quotes_thumb,
      'https://play.google.com/store/apps/details?id=com.videostatus.fullscreenvideostatus'
    ).then((res) => {
      this.isVidShare = false;
      quotRow.quotes_share = Number(quotRow.quotes_share) + 1;
      this.gs.increateCount(quotRow.quotes_id, "2");
    }, (er) => {
      this.isVidShare = false;
    });
  }


  async unFavConfirm(quotRow) {
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
            this.gs.removeFavQuotes(quotRow);
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  goQuotesSlides(data, index) {
    this.router.navigate(['/quotes-slider'], {
      queryParams: {
        item: JSON.stringify({
          quotesData: data,
          index: index,
        })
      }
    });
  }
}
