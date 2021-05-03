import { AfterViewChecked, ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

@Component({
  template: ''
})
// tslint:disable-next-line: component-class-suffix
export abstract class DnngComponentBase implements AfterViewChecked, OnChanges, OnDestroy {
  private __dn_async_cd_subscription__: Subscription | null = null;
  private __dn_marked_to_check_localy__ = false;
  private __dn_subscriptions__: Subscription[] = [];

  @Input() set listenTo(value: Observable<any> | Observable<any>[]) {
    if (value instanceof Array) {
      value.forEach((item) => {
        this.__dn_subscriptions__.push(item.subscribe(() => {
          this.markForCheckLocaly();
        }));
      });
    } else {
      this.__dn_subscriptions__.push(value.subscribe(() => {
        this.markForCheckLocaly();
      }));
    }
  }

  constructor(protected changeDetectorRef: ChangeDetectorRef,
              protected ngZone: NgZone) { }

  markForCheckLocaly(): void {
    if (!this.__dn_marked_to_check_localy__) {
      this.__dn_marked_to_check_localy__ = true;
      this.__dn_async_cd_subscription__ = this.ngZone.onMicrotaskEmpty.subscribe(() => {
        this.changeDetectorRef.detectChanges();
        this.cancelChangeDetecton();
      });
    }
  }

  protected cancelChangeDetecton(): void {
    if (this.__dn_marked_to_check_localy__) {
      this.__dn_marked_to_check_localy__ = false;
      this.__dn_async_cd_subscription__?.unsubscribe();
      this.__dn_async_cd_subscription__ = null;
    }
  }

  ngOnChanges(): void {
    this.changeDetectorRef.reattach();
    this.cancelChangeDetecton();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detach();
  }

  ngOnDestroy(): void {
    this.__dn_async_cd_subscription__?.unsubscribe();
    for (const subscription of this.__dn_subscriptions__) {
      if ((subscription as any).__dn_internal_unsubscribe__) {
        (subscription as any).__dn_internal_unsubscribe__();
      } else {
        subscription.unsubscribe();
      }
    }
  }
}

