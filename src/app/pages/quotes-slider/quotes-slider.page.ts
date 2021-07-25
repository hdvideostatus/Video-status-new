import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, IonSlides, Platform } from '@ionic/angular';
import { GlobalService } from '../../services/global.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ApiService } from 'src/app/services/api.service';
// import { AdMobFree } from '@ionic-native/admob-free/ngx';
// import { AdmobfreeService } from 'src/app/services/admobfree.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-quotes-slider',
  templateUrl: './quotes-slider.page.html',
  styleUrls: ['./quotes-slider.page.scss'],
})
export class QuotesSliderPage implements OnInit {
  getVideoObj: any = {};
  getAllQuotes: any = [];
  foldername: any;
  spinner: boolean = true;
  isShown: boolean = false;
  downloadspinner: boolean = false;
  isVidShare: boolean = false;
  shownVideos: number = 0;
  previousInd: any = 0;
  videoURL: any;
  isPlay: boolean = true;
  isHideShowPlay: boolean = true;
  isAPIcall: boolean = true;
  setTimeout: any;
  slideOpts = {
    loop: false,
    initialSlide: 1
  };
  selectedLang: any = [];
  selectedCategory: any;


  @ViewChild('isNewVideo') isNewVideo: ElementRef;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild(IonSlides) slides: IonSlides;
  constructor(
    public router: Router,
    public alertCtrl: AlertController,
    public fileTransfer: FileTransfer,
    public file: File,
    // public admobS: AdmobfreeService,
    public gs: GlobalService,
    private route: ActivatedRoute,
    public socialSharing: SocialSharing,
    public api: ApiService,
    // public adMobFree: AdMobFree,
    private platform: Platform,
  ) {
    this.platform.ready().then(async () => {
      let getCatBioObj = await JSON.parse(this.route.snapshot.queryParamMap.get('item'));
      this.slideOpts.initialSlide = getCatBioObj.index;
      this.getAllQuotes = getCatBioObj.quotesData;
      this.selectedLang = getCatBioObj.selectedLang;
      this.selectedCategory = getCatBioObj.category;
      console.log("getCatBioObj>>>>>>>>>>", getCatBioObj);
      this.shownVideos = 0;
      this.previousInd = 0;
      this.spinner = false;
      // this.adMobFree.on(this.adMobFree.events.INTERSTITIAL_OPEN).subscribe(() => {
      //   let index = this.slides.getActiveIndex();
      //   console.log("index>>>>>>>>>>>>>>>>>" + index);

      //   setTimeout(() => {
      //     let newVideoData = <HTMLVideoElement>(
      //       document.getElementById("isNewVideo" + index)
      //     );
      //     console.log("newVideoData>>>>>" + JSON.stringify(newVideoData));

      //     if (newVideoData) {
      //       newVideoData.pause();
      //     }
      //   }, 100);
      // });
      this.gs.checkFavQuotes(this.getAllQuotes[getCatBioObj.index].quotes_id);
    })
  }

  ngOnInit() {
  }

  slideChanged() {
    this.isPlay = false;
    try {

      this.slides.getActiveIndex().then((index) => {
        if (index == 1) {
          this.shownVideos += 1;
        }
      });

    } catch (ee) {
    }
  }

  slideNextt() {
    console.log("index");
    this.slides.getActiveIndex().then((index) => {
      if (this.isAPIcall && index == (this.getAllQuotes.length - 1)) {
        this.getAllQuotesList();
        console.log("getAllQuotes>>", this.getAllQuotes);
      }
      this.gs.checkFavQuotes(this.getAllQuotes[index].quotes_id);
    });
  }
  slidePrevv() {
    this.slides.getActiveIndex().then((index) => {
      console.log("iiiiii>>", index);
      this.gs.checkFavQuotes(this.getAllQuotes[index].quotes_id);
    });
  }

  getAllQuotesList() {
    if (this.isAPIcall) {
      let body = {
        category_id: this.selectedCategory,
        language_id: String(this.selectedLang),
        start: this.getAllQuotes.length
      }
      this.api.Qpost('getQuotesList', body).then((res) => {
        if (res['ResponseCode'] == 1) {
          if (res['ResultData'].length) {
            for (let i = 0; i < res['ResultData'].length; i++) {
              this.getAllQuotes.push(res['ResultData'][i]);
            }
          } else {
            this.isAPIcall = false;
          }
        } else {
          this.gs.messageToast('Something went wrong');
        }
      }, err => {
        this.gs.messageToast('Something went wrong');
      })
    }
  }


  downloadVideo(quotRow) {
    this.downloadspinner = true;
    var fileName = 'Quotes' + new Date().getTime() + '.jpg';
    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    const fileTransferDir = this.file.externalRootDirectory;
    console.log("fileTransferDir<<<<<<<<<>>>>" + JSON.stringify(fileTransferDir));
    const fileURL = fileTransferDir + '4k Video Status/Quotes/' + fileName;
    fileTransfer.download(quotRow.quotes_thumb, fileURL).then((entry) => {
      this.downloadspinner = false;
      quotRow.quotes_download = Number(quotRow.quotes_download) + 1;
      this.gs.quotesIncreateCount(quotRow.quotes_id, "1");
      let alert = this.alertCtrl.create({
        header: '4k Video Status',
        message: 'Download Successfully!',
        mode: 'ios',
        cssClass: 'my_alertCtrl',
        buttons: [
          {
            text: 'Ok',
            cssClass: 'oky_btn',
            handler: () => {
              (<any>window).cordova.plugins.MediaScannerPlugin.scanFile(fileURL, () => { },
                (errr) => { }
              );
            },
          },
        ],
      });
      alert.then((res) => {
        res.present();
      });
    },
      (error) => {
        console.log("error>>>>>>>>>>>>>" + JSON.stringify(error));
        this.downloadspinner = false;
      }
    );
  }

  viaVideoShare(quotRow) {
    this.isVidShare = true;
    this.socialSharing.share('👌🏻 10,000+ 4k Full Screen Video Status  (Free)Download Now 👇🏻👇🏻👇🏻👇🏻👇🏻', '', quotRow.quotes_thumb, 'https://play.google.com/store/apps/details?id=com.vidstatus.hdvideofullsrceenvideo').then((res) => {
      this.isVidShare = false;
      quotRow.quotes_share = Number(quotRow.quotes_share) + 1;
      this.gs.quotesIncreateCount(quotRow.quotes_id, "2");
    }, (er) => {
      this.isVidShare = false;
    });
  }

  // favriteVideo(quotRow) {
  //   console.log("quotRow", quotRow);

  //   quotRow.video_share = Number(quotRow.video_share) + 1;
  //   this.gs.quotesIncreateCount(quotRow.quotes_id, '3')
  // }
}
