import { ScrollAllawService } from './../../services/scroll-allaw.service';
import { throttleTime } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { DnngComponentBase } from 'src/app/component-base/component-base';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, Renderer2, PLATFORM_ID } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-slide-two',
  templateUrl: './slide-two.component.html',
  styleUrls: ['./slide-two.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlideTwoComponent extends DnngComponentBase implements OnInit {

  constructor(cd: ChangeDetectorRef,
              ngz: NgZone,
              private elementRef: ElementRef<HTMLElement>,
              private renderer: Renderer2,
              @Inject(PLATFORM_ID) private platformId: object,
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
    let startPosition = 0;
    let endPosition = 0;
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        fromEvent(window, 'touchmove').pipe(
          throttleTime(100)
        ).listen(this, event => {
          const e = event as TouchEvent;
          if (!begin) {
            begin = true;
            startPosition = e.touches[0].clientY;
          } else {
            begin = false;
            endPosition = e.touches[e.touches.length - 1].clientY;
            if (Math.abs(startPosition - endPosition) > window.innerHeight / 5) {
              if (!this.scrollAllawService.allaw) { return; }
              this.renderer.removeClass(this.elementRef.nativeElement, 'show');
            }
          }
        });
      });
    }
  }
}
