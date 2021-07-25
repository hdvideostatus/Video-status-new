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
  selector: 'app-view-quotes',
  templateUrl: './view-quotes.page.html',
  styleUrls: ['./view-quotes.page.scss'],
})
export class ViewQuotesPage implements OnInit {
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
    public gs: GlobalService,
    private route: ActivatedRoute,
    public socialSharing: SocialSharing,
    public api: ApiService,
    private platform: Platform,
    // public admobS: AdmobfreeService,
    // public adMobFree: AdMobFree,
  ) {
    this.platform.ready().then(async () => {
      let getCatBioObj = await JSON.parse(this.route.snapshot.queryParamMap.get('item'));
      this.slideOpts.initialSlide = getCatBioObj.index;
      // console.log("getCatBioObj>>>>>>>>>>", getCatBioObj);
      this.shownVideos = 0;
      this.previousInd = 0;
      this.spinner = false;
    })
  }

  ngOnInit() {
  }

  slideNextt() {
    console.log("index");
    this.slides.getActiveIndex().then((index) => {

    });
  }
  slidePrevv() {
    this.slides.getActiveIndex().then((index) => {

    });
  }

  viaVideoShare(quotRow) {
    this.isVidShare = true;
    this.socialSharing.share('👌🏻 10,000+ 4k Full Screen Video Status  (Free)Download Now 👇🏻👇🏻👇🏻👇🏻👇🏻', '', quotRow.original, 'https://play.google.com/store/apps/details?id=com.vidstatus.hdvideofullsrceenvideo').then((res) => {
      this.isVidShare = false;
    }, (er) => {
      this.isVidShare = false;
    });
  }

}
