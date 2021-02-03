import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subject } from 'rxjs';
import { debounce, takeUntil } from 'rxjs/operators';
import { eleIsIn } from 'src/app/common/utils';
import { WeddingUIService } from '../wedding-ui.service';
import { IMessage, WeddingService } from '../wedding.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.sass']
})
export class MessagesComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('msgsEle') msgListEle: ElementRef
  @ViewChildren('msgEle') msgEle: QueryList<ElementRef>

  /** Dom element */
  firstMsgEle: ElementRef

  _scrollUnlisten: () => void

  onListScroll$: Subject<any> = new Subject()
  
  unsub$: Subject<any> = new Subject()
  
  messages: IMessage[]

  ownMsg: IMessage

  checkMsgInterval: any

  get _hasWrote(): boolean {
    return !!this.ownMsg
  }

  get code(): string {
    return this.wedUIServ.code
  }

  constructor(
    private wedService: WeddingService,
    private wedUIServ: WeddingUIService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    // console.log('code: ', this.wedUIServ.code)

    const refreshMsgs = async () => {
      this.messages = await this.wedService.allMessages(this.code ? `?code=${this.code}` : null).toPromise()
    }

    this.checkMsgInterval = setInterval( async () => {
      await refreshMsgs()
    }, 30 * 1000)
    await refreshMsgs()

    this.ownMsg = await this.wedService.getMessage(this.code ? `?code=${this.code}` : null).toPromise()

    this.onListScroll$.pipe(
      takeUntil(this.unsub$.asObservable()),
      debounce((ev) => interval(100))
    ).subscribe(() => this.scrollEndEvt())
  }

  async editCreateMessage() {
    await this.router.navigate([`message/${ this._hasWrote ? 'edit' : 'create' }`], { relativeTo: this.route})
  }

  scrollEndEvt() {
    console.log('scrollEndEvt')
    console.log('eleIsShown?: ', eleIsIn(this.firstMsgEle.nativeElement, this.msgListEle.nativeElement))
  }

  ngAfterViewInit(): void {
    // this._scrollUnlisten = this.renderer.listen(this.msgListEle.nativeElement, 'scroll', (event) => {
    //   this.onListScroll$.next()
    // })
    // let count = 0
    // const interval = setInterval(() => {
    //   if (this.messages?.length) {
    //     this.msgEle.forEach((eleRef, idx) => {
    //       if (idx === 0) {
    //         this.firstMsgEle = eleRef
    //         clearInterval(interval)
    //       }
    //     })
    //   }
    //   else {
    //     count += 1
    //     if (count === 100) {
    //       clearInterval(interval)
    //     }
    //   }
    //   console.log('count: ', count)
    // }, 150)
  }

  ngOnDestroy(): void {
    if (this._scrollUnlisten) this._scrollUnlisten()
    clearInterval(this.checkMsgInterval)
  }
}
