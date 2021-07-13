import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuotesFaveritePage } from './quotes-faverite.page';

const routes: Routes = [
  {
    path: '',
    component: QuotesFaveritePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotesFaveritePageRoutingModule {}
