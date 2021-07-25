import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, IonSlides, ModalController, Platform } from '@ionic/angular';
import { GlobalService } from '../../services/global.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ApiService } from 'src/app/services/api.service';
// import { AdMobFree } from '@ionic-native/admob-free/ngx';
// import { AdmobfreeService } from 'src/app/services/admobfree.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { OtherProfilePage } from '../other-profile/other-profile.page';

@Component({
  selector: 'app-video-slides',
  templateUrl: './video-slides.page.html',
  styleUrls: ['./video-slides.page.scss'],
})
export class VideoSlidesPage implements OnInit {
  getVideoObj: any = {};
  getAllVideos: any = [];
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
  endPoint: any = '';
  slideOpts = {
    loop: false,
    initialSlide: 0,
    direction: 'vertical',
  };
  category: any;
  @ViewChild('isNewVideo') isNewVideo: ElementRef;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild(IonSlides) slides: IonSlides;
  constructor(
    public router: Router,
    public alertCtrl: AlertController,
    public fileTransfer: FileTransfer,
    public file: File,
    public gs: GlobalService,
    private route: ActivatedRoute,
    public socialSharing: SocialSharing,
    public api: ApiService,
    private platform: Platform,
    public modalController: ModalController
    // public admobS: AdmobfreeService,
    // public adMobFree: AdMobFree,
  ) {
    this.platform.ready().then(async () => {
      let getCatBioObj = await JSON.parse(this.route.snapshot.queryParamMap.get('item'));
      this.slideOpts.initialSlide = getCatBioObj.index;
      this.getAllVideos = getCatBioObj.videoData;
      this.endPoint = getCatBioObj.endPoint;
      this.category = getCatBioObj.category;
      console.log("getAllVideos>>>>>>>>>>", this.getAllVideos);
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
      this.gs.checkFavVideo(this.getAllVideos[getCatBioObj.index].video_id);
    })
  }

  ngOnInit() {
    setTimeout(() => {
      let newVideoData = <HTMLVideoElement>document.getElementById("isNewVideo" + 0);
      console.log("newVideoData???", newVideoData);
      if (newVideoData) {
        // newVideoData.play();
      }
      this.isPlay = false;
    }, 50);
  }

  loadMoreData() {
    console.log("shownVideos>>>", this.shownVideos);
    if (this.shownVideos < this.getAllVideos.length) {
      this.shownVideos += 5;
      // this.admobS.showInterstitialAds();
    }
  }

  slideChanged() {
    this.isPlay = false;
    try {
      (<any>window).document.querySelectorAll('video').forEach(vid => {
        vid.pause();
        vid.currentTime = 0;
      });

      this.slides.getActiveIndex().then((index) => {
        if (index == 1) {
          this.shownVideos += 1;
        }
        setTimeout(() => {
          if (index > this.previousInd) {
            let newVideoData = <HTMLVideoElement>(
              document.getElementById("isNewVideo" + (index - 1))
            );
            if (newVideoData) {
              newVideoData.pause();
            }
          } else {
            let newVideoData = <HTMLVideoElement>(
              document.getElementById("isNewVideo" + (index + 1))
            );
            if (newVideoData) {
              newVideoData.pause();
            }
          }
          this.previousInd = index;

          let newVideoData = <HTMLVideoElement>(
            document.getElementById("isNewVideo" + index)
          );
          if (newVideoData) {
            newVideoData.play();
          }
        }, 100);
      });

    } catch (ee) {
    }
  }

  slideNextt() {
    console.log("index");
    this.slides.getActiveIndex().then((index) => {
      if (this.isAPIcall && (index == this.getAllVideos.length - 3)) {
        this.loadData();
      }
      this.gs.checkFavVideo(this.getAllVideos[index].video_id);
    });
  }
  slidePrevv() {
    this.slides.getActiveIndex().then((index) => {
      console.log("iiiiii>>", index);
      this.gs.checkFavVideo(this.getAllVideos[index].video_id);
    });
  }

  loadData() {
    if (this.isAPIcall && this.endPoint != '') {
      let body;
      if (this.endPoint == 'getTrendingVideos' || this.endPoint == 'getHomePageVideoList') {
        body = {
          language_id: String(this.gs.selectedLang),
          start: this.getAllVideos.length
        }
      }
      if (this.endPoint == 'getVideoListByCategory') {
        body = {
          category_id: this.category,
          language_id: String(this.gs.selectedLang),
          start: this.getAllVideos.length,
        }
      }
      setTimeout(() => {
        this.api.post(this.endPoint, body).then((res) => {
          console.log("res>>>", res);
          console.log("this.getAllVideos>>>", this.getAllVideos);
          if (res['ResponseCode'] == 1) {
            if (res['ResultData'].length) {
              for (let i = 0; i < res['ResultData'].length; i++) {
                this.getAllVideos.push(res['ResultData'][i]);
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
      }, 100);
    }
  }


  downloadVideo(vidRow) {
    this.downloadspinner = true;
    var fileName = '4kVideoStatus' + new Date().getTime() + '.mp4';
    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    const fileTransferDir = this.file.externalRootDirectory;
    console.log("fileTransferDir<<<<<<<<<>>>>" + JSON.stringify(fileTransferDir));
    const fileURL = fileTransferDir + '4k Video Status/Videos/' + fileName;
    fileTransfer.download(vidRow.video_url, fileURL).then((entry) => {
      this.downloadspinner = false;
      vidRow.video_download = Number(vidRow.video_download) + 1;
      this.gs.increateCount(vidRow.video_id, "1");
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

  viaVideoShare(vidRow) {
    this.isVidShare = true;
    this.socialSharing.share('👌🏻 10,000+ 4k Full Screen Video Status  (Free)Download Now 👇🏻👇🏻👇🏻👇🏻👇🏻', '', vidRow.video_url, 'https://play.google.com/store/apps/details?id=com.vidstatus.hdvideofullsrceenvideo').then((res) => {
      this.isVidShare = false;
      vidRow.video_share = Number(vidRow.video_share) + 1;
      this.gs.increateCount(vidRow.video_id, "2");
    }, (er) => {
      this.isVidShare = false;
    });
  }

  async viewProfile(user_id) {
    this.slides.getActiveIndex().then((index) => {
      let newVideoData = <HTMLVideoElement>(
        document.getElementById("isNewVideo" + index)
      );
      if (newVideoData) {
        newVideoData.pause();
      }
    })
    this.router.navigate(['/other-profile'], {
      queryParams: {
        user_id: user_id
      }
    });
    // const modal = await this.modalController.create({
    //   component: OtherProfilePage,
    //   cssClass: 'my-custom-class',
    //   componentProps: {
    //     user_id: user_id
    //   }
    // });
    // return await modal.present();
  }
}
