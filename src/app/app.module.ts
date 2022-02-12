import { NgModule } from '@angular/core';
import {  ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CalendarContainerComponent } from './calendar-container/calendar-container.component';
import { CalendarDayComponent } from './calendar-container/calendar-day/calendar-day.component';
import { CalendarActionsComponent } from './calendar-actions/calendar-actions.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CalendarContainerComponent,
    CalendarDayComponent,
    CalendarActionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
