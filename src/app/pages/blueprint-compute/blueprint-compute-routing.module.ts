import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlueprintComputeComponent } from './blueprint-compute.component';

const routes: Routes = [
  { path: '', component: BlueprintComputeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlueprintComputeRoutingModule { }
