import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoSlidesPageRoutingModule } from './video-slides-routing.module';

import { VideoSlidesPage } from './video-slides.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoSlidesPageRoutingModule
  ],
  declarations: [VideoSlidesPage]
})
export class VideoSlidesPageModule {}
