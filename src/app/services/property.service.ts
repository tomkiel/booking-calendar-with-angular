import { Injectable } from '@angular/core';
import { PropertyInterface } from '../interfaces/property-interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  constructor(
    private http: HttpClient
  ) { }

  async get(): Promise<PropertyInterface[]> {
    return this.http.get<PropertyInterface[]>(environment.apiURL + 'properties')
    .toPromise()
    .catch(error => {
      return error;
    })
  }
}
