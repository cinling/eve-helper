import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EveEsiApiService } from './apis/eve-esi-api.service';

/**
 * esi api service
 * @link https://esi.evetech.net/ui
 * @deprecated 新代码需要移动到 ./apis 目录下
 */
@Injectable({
  providedIn: 'root'
})
export class EsiApiService extends EveEsiApiService {

  constructor(
    httpClient: HttpClient
  ) {
    super(httpClient)
  }
}
