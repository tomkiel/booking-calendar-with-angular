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

  getNameOfMonth(month: number, year: number): string {
    const months: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date: Date = new Date(year, month, 1);
    return months[date.getMonth()];
  }

  getNumberOfDaysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }
}
