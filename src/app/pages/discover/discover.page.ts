import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  allCategoryList: any = [];
  isAPIcall: boolean = true;
  isSpinner: any = true;
  constructor(
    public gs: GlobalService,
    public api: ApiService,
    public router: Router,
  ) {
    this.getCetegory();
  }

  ngOnInit() {
  }

  getCetegory() {
    this.gs.presentLoading('Category loading...');
    let body = {
      language_id: String(this.gs.selectedLang),
      start: 0,
    }
    this.api.post('getCategoryList', body).then((res) => {
      if (res['ResponseCode'] == 1) {
        this.allCategoryList = res['ResultData'];
        console.log('this.allCategoryList', this.allCategoryList);
      } else {
        this.gs.messageToast('Something went wrong');
      }
      this.isSpinner = false;
      this.gs.dissmisLoding();
    }, err => {
      this.isSpinner = false;
      this.gs.dissmisLoding();
      this.gs.messageToast('Something went wrong');
    })
  }

  getVideoListByCategory(category_id) {
    let body = {
      category_id: category_id,
      language_id: String(this.gs.selectedLang),
      start: 0,
    }
    this.api.post('getVideoListByCategory', body).then((res) => {
      if (res['ResponseCode'] == 1) {
        this.goVideoSlides(res['ResultData'], category_id, 0)
      } else {
        this.gs.messageToast('Something went wrong');
      }
      this.isSpinner = false;
    }, err => {
      this.isSpinner = false;
      this.gs.messageToast('Something went wrong');
    })
  }

  goVideoSlides(data, category_id, index) {
    this.router.navigate(['/video-slides'], {
      queryParams: {
        item: JSON.stringify({
          videoData: data,
          index: index,
          category: category_id,
          endPoint: 'getVideoListByCategory',
        })
      }
    });
  }

  loadData(infiniteScroll) {
    console.log("infiniteScroll>>>>>");

    if (this.isAPIcall) {
      let body = {
        language_id: String(this.gs.selectedLang),
        start: this.allCategoryList.length,
      }
      this.api.post('getCategoryList', body).then((res) => {
        if (res['ResponseCode'] == 1) {
          if (res['ResultData'] && res['ResultData'].length) {
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
