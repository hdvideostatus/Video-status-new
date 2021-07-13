import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isAPIcall: boolean = true;
  constructor(
    public gs: GlobalService,
    public api: ApiService,
    public router: Router,
  ) { }

  ngOnInit() {
  }

  goVideoSlides(data, index) {
    this.router.navigate(['/video-slides'], {
      queryParams: {
        item: JSON.stringify({
          videoData: data,
          index: index,
          endPoint: 'getHomePageVideoList'
        })
      }
    });
  }

  loadData(infiniteScroll) {
    if (this.isAPIcall) {
      let body = {
        language_id: String(this.gs.selectedLang),
        start: this.gs.homeVideos.length,
      }
      this.api.post('getHomePageVideoList', body).then((res) => {
        if (res['ResponseCode'] == 1) {
          if (res['ResultData'].length) {
            for (let i = 0; i < res['ResultData'].length; i++) {
              this.gs.homeVideos.push(res['ResultData'][i]);
            }
          } else {
            this.isAPIcall = false;
          }
          infiniteScroll.target.complete();
        } else {
          infiniteScroll.target.complete();
          this.gs.messageToast('Something went wrong');
        }
      }, err => {
        infiniteScroll.target.complete();
        this.gs.messageToast('Something went wrong');
      })
      return true;
    }
    infiniteScroll.target.complete();
  }

}
