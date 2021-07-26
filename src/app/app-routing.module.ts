import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrimeCalendarComponent } from './components/prime-calendar/prime-calendar.component';

const routes: Routes = [
  {
    path: '', component: PrimeCalendarComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
