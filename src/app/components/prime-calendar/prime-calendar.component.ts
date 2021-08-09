import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectContainerComponent } from 'ngx-drag-to-select';
import { CustomerInterface } from 'src/app/interfaces/customer-interface';
import { PropertyInterface } from 'src/app/interfaces/property-interface';
import { CustomerService } from 'src/app/services/customer.service';
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
  public propertiesToRenderHTML: PropertyInterface[] = [];
  public selectedDaysByDrag: any;
  public selectedDates: string = '';
  public totalPriceSelectedDays: number = 0;
  public numberOfNights: number = 0;

  public customers: CustomerInterface[] = [];
  public viewRightSidebar = false;
  public viewFilterOptions: Boolean = false;
  public searchContent: string = '';

  public filterOptions = {
    address: '',
    guestName: '',
    guestEmail: '',
    numberOfRooms: 1,
    isResort: false,
    isPool: false,
  };

  public today = Number(String(this.currentDate.getDate()).padStart(2, '0'));

  constructor(
    private scrollService: ScrollServiceService,
    private dateServiceService: DateServiceService,
    private propertyService: PropertyService,
    private customerService: CustomerService
  ) { }

  async ngOnInit(): Promise<void> {
    this.getPropertiesDataFromServe();
    this.getCustomersDataFromServe();
    this.scrollService.determineScroll('calendar-content');
    this.customers = [];
    await this.determineNumberOfDaysCurrentDate();
  }

  async getPropertiesDataFromServe(): Promise<void> {
    const properties: PropertyInterface[] = await this.propertyService.get();
    this.properties = properties;
    this.propertiesToRenderHTML = properties;
  }

  async getCustomersDataFromServe(): Promise<void> {
    this.customers = await this.customerService.get();
  }

  async determineNumberOfDaysCurrentDate(): Promise<any> {
    this.numberOfDaysOnMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0).getDate();
    console.log(this.currentDate);

    await this.createDataSourceByNumberOfDays(this.numberOfDaysOnMonth);

    this.months.push(
      {
        name: this.dateServiceService.getNameOfMonth(this.currentDate.getMonth(), this.currentDate.getFullYear()),
        numberDays: this.numberOfDaysOnMonth,
        year: this.currentDate.getFullYear(),
        count: this.currentDate.getMonth()
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
      const orderedDays = items.sort(function (a, b) {
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

  filterPropertyFromName(event: any): void {
    const propertiesFiltered: PropertyInterface[] = this.properties.filter((property: PropertyInterface) => {
      return property.name.includes(event.target.value);
    });
    this.propertiesToRenderHTML = propertiesFiltered;
  }

  applyFilters(): void {
    let filteredProperties: PropertyInterface[] = this.propertiesToRenderHTML;
    if (this.filterOptions.address !== '') {
      filteredProperties = filteredProperties.filter((property: PropertyInterface) => {
        return property.address.includes(this.filterOptions.address);
      });
    };
    if (this.filterOptions.guestName !== '') {
      filteredProperties = filteredProperties.filter((property: PropertyInterface) => {
        return property.guestName.includes(this.filterOptions.guestName);
      });
    };
    if (this.filterOptions.guestEmail !== '') {
      filteredProperties = filteredProperties.filter((property: PropertyInterface) => {
        return property.guestEmail === this.filterOptions.guestEmail;
      });
    };

    if (this.filterOptions.numberOfRooms > 0) {
      filteredProperties = filteredProperties.filter((property: PropertyInterface) => {
        return property.numberOfRooms >= this.filterOptions.numberOfRooms;
      });
    };

    if (this.filterOptions.isResort) {
      filteredProperties = filteredProperties.filter((property: PropertyInterface) => {
        return property.isResort;
      });
    };

    if (this.filterOptions.isPool) {
      filteredProperties = filteredProperties.filter((property: PropertyInterface) => {
        return property.isPool;
      });
    };
    this.propertiesToRenderHTML = filteredProperties;
  }

  clearFilters(): void {
    this.propertiesToRenderHTML = this.properties;
  }

}
