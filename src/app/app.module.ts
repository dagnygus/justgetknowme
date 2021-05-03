import { ScrollAllawService } from './services/scroll-allaw.service';
import './rxjs-extension/rxjs-extension';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DynamicBackgroundComponent } from './components/dynamic-background/dynamic-background.component';
import { SlideOneComponent } from './components/slide-one/slide-one.component';
import { SlideTwoComponent } from './components/slide-two/slide-two.component';
import { SlideThreeComponent } from './components/slide-three/slide-three.component';
import { SlideFourComponent } from './components/slide-four/slide-four.component';
import { SlideFiveComponent } from './components/slide-five/slide-five.component';

@NgModule({
  declarations: [
    AppComponent,
    DynamicBackgroundComponent,
    SlideOneComponent,
    SlideTwoComponent,
    SlideThreeComponent,
    SlideFourComponent,
    SlideFiveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [
    ScrollAllawService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
