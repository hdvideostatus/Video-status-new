import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { AlertController, IonRouterOutlet, MenuController, Platform } from '@ionic/angular';
import { GlobalService } from './services/global.service';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { File } from '@ionic-native/file/ngx';
import { ApiService } from './services/api.service';
import { Router } from '@angular/router';
// import { Network } from '@ionic-native/network/ngx';
// import { HTTP } from '@ionic-native/http/ngx';
// import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  alertInShown: boolean = true;
  internetPopup: any;

  constructor(
    private platform: Platform,
    private _location: Location,
    private uniqueDeviceID: UniqueDeviceID,
    // public network: Network,
    public appVersion: AppVersion,
    // private http: HTTP,
    private file: File,
    private alertCtrl: AlertController,
    private menutCtrl: MenuController,
    public gs: GlobalService,
    public router: Router,
    // private fcm: FCM,
    public api: ApiService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url) {
        if (this.router.url != '/tabs/home') {
          this.router.navigate(['/tabs/home']);
        } else {
          navigator['app'].exitApp();
        }
      }
    })

    this.platform.ready().then((res) => {
      // if (this.network.type == 'none') {
      //   if (!this.alertInShown) {
      //     this.internetNotConnect();
      //   }
      // }
      // this.initialFCMNotification();
      // this.listenConnection();
      this.createUserProfile();
      this.getAppDetail();
      this.gs.getLanguageList();
      // this.http.get('http://4kfullscreenvideostatus.com/appv1/videoapi/getLanguageList', '', '')
      //   .then(data => {
      //     console.log("datadatadatadata" + JSON.stringify(data));
      //   })
      //   .catch(error => {

      //     console.log("error.status>>>" + JSON.stringify(error.status));
      //     console.log("error.error>>>" + JSON.stringify(error.error)); // error message as string
      //     console.log("error.headers>>>" + JSON.stringify(error.headers));

      //   });
      this.file.createDir(this.file.externalRootDirectory, '4k Video Status', true)
        .then((result) => {
          this.file.createDir(this.file.externalRootDirectory, '4k Video Status/Videos', true).then((result) => {
          }).catch((err) => { });

          this.file.createDir(this.file.externalRootDirectory, '4k Video Status/Quotes', true).then((result) => {
          }).catch((err) => { });
        })
        .catch((err) => { });
    })
  }

  initialFCMNotification() {
    // try {
    //   this.fcm.getToken().then((token) => {
    //     console.log("token>>>>>>>>>>>" + JSON.stringify(token))
    //   }, (err) => {
    //     console.log("errreeeee" + JSON.stringify(err));
    //   });

    //   this.fcm.onNotification().subscribe((data) => {
    //     if (data.wasTapped) {
    //       console.log('Received in background');
    //     } else {
    //       console.log('Received in foreground');
    //     }
    //   });
    // } catch (erer) {
    //   console.log('FCM>>>>>>>>>>', erer);
    // }
  }

  // async listenConnection() {
  //   this.network.onDisconnect().subscribe(() => {
  //     if (this.alertInShown == false) {
  //       this.internetNotConnect();
  //     }
  //   });

  //   this.network.onConnect().subscribe(() => {
  //     if (this.internetPopup) {
  //       this.internetPopup.then((res) => {
  //         res.dismiss();
  //       });
  //       this.alertInShown = false;
  //     }
  //   });
  // }

  async internetNotConnect() {
    this.internetPopup = await this.alertCtrl.create({
      header: '4k video status',
      message: 'No Internet Connection!',
      backdropDismiss: false,
      mode: 'ios',
      cssClass: 'my_alertCtrl',
    });
    this.internetPopup.then((res) => {
      res.present();
      this.alertInShown = true;
    });
  }

  createUserProfile() {
    this.uniqueDeviceID.get().then((uuid: any) => {
      console.log("uuiduuiduuiduuid>>>>" + JSON.stringify(uuid));
      let body = {
        "device_token": uuid
      }
      this.api.post('createUserProfile', body).then((res) => {
        console.log(JSON.stringify("createUserProfile=====" + res));
        if (res['ResponseCode'] == 1) {
          this.gs.userData = res['ResultData'];
          console.log(JSON.stringify("gs.userData>>>>>>>>" + this.gs.userData));
        } else {
          this.gs.messageToast('Something went wrong');
        }
      }, error => {
        console.log(JSON.stringify("error>>>>>>>>" + error));
        this.gs.messageToast('Something went wrong');
      })
    }).catch((error: any) => console.log("erroruniqueDeviceID>>>>" + JSON.stringify(error)));
  }

  getAppDetail() {
    this.api.post('getAppDetail', '').then((res) => {
      if (res['ResponseCode'] == 1) {
        this.appVersion.getVersionNumber().then((versionNumber) => {
          if (res['ResultData'].app_version != versionNumber) {
            this.updatePopup()
          }
        })
      } else {
        this.gs.messageToast('Something went wrong');
      }
    }, error => {
      console.log(JSON.stringify("error>>>>>>>>" + error));
      this.gs.messageToast('Something went wrong');
    })
  }

  privacyPolice() {
    this.router.navigate(['/privacy-police']);
    this.menutCtrl.close();
  }
  quotes() {
    this.router.navigate(['/quotes']);
    this.menutCtrl.close();
  }

  async updatePopup() {
    let alert = await this.alertCtrl.create({
      header: 'Vibes Video Status',
      message: 'New Update Available',
      backdropDismiss: false,
      mode: 'ios',
      cssClass: 'my_alertCtrl',
      buttons: [
        {
          text: 'Ignore',
          role: 'cancel',
          cssClass: 'cancel_btn',
          handler: () => { },
        },
        {
          text: 'Update',
          cssClass: 'oky_btn',
          handler: () => {
            this.gs.rateApp();
          },
        },
      ],
    });
    await alert.present();
  }
}
