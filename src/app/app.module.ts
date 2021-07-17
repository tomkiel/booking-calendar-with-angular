import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewCalendarComponent } from './components/view-calendar/view-calendar.component';
import { PrimeCalendarComponent } from './components/prime-calendar/prime-calendar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { DragToSelectModule } from 'ngx-drag-to-select';

@NgModule({
  declarations: [
    AppComponent,
    ViewCalendarComponent,
    PrimeCalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    DragToSelectModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
