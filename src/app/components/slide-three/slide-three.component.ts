import { ScrollAllawService } from './../../services/scroll-allaw.service';
import { DnngComponentBase } from 'src/app/component-base/component-base';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, Inject, PLATFORM_ID, ElementRef, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent, zip } from 'rxjs';
import { delay, map, tap, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-slide-three',
  templateUrl: './slide-three.component.html',
  styleUrls: ['./slide-three.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlideThreeComponent extends DnngComponentBase implements OnInit {

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
    let beginPosition = 0;
    let endPosition = 0;
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        fromEvent(window, 'touchstart').listen(this, (event) => {
          beginPosition = (event as TouchEvent).touches[0].clientY;
        });
        fromEvent(window, 'touchend').listen(this, (event) => {
          endPosition = (event as TouchEvent).touches[0].clientY;
          if (Math.abs(beginPosition - endPosition) > window.innerHeight / 5
              && this.scrollAllawService.allaw) {
            this.renderer.removeClass(this.elementRef.nativeElement, 'show');
          }
        });
      });
    }
  }

}
