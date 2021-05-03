import { Observable, PartialObserver, Subscription } from 'rxjs';
import { DnngComponentBase } from '../component-base/component-base';
import { DnngStateManager } from '../state-manager-base/state-manager-base';



(Observable.prototype as any).listen = function(this: Observable<any>,
                                                context: DnngComponentBase | DnngStateManager<any>,
                                                observer: PartialObserver<any> |
                                                ((data: any) => void)): Subscription   {

const subscription = this.subscribe(observer as PartialObserver<any>);

((context as any).__dn_subscriptions__ as Array<Subscription>).push(subscription);

(subscription as any).__dn_internal_unsubscribe__ = subscription.unsubscribe;

subscription.unsubscribe = function(this: Subscription): void {
    const index = ((context as any).__dn_subscriptions__ as Array<Subscription>).indexOf(this);

    if (index >= 0) {
      ((context as any).__dn_subscriptions__ as Array<Subscription>).splice(index, 1);
      (this as any).__dn_internal_unsubscribe__();
    }

  };
return subscription;
};

declare module 'rxjs' {
  interface Observable<T> {
    listen(listiner: DnngComponentBase | DnngStateManager<any>, observer: PartialObserver<T>): Subscription;
    // tslint:disable-next-line: unified-signatures
    listen(listiner: DnngComponentBase | DnngStateManager<any>, observer: (value: T) => void): Subscription;
  }
}
