import { ScrollAllawService } from './../../services/scroll-allaw.service';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy,
         ChangeDetectorRef,
         Component,
         ElementRef,
         NgZone,
         Renderer2,
         ViewChild,
         Inject,
         PLATFORM_ID,
         AfterViewInit,
         OnInit} from '@angular/core';
import { fromEvent, zip } from 'rxjs';
import { delay, map, tap, throttleTime } from 'rxjs/operators';
import { DnngComponentBase } from 'src/app/component-base/component-base';

@Component({
  selector: 'app-slide-one',
  templateUrl: './slide-one.component.html',
  styleUrls: ['./slide-one.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlideOneComponent extends DnngComponentBase implements AfterViewInit, OnInit {
  @ViewChild('greeterOne') private greeterOneRef!: ElementRef<HTMLElement>;
  @ViewChild('greeterTwo') private greeterTwoRef!: ElementRef<HTMLElement>;
  @ViewChild('scrollDownImage') private scrollDownImageRef!: ElementRef<HTMLElement>;

  constructor(cd: ChangeDetectorRef,
              ngz: NgZone,
              private rendrer: Renderer2,
              @Inject(PLATFORM_ID) private platformId: object,
              private elementRef: ElementRef<HTMLElement>,
              private scrollAllawService: ScrollAllawService,
              private renderer: Renderer2) {
    super(cd, ngz);
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // tslint:disable-next-line: no-non-null-assertion
      const firstText = this.greeterOneRef.nativeElement.textContent!;
      // tslint:disable-next-line: no-non-null-assertion
      const secondText = this.greeterTwoRef.nativeElement.textContent!;
      this.greeterOneRef.nativeElement.textContent = null;
      this.greeterTwoRef.nativeElement.textContent = null;

      const textElements: HTMLElement[] = [];
      // tslint:disable-next-line: no-non-null-assertion
      const senteceCountOne = firstText.split(' ').length;
      // tslint:disable-next-line: no-non-null-assertion
      const senteceCountTwo = secondText.split(' ').length;
      const arrOfSenteceOneBlocks: HTMLElement[] = [];
      const arrOfSenteceTwoBlocks: HTMLElement[] = [];


      for (let i = 0; i < senteceCountOne; i++) {
        const div = this.rendrer.createElement('div') as HTMLElement;
        div.style.display = 'inline-block';
        arrOfSenteceOneBlocks.push(div);
      }
      for (let j = 0; j < senteceCountTwo; j++) {
        const div = this.rendrer.createElement('div') as HTMLElement;
        div.style.display = 'inline-block';
        arrOfSenteceTwoBlocks.push(div);
      }

      let oneIndex = 0;
      for (const letter of firstText) {
        const span = this.rendrer.createElement('span') as HTMLElement;
        span.textContent = letter;
        span.classList.add('slide-one__letter');
        if (letter !== ' ') {
          span.style.display = 'inline-block';
          arrOfSenteceOneBlocks[oneIndex].appendChild(span);
        }
        else {
          this.greeterOneRef.nativeElement.appendChild(arrOfSenteceOneBlocks[oneIndex]);
          this.greeterOneRef.nativeElement.appendChild(span);
          oneIndex++;
        }
        textElements.push(span);
      }
      this.greeterOneRef.nativeElement.appendChild(arrOfSenteceOneBlocks[senteceCountOne - 1]);

      let twoIndex = 0;
      for (const letter of secondText) {
        const span = this.rendrer.createElement('span') as HTMLElement;
        span.textContent = letter;
        span.classList.add('slide-one__letter');
        if (letter !== ' ') {
          span.style.display = 'inline-block';
          arrOfSenteceTwoBlocks[twoIndex].appendChild(span);
        } else {
          this.greeterTwoRef.nativeElement.appendChild(arrOfSenteceTwoBlocks[twoIndex]);
          this.greeterTwoRef.nativeElement.appendChild(span);
          twoIndex++;
        }
        textElements.push(span);
      }

      this.greeterTwoRef.nativeElement.appendChild(arrOfSenteceTwoBlocks[senteceCountTwo - 1]);

      this.ngZone.runOutsideAngular(() => {

        setTimeout(() => {
          this.rendrer.addClass(this.elementRef.nativeElement, 'show');
        }, 100);

        setTimeout(() => {
          textElements.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add('slide-one__letter-entry');
            }, index * 80);
          });
        }, 400);

        setTimeout(() => {
          this.rendrer.addClass(this.scrollDownImageRef.nativeElement, 'show');
        }, 2000);
      });
    }
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'wheel').pipe(
        throttleTime(300)
      ).listen(this, (event) => {
        if (!this.scrollAllawService.allaw) { return; }
        if ((event as WheelEvent).deltaY > 0) {
          this.rendrer.removeClass(this.elementRef.nativeElement, 'show');
        }
      });
    });
    this.onTouchMove();
  }

  private onTouchMove(): void {
    let begin = false;
    let ends = false;
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        fromEvent(window, 'touchstart').pipe(
          tap(() => {
            begin = true;
            ends = false;
          }),
          delay(100)
        ).listen(this, () => {
          begin = false;
          ends = true;
        });
      });

      zip(
        fromEvent(window, 'touchstart'),
        fromEvent(window, 'touchend')
      ).pipe(
        map(([event1, event2]) => {
          return {
            beginPosition: (event1 as TouchEvent).touches[0].clientY,
            endPosition: (event2 as TouchEvent).touches[(event2 as TouchEvent).touches.length - 1].clientY
          };
        })
      ).listen(this, ({ beginPosition, endPosition }) => {
        if (Math.abs(beginPosition - endPosition) > window.innerHeight / 5 &&
            this.scrollAllawService.allaw) {
          this.renderer.removeClass(this.elementRef.nativeElement, 'show');
        }
      });
    }
  }
}
