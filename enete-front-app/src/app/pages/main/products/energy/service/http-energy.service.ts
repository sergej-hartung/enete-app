import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
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
        } else {
          return []
        }
      }),    
    )
  }

  /**
   * 
   * @param zip
   * @param city
   */
  getStreets(zip: string, city: string): Observable<any> {
    return this.http.get<any>(`${BASE_URL}/products/energy/streets/${zip}/${encodeURI(city.toLowerCase())}`).pipe(
      map(data => {
        if (data && 'result' in data) {
          return data.result.map((res: any) => {
            if ('street' in res) {
              return res.street
            }
          })
          //return data.result
        } else {
          return []
        }
      })
    )
  }

  getNetzProvider(params: { zip: string, city: string, street: string, houseNumber: string, branch:string}): Observable<any> {
    let queryParams = new HttpParams()
    queryParams.append('zip', params.zip)
    queryParams.append('city', params.city)
    queryParams.append('street', params.street)
    queryParams.append('houseNumber', params.houseNumber)
    queryParams.append('branch', params.branch)

    return this.http.get<any>(`${BASE_URL}/products/energy/netzProvider`, { params: params }).pipe(
      map(data => {
        console.log(data)
        if (data && 'result' in data) {
          return data.result
        } else {
          return []
        }
      }),
    )
  }

  getBaseProvider(params: { branch: string, type: string, zip: string, city: string, consum: string, consumNt?: string, country?: string }): Observable<any> {


    return this.http.get<any>(`${BASE_URL}/products/energy/baseProvider`, { params: params }).pipe(
      map(data => {
        if (data && 'result' in data) {
          return data.result
        } else {
          return []
        }
      }),
    )
  }
}
