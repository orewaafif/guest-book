import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subject } from 'rxjs';
import { debounce, takeUntil } from 'rxjs/operators';
import { eleIsIn, IEleIsIn } from 'src/app/common/utils';

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

  ui: {
    name1: string
    name2: string
    date1: string
    date2?: string
    time: string
    header: string
  }

  unsub$ = new Subject<any>()

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute
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
      console.log('params: ', params)


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
