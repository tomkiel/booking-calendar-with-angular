import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectContainerComponent } from 'ngx-drag-to-select';
import { PropertyInterface } from 'src/app/interfaces/property-interface';
import { DateServiceService } from 'src/app/services/date-service.service';
import { PropertyService } from 'src/app/services/property.service';
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
  public properties: PropertyInterface[] = [];
  public selectedDaysByDrag: any;
  public selectedDates: string = '';
  public totalPriceSelectedDays: number = 0;
  public numberOfNights: number = 0;

  public customers: Customer[] = [];
  public viewRightSidebar = false;

  public today = Number(String(this.currentDate.getDate()).padStart(2, '0'));

  constructor(
    private scrollService: ScrollServiceService,
    private dateServiceService: DateServiceService,
    private propertyService: PropertyService
  ) { }

  async ngOnInit(): Promise<void> {
    this.getPropertiesDataFromServe();
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
    await this.determineNumberOfDaysCurrentDate();
  }

  async getPropertiesDataFromServe(): Promise<void> {
    this.properties = await this.propertyService.get();
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

      this.numberOfNights = orderedDays.length;
      
      orderedDays.map((item: any) => {
        if (this.checkIsWeekendDay(item.day, item.month, item.year)) {
          totalPrice = totalPrice + item.property.weekdaysPrice;
        } else {
          totalPrice = totalPrice + item.property.weekendPrice;
        }
      });
      this.totalPriceSelectedDays = totalPrice;

      this.viewRightSidebar = true;
    } else {
      this.totalPriceSelectedDays = 0;
      this.selectedDates = '';
      this.viewRightSidebar = false;
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
