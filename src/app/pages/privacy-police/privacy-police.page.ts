import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-privacy-police',
  templateUrl: './privacy-police.page.html',
  styleUrls: ['./privacy-police.page.scss'],
})
export class PrivacyPolicePage implements OnInit {

  constructor(
    public gs: GlobalService
  ) { }

  ngOnInit() {
  }

}
