import { Component, OnInit } from '@angular/core';
// import * as $ from 'jquery';
declare const jQuery: any;

@Component({
  selector: 'app-view-calendar',
  templateUrl: './view-calendar.component.html',
  styleUrls: ['./view-calendar.component.scss']
})
export class ViewCalendarComponent implements OnInit {
  private currentDate = new Date();

  constructor() { }

  ngOnInit(): void {
    const clendarComponent = jQuery('#calendar-selector').Timeline(
      {
        type: "bar",
        startDatetime: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1),
        scale: "day",
        minGridSize: 48,
        rows: 6,
        headline: {
          display: true,
          title: "<span></span>",
          range: true,
          local: "en-US",
          format: {
            timeZone: "UTC",
            hour12: false,
          },
        },
        ruler: {
          top: {
            lines: ["year", "month", "day"],
            format: {
              timeZone: "UTC",
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          },
          bottom: {
            lines: ["day"],
            format: {
              timeZone: "UTC",
              day: "numeric",
            },
          },
        },
        hideScrollbar: true,
        zoom: true,
      }
    );

  }

}
