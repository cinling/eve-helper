import { Injectable } from '@angular/core';
import { first, firstValueFrom, map, Observable } from 'rxjs';
import { KeyValueRepositoryService } from './repositories/key-value-repository.service';
import { MarketGroupRepositoryService } from './repositories/market-group-repository.service';
import { TypeRepositoryService } from './repositories/type-repository.service';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { IMarketGroup } from '../statics/entities/MarketGroup';
import { IType } from '../statics/entities/Type';
import { BlueprintRepositoryService } from './repositories/blueprint-repository.service';
import { ObservableValue } from '../structs/ObservableValue';
import { LocalStorageTool } from '../statics/tools/LocalStorageTool';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EncryptHelper } from '../statics/helpers/EncrypHelper';
import { TimeHelper } from '../statics/helpers/TimeHelper';
import { IEsiLoginReponse } from '../structs/esi/LoginReponse';
import { LoadingViewManagerService } from './managers/loading-view-manager.service';
import { IEsiVerifyReponse } from '../structs/esi/VerifyReponse';
import { IStoreCharacterAuth } from '../structs/store/CharacterAuth';
import { IEsiService } from '../statics/interfaces/IEsiService';
import { InstanceMessageService } from './messages/instance-message.service';
import { v4 as uuidv4 } from 'uuid'
import { EveEsiApiService } from './apis/eve-esi-api.service';
import { ValueHelper } from '../statics/helpers/ValueHelper';

@Injectable({
  providedIn: 'root'
})
export class EsiService implements IEsiService {

  constructor(
    private keyValueRepository: KeyValueRepositoryService,
    private marketGroupRepository: MarketGroupRepositoryService,
    private typeRepository: TypeRepositoryService,
    private blueprintRepository: BlueprintRepositoryService,
    private httpClient: HttpClient,
    private loadingViewManager: LoadingViewManagerService,
    private instanceMessage: InstanceMessageService,
    private esiApi: EveEsiApiService,
  ) {
    let vo = this.loadingViewManager.register("esi", "ESI 授权服务", 1)
    this.init().subscribe(() => {
      this.instanceMessage.esiService.setValue(this)
      this.loadingViewManager.finished(vo)
    })
  }

  /**
   * 角色授权字典
   */
  private characterAuthDict = new ObservableValue<{[characterId: number]: IStoreCharacterAuth}>()


  getChartacterIds(): Observable<number[]> {
    return this.characterAuthDict.pipe(map(dict => {
      let ids: number[] = []
      for (let characterId in dict) {
        ids.push(Number(characterId))
      }
      return ids
    }))
  }

  getAccessToken(characterId: number): Observable<string> {
    return new Observable(sub => {setTimeout(async() => {
      await firstValueFrom(this.autoRefreshAccessToken(characterId))
      let dict = await firstValueFrom(this.characterAuthDict)
      let auth = dict[characterId]
      if (auth) {
        sub.next(auth.accessToken)
        sub.complete()
      } else {
        let errMsg = `角色id[${characterId}]未授权ESI`
        sub.error(errMsg)
        console.error('EsiService.getAccessToken', errMsg)
      }
    })})
  }

  getCharacterName(characterId: number): Observable<string> {
    return this.characterAuthDict.pipe(map(dict => {
      let auth = dict[characterId]
      if (auth) {
        return auth.characterName
      }
      return ""
    }))
  }

  private init(): Observable<void> {
    this.characterAuthDict.pipe(first()).subscribe(async(characterAuthDict) => {
      for (let i in characterAuthDict) {
        let auth = characterAuthDict[i]
        let ok = await firstValueFrom(this.check(auth.characterId))
        if (!ok) {
          this.autoRefreshAccessToken(auth.characterId, true).subscribe() // accessToken 无效，立刻刷新
        }
      }
    })


    return new Observable(sub => {setTimeout(async() => {
      let dict = await firstValueFrom(LocalStorageTool.get<{[characterId: number]: IStoreCharacterAuth}>(LocalStorageTool.CharacterAuthDict))
      if (dict) {
        this.characterAuthDict.setValue(dict)
      } else {
        this.characterAuthDict.setValue({})
      }

      sub.next()
      sub.complete()
    })})
  }

  foo() {}

  /**
   * 获取市场分组树形结构
   * @deprecated 移动到 BluePrintService 中
   */
  public getMarketGroupsOptions(): Observable<NzTreeNodeOptions[]> {
    return new Observable<NzTreeNodeOptions[]>(sub => { setTimeout( async() => {
      let nodes = await firstValueFrom(this.keyValueRepository.getMarketBlueprintTreeNodes())
      if (nodes.length > 0) {
        sub.next(nodes)
        sub.complete()
        return
      }

      nodes = []

      // 所有可以制造的物品id列表
      let typeIds = await firstValueFrom(this.blueprintRepository.getManufacturingProductTypeIds())
      let typeDict = await firstValueFrom(this.typeRepository.getTypeDictByTypeIds(typeIds))

      let marketGroupIdSet: Set<number> = new Set()
      for (let i in typeDict) {
        let type = typeDict[i]
        if (type && type.marketGroupID) { // 可能存在未发布的物品
          marketGroupIdSet.add(type.marketGroupID)
        }
      }

      // 获取所有可以制造物品的上级分组
      let marketGroupDict = await firstValueFrom(this.marketGroupRepository.getMarketGroupDictByIds([...marketGroupIdSet]))

      // 获取所有分组的上级分组（包括自身）
      marketGroupDict = await firstValueFrom(this.marketGroupRepository.getMarketGroupDictByChildren(marketGroupDict))

      // 上分组ID对应的分组列表
      let parentMarketGroupDict: {[marketParentGroupId: number]: IMarketGroup[]} = {}
      for (let i in marketGroupDict) {
        let marketGroup = marketGroupDict[i]
        let parentGroupId = marketGroup.parentGroupID ?? 0 // 没有上级分组的默认为0（顶级分组）

        if (!parentMarketGroupDict[parentGroupId]) {
          parentMarketGroupDict[parentGroupId] = []
        }
        parentMarketGroupDict[parentGroupId].push(marketGroup)
      }

      // 市场分组 => 物品列表
      let marketGroupTypesDict: {[marketGroupID: number]: IType[]} = {}
      for (let i in typeDict) {
        let type = typeDict[i]
        let marketGroupID = type?.marketGroupID ?? undefined
        if (!marketGroupID) {
          continue
        }
        if (!marketGroupTypesDict[marketGroupID]) {
          marketGroupTypesDict[marketGroupID] = []
        }
        marketGroupTypesDict[marketGroupID].push(type)
      }


      // 获取第一层的分组
      let topMarketGroups = parentMarketGroupDict[0]
      for (let i in topMarketGroups) {
        let marketGroup = topMarketGroups[i]

        nodes!.push({
          title: marketGroup.name,
          key: "mg_" + marketGroup.marketGroupID,
          iconId: marketGroup.iconID,
          children: await firstValueFrom(this.getMarketGroupOptionChildren(marketGroup, parentMarketGroupDict, marketGroupTypesDict))
        })
      }

      // 缓存数据，下一次打开无需重复生成列表
      this.keyValueRepository.setMarketBlueprintTreeNodes(nodes).subscribe()

      sub.next(nodes)
      sub.complete()
    } )})
  }

  /**
   * 获取市场分组的子项列表，并转为 NzTreeNodeOptions
   * @param marketGroup
   * @param parentMarketGroupDict
   * @returns
   */
  private getMarketGroupOptionChildren(
    marketGroup: IMarketGroup
    , parentMarketGroupDict: {[marketParentGroupId: number]: IMarketGroup[]}
    , marketGroupTypesDict: {[marketGroupID: number]: IType[]}
  ): Observable<NzTreeNodeOptions[]> {
    return new Observable<NzTreeNodeOptions[]>(sub => { setTimeout( async() => {
      let subMarketGroups = parentMarketGroupDict[marketGroup.marketGroupID] ?? []
      let children: NzTreeNodeOptions[] = []
      for (let i in subMarketGroups) {
        let subMarketGroup = subMarketGroups[i]
        let name = subMarketGroup.name
        if (name == "") {
          name = subMarketGroup.marketGroupID + ""
        }

        // 加入子分类
        children.push({
          title: name,
          key: "mg_" + subMarketGroup.marketGroupID,
          iconId: subMarketGroup.iconID,
          children: await firstValueFrom(this.getMarketGroupOptionChildren(subMarketGroup, parentMarketGroupDict, marketGroupTypesDict))
        })
      }

      // 加入分类所有的物品
      let types = marketGroupTypesDict[marketGroup.marketGroupID] ?? []
      for (let i in types) {
        let type = types[i]
        children.push({
          title: type.name,
          key: "t_" + type.typeID,
          isLeaf: true
        })
      }

      sub.next(children)
      sub.complete()
    }) })
  }

  /**
   * 自动刷新访问令牌
   * @param characterId
   * @param refreshNow 是否立即刷新
   */
  private autoRefreshAccessToken(characterId: number, refreshNow: boolean = false): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      let auth = (await firstValueFrom(this.characterAuthDict))[characterId]

      if (auth == null) {
        let errMsg = `角色id[${characterId}]未授权ESI`
        sub.error(errMsg)
        return
      }

      if (!refreshNow) {
        const allowReaminMS = 15 * 1000 // 过期前多少秒算已过期

        if (TimeHelper.timestampMS() - allowReaminMS < auth.accessTokenExpireTime) { // 还没过期
          sub.next()
          sub.complete()
          return
        }
      }


      // 已经过期，使用刷新令牌获取新的 accessToken
      let refreshToken = auth.refreshToken
      let esi = environment.esi
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      const payload = new HttpParams()
        .set('grant_type', 'refresh_token')
        .set('refresh_token', refreshToken!)
        .set('client_id', esi.clientId)
      this.httpClient.post(`https://login.eveonline.com/v2/oauth/token`, payload.toString(), {headers}).subscribe({
        next: response => {setTimeout(async() => {
          let loginReponse = response as IEsiLoginReponse
          await firstValueFrom(this.setEsiToken(loginReponse))
          sub.next()
          sub.complete()
        })},
        error: error => {
          console.log("登录失败", error)
          sub.error(error)
        }})
    })})
  }

  loginByAuthCode(authCode: string): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      let codeVerifier = await firstValueFrom(LocalStorageTool.get<string>(LocalStorageTool.CodeVerifier))
      if (codeVerifier == null) {
        sub.error("未授权ESI")
        return
      }

      let esi = environment.esi
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      const payload = new HttpParams()
        .set('grant_type', 'authorization_code')
        .set('code', authCode)
        .set('client_id', esi.clientId)
        .set('code_verifier', codeVerifier);
      this.httpClient.post(`https://login.eveonline.com/v2/oauth/token`, payload.toString(), {headers}).subscribe({
        next: response => {setTimeout(async() => {
          let loginReponse = response as IEsiLoginReponse
          await firstValueFrom(this.setEsiToken(loginReponse))
          sub.next()
          sub.complete()
        })},
        error: error => {
          console.log("登录失败", error)
          sub.error(error)
        }})
    })})
  }

  private setEsiToken(loginReponse: IEsiLoginReponse): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      let verify = await firstValueFrom(this.verify(loginReponse.access_token))
      if (!this.characterAuthDict.hasValue()) {
        this.characterAuthDict.setValue({})
      }
      let dict = await firstValueFrom(this.characterAuthDict)
      dict[verify.CharacterID] = {
        characterId: verify.CharacterID,
        characterName: verify.CharacterName,
        accessToken: loginReponse.access_token,
        accessTokenExpireTime: TimeHelper.timestampMS() + loginReponse.expires_in * 1000,
        refreshToken: loginReponse.refresh_token,
      }

      // 更新内存数据&保存数据
      this.characterAuthDict.setValue(dict)
      await firstValueFrom(LocalStorageTool.set(LocalStorageTool.CharacterAuthDict, dict))

      sub.next()
      sub.complete()
    })})
  }

  /**
   * 获取ESI授权URL。页面直接重定向即可
   */
  getEsiAuthUrl(): Observable<string> {
    return new Observable(sub => {setTimeout(async() => {
      let codeChallenge = await firstValueFrom(this.generateCodeChallenge())
      const esi = environment.esi
      await firstValueFrom(LocalStorageTool.set(LocalStorageTool.CodeVerifier, codeChallenge[0])) // 保存验证码

      let params = {
        "response_type": "code",
          "client_id": esi.clientId,
          "redirect_uri": esi.callbackUrl,
          "scope": esi.scopes.join(" "),
          "state": "123456",
          "code_challenge[0]": codeChallenge[0],
          "code_challenge[1]": codeChallenge[1],
          "code_challenge_method": "S256",
      }
      let queryString = (new URLSearchParams(params)).toString()
      let url = `https://login.eveonline.com/v2/oauth/authorize?${queryString}`
      sub.next(url)
      sub.complete()
    })})
  }

  /**
   * 生成code_challenge
   * @see https://developers.eveonline.com/docs/services/sso/#authorization-code-with-pkce
   * @returns code_verifier, code_challenge
   */
  private generateCodeChallenge(): Observable<string[]> {
    return new Observable(sub => {setTimeout(async() => {
      // 生成 32 字节的随机字节序列作为 code verifier
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      const code_verifier = EncryptHelper.base64Encode(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      const code_challenge = EncryptHelper.base64Encode(EncryptHelper.sha256(code_verifier))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      sub.next([code_verifier, code_challenge]);
      sub.complete()
    })})
  }

  /**
   * 是否有AccessToken
   * @returns
   */
  hasAccessToken(): Observable<boolean> {
    return new Observable(sub => {setTimeout(async() => {
      let dict = await firstValueFrom(this.characterAuthDict)
      sub.next(Object.keys(dict).length > 0)
      sub.complete()
    })})
  }

  /**
   * 通过验证信息获取授权的角色信息
   * @returns
   */
  verify(accessToken: string): Observable<IEsiVerifyReponse> {
    return new Observable(sub => {setTimeout(async() => {
      const url = `https://esi.evetech.net/verify/` + "?uuid=" + ValueHelper.uuid()
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      }
      this.httpClient.get(url, {headers}).subscribe({
        next: async(response) => {
          sub.next(response as IEsiVerifyReponse)
          sub.complete()
        },
        error: async(err) => {
          sub.error(err)
          console.error(err)
        }
      })
    })})
  }

  /**
   * 检测角色的授权是否可用
   * @param characterId
   */
  check(characterId: number): Observable<boolean> {
    return new Observable(sub => {setTimeout(async() => {
      let accessToken = await firstValueFrom(this.getAccessToken(characterId))

      this.esiApi.charactersKillMailsRecent(accessToken, characterId).subscribe({
        next: r => {
          sub.next(true)
          sub.complete()
        },
        error: e => {
          console.error("EsiService.check", e)
          sub.next(false)
          sub.complete()
        }
      })
    })})
  }

  removeCharacter(characterId: number): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      let dict = await firstValueFrom(this.characterAuthDict)
      delete dict[characterId]
      this.characterAuthDict.setValue(dict)
      await firstValueFrom(LocalStorageTool.set(LocalStorageTool.CharacterAuthDict, dict))
      sub.next()
      sub.complete()
    })})
  }
}
