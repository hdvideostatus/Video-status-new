import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-download',
  templateUrl: './download.page.html',
  styleUrls: ['./download.page.scss'],
})
export class DownloadPage implements OnInit {
  myImages: any = [];
  spinner: boolean = true;

  constructor(
    public gs: GlobalService,
    public router: Router,
    private file: File,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.myImages = [];
    // this.readImageFromFolder(this.file.externalRootDirectory, '4k Video Status/Videos/');
  }

  goVideoSlides() {
    this.router.navigate(['/video-slides']);
    // this.router.navigate(['/video-slides'], { queryParams: { item: JSON.stringify(item) } });
  }

  readImageFromFolder(path, dirName) {
    this.file.listDir(path, dirName).then((entries) => {
      for (let i of entries) {
        if (i['nativeURL'].split('.').pop() != 'mp4' && i['nativeURL'].split('.').pop() != 'webm') {
          let image = (window as any).Ionic.WebView.convertFileSrc(i['nativeURL']);
          this.myImages.push({ image: image, original: i['nativeURL'] });
        }
      }
      this.spinner = false;
    })
      .catch((e) => {
        console.log('While reading pdf getting errors' + JSON.stringify(e));
        this.spinner = false;
      });
  }

}
