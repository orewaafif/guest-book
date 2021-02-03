import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: ':code',
    loadChildren: () => import('src/app/modules/wedding/wedding.module').then(m => m.WeddingModule)
  },
  {
    path: '',
    loadChildren: () => import('src/app/modules/wedding/wedding.module').then(m => m.WeddingModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
