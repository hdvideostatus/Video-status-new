import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuotesSliderPageRoutingModule } from './quotes-slider-routing.module';

import { QuotesSliderPage } from './quotes-slider.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuotesSliderPageRoutingModule
  ],
  declarations: [QuotesSliderPage]
})
export class QuotesSliderPageModule {}
