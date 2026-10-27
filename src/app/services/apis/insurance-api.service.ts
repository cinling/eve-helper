import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { IEsiInsurancePrice } from '../../structs/esi/InsuranceModels';

@Injectable({
  providedIn: 'root'
})
export class InsuranceApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取所有船舰的保险价格
   * @returns
   */
  insurancePrices(): Observable<IEsiInsurancePrice[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/insurance/prices/`)
      .pipe(map(response => response as IEsiInsurancePrice[]))
  }
}
