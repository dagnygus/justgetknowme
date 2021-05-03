import { SlideFiveComponent } from './components/slide-five/slide-five.component';
import { SlideFourComponent } from './components/slide-four/slide-four.component';
import { SlideThreeComponent } from './components/slide-three/slide-three.component';
import { SlideTwoComponent } from './components/slide-two/slide-two.component';
import { SlideOneComponent } from './components/slide-one/slide-one.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: SlideOneComponent },
  { path: 'slide-two', component: SlideTwoComponent },
  { path: 'slide-three', component: SlideThreeComponent },
  { path: 'slide-four', component: SlideFourComponent },
  { path: 'slide-five', component: SlideFiveComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
