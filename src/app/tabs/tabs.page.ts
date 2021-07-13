import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    public router: Router,
    public gs: GlobalService,
  ) { }

  upload() {
    if (this.gs.userData && this.gs.userData.user_id) {
      this.router.navigate(['/upload']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
