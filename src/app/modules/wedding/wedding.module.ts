import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeddingComponent } from './wedding.component';
import { RouterModule, Routes } from '@angular/router';
import { WeddingService } from './wedding.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MessagesComponent } from './messages/messages.component';
import { EditMessageComponent } from './edit-message/edit-message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CredentialsInterceptor } from 'src/app/helpers/credentials.interceptor';
import { AssetLoaderService } from 'src/app/common/asset-loader/asset-loader.service';
import { MsgTemplateComponent } from './msg-template/msg-template.component';

const routes: Routes = [
  {
    path: '',
    component: WeddingComponent,
    children: [
      {
        path: '',
        component: MessagesComponent
      },
      {
        path: 'message',
        redirectTo: ''
      },
      {
        /** Handle both create and edit here */
        path: 'message/:mode',
        component: EditMessageComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class WeddingRoutingModule { }

@NgModule({
  declarations: [WeddingComponent, MessagesComponent, EditMessageComponent, MsgTemplateComponent],
  imports: [
    CommonModule,
    WeddingRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    WeddingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialsInterceptor,
      multi: true
    }
  ],
  exports: [WeddingComponent]
})
export class WeddingModule { }
