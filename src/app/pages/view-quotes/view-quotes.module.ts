import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewQuotesPageRoutingModule } from './view-quotes-routing.module';

import { ViewQuotesPage } from './view-quotes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewQuotesPageRoutingModule
  ],
  declarations: [ViewQuotesPage]
})
export class ViewQuotesPageModule {}
