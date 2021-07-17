import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateServiceService {

  constructor() { }

  checkDayOfWeek(day: number, month: number, year: number): Boolean {
    const date: Date = new Date(year, month, day);
    return date.getDay() == 0 || date.getDay() == 6 ? true : false;
  }

  getNameOfDay(day: number, month: number, year: number): string {
    const days: Array<string> = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const date: Date = new Date(year, month, day);
    return days[date.getDay()];
  }
}
