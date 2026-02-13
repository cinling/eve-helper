import { Injectable } from '@angular/core';
import { EveEsiApiService } from './apis/eve-esi-api.service';
import { firstValueFrom, forkJoin, map, Observable } from 'rxjs';
import { CommonMessageService } from './messages/common-message.service';
import { AssetItemTypeConstants, IAssetItemVo, IAssetViewVo } from '../structs/view/AssetItemVo';
import { IEisAsset, LocationFlagConstants, LocationTypeConstants } from '../structs/esi/Asset';
import { UniverseRepositoryService } from './repositories/universe-repository.service';
import { LoadingViewManagerService } from './managers/loading-view-manager.service';
import { TimeHelper } from '../statics/helpers/TimeHelper';
import { SdeGroupDict, SdeTypeDict, TypeRepositoryService } from './repositories/type-repository.service';
import { CATEGORY_ID_SHIP } from '../statics/contants/eve';
import { InstanceMessageService } from './messages/instance-message.service';
import { number } from 'echarts';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(
    private esiApi: EveEsiApiService,
    private commonMessage: CommonMessageService,
    private universeRepository: UniverseRepositoryService,
    private loadingViewManager: LoadingViewManagerService,
    private typeRepository: TypeRepositoryService,
    private instanceMessage: InstanceMessageService,
  ) {
    let vo = this.loadingViewManager.register('AssetService', '资产服务初始化', 1)
    this.init().subscribe(() => {
      this.loadingViewManager.finished(vo)
    })
  }


  private readonly AssetItemVosCacheKey = 'AssetService:AssetItemVos'

  private init(): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      sub.next()
      sub.complete()
    })})
  }

  getAssetViewVo(reloadNow: boolean = false): Observable<IAssetViewVo> {
    return new Observable(sub => { setTimeout(async() => {
      let getSetTool = await firstValueFrom(this.instanceMessage.getSetTool)
      let vosKV = await firstValueFrom(getSetTool.getWithKeyValue<IAssetItemVo[]>(this.AssetItemVosCacheKey))

      sub.next({
        assetItemVos: await firstValueFrom(this.getAssetItemVos(reloadNow)),
        lastUpdateTime: TimeHelper.datetime(vosKV?.timestamp ?? 0)
      })
    })})
  }

  /**
   * 获取所有资产数据ß
   * @param reloadNow 是否立刻重新从ESI加载，默认是优先读取数据库中的数据ß
   * @returns
   */
  getAssetItemVos(reloadNow: boolean = false): Observable<IAssetItemVo[]> {
    return new Observable(sub => {setTimeout(async() => {
      let getSetTool = await firstValueFrom(this.instanceMessage.getSetTool)
      let esiService = await firstValueFrom(this.instanceMessage.esiService)

      if (!reloadNow) {
        // 从缓存中加载
        let settings = await firstValueFrom(this.commonMessage.settings)
        let expireTimestampMS = TimeHelper.timestampMS() - settings.asset.expireHour * 60 * 60 * 1000

        let vosKV = await firstValueFrom(getSetTool.getWithKeyValue<IAssetItemVo[]>(this.AssetItemVosCacheKey))
        if (vosKV != null && (vosKV.timestamp ?? 0) > expireTimestampMS) {
          sub.next(vosKV.value)
          sub.complete()
          return
        }
      }

      let vos: IAssetItemVo[] = []
      // 获取角色资产数据
      let characterIds = await firstValueFrom(esiService.getChartacterIds())
      for (let i = 0; i < characterIds.length; i++) {
        let characterId = characterIds[i]
        let characterAssetItemVo = await firstValueFrom(this.requestCharacterAssetItemVos(characterId))
        vos.push(characterAssetItemVo)
      }

      // 获取军团资产数据
      let corporationIds = await firstValueFrom(this.getCorporationIds(characterIds))
      for (let i = 0; i < corporationIds.length; i++) {

      }


      // 存储到缓存中
      await firstValueFrom(getSetTool.set(this.AssetItemVosCacheKey, vos))

      // 获取军团资产数据
      sub.next(vos)
      sub.complete()
    })})
  }


  /**
   * 获取 [角色id => 军团id] 字典
   * @param characterIds
   * @returns
   */
  private getCharacterCorporationIdDict(characterIds: number[]): Observable<Map<number, number>> {
    return this.esiApi.charactersAffiliation(characterIds).pipe(map(items => {
      let dict = new Map<number, number>()
      items.forEach(item => {
        dict.set(item.character_id, item.corporation_id)
      })
      return dict
    }))
  }

  /**
   * 请求角色资产数据
   * @param characterId
   * @returns
   */
  private requestCharacterAssetItemVos(characterId: number): Observable<IAssetItemVo> {
    return new Observable(sub => {setTimeout(async() => {
      let esiService = await firstValueFrom(this.instanceMessage.esiService)
      let assets = await firstValueFrom(this.requestAssets(characterId))

      /** 角色数据 */
      let characterItemVo: IAssetItemVo = {
        id: characterId,
        type: AssetItemTypeConstants.Character,
        name: await firstValueFrom(esiService.getCharacterName(characterId)),
        key: `character-${characterId}`,
        amount: 0,
        children: []
      }

      /** 空间站ids */
      let stationIds = new Set<number>()
      /** 建筑ids */
      let structureIds = new Set<number>()
      /** [地点id => 地点内物品]字典的 */
      let locationAssetsDict: Map<number, IEisAsset[]> = new Map()
      /** 物品ids */
      let itemIds = new Set<number>()
      /** 类型ids */
      let typeIds = new Set<number>()

      for (let i = 0; i < assets.length; i++) {
        let asset = assets[i]
        if (asset.location_type == LocationTypeConstants.Station) {
          stationIds.add(asset.location_id)
        }
        // 其他可存放物品的建筑
        if (asset.location_type == "item" && asset.location_flag == LocationFlagConstants.Hangar) {
          structureIds.add(asset.location_id) // 建筑
        }
        if (!locationAssetsDict.has(asset.location_id)) {
          locationAssetsDict.set(asset.location_id, [])
        }
        let locationAssets = locationAssetsDict.get(asset.location_id)
        locationAssets?.push(asset)

        itemIds.add(asset.item_id)
        typeIds.add(asset.type_id)
      }

      // 获取物品名字
      let itemNameDict = await firstValueFrom(this.getAssetNameDict(characterId, Array.from(itemIds)))
      let typeDict = await firstValueFrom(this.typeRepository.getTypeDictByTypeIds(Array.from(typeIds)))
      let groupDict = await firstValueFrom(this.typeRepository.getGroupDict())

      // 空间站
      for (let stationId of stationIds) {
        let station = await firstValueFrom(this.universeRepository.getStation(stationId))
        let stationItemVo = await firstValueFrom(this.getLocationAssetItemVo(stationId, station.name, characterItemVo.key, locationAssetsDict, itemNameDict, typeDict, groupDict))
        stationItemVo.type = AssetItemTypeConstants.Station
        stationItemVo.typeId = station.type_id
        characterItemVo.children?.push(stationItemVo)
      }

      // 建筑数据
      for (let structureId of structureIds) {
        let structure = await firstValueFrom(this.universeRepository.getStructure(await firstValueFrom(esiService.getAccessToken(characterId)), structureId))
        let name = structure?.name ?? `无法访问[${structureId}]`
        let structureItemVo = await firstValueFrom(this.getLocationAssetItemVo(structureId, name, characterItemVo.key, locationAssetsDict, itemNameDict, typeDict, groupDict))
        structureItemVo.typeId = structure?.type_id
        characterItemVo.children?.push(structureItemVo)
      }


      sub.next(characterItemVo)
      sub.complete()
    })})
  }

  /**
   * 获取地点（空间站/建筑）中的物品信息
   * @param locationId
   * @param locationName
   * @param parentKey
   * @param locationAssetsDict
   * @param itemNameDict
   * @param typeDict
   * @param groupDict
   * @returns
   */
  private getLocationAssetItemVo(
    locationId: number,
    locationName: string,
    parentKey: string,
    locationAssetsDict: Map<number, IEisAsset[]>,
    itemNameDict: Map<number, string>,
    typeDict: SdeTypeDict,
    groupDict: SdeGroupDict
  ): Observable<IAssetItemVo> {
    return new Observable(sub => {setTimeout(async() => {
      let locationItemVo: IAssetItemVo = {
        id: locationId,
        type: AssetItemTypeConstants.Station,
        name: locationName,
        amount: 0,
        key: `${parentKey}-${locationId}`,
        children: []
      }

      // 舰船机库
      let hangarItemVo: IAssetItemVo = {
        id: locationId,
        type: AssetItemTypeConstants.StationHangar,
        name: "舰船机库",
        amount: 0,
        key: `${locationItemVo.key}-hangar`,
        children: []
      }
      locationItemVo.children?.push(hangarItemVo)

      // 物品机库
      let itemItemVo: IAssetItemVo = {
        id: locationId,
        type: AssetItemTypeConstants.StationAssetSafety,
        name: "物品机库",
        amount: 0,
        key: `${locationItemVo.key}-item`,
        children: []
      }
      locationItemVo.children?.push(itemItemVo)

      // 遍历物品
      let locationAssets = locationAssetsDict.get(locationId)
      for (let asset of locationAssets ?? []) {
        let type = typeDict[asset.type_id]
        if (!type?.groupID) continue
        let group = groupDict[type.groupID]
        let categoryId = group.categoryID

        /** 第二层物品或容器 */
        let secondIemVo: IAssetItemVo = {
          id: asset.item_id,
          type: AssetItemTypeConstants.Item,
          name: this.getAssetName(asset, itemNameDict, typeDict),
          amount: asset.quantity,
          key: `${locationItemVo.key}-${asset.item_id}`,
          children: []
        }

        if (categoryId == CATEGORY_ID_SHIP) { // 舰船机库
          hangarItemVo.children?.push(secondIemVo)
        } else { // 物品机库
          itemItemVo.children?.push(secondIemVo)

          // 第三层物品
          if (locationAssetsDict.has(asset.item_id)) {
            for (let itemAsset of locationAssetsDict.get(asset.item_id) ?? []) {
              let itemVo: IAssetItemVo = {
                id: itemAsset.item_id,
                type: AssetItemTypeConstants.Item,
                name: this.getAssetName(itemAsset, itemNameDict, typeDict),
                amount: itemAsset.quantity,
                key: `${locationItemVo.key}-${itemAsset.item_id}`,
              }
              secondIemVo.children?.push(itemVo)
            }
          }
        }
      }
      sub.next(locationItemVo)
      sub.complete()
    })})
  }

  /**
   * 请求角色下所有的资源信息
   */
  private requestAssets(characterId: number): Observable<IEisAsset[]> {
    return new Observable(sub => { setTimeout(async() => {
      let esiService = await firstValueFrom(this.instanceMessage.esiService)

      let pageValue = await firstValueFrom(this.esiApi.charactersAssets(await firstValueFrom(esiService.getAccessToken(characterId)), characterId))
      let assets = pageValue.data;
      if (pageValue.size > 1) {
        for (let page = 2; page <= pageValue.size; page++) {
          let nextPageValue = await firstValueFrom(this.esiApi.charactersAssets(await firstValueFrom(esiService.getAccessToken(characterId)), characterId, page))
          assets.push(...nextPageValue.data)
        }
      }
      sub.next(assets)
      sub.complete()
    })})
  }


  private getAssetName(asset: IEisAsset, itemNameDict: Map<number, string>, typeNameDict: SdeTypeDict): string {
    let name = itemNameDict.get(asset.item_id)
    if (name && name != "") {
      return name
    }
    name = typeNameDict[asset.type_id]?.name
    if (name) {
      return name
    }
    return `unknown_${asset.item_id}`
  }

  /**
   * 获取资源名字列表
   * @param characterId
   * @param itemIds
   * @returns
   */
  private getAssetNameDict(characterId: number, itemIds: number[]): Observable<Map<number, string>> {
    return new Observable(sub => {setTimeout(async() => {
      let esiService = await firstValueFrom(this.instanceMessage.esiService)

      let newItemIds = JSON.parse(JSON.stringify(itemIds))
      let itemDict = new Map<number, string>()
      do {
        let itemIds = newItemIds.splice(0, 1000)
        let partItemDict = await firstValueFrom(this.esiApi.charactersAssetsNames(await firstValueFrom(esiService.getAccessToken(characterId)), characterId, itemIds)
          .pipe<Map<number, string>>(map((list) => {
            let map = new Map<number, string>()
            for (let item of list) {
              if (item.name != 'None') {
                map.set(item.item_id, item.name)
              }
            }
            return map
          })))
        for (let item of partItemDict) {
          itemDict.set(item[0], item[1])
        }
      } while(newItemIds.length > 0)

      sub.next(itemDict)
      sub.complete()
    })})
  }

  /**
   * 根据角色获取所有军团id
   * @param characterIds
   * @returns
   */
  private getCorporationIds(characterIds: number[]): Observable<number[]> {
    return new Observable(sub => {setTimeout(async() => {
      let corporationIds: number[] = []
      let characters = await firstValueFrom(forkJoin(characterIds.map(characterId => this.esiApi.character(characterId))))
      for (let i in characters) {
        let character = characters[i]
        if (character.corporation_id == null || character.corporation_id == undefined) {
          continue
        }
        corporationIds.push(character.corporation_id)
      }

      sub.next(corporationIds)
      sub.complete()
    })})
  }
}
