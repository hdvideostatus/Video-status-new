import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FaveritePage } from './faverite.page';

const routes: Routes = [
  {
    path: '',
    component: FaveritePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaveritePageRoutingModule {}
