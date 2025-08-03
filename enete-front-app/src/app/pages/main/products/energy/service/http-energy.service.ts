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

  getBeforeProvider(rateId: number | string): Observable<any> {
    return this.http.get<any>(`${BASE_URL}/products/energy/beforeProvider/${rateId}`).pipe(
      map(data => {
        if (data && 'result' in data) {
          return data.result
        } else {
          return []
        }
      })
    )
  }

  getLegalForm(rateId: number | string): Observable<any> {
    return this.http.get<any>(`${BASE_URL}/products/energy/legalForm/${rateId}`).pipe(
      map(data => {
        if (data && 'result' in data) {
          return data.result
        } else {
          return []
        }
      })
    )
  }

  getEnergyRates(ratesData:any, filterData:any): Observable<any> {
    let Filters:any = []

    if (Object.keys(filterData).length > 0) {
      Object.entries(filterData).forEach(
        ([key, value]) => {
          let obj:any = {}
          obj[key] = value
          Filters.push(obj)
        }
      )
    }

    let params = Object.assign({}, ratesData)
    if (Filters.length > 0) {
      params['filters'] = JSON.stringify(Filters)
    }
    console.log(params)

    return this.http.get<any>(`${BASE_URL}/products/energy/rates`, { params: params }).pipe(
      map(data => {
        if (data && 'result' in data) {
          return data.result
        } else {
          return []
        }
      }),
    )
  } 

  getContractFileBlanko(rateId:string, rateFileId:string): Observable<any> {
    //const httpOptions = {
    //  responseType: 'blob' as 'json',
    //  headers: new HttpHeaders({
    //    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ5SGNwTmN1ZmN6WVJyc3FNRSIsImFwcElkIjoibXdkV1d3RXhMRjZnd2o5cTUiLCJzZXJ2aWNlTmFtZSI6IlVzZXJTZXJ2aWNlIiwiZWdvbkFwaUtleSI6ImEwNjk2Zjk4MzZkMjllZDgzMWIyYjI2NDBmY2Y5ZjEyIiwiaWF0IjoxNjMzNjc3MzI0fQ.nE0yQRZbh0ooVOTprLf97veamfCYrM2Saqqsp_k8Pr4',
    //    'reseller-id': '10000'
    //  })
    //};
    return this.http.get(`${BASE_URL}/products/energy/contract-file-blank/${rateId}/${rateFileId}`)
  }

  getPdfOffer(params: any): Observable<any>  {
    return this.http.post(`${BASE_URL}/products/pdf/offer`, params, { responseType: 'blob' })
  }
}
