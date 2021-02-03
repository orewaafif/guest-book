import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: ':code',
    loadChildren: () => import('src/app/modules/wedding/wedding.module').then(m => m.WeddingModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'aiman-sukainah'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
