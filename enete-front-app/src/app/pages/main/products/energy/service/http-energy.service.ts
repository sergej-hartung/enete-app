import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

const BASE_URL = environment.apiUrl

interface City {
  city: string
}

interface CityApi {
  result: resultCityApi[]
}

interface resultCityApi {
  city: string,
  zip: string
}

@Injectable({
  providedIn: 'root'
})
export class HttpEnergyService {

  constructor(private http: HttpClient) { 

  }

  getCitiesByZip(zip: string): Observable<City[] | null> {
    console.log(zip)
    return this.http.get<CityApi>(`${BASE_URL}/products/energy/cities/${zip}`).pipe(
      map(data => {
        if (data && 'result' in data) {
          return data.result
          //return data.result.map(res => {
          //  if ('city' in res) {
          //    return { 'city': res.city }
          //  }
          //})
        } else {
          return []
        }
      }),    
    )
  }

  test(){
    return 'test'
  }
}
