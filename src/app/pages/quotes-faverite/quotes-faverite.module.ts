import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuotesFaveritePageRoutingModule } from './quotes-faverite-routing.module';

import { QuotesFaveritePage } from './quotes-faverite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuotesFaveritePageRoutingModule
  ],
  declarations: [QuotesFaveritePage]
})
export class QuotesFaveritePageModule {}
