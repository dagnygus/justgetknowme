import {  BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { OnDestroy, Directive } from '@angular/core';

export type DeepReadonly<T> = T extends Array<infer U1> ? ReadonlyArray<U1> : {
  readonly [Property in keyof T]: T[Property] extends number | string | boolean ?
                                  T[Property] :
                                  T[Property] extends Array<infer U2> ? ReadonlyArray<U2> :
                                  T[Property] extends ((...args: any[]) => any) ? T[Property] :
                                  DeepReadonly<T[Property]>
};

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class DnngStateManager<T extends object> implements OnDestroy {

  protected writableState: T | null = null;

  private __dn_subscriptions__: Subscription[] = [];
  private __dn_state_pending__ = false;
  private __dn_state_pending$__ = new BehaviorSubject<boolean>(false);
  private __dn_state_subscription__: Subscription | null = null;
  private __dn_failed_to_initial_state__: boolean | null = null;
  private __dn_failed_to_initial_state$__ = new BehaviorSubject<boolean | null>(null);
  private __dn_state_initialized__ = false;
  private __dn_state_initialized$__ = new BehaviorSubject<boolean>(false);
  private __dn_state_manager_initialized__ = false;

  private __dn_on_changed__ = new Subject<void>();

  get onChanged(): Observable<void> {
    return this.__dn_on_changed__.asObservable();
  }

  get stateInitialized(): boolean {
    return this.__dn_state_initialized__;
  }
  get stateInitialized$(): Observable<boolean> {
    return this.__dn_state_initialized$__;
  }

  get statePending(): boolean {
    return this.__dn_state_pending__;
  }
  get statePending$(): Observable<boolean> {
    return this.__dn_state_pending$__;
  }

  get failedToInitialState(): boolean | null {
    return this.__dn_failed_to_initial_state__;
  }
  get failedToInitialState$(): Observable<boolean | null> {
    return this.__dn_failed_to_initial_state$__;
  }

  get state(): DeepReadonly<T> | null {

    if (this.__dn_state_pending__) {
      throw new Error('Cannot read state if state manager is in pending mode!!!');
    }

    if (this.__dn_failed_to_initial_state__) {
      throw new Error('Cannot read state when state manager failed to load state!!!');
    }

    if (!this.__dn_state_initialized__) {
      throw new Error('Cannot read state if the state is not initialized');
    }

    return this.writableState as any;
  }

  constructor() {
    Object.defineProperty(this, '__dn_subscriptions__', {
      value: this.__dn_subscriptions__,
      enumerable: false
    });
    Object.defineProperty(this, '__dn_state_pending__', {
      value: this.__dn_state_pending__,
      enumerable: false,
      writable: true,
    });
    Object.defineProperty(this, '__dn_state_pending$__', {
      value: this.__dn_state_pending$__,
      enumerable: false,
    });
    Object.defineProperty(this, '__dn_state_subscription__', {
      value: this.__dn_state_subscription__,
      enumerable: false,
      writable: true,
    });
    Object.defineProperty(this, '__dn_on_changed__', {
      value: this.__dn_on_changed__,
      enumerable: false,
    });
    Object.defineProperty(this, '__dn_failed_to_initial_state__', {
      value: this.__dn_failed_to_initial_state__,
      enumerable: false,
      writable: true,
    });
    Object.defineProperty(this, '__dn_failed_to_initial_state$__', {
      value: this.__dn_failed_to_initial_state$__,
      enumerable: false,
    });
    Object.defineProperty(this, '__dn_state_initialized__', {
      value: this.__dn_state_initialized__,
      enumerable: false,
      writable: true,
    });
    Object.defineProperty(this, '__dn_state_initialized$__', {
      value: this.__dn_state_initialized$__,
      enumerable: false,
    });
    Object.defineProperty(this, '__dn_state_manager_initialized__', {
      value: this.__dn_state_manager_initialized__,
      enumerable: false,
      writable: true,
    });
  }

  protected abstract provideInitialState(): T | Observable<T> | null;

  init(): void {
    if (!this.__dn_state_manager_initialized__) {
      this.__dn_state_manager_initialized__ = true;
      this.__dn_initial_state__();
    }
  }

  load(): void {
    if (this.__dn_state_initialized__) {
      this.__dn_state_initialized__ = false;
      this.__dn_state_initialized$__.next(false);
      this.notifyChanges();
    }
    this.__dn_state_manager_initialized__ = true;
    this.__dn_initial_state__();
  }

  ngOnDestroy(): void {
    this.__dn_state_subscription__?.unsubscribe();
    for (const subscription of this.__dn_subscriptions__) {
      (subscription as any).__dn_internal_unsubscribe__();
    }
  }

  protected notifyChanges(): void {
    this.__dn_on_changed__.next();
  }

  protected tryLoadStateAgain(): void {

    if (!this.__dn_failed_to_initial_state__) {
      throw new Error('You can try to load state again only if it fails before!!');
    }

    this.__dn_failed_to_initial_state__ = null;
    this.__dn_failed_to_initial_state$__.next(null);
    this.__dn_initial_state__();
  }

  protected cancelProvidingState(): void {
    if (this.__dn_state_subscription__ && this.__dn_state_pending__) {
      this.__dn_state_subscription__.unsubscribe();
    }
  }

  private __dn_initial_state__(): void {
    const initialState = this.provideInitialState();

    if (initialState instanceof Observable) {
      this.__dn_state_pending__ = true;
      this.__dn_state_pending$__.next(true);
      this.__dn_state_subscription__?.unsubscribe();
      this.__dn_state_subscription__ = initialState.subscribe({
        next: (providedSate) => {
          this.writableState = providedSate;
          this.__dn_state_pending__ = false;
          this.__dn_state_pending$__.next(this.statePending);
          this.__dn_state_initialized__ = true;
          this.__dn_state_initialized$__.next(this.stateInitialized);
          this.notifyChanges();
        },
        error: (error) => {
          this.__dn_state_pending__ = false;
          this.__dn_state_pending$__.next(this.statePending);
          this.__dn_failed_to_initial_state__ = true;
          this.__dn_failed_to_initial_state$__.next(this.failedToInitialState);
          this.notifyChanges();
          this.__dn_state_subscription__?.unsubscribe();
        },
        complete: () => {
          if (!this.writableState) {
            this.__dn_state_pending__ = false;
            this.__dn_state_pending$__.next(this.statePending);
            this.__dn_failed_to_initial_state__ = true;
            this.__dn_failed_to_initial_state$__.next(this.failedToInitialState);
            this.notifyChanges();
          }
          this.__dn_state_subscription__?.unsubscribe();
        }
      });
      return;
    } else {
      this.writableState = initialState;
      this.__dn_state_initialized__ = true;
      this.__dn_state_initialized$__.next(this.stateInitialized);
    }
  }
}

