import { Injectable } from '@angular/core';
import { CustomerInterface } from '../interfaces/customer-interface';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private databaseService: DatabaseService
  ) { }

  async get(): Promise<CustomerInterface[]> {
    const database = this.databaseService.getDatabase();
    const customers = (database.customers as CustomerInterface[]);
    return customers;
  }
}
