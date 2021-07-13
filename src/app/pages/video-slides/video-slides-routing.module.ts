import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoSlidesPage } from './video-slides.page';

const routes: Routes = [
  {
    path: '',
    component: VideoSlidesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoSlidesPageRoutingModule {}
