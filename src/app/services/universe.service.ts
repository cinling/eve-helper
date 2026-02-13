import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { NzOption } from '../structs/NzOptions';
import { UniverseRepositoryService } from './repositories/universe-repository.service';

/**
 * 宇宙服务
 * 主要包含 星域、星座、星系、星球、空间站等一些数据的处理
 */
@Injectable({
  providedIn: 'root'
})
export class UniverseService {

  constructor(
    private universeRepository: UniverseRepositoryService,
  ) { }

  /**
   * 星系选项数据
   * @returns
   */
  systemOptions(): Observable<NzOption[]> {
    return this.universeRepository.getSystemDict().pipe<NzOption[]>(map(dict => {
      let options: NzOption[] = []
      for (let part of dict) {
        let system = part[1]
        options.push({
          label: system.name,
          value: system.system_id,
        })
      }
      return options
    }))
  }

  /**
   * 空间站选项数据
   * @returns
   */
  stationOptions(systemId: number): Observable<NzOption[]> {
    return new Observable(sub => {setTimeout(async() => {
      let system = await firstValueFrom(this.universeRepository.getSystem(systemId))
      if (system == null) {
        sub.next([])
        sub.complete()
        return
      }

      let stations = await firstValueFrom(this.universeRepository.getStationsBySystem(system))
      let options: NzOption[] = []
      for (let station of stations) {
        options.push({
          label: station.name,
          value: station.station_id,
        })
      }
      sub.next(options)
      sub.complete()
    })})
  }

  getSystemName(systemId: number): Observable<string> {
    return this.universeRepository.getSystem(systemId).pipe<string>(map(system => system?.name ?? '-'))
  }

  getStationName(stationId: number): Observable<string> {
    return this.universeRepository.getStation(stationId).pipe<string>(map(station => station?.name ?? '-'))
  }
}
