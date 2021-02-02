import { Component, Input, OnInit } from '@angular/core';
import { IMessage } from '../wedding.service';

@Component({
  selector: 'app-msg-template',
  templateUrl: './msg-template.component.html',
  styleUrls: ['./msg-template.component.sass']
})
export class MsgTemplateComponent implements OnInit {

  default: IMessage = {
    sender: 'Your name goes here',
    message: 'Your message goes here'
  }

  @Input('msg') msg: IMessage

  constructor() { }

  ngOnInit(): void {
  }

}
