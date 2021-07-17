import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectContainerComponent } from 'ngx-drag-to-select';
import { DateServiceService } from 'src/app/services/date-service.service';
import { ScrollServiceService } from 'src/app/services/scroll-service.service';

export interface PeriodicElement {
  name: string;
  day: number;
}

export interface Months {
  name: string;
  numberDays: number;
  year: number;
  count: number;
}

export interface Property {
  name: string;
  image: string;
  id: number;
  weekdaysPrice: number,
  weekendPrice: number
}

export interface Customer {
  name: string,
  id: number
}

@Component({
  selector: 'app-prime-calendar',
  templateUrl: './prime-calendar.component.html',
  styleUrls: ['./prime-calendar.component.scss']
})
export class PrimeCalendarComponent implements OnInit {

  @ViewChild(SelectContainerComponent) dtsContainer!: SelectContainerComponent;

  public displayedColumns: string[] = ['day'];
  public dataSource: PeriodicElement[] = [];
  public currentDate = new Date();
  public numberOfDaysOnMonth: number = 0;
  public months: Months[] = [];
  public properties: Property[] = [];
  public selectedDaysByDrag: any;
  public selectedDates: string = '';
  public totalPriceSelectedDays: number = 0;

  public customers: Customer[] = [];
  public viewRightSidebar = false;

  public today = Number(String(this.currentDate.getDate()).padStart(2, '0'));

  constructor(
    private scrollService: ScrollServiceService,
    private dateServiceService: DateServiceService
  ) { }

  async ngOnInit(): Promise<void> {
    this.scrollService.determineScroll('calendar-content');
    this.customers = [
      {
        name: "BRUNO GABRIEL FREITAS JUSTINO",
        id: 1
      },
      {
        name: "SAMANTA PINTO COELHO LINHARES",
        id: 2
      }
    ];
    this.properties = [
      {
        name: "Hotel das vinhedas Excume - SF",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
        id: 1,
        weekdaysPrice: 78.98,
        weekendPrice: 60.90
      },
      {
        name: "Hotel das vinhedas Excume - NY",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
        id: 2,
        weekdaysPrice: 75.00,
        weekendPrice: 100
      },
      {
        name: "Hotel das hortas - SF",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
        id: 3,
        weekdaysPrice: 45.50,
        weekendPrice: 100.25
      }
    ]
    await this.determineNumberOfDaysCurrentDate();
  }

  async determineNumberOfDaysCurrentDate(): Promise<any> {
    this.numberOfDaysOnMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0).getDate();
    await this.createDataSourceByNumberOfDays(this.numberOfDaysOnMonth);
    this.months.push(
      {
        name: 'July',
        numberDays: this.numberOfDaysOnMonth,
        year: 2021,
        count: 7
      })
  }

  async createDataSourceByNumberOfDays(numberOfDays: number): Promise<any> {
    this.dataSource = [];
    for (let i = 1; i <= numberOfDays; i++) {
      const dayOnCalendar: PeriodicElement = {
        day: i,
        name: 'Day ' + i
      }
      this.dataSource.push(dayOnCalendar);
    }
  }

  async selectDaysInCalendar(items: Array<any>): Promise<void> {
    if (items[0] !== undefined) {
      let totalPrice: number = 0;
      const orderedDays = items.sort(function(a, b) {
        return a.day - b.day;
      });

      this.selectedDates = items[0].month + '/' + items[0].day + '/' + items[0].year + ' - ' + items[items.length - 1].month + '/' + items[items.length - 1].day + '/' + items[items.length - 1].year

      const firstDaySelectedName: string = "year_" + items[0].year + "_month_" + items[0].month + "_day_" + items[0].day + "_property_" + items[0].property.id;
      const dayElement: HTMLElement = document.getElementById(firstDaySelectedName)!;

      orderedDays.map((item: any) => {
        if (this.checkIsWeekendDay(item.day, item.month, item.year)) {
          totalPrice = totalPrice + item.property.weekdaysPrice;
        } else {
          totalPrice = totalPrice + item.property.weekendPrice;
        }
      });
      this.totalPriceSelectedDays = totalPrice;

      this.viewRightSidebar = true;
    }
  }

  onScroll(event: any): void {
    this.dtsContainer.update();
  }

  checkIsWeekendDay(day: number, month: number, year: number): Boolean {
    return this.dateServiceService.checkDayOfWeek(day, month, year);
  }

  getDayName(day: number, month: number, year: number): string {
    return this.dateServiceService.getNameOfDay(day, month, year);
  }

}
