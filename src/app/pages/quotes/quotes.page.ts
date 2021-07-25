import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.page.html',
  styleUrls: ['./quotes.page.scss'],
})
export class QuotesPage implements OnInit {
  allQuotCatList: any = [];
  allQuotesList: any = [];
  allQuotesLanguage: any = [];
  allVideoLangTemp: any = [];
  selectedLang: any = [];
  selectedCategory: any;
  isFirstTime: boolean = false;
  isAPIcall: boolean = true;
  isSpinner: boolean = true;
  checkedQuote: any;
  constructor(
    public router: Router,
    public gs: GlobalService,
    public api: ApiService,
    public alertController: AlertController,
  ) {
    this.selectedLang = JSON.parse(window.localStorage.getItem("vidstausQuotesLanguages")) || [];
    this.getLanguageList();
  }

  ngOnInit() {
  }

  segmentChanged(event) {
    this.isAPIcall = true;
    this.selectedCategory = event.target.value;
    this.getAllQuotesList(event.target.value)
  }

  getLanguageList() {
    this.gs.presentLoading('Quotes loading...');
    this.api.Qpost('getLanguageList', '').then(async (res) => {
      if (res['ResponseCode'] == 1) {
        this.allQuotesLanguage = res['ResultData'];
        console.log(this.allQuotesLanguage);
        const setCatLang = () => {
          for (let i in this.allQuotesLanguage) {
            this.allVideoLangTemp.push({
              type: 'checkbox',
              label: this.allQuotesLanguage[i].language_name,
              value: this.allQuotesLanguage[i].language_id,
              checked: this.isLangCheck(this.allQuotesLanguage[i].language_id)
            })
            if (!this.selectedLang.length || this.isFirstTime) {
              this.isFirstTime = true;
              this.selectedLang.push(this.allQuotesLanguage[i].language_id)
            }
          }
        }
        await setCatLang();
        console.log("this.allVideoLangTemp>>>", this.allVideoLangTemp);

        this.getCetegory({
          language_id: String(this.selectedLang)
        });
      } else {
        this.gs.messageToast('Something went wrong');
        this.isSpinner = false;
        this.gs.dissmisLoding();
      }
    }, err => {
      console.log("errgetLanguageList>>>>>>>>" + JSON.stringify(err));
      this.isSpinner = false;
      this.gs.dissmisLoding();
      this.gs.messageToast('Something went wrong');
    })
  }

  getCetegory(language_id) {
    let body = {
      language_id: language_id,
      start: 0,
    }
    this.api.Qpost('getCategoryList', body).then((res) => {
      if (res['ResponseCode'] == 1) {
        this.allQuotCatList = res['ResultData'];
        if (res['ResultData'] && res['ResultData'].length) {
          this.selectedCategory = this.allQuotCatList[0].category_id;
          this.checkedQuote = this.allQuotCatList[0].category_id;
          this.getAllQuotesList(this.allQuotCatList[0].category_id);
        }
      } else {
        this.gs.messageToast('Something went wrong');
        this.isSpinner = false;
        this.gs.dissmisLoding();
      }
    }, err => {
      this.isSpinner = false;
      this.gs.dissmisLoding();
      this.gs.messageToast('Something went wrong');
    })
  }

  getAllQuotesList(category_id) {
    let body = {
      category_id: category_id,
      language_id: String(this.selectedLang),
      start: 0,
    }
    this.api.Qpost('getQuotesList', body).then((res) => {
      console.log("allQuotesList>>>>", res);
      if (res['ResponseCode'] == 1) {
        this.allQuotesList = res['ResultData'];
        this.isSpinner = false;
        this.gs.dissmisLoding();
      } else {
        this.gs.messageToast('Something went wrong');
        this.isSpinner = false;
        this.gs.dissmisLoding();
      }
    }, err => {
      this.gs.messageToast('Something went wrong');
      this.isSpinner = false;
      this.gs.dissmisLoding();
    })
  }

  isLangCheck(language_id) {
    if (this.selectedLang.length) {
      for (let i in this.selectedLang) {
        if (this.selectedLang[i] == language_id) {
          return true
        }
      }
    } else {
      return true
    }
  }

  async languagePopup() {
    const setCatLang = () => {
      for (let i in this.allVideoLangTemp) {
        this.allVideoLangTemp[i] = {
          type: 'checkbox',
          label: this.allQuotesLanguage[i].language_name,
          value: this.allQuotesLanguage[i].language_id,
          checked: this.isLangCheck(this.allQuotesLanguage[i].language_id)
        }
      }
    }
    await setCatLang();
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Quotes Languages',
      inputs: this.allVideoLangTemp,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (res) => {
            this.selectedLang = res;
            if (res.length) {
              window.localStorage.setItem("vidstausQuotesLanguages", JSON.stringify(res));
              this.isAPIcall = false;
              this.getCetegory({
                language_id: String(res)
              });
              console.log('Confirm Ok');
            }
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
          category: this.selectedCategory,
          selectedLang: this.selectedLang,
        })
      }
    });
  }

  loadData(infiniteScroll) {
    if (this.isAPIcall) {
      let body = {
        category_id: this.selectedCategory,
        language_id: String(this.selectedLang),
        start: this.allQuotesList.length
      }
      this.api.Qpost('getQuotesList', body).then((res) => {
        if (res['ResponseCode'] == 1) {
          if (res['ResultData'].length) {
            for (let i = 0; i < res['ResultData'].length; i++) {
              this.allQuotesList.push(res['ResultData'][i]);
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
