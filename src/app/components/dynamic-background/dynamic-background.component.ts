import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { DnngComponentBase } from 'src/app/component-base/component-base';
import { init, dispose } from './dynamic-background.three';

@Component({
  selector: 'app-dynamic-background',
  templateUrl: './dynamic-background.component.html',
  styleUrls: ['./dynamic-background.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicBackgroundComponent extends DnngComponentBase implements OnInit {

  constructor(cd: ChangeDetectorRef,
              ngz: NgZone,
              private _elementRef: ElementRef<HTMLElement>,
              @Inject(PLATFORM_ID) private platformId: object) {
    super(cd, ngz);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        init(this._elementRef.nativeElement);
      });
    }
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    super.ngOnDestroy();
    dispose();
  }
}
