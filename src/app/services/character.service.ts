import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ObservableHelper } from '../statics/helpers/ObservableHelper';
import { InstanceMessageService } from './messages/instance-message.service';
import { EveEsiApiService } from './apis/eve-esi-api.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(
    private instanceMessage: InstanceMessageService,
    private esiApi: EveEsiApiService,
  ) { }

  private characterCorporactionIdDict: Map<number, number> = new Map();

  /**
   * 获取角色所属军团的id
   * @param characterId
   * @returns
   */
  public getCorporationId(characterId: number): Observable<number> {
    return ObservableHelper.create<number>(async(sub) => {
      if (this.characterCorporactionIdDict.has(characterId)) {
        sub.next(this.characterCorporactionIdDict.get(characterId)!)
        sub.complete()
        return
      }

      let character = await firstValueFrom(this.esiApi.character(characterId))
      if (character.corporation_id == null || character.corporation_id == undefined) {
        let errMsg = `角色id[${characterId}]获取军团id失败`
        sub.error(errMsg)
        console.error('CharacterService.getCorporationId', errMsg)
        return
      }

      this.characterCorporactionIdDict.set(characterId, character.corporation_id)
      sub.next(character.corporation_id)
      sub.complete()
    })
  }
}
