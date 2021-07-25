import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewQuotesPage } from './view-quotes.page';

const routes: Routes = [
  {
    path: '',
    component: ViewQuotesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewQuotesPageRoutingModule {}
