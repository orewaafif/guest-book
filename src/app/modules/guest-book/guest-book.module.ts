import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestBookRoutingModule } from './guest-book-routing.module';
import { GuestBookComponent } from './guest-book.component';


@NgModule({
  declarations: [GuestBookComponent],
  imports: [
    CommonModule,
    GuestBookRoutingModule
  ]
})
export class GuestBookModule { }
