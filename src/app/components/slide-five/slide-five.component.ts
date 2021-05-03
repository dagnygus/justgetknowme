import { ScrollAllawService } from './../../services/scroll-allaw.service';
import { DnngComponentBase } from 'src/app/component-base/component-base';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID, ElementRef, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent, zip } from 'rxjs';
import { delay, map, tap, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-slide-five',
  templateUrl: './slide-five.component.html',
  styleUrls: ['./slide-five.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlideFiveComponent extends DnngComponentBase implements OnInit {

  constructor(cd: ChangeDetectorRef,
              ngz: NgZone,
              @Inject(PLATFORM_ID) private platformId: object,
              private elementRef: ElementRef<HTMLElement>,
              private renderer: Renderer2,
              private scrollAllawService: ScrollAllawService) {
    super(cd, ngz);
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.renderer.addClass(this.elementRef.nativeElement, 'show');
      }, 10);
    });

    this.onWheel();
    this.onTouchMove();
  }

  private onWheel(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        fromEvent(window, 'wheel').pipe(
          throttleTime(300),
        ).listen(this, () => {
          if (!this.scrollAllawService.allaw) { return; }
          this.renderer.removeClass(this.elementRef.nativeElement, 'show');
        });
      });
    }
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
