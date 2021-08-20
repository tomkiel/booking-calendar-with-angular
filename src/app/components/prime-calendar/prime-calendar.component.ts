import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SelectContainerComponent } from 'ngx-drag-to-select';
import { CustomerInterface } from 'src/app/interfaces/customer-interface';
import { MonthInterface } from 'src/app/interfaces/month-interface';
import { PropertyInterface } from 'src/app/interfaces/property-interface';
import { ReservationInterface } from 'src/app/interfaces/reservation-interface';
import { CustomerService } from 'src/app/services/customer.service';
import { DateServiceService } from 'src/app/services/date-service.service';
import { PropertyService } from 'src/app/services/property.service';
import { ScrollServiceService } from 'src/app/services/scroll-service.service';

export interface PeriodicElement {
  name: string;
  day: number;
}

@Component({
  selector: 'app-prime-calendar',
  templateUrl: './prime-calendar.component.html',
  styleUrls: ['./prime-calendar.component.scss']
})
export class PrimeCalendarComponent implements OnInit, AfterViewInit {

  @ViewChild(SelectContainerComponent) dtsContainer!: SelectContainerComponent;
  @ViewChildren('calendarDaysHeader') calendarDaysHeader?: QueryList<any>;
  @ViewChildren('calendarDaysReservation') calendarDaysReservation?: QueryList<any>;

  public displayedColumns: string[] = ['day'];
  public dataSource: PeriodicElement[] = [];
  public currentDate = new Date((new Date()).setHours(0, 0, 0, 0));
  public numberOfDaysOnMonth: number = 0;
  public months: MonthInterface[] = [];
  public properties: PropertyInterface[] = [];
  public propertiesToRenderHTML: PropertyInterface[] = [];
  public selectedDaysByDrag: any;
  public selectedDates: string = '';
  public totalPriceSelectedDays: number = 0;
  public numberOfNights: number = 0;
  public colors = [
    '#F44336',
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50',
    '#8BC34A',
    '#CDDC39',
    '#9E9E9E',
    '#607D8B',
    '#FF9800',
    '#FF5722',
    '#795548',
    '#9E9E9E',
    '#907D8B',
  ];

  public descriptionOfNewReservation: string = '';
  public customerOfReservation?: CustomerInterface;
  public colorOfNewReservation: string = '';
  public reservations = [];

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

  async ngAfterViewInit(): Promise<void> {
    this.calendarDaysHeader!.changes.subscribe(() => {
      const dayElement: HTMLElement = document.getElementById('is_today')!;
      dayElement.scrollIntoView({behavior: 'auto', inline: 'center'});
    });

    this.calendarDaysReservation!.changes.subscribe(() => {

      this.properties.map((property: PropertyInterface) => {
        property.reservations?.map((reservation: ReservationInterface) => {
          reservation.dates.map((reservationDate: string, index: number) => {
            const date: Date = new Date(reservationDate);
            const dayElement: HTMLElement = document.getElementById(`year_${date.getFullYear()}_month_${date.getMonth()}_day_${date.getDate()}_property_${property.id}`)!;
            if (dayElement) {
              dayElement.classList.add('dts-select-item');
              dayElement.classList.add('selected');
              (dayElement.lastChild! as HTMLDivElement).style.backgroundColor = this.colors[reservation.id!];
              if(reservation.dates.length === index + 1) {
                (dayElement.lastChild! as HTMLDivElement).classList.add('last-item');
              }

              if (index === 0) {
                (dayElement.lastChild! as HTMLDivElement).classList.add('first-item');
                (dayElement.lastChild! as HTMLDivElement).textContent = reservation.customer.name + " - " + reservation.dates.length + " Days" ;
              }
            }
          });
        });
      });

      const dayElement: HTMLElement = document.getElementById('is_today')!;
      dayElement.scrollIntoView({behavior: 'auto', inline: 'center'});
    });
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
    this.numberOfDaysOnMonth = this.dateServiceService.getNumberOfDaysInMonth(this.currentDate.getMonth(), this.currentDate.getFullYear());
    await this.createDataSourceByNumberOfDays(this.numberOfDaysOnMonth);

    this.months.push(
      {
        name: this.dateServiceService.getNameOfMonth(this.currentDate.getMonth(), this.currentDate.getFullYear()),
        numberDays: this.numberOfDaysOnMonth,
        year: this.currentDate.getFullYear(),
        count: this.currentDate.getMonth()
      },
      {
        name: this.dateServiceService.getNameOfMonth(this.currentDate.getMonth() + 1, this.currentDate.getFullYear()),
        numberDays: this.dateServiceService.getNumberOfDaysInMonth(this.currentDate.getMonth() + 1, this.currentDate.getFullYear()),
        year: this.currentDate.getFullYear(),
        count: this.currentDate.getMonth() + 1
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

  isToday(day: number, month: number, year: number): Boolean {
    const date: Date = new Date(year, month, day);
    if (date.valueOf() === this.currentDate.valueOf()) {
      return true;
    }
    return false;
  }

  isDateSelectedValid(day: number, month: number, year: number): Boolean {
    const dateSelected: Date = new Date(year, month, day);
    if (dateSelected >= this.currentDate) {
      return true;
    }
    return false;
  }

  async selectDaysInCalendar(items: Array<any>): Promise<void> {
    if (items[0] !== undefined) {
      let totalPrice: number = 0;
      const orderedDays = items.sort(function (a, b) {
        return a.day - b.day;
      });

      this.selectedDates = items[0].month + '/' + items[0].day + '/' + items[0].year + ' - ' + items[items.length - 1].month + '/' + items[items.length - 1].day + '/' + items[items.length - 1].year
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

  confirmNewReservation(): void {
    if (!this.customerOfReservation) {
      document.getElementById('select-customer-error')!.style.display = 'block';
      setTimeout(() => {
        document.getElementById('select-customer-error')!.style.display = 'none';
      }, 3000);
    }

    const newReservation: ReservationInterface = {
      property: [],
      customer: this.customerOfReservation!,
      numberOfNights: this.numberOfNights,
      totalPrice: this.totalPriceSelectedDays,
      description: this.descriptionOfNewReservation,
      checkIn: new Date().toString(),
      checkOut: new Date().toString(),
      dates: []
    };
    window.alert('Reservation created successfully!');
  }

  cancelNewReservation(): void {
    this.viewRightSidebar = false;
    this.customerOfReservation = {} as CustomerInterface;
    this.numberOfNights = 0;
    this.totalPriceSelectedDays = 0;
    this.descriptionOfNewReservation = '';
  }

  toViewRightSidebar(): void {
    this.viewRightSidebar = true;
    this.scrollService.determineScroll('calendar-content');
  }

}
