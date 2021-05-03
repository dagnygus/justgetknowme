import { ScrollAllawService } from './services/scroll-allaw.service';
import { isPlatformBrowser } from '@angular/common';
import { DnngComponentBase } from 'src/app/component-base/component-base';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { delay, filter, map, tap, throttleTime } from 'rxjs/operators';
import { animate, query, style, transition, trigger } from '@angular/animations';
import { fromEvent, zip } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends DnngComponentBase implements OnInit {

  private paths = [
    '/',
    '/slide-two',
    '/slide-three',
    '/slide-four',
    '/slide-five'
  ];

  private currentPath = 0;

  constructor(cd: ChangeDetectorRef,
              ngz: NgZone,
              private _router: Router,
              @Inject(PLATFORM_ID) private _platformId: object,
              private scrollAllawService: ScrollAllawService) {
    super(cd, ngz);
  }

  ngOnInit(): void {
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).listen(this, () => {
      this.markForCheckLocaly();
      const index = this.paths.indexOf(this._router.url);
      if (this.currentPath !== index) {
        this.currentPath = index;
      }
    });
    this.onWheel();
    this.onTouchMove();
  }

  private onWheel(): void {
    if (isPlatformBrowser(this._platformId)) {
      this.ngZone.runOutsideAngular(() => {
        fromEvent(window, 'wheel').pipe(
          tap((event) => {
            if ((event as WheelEvent).deltaY > 0) {
              if (this.currentPath === this.paths.length - 1) {
                this.scrollAllawService.allaw = false;
              } else {
                this.scrollAllawService.allaw = true;
              }
            } else {
              if (this.currentPath === 0) {
                this.scrollAllawService.allaw = false;
              } else {
                this.scrollAllawService.allaw = true;
              }
            }
          }),
          delay(300),
          throttleTime(300)
        ).listen(this, (event) => {
          this.ngZone.run(() => {
            if ((event as WheelEvent).deltaY > 0) {
              if (this.currentPath === this.paths.length - 1) { return; }
              this.currentPath++;
            } else {
              if (this.currentPath === 0) { return; }
              this.currentPath--;
            }
            this._router.navigate([this.paths[this.currentPath]]);
          });
        });
      });
    }
  }

  private onTouchMove(): void {

    let beginPosition = 0;
    let endPosition = 0;

    if (isPlatformBrowser(this._platformId)) {
      this.ngZone.runOutsideAngular(() => {
        fromEvent(window, 'touchstart').listen(this, (event) => {
          beginPosition = (event as TouchEvent).touches[0].pageY;
        });
        fromEvent(window, 'touchend').pipe(
          // tap((event) => {
          //   endPosition = (event as TouchEvent).touches[0].pageY;
          //   if (Math.abs(beginPosition - endPosition) > window.innerHeight / 5) {
          //     if (beginPosition - endPosition > 0) {
          //       if (this.currentPath === this.paths.length - 1) {
          //         this.scrollAllawService.allaw = false;
          //       } else {
          //         this.scrollAllawService.allaw = true;
          //       }
          //     } else {
          //       if (this.currentPath === 0) {
          //         this.scrollAllawService.allaw = false;
          //       } else {
          //         this.scrollAllawService.allaw = true;
          //       }
          //     }
          //   }
          // }),
        ).listen(this, (event) => {
          endPosition = (event as TouchEvent).touches[0].pageY;
          alert('value is ' + (beginPosition - endPosition));
          // if (Math.abs(beginPosition - endPosition) > window.innerHeight / 5) {
          //   if (beginPosition - endPosition > 0) {
          //     if (this.currentPath !== this.paths.length - 1) {
          //       this.currentPath++;
          //     }
          //   } else {
          //     if (this.currentPath !== 0) {
          //       this.currentPath--;
          //     }
          //   }
          //   this.ngZone.run(() => {
          //     this._router.navigate([this.paths[this.currentPath]]);
          //   });
          // }
        });
      });
    }
  }
}
