import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuotesSliderPage } from './quotes-slider.page';

const routes: Routes = [
  {
    path: '',
    component: QuotesSliderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotesSliderPageRoutingModule {}
