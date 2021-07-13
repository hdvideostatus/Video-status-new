import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaveritePageRoutingModule } from './faverite-routing.module';

import { FaveritePage } from './faverite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaveritePageRoutingModule
  ],
  declarations: [FaveritePage]
})
export class FaveritePageModule {}
