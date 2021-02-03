import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subject } from 'rxjs';
import { debounce, takeUntil } from 'rxjs/operators';
import { eleIsIn, IEleIsIn } from 'src/app/common/utils';
import { WeddingUIService } from './wedding-ui.service';

@Component({
  selector: 'app-wedding',
  templateUrl: './wedding.component.html',
  styleUrls: ['./wedding.component.sass']
})
export class WeddingComponent implements OnInit, AfterViewInit {

  @ViewChild('main') mainEle: ElementRef
  @ViewChild('msg') msgEle: ElementRef
  @ViewChild('scrolling') scrollEle: ElementRef

  panUpEvt$ = new Subject<any>()
  panDownEvt$ = new Subject<any>()

  isScrolling

  _scrollUnlisten: () => void
  /** Emits scroll event */
  onCompScroll$ = new Subject<any>()

  scrollInterval

  isMain: boolean = true

  ui: IGuestBookCover

  code: string = null

  unsub$ = new Subject<any>()

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private wedUIServ: WeddingUIService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.onCompScroll$.pipe(
      takeUntil(this.unsub$.asObservable()),
      debounce(() => interval(50))
    ).subscribe((scrollEvt) => {
      const THRESHOLD = 10
      let intersectPercent

      if (this.isMain === true) {
        const { intersectPercent: msgIntersect } = eleIsIn(this.msgEle.nativeElement, null, true) as IEleIsIn
        intersectPercent = msgIntersect

        if (msgIntersect > THRESHOLD)
          this.scrollTo('msg')
        else
          this.scrollTo('main')
      }
      else if (this.isMain === false) {
        const { intersectPercent: mainIntersect } = eleIsIn(this.mainEle.nativeElement, null, true) as IEleIsIn
        intersectPercent = mainIntersect
        if (mainIntersect > THRESHOLD)
          this.scrollTo('main')
        else
          this.scrollTo('msg')
      }
      else {
        console.log('page is scrolling')
      }

      // console.log('WandaVision: ', intersectPercent)
    })

    this.route.params.pipe(takeUntil(this.unsub$.asObservable())).subscribe(params => {
      const { code } = params
      this.wedUIServ.code = code

      if (!this.wedUIServ.code) {
      }
      else if (this.wedUIServ.code !== 'aiman-sukainah') {
        this.router.navigate(['./aiman-sukainah'])
      }
      else {
        this.ui = AimanSukainah
      }
    })
  }

  ngAfterViewInit(): void {
    this._scrollUnlisten = this.renderer.listen(this.scrollEle.nativeElement, 'scroll', (event) => {
      this.onCompScroll$.next(event)

      const msgIsIn = eleIsIn(this.msgEle.nativeElement, this.scrollEle.nativeElement, true) as IEleIsIn
      const mainIsIn = eleIsIn(this.mainEle.nativeElement, this.scrollEle.nativeElement, true) as IEleIsIn

      console.log('msg: ', msgIsIn.intersectPercent)
      console.log('main: ', mainIsIn.intersectPercent)

      if (msgIsIn.isIn) {
        this.isMain = false
      }
      else if (mainIsIn.isIn)
        this.isMain = true
      // else
      //   this.isMain = undefined
    })
  }

  scrollTo(page: 'msg' | 'main') {
    const opt = { behavior: "smooth", block: "end", inline: "nearest" }
    if (page === 'msg') {
      // this.msgEle.nativeElement.scrollIntoView(opt)
      const offsetTop = this.msgEle.nativeElement.offsetTop
      this.scrollEle.nativeElement.scrollTop = offsetTop
    }
    else if (page === 'main') {
      const offsetTop = this.mainEle.nativeElement.offsetTop
      this.scrollEle.nativeElement.scrollTop = offsetTop
      // this.mainEle.nativeElement.scrollIntoView(opt)
    }
  }
}

interface IGuestBookCover {
  header: string
  name1: string
  name2: string
  dateM: string
  dateH: string
  time: string
}
const AimanSukainah: IGuestBookCover = {
  header: 'Solemnization of',
  name1: 'Aiman Al-Hindwan',
  name2: 'Sukainah Al-Munawar',
  dateM: '5 February 2021',
  dateH: '23 Jumadil Akhir 1442H',
  time: '2:30PM'
}
