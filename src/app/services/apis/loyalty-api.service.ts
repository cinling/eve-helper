import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { IEsiLoyaltyOffer } from '../../structs/esi/LoyaltyModels';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取军团忠诚点商店的兑换品列表
   * @param corporationId
   * @returns
   */
  loyaltyStoresOffers(corporationId: number): Observable<IEsiLoyaltyOffer[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/loyalty/stores/${corporationId}/offers/`)
      .pipe(map(response => response as IEsiLoyaltyOffer[]))
  }
}
