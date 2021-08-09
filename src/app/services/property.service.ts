import { Injectable } from '@angular/core';
import { PropertyInterface } from '../interfaces/property-interface';
import { HttpClient } from '@angular/common/http';

import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  constructor(
    private http: HttpClient,
    private databaseService: DatabaseService
  ) { }

  async get(): Promise<PropertyInterface[]> {
    const database = this.databaseService.getDatabase();
    const properties = ( database.properties as PropertyInterface[] );
    return properties;
  }
  
}
