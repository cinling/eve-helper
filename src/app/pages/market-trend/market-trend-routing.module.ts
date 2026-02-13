import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketTrendComponent } from './market-trend.component';

const routes: Routes = [
  { path: '', component: MarketTrendComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketTrendRoutingModule { }
