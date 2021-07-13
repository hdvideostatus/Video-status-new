import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.page.html',
  styleUrls: ['./trending.page.scss'],
})
export class TrendingPage implements OnInit {
  allTrendingVideos: any = [];
  isAPIcall: any = true;
  constructor(
    public gs: GlobalService,
    public api: ApiService,
    public router: Router
  ) {
    this.getTrendingVideos();
  }

  ngOnInit() {
  }

  getTrendingVideos() {
    let body = {
      language_id: String(this.gs.selectedLang),
      start: this.allTrendingVideos.length,
    }
    this.api.post('getTrendingVideos', body).then((res) => {
      console.log("res>>>>", res);
      if (res['ResponseCode'] == 1) {
        this.allTrendingVideos = res['ResultData'];
        console.log("this.allTrendingVideos>>>>", this.allTrendingVideos);
      } else {
        this.gs.messageToast('Something went wrong');
      }
    }, err => {
      this.gs.messageToast('Something went wrong');
    })
  }

  loadData(infiniteScroll) {
    if (this.isAPIcall) {
      let body = {
        language_id: String(this.gs.selectedLang),
        start: this.allTrendingVideos.length
      }
      this.api.post('getTrendingVideos', body).then((res) => {
        if (res['ResponseCode'] == 1) {
          if (res['ResultData'].length) {
            for (let i = 0; i < res['ResultData'].length; i++) {
              this.allTrendingVideos.push(res['ResultData'][i]);
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

  goVideoSlides(data, index) {
    this.router.navigate(['/video-slides'], {
      queryParams: {
        item: JSON.stringify({
          videoData: data,
          index: index,
          endPoint: 'getTrendingVideos',
        })
      }
    });
  }

}
