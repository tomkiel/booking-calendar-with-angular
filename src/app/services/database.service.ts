import { Injectable } from '@angular/core';
import * as database from '../resources/database.json';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  getDatabase() {
    return database;
  }
}
