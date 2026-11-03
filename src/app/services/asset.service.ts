import { Injectable } from '@angular/core';
import { EveEsiApiService } from './apis/eve-esi-api.service';
import { firstValueFrom, forkJoin, map, Observable } from 'rxjs';
import { CommonMessageService } from './messages/common-message.service';
import { AssetItemTypeConstants, IAssetItemVo, IAssetLoadResult, IAssetViewVo } from '../structs/view/AssetItemVo';
import { IEisAsset, LocationFlagConstants, LocationTypeConstants } from '../structs/esi/Asset';
import { UniverseRepositoryService } from './repositories/universe-repository.service';
import { LoadingViewManagerService } from './managers/loading-view-manager.service';
import { TimeHelper } from '../statics/helpers/TimeHelper';
import { SdeGroupDict, SdeTypeDict, TypeRepositoryService } from './repositories/type-repository.service';
import { CATEGORY_ID_BLUEPRINT, CATEGORY_ID_SHIP, TYPE_ID_CORPORATION_OFFICE } from '../statics/contants/eve';
import { InstanceMessageService } from './messages/instance-message.service';
import { ObservableHelper } from '../statics/helpers/ObservableHelper';
import { ICharacterCorporationVo } from '../structs/vos/CharacterCorportationVo';
import { AssetApiService } from './apis/asset-api.service';
import { CorporationApiService } from './apis/corporation-api.service';
import { IEsiAssetsNames } from '../structs/esi/AssetsModels';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(
    private esiApi: EveEsiApiService,
    private assetApi: AssetApiService,
    private corporationApi: CorporationApiService,
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
    return ObservableHelper.createDeferred(async sub => {
      let result = await firstValueFrom(this.getAssetItemVos(reloadNow))

      let lastUpdateTime = TimeHelper.datetime(0)
      try {
        let getSetTool = await firstValueFrom(this.instanceMessage.getSetTool)
        let vosKV = await firstValueFrom(getSetTool.getWithKeyValue<IAssetItemVo[]>(this.AssetItemVosCacheKey))
        lastUpdateTime = TimeHelper.datetime(vosKV?.timestamp ?? 0)
      } catch (error) {
        // 读取更新时间失败不影响资产展示
        console.error('AssetService.getAssetViewVo 读取更新时间失败', error)
      }

      sub.next({
        assetItemVos: result.vos,
        lastUpdateTime: lastUpdateTime,
        errors: result.errors
      })
      sub.complete()
    })
  }

  /**
   * 获取所有资产数据。
   * 单个角色/军团加载失败会被隔离为一条错误信息，不会导致整页加载不出来。
   * @param reloadNow 是否立刻重新从ESI加载，默认是优先读取数据库中的数据
   * @returns
   */
  getAssetItemVos(reloadNow: boolean = false): Observable<IAssetLoadResult> {
    return ObservableHelper.createDeferred(async sub => {
      let getSetTool = await firstValueFrom(this.instanceMessage.getSetTool)
      let esiService = await firstValueFrom(this.instanceMessage.esiService)
      let errors: string[] = []

      if (!reloadNow) {
        // 从缓存中加载
        try {
          let settings = await firstValueFrom(this.commonMessage.settings)
          let expireHour = settings?.asset?.expireHour ?? 2
          let expireTimestampMS = TimeHelper.timestampMS() - expireHour * 60 * 60 * 1000

          let vosKV = await firstValueFrom(getSetTool.getWithKeyValue<IAssetItemVo[]>(this.AssetItemVosCacheKey))
          // 缓存内容可能已损坏（不是数组），此时视为未命中并重新加载
          if (Array.isArray(vosKV?.value) && (vosKV?.timestamp ?? 0) > expireTimestampMS) {
            sub.next({ vos: vosKV!.value, errors: [] })
            sub.complete()
            return
          }
        } catch (error) {
          console.error('AssetService.getAssetItemVos 读取缓存失败', error)
        }
      }

      let vos: IAssetItemVo[] = []

      // 获取已授权角色列表
      let characterIds: number[] = []
      try {
        characterIds = await firstValueFrom(esiService.getChartacterIds())
      } catch (error) {
        errors.push(`获取已授权角色列表失败：${this.errorText(error)}`)
      }

      // 获取角色资产数据（单个角色失败不影响其他角色）
      for (let characterId of characterIds) {
        try {
          vos.push(await firstValueFrom(this.requestCharacterAssetItemVos(characterId)))
        } catch (error) {
          console.error(`AssetService.getAssetItemVos 角色[${characterId}]资产加载失败`, error)
          errors.push(`角色[${characterId}] 资产加载失败：${this.errorText(error)}`)
        }
      }

      // 获取军团资产数据
      try {
        let charCornVos = await firstValueFrom(this.getCharacterCorporationVos(characterIds))
        let corporationIdDict: Map<number, number> = new Map() // [军团id => 角色id]
        for (let charCornVo of charCornVos) {
          if (charCornVo.corporationId == 0) {
            continue
          }
          // 同一个军团只加载一次
          if (!corporationIdDict.has(charCornVo.corporationId)) {
            corporationIdDict.set(charCornVo.corporationId, charCornVo.characterId)
          }
        }
        for (let [corporationId, characterId] of corporationIdDict) {
          try {
            vos.push(await firstValueFrom(this.requestCorporationAssetItemVos(characterId, corporationId)))
          } catch (error) {
            // 角色没有军团资产权限等情况下，跳过该军团，不影响角色资产展示
            console.error(`AssetService.getAssetItemVos 军团[${corporationId}]资产加载失败`, error)
            errors.push(`军团[${corporationId}] 资产加载失败（可能需要军团资产权限）：${this.errorText(error)}`)
          }
        }
      } catch (error) {
        console.error('AssetService.getAssetItemVos 获取军团信息失败', error)
        errors.push(`获取军团信息失败：${this.errorText(error)}`)
      }

      // 存储到缓存中：有失败时不写缓存，避免不完整的数据在有效期内被反复复用
      if (errors.length == 0) {
        try {
          await firstValueFrom(getSetTool.set(this.AssetItemVosCacheKey, vos))
        } catch (error) {
          // 缓存写入失败不影响展示
          console.error('AssetService.getAssetItemVos 写入缓存失败', error)
        }
      }

      sub.next({ vos: vos, errors: errors })
      sub.complete()
    })
  }

  /**
   * 把异常转成可展示的文本
   */
  private errorText(error: any): string {
    if (error == null) return '未知错误'
    if (typeof error == 'string') return error
    if (typeof error?.message == 'string' && error.message != '') return error.message
    if (error?.status != null) return `HTTP ${error.status}${error.statusText ? ' ' + error.statusText : ''}`
    try {
      return JSON.stringify(error)
    } catch {
      return String(error)
    }
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
    return ObservableHelper.createDeferred(async sub => {
      let esiService = await firstValueFrom(this.instanceMessage.esiService)
      let assets = await firstValueFrom(this.requestCharcterAssets(characterId))

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
      /** 星系ids */
      let solarSystemIds = new Set<number>()
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
        // 星系中的资产（行星设施、POS、太空货柜等）
        if (asset.location_type == LocationTypeConstants.SolarSystem) {
          solarSystemIds.add(asset.location_id)
        }
        if (!locationAssetsDict.has(asset.location_id)) {
          locationAssetsDict.set(asset.location_id, [])
        }
        let locationAssets = locationAssetsDict.get(asset.location_id)
        locationAssets?.push(asset)

        itemIds.add(asset.item_id)
        typeIds.add(asset.type_id)
      }

      // 类型与分组字典（名字解析、可命名资产过滤都依赖它）
      let typeDict = await firstValueFrom(this.typeRepository.getTypeDictByTypeIds(Array.from(typeIds)))
      let groupDict = await firstValueFrom(this.typeRepository.getGroupDict())

      // 只有单例资产（舰船/集装箱等）才可能有自定义名字，堆叠物品与蓝图不必请求，
      // 否则容易触发接口 400 并让整个角色的资产加载失败
      let nameableItemIds: number[] = []
      for (let asset of assets) {
        if (!asset.is_singleton) continue
        if (asset.type_id == TYPE_ID_CORPORATION_OFFICE) continue
        let type = typeDict[asset.type_id]
        let group = type?.groupID ? groupDict[type.groupID] : null
        if (group && group.categoryID == CATEGORY_ID_BLUEPRINT) continue
        nameableItemIds.push(asset.item_id)
      }

      // 获取物品名字（失败时降级为类型名，不影响资产列表展示）
      let itemNameDict = new Map<number, string>()
      try {
        itemNameDict = await firstValueFrom(this.getCharacterAssetNameDict(characterId, nameableItemIds))
      } catch (error) {
        console.error(`AssetService.requestCharacterAssetItemVos 角色[${characterId}]资产名字获取失败`, error)
      }

      // 空间站
      for (let stationId of stationIds) {
        let station = await firstValueFrom(this.universeRepository.getStation(stationId))
        let stationName = station?.name ?? `空间站[${stationId}]`
        let stationItemVo = await firstValueFrom(this.getCharacterLocationAssetItemVo(stationId, stationName, characterItemVo.key, locationAssetsDict, itemNameDict, typeDict, groupDict))
        stationItemVo.type = AssetItemTypeConstants.Station
        stationItemVo.typeId = station?.type_id
        characterItemVo.children?.push(stationItemVo)
      }

      // 建筑数据
      for (let structureId of structureIds) {
        let structure = await firstValueFrom(this.universeRepository.getStructure(await firstValueFrom(esiService.getAccessToken(characterId)), structureId))
        let name = structure?.name ?? `无法访问[${structureId}]`
        let structureItemVo = await firstValueFrom(this.getCharacterLocationAssetItemVo(structureId, name, characterItemVo.key, locationAssetsDict, itemNameDict, typeDict, groupDict))
        structureItemVo.type = AssetItemTypeConstants.Structure
        structureItemVo.typeId = structure?.type_id
        characterItemVo.children?.push(structureItemVo)
      }

      // 星系数据
      for (let solarSystemId of solarSystemIds) {
        let solarSystem = await firstValueFrom(this.universeRepository.getSystem(solarSystemId))
        let solarSystemItemVo = await firstValueFrom(this.getSolarSystemAssetItemVo(solarSystemId, solarSystem?.name ?? `星系[${solarSystemId}]`, characterItemVo.key, locationAssetsDict, itemNameDict, typeDict, groupDict))
        characterItemVo.children?.push(solarSystemItemVo)
      }


      sub.next(characterItemVo)
      sub.complete()
    })
  }

  /**
   * 获取军团部门机库名称字典（部门号 => 部门名），调试/测试用
   * @param characterId
   * @param croporationId
   * @returns
   */
  public getCorporationHangarDivisions(characterId: number, croporationId: number): Observable<Map<number, string>> {
    return ObservableHelper.create(async (sub) => {
      let esiService = await firstValueFrom(this.instanceMessage.esiService)
      let assetToken = await firstValueFrom(esiService.getAccessToken(characterId))
      let divisions = await firstValueFrom(this.corporationApi.corporationsDivisions(assetToken, croporationId))
      let hangarDivisionDict = new Map<number, string>()
      for (let division of divisions.hangar ?? []) {
        hangarDivisionDict.set(division.division, division.name)
      }
      sub.next(hangarDivisionDict)
    })
  }

  public requestCorporationAssetItemVos(characterId: number, croporationId: number): Observable<IAssetItemVo> {
    return ObservableHelper.create(async (sub) => {
      let esiService = await firstValueFrom(this.instanceMessage.esiService)
      let assets = await firstValueFrom(this.requestCorporationAssets(characterId, croporationId))
      let assetToken = await firstValueFrom(esiService.getAccessToken(characterId))

      /** 军团数据 */
      let corporation = await firstValueFrom(this.corporationApi.corporation(croporationId))
      let corporationItemVo: IAssetItemVo = {
        id: croporationId,
        type: AssetItemTypeConstants.Corporation,
        name: corporation?.name ?? `军团[${croporationId}]`,
        key: `corporation-${croporationId}`,
        amount: 0,
        children: []
      }

      // 获取军团部门机库名称（部门1-7 => 部门名，如"主仓库""工业制造"）
      let hangarDivisionDict = new Map<number, string>()
      try {
        let divisions = await firstValueFrom(this.corporationApi.corporationsDivisions(assetToken, croporationId))
        for (let division of divisions.hangar ?? []) {
          hangarDivisionDict.set(division.division, division.name)
        }
      } catch (error) {
        // 获取部门名称失败不影响资产展示，机库回退为"军团机库 N"
        console.error('AssetService.requestCorporationAssetItemVos 获取军团部门名称失败', error)
      }

      /** 空间站ids */
      let stationIds = new Set<number>()
      /** 建筑ids */
      let structureIds = new Set<number>()
      /** 星系ids */
      let solarSystemIds = new Set<number>()
      /** [地点id => 地点内物品]字典的 */
      let locationAssetsDict: Map<number, IEisAsset[]> = new Map()
      /** 物品ids */
      let itemIds = new Set<number>()
      /** 类型ids */
      let typeIds = new Set<number>()
      /** 可能被玩家自定义命名的资产 [itemId => typeId]：单例（舰船/集装箱等），排除堆叠物品与军团办公室 */
      let nameableTypeIdMap = new Map<number, number>()
      /** 物品型位置ids（办公室/舰船等容器所在的位置，需进一步判定是否为外部建筑） */
      let itemLocationIds = new Set<number>()

      for (let i = 0; i < assets.length; i++) {
        let asset = assets[i]
        if (asset.location_type == LocationTypeConstants.Station) {
          stationIds.add(asset.location_id)
        }
        // 其他可存放物品的建筑
        if (asset.location_type == "item" && asset.location_flag == LocationFlagConstants.Hangar) {
          structureIds.add(asset.location_id) // 建筑
        }
        // 物品型位置（办公室/舰船等容器所在的位置），先收集，等全部物品 id 收集完后再判定其中的外部建筑
        if (asset.location_type == LocationTypeConstants.Item) {
          itemLocationIds.add(asset.location_id)
        }
        // 星系中的资产（行星设施、POS、太空货柜等）
        if (asset.location_type == LocationTypeConstants.SolarSystem) {
          solarSystemIds.add(asset.location_id)
        }
        if (!locationAssetsDict.has(asset.location_id)) {
          locationAssetsDict.set(asset.location_id, [])
        }
        let locationAssets = locationAssetsDict.get(asset.location_id)
        locationAssets?.push(asset)

        itemIds.add(asset.item_id)
        typeIds.add(asset.type_id)

        // 可自定义命名的候选：单例资产（舰船/集装箱等），堆叠物品与军团办公室不支持命名
        if (asset.is_singleton && asset.type_id != TYPE_ID_CORPORATION_OFFICE) {
          nameableTypeIdMap.set(asset.item_id, asset.type_id)
        }
      }

      // 物品型位置若不在资产列表中（即不是可见容器），说明它是外部建筑（如军团办公室所在的建筑）
      for (let itemLocationId of itemLocationIds) {
        if (!itemIds.has(itemLocationId)) {
          structureIds.add(itemLocationId)
        }
      }

      // 物品类型与分组字典（名字解析、可命名资产过滤都依赖它）
      let typeDict = await firstValueFrom(this.typeRepository.getTypeDictByTypeIds(Array.from(typeIds)))
      let groupDict = await firstValueFrom(this.typeRepository.getGroupDict())

      // 军团 assets/names 接口仅对"有自定义名字"的单例资产（舰船/集装箱等）返回名字；
      // 堆叠物品、军团办公室、蓝图一旦混入请求就会整体 400，因此先过滤候选（蓝图再按分类排除）
      let nameableItemIds: number[] = []
      for (let [nameableItemId, typeId] of nameableTypeIdMap) {
        let type = typeDict[typeId]
        let group = type?.groupID ? groupDict[type.groupID] : null
        if (group && group.categoryID == CATEGORY_ID_BLUEPRINT) continue
        nameableItemIds.push(nameableItemId)
      }

      // 获取物品自定义名字（无自定义名的资产会被二分剔除）
      let itemNameDict = await firstValueFrom(this.getCorporationAssetNameDict(assetToken, croporationId, nameableItemIds))

      // 空间站
      for (let stationId of stationIds) {
        let station = await firstValueFrom(this.universeRepository.getStation(stationId))
        let stationItemVo = await firstValueFrom(this.getCorporationLocationAssetItemVo(stationId, station.name, corporationItemVo.key, locationAssetsDict, itemNameDict, typeDict, groupDict, hangarDivisionDict))
        stationItemVo.type = AssetItemTypeConstants.Station
        stationItemVo.typeId = station.type_id
        corporationItemVo.children?.push(stationItemVo)
      }

      // 建筑数据
      for (let structureId of structureIds) {
        let structure = await firstValueFrom(this.universeRepository.getStructure(await firstValueFrom(esiService.getAccessToken(characterId)), structureId))
        let name = structure?.name ?? `无法访问[${structureId}]`
        let structureItemVo = await firstValueFrom(this.getCorporationLocationAssetItemVo(structureId, name, corporationItemVo.key, locationAssetsDict, itemNameDict, typeDict, groupDict, hangarDivisionDict))
        structureItemVo.type = AssetItemTypeConstants.Structure
        structureItemVo.typeId = structure?.type_id
        corporationItemVo.children?.push(structureItemVo)
      }

      // 星系数据
      for (let solarSystemId of solarSystemIds) {
        let solarSystem = await firstValueFrom(this.universeRepository.getSystem(solarSystemId))
        let solarSystemItemVo = await firstValueFrom(this.getSolarSystemAssetItemVo(solarSystemId, solarSystem?.name ?? `星系[${solarSystemId}]`, corporationItemVo.key, locationAssetsDict, itemNameDict, typeDict, groupDict))
        corporationItemVo.children?.push(solarSystemItemVo)
      }

      console.debug("locationAssetsDict", locationAssetsDict)

      sub.next(corporationItemVo)
      sub.complete()
    });
  }

  /**
   * 请求军团资产的名字
   * @deprecated 可能不使用这个方法
   * @param accessToken 角色授权码
   * @param croporationId 军团ID
   * @param itemIds
   * @returns
   */
  private requestCorporationAssetsNames(accessToken: string, croporationId: number, itemIds: number[]): Observable<IEsiAssetsNames[]> {
    return ObservableHelper.create(async(sub) => {
      const COUNT = 1000 // 单次请求最大物品数量
      let requestNum = itemIds.length / COUNT;
      let requestObsArr = []
      let startIndex = 0
      for (let i = 0; i <= requestNum; i++) {
        let tmpItemIds = i == requestNum ? itemIds.slice(startIndex) : itemIds.slice(startIndex, startIndex + COUNT)
        requestObsArr.push(this.assetApi.corporationsAssetsNames(accessToken, croporationId, tmpItemIds))
        startIndex += COUNT
      }
      let namesArr = await firstValueFrom(forkJoin(requestObsArr))
      let assetsItemNames: IEsiAssetsNames[] = []

      for (let i = 0; i < namesArr.length; i++) {
        let names = namesArr[i]
        assetsItemNames.push(...names)
      }

      sub.next(assetsItemNames)
      sub.complete()
    })

    // return this.assetApi.corporationsAssetsNames(accessToken, croporationId, itemIds)
  }

  /**
   * 获取角色空间站/建筑中的物品信息
   * @param locationId
   * @param locationName
   * @param parentKey
   * @param locationAssetsDict
   * @param itemNameDict
   * @param typeDict
   * @param groupDict
   * @returns
   */
  private getCharacterLocationAssetItemVo(
    locationId: number,
    locationName: string,
    parentKey: string,
    locationAssetsDict: Map<number, IEisAsset[]>,
    itemNameDict: Map<number, string>,
    typeDict: SdeTypeDict,
    groupDict: SdeGroupDict
  ): Observable<IAssetItemVo> {
    return ObservableHelper.createDeferred(async sub => {
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
        // 本地SDE可能缺少该分组（例如新版本物品），缺少时按物品机库处理，不能让整页加载失败
        let group = groupDict[type.groupID]
        let categoryId = group?.categoryID

        /** 第二层物品或容器 */
        let secondIemVo: IAssetItemVo = {
          id: asset.item_id,
          type: AssetItemTypeConstants.Item,
          typeId: asset.type_id,
          name: this.getAssetName(asset, itemNameDict, typeDict),
          amount: asset.quantity,
          quantity: asset.quantity,
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
                typeId: itemAsset.type_id,
                name: this.getAssetName(itemAsset, itemNameDict, typeDict),
                amount: itemAsset.quantity,
                quantity: itemAsset.quantity,
                key: `${locationItemVo.key}-${itemAsset.item_id}`,
              }
              secondIemVo.children?.push(itemVo)
            }
          }
        }
      }
      sub.next(locationItemVo)
      sub.complete()
    })
  }

  /**
   * 获取军团地点中的物品信息（按 location_flag 分组到对应的部门机库）
   * @param locationId
   * @param locationName
   * @param parentKey
   * @param locationAssetsDict
   * @param itemNameDict
   * @param typeDict
   * @param groupDict
   * @param hangarDivisionDict 部门机库名称字典（部门号 => 部门名）
   * @returns
   */
  private getCorporationLocationAssetItemVo(
    locationId: number,
    locationName: string,
    parentKey: string,
    locationAssetsDict: Map<number, IEisAsset[]>,
    itemNameDict: Map<number, string>,
    typeDict: SdeTypeDict,
    groupDict: SdeGroupDict,
    hangarDivisionDict: Map<number, string>
  ): Observable<IAssetItemVo> {
    return ObservableHelper.create(async(sub) => {
      let locationItemVo: IAssetItemVo = {
        id: locationId,
        type: AssetItemTypeConstants.Station,
        name: locationName,
        amount: 0,
        key: `${parentKey}-${locationId}`,
        children: []
      }

      // 按 location_flag 分组（同一个机库内的物品归到一组）
      let flagAssetsDict: Map<string, IEisAsset[]> = new Map()
      let addAssetToFlag = (flag: string, asset: IEisAsset) => {
        if (!flagAssetsDict.has(flag)) {
          flagAssetsDict.set(flag, [])
        }
        flagAssetsDict.get(flag)?.push(asset)
      }

      for (let locationAsset of locationAssetsDict.get(locationId) ?? []) {
        // 军团办公室容器（type_id=27）是部门机库的集合，本身不展示：穿透，把内部物品按各自的部门机库 flag 归组
        if (locationAsset.type_id == TYPE_ID_CORPORATION_OFFICE) {
          for (let officeAsset of locationAssetsDict.get(locationAsset.item_id) ?? []) {
            addAssetToFlag(officeAsset.location_flag, officeAsset)
          }
          continue
        }
        addAssetToFlag(locationAsset.location_flag, locationAsset)
      }

      // 机库展示顺序（部门机库1-7、递送、办公室文件夹等），只生成有资产的机库
      let flagOrder: string[] = [
        LocationFlagConstants.CorpSAG1,
        LocationFlagConstants.CorpSAG2,
        LocationFlagConstants.CorpSAG3,
        LocationFlagConstants.CorpSAG4,
        LocationFlagConstants.CorpSAG5,
        LocationFlagConstants.CorpSAG6,
        LocationFlagConstants.CorpSAG7,
        LocationFlagConstants.CorpSAG0,
        LocationFlagConstants.CorpDeliveries,
        LocationFlagConstants.CorporationGoalDeliveries,
        LocationFlagConstants.OfficeFolder,
        LocationFlagConstants.AssetSafety,
      ]
      for (let flag of flagAssetsDict.keys()) {
        if (!flagOrder.includes(flag)) {
          flagOrder.push(flag)
        }
      }

      // 每个机库节点：机库内挂物品/存储柜，存储柜内部递归挂物品
      for (let flag of flagOrder) {
        let flagAssets = flagAssetsDict.get(flag)
        if (!flagAssets || flagAssets.length == 0) continue

        let hangarItemVo: IAssetItemVo = {
          id: locationId,
          type: AssetItemTypeConstants.StationHangar,
          name: this.getCorporationHangarName(flag, hangarDivisionDict),
          amount: 0,
          key: `${locationItemVo.key}-${flag}`,
          children: []
        }
        for (let asset of flagAssets) {
          hangarItemVo.children?.push(this.getCorporationAssetItemVo(asset, hangarItemVo.key, locationAssetsDict, itemNameDict, typeDict))
        }
        locationItemVo.children?.push(hangarItemVo)
      }

      sub.next(locationItemVo)
      sub.complete()
    })
  }

  /**
   * 获取军团机库内的物品/存储柜信息（存储柜内部递归挂载物品）
   * @param asset
   * @param parentKey
   * @param locationAssetsDict
   * @param itemNameDict
   * @param typeDict
   * @returns
   */
  private getCorporationAssetItemVo(
    asset: IEisAsset,
    parentKey: string,
    locationAssetsDict: Map<number, IEisAsset[]>,
    itemNameDict: Map<number, string>,
    typeDict: SdeTypeDict
  ): IAssetItemVo {
    let itemVo: IAssetItemVo = {
      id: asset.item_id,
      type: AssetItemTypeConstants.Item,
      typeId: asset.type_id,
      name: this.getAssetName(asset, itemNameDict, typeDict),
      amount: asset.quantity,
      quantity: asset.quantity,
      key: `${parentKey}-${asset.item_id}`,
      children: []
    }

    // 存储柜/舰船等容器内部的物品（递归）
    if (locationAssetsDict.has(asset.item_id)) {
      for (let childAsset of locationAssetsDict.get(asset.item_id) ?? []) {
        itemVo.children?.push(this.getCorporationAssetItemVo(childAsset, itemVo.key, locationAssetsDict, itemNameDict, typeDict))
      }
    }
    return itemVo
  }

  /**
   * 获取军团机库名称（根据 location_flag 判断属于哪个部门的机库，部门机库优先显示军团自定义的部门名）
   * @param flag
   * @param hangarDivisionDict 部门机库名称字典（部门号 => 部门名）
   * @returns
   */
  private getCorporationHangarName(flag: string, hangarDivisionDict: Map<number, string>): string {
    if (flag == LocationFlagConstants.CorpSAG1) return hangarDivisionDict.get(1) ?? "军团机库 1"
    if (flag == LocationFlagConstants.CorpSAG2) return hangarDivisionDict.get(2) ?? "军团机库 2"
    if (flag == LocationFlagConstants.CorpSAG3) return hangarDivisionDict.get(3) ?? "军团机库 3"
    if (flag == LocationFlagConstants.CorpSAG4) return hangarDivisionDict.get(4) ?? "军团机库 4"
    if (flag == LocationFlagConstants.CorpSAG5) return hangarDivisionDict.get(5) ?? "军团机库 5"
    if (flag == LocationFlagConstants.CorpSAG6) return hangarDivisionDict.get(6) ?? "军团机库 6"
    if (flag == LocationFlagConstants.CorpSAG7) return hangarDivisionDict.get(7) ?? "军团机库 7"
    if (flag == LocationFlagConstants.CorpSAG0) return "军团机库 0"
    if (flag == LocationFlagConstants.CorpDeliveries) return "军团递送"
    if (flag == LocationFlagConstants.CorporationGoalDeliveries) return "军团目标递送"
    if (flag == LocationFlagConstants.OfficeFolder) return "办公室文件夹"
    if (flag == LocationFlagConstants.AssetSafety) return "资产安全"
    if (flag == LocationFlagConstants.Deliveries) return "递送"
    if (flag == LocationFlagConstants.Hangar) return "机库"
    if (flag == LocationFlagConstants.HangarAll) return "全部机库"
    if (flag == LocationFlagConstants.ShipHangar) return "舰船机库"
    if (flag == LocationFlagConstants.FleetHangar) return "舰队机库"
    if (flag == LocationFlagConstants.InfrastructureHangar) return "基础设施机库"
    return `其他[${flag}]`
  }

  /**
   * 获取星系中的物品信息（行星设施、POS、太空货柜等，直接平铺在星系节点下）
   * @param solarSystemId
   * @param solarSystemName
   * @param parentKey
   * @param locationAssetsDict
   * @param itemNameDict
   * @param typeDict
   * @param groupDict
   * @returns
   */
  private getSolarSystemAssetItemVo(
    solarSystemId: number,
    solarSystemName: string,
    parentKey: string,
    locationAssetsDict: Map<number, IEisAsset[]>,
    itemNameDict: Map<number, string>,
    typeDict: SdeTypeDict,
    groupDict: SdeGroupDict
  ): Observable<IAssetItemVo> {
    return ObservableHelper.createDeferred(async sub => {
      let solarSystemItemVo: IAssetItemVo = {
        id: solarSystemId,
        type: AssetItemTypeConstants.SolarSystem,
        name: solarSystemName,
        amount: 0,
        key: `${parentKey}-${solarSystemId}`,
        children: []
      }

      // 遍历星系中的物品
      let solarSystemAssets = locationAssetsDict.get(solarSystemId)
      for (let asset of solarSystemAssets ?? []) {
        /** 第二层物品或容器 */
        let secondItemVo: IAssetItemVo = {
          id: asset.item_id,
          type: AssetItemTypeConstants.Item,
          typeId: asset.type_id,
          name: this.getAssetName(asset, itemNameDict, typeDict),
          amount: asset.quantity,
          quantity: asset.quantity,
          key: `${solarSystemItemVo.key}-${asset.item_id}`,
          children: []
        }
        solarSystemItemVo.children?.push(secondItemVo)

        // 容器内的物品
        if (locationAssetsDict.has(asset.item_id)) {
          for (let itemAsset of locationAssetsDict.get(asset.item_id) ?? []) {
            let itemVo: IAssetItemVo = {
              id: itemAsset.item_id,
              type: AssetItemTypeConstants.Item,
              typeId: itemAsset.type_id,
              name: this.getAssetName(itemAsset, itemNameDict, typeDict),
              amount: itemAsset.quantity,
              quantity: itemAsset.quantity,
              key: `${solarSystemItemVo.key}-${itemAsset.item_id}`,
            }
            secondItemVo.children?.push(itemVo)
          }
        }
      }

      sub.next(solarSystemItemVo)
      sub.complete()
    })
  }

  /**
   * 请求角色下所有的资源信息
   */
  private requestCharcterAssets(characterId: number): Observable<IEisAsset[]> {
    return ObservableHelper.createDeferred(async sub => {
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
    })
  }

  /**
   * 请求军团下所有的资源信息
   * @param croporationId
   * @returns
   */
  private requestCorporationAssets(characterId: number, croporationId: number): Observable<IEisAsset[]> {
    return ObservableHelper.create(async (sub) => {
      let esiService = await firstValueFrom(this.instanceMessage.esiService)
      let pageValue = await firstValueFrom(this.esiApi.corporationsAssets(await firstValueFrom(esiService.getAccessToken(characterId)), croporationId))
      let assets = pageValue.data;
      if (pageValue.size > 1) {
        for (let page = 2; page <= pageValue.size; page++) {
          let nextPageValue = await firstValueFrom(this.esiApi.corporationsAssets(await firstValueFrom(esiService.getAccessToken(characterId)), croporationId, page))
          assets.push(...nextPageValue.data)
        }
      }
      sub.next(assets)
      sub.complete()
    });
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
   * 获取角色资源名字列表
   * @param characterId
   * @param itemIds
   * @returns
   */
  private getCharacterAssetNameDict(characterId: number, itemIds: number[]): Observable<Map<number, string>> {
    return ObservableHelper.createDeferred(async sub => {
      let esiService = await firstValueFrom(this.instanceMessage.esiService)
      let accessToken = await firstValueFrom(esiService.getAccessToken(characterId))

      let itemDict = await this.requestAssetNames(itemIds, 1000, ids => this.esiApi.charactersAssetsNames(accessToken, characterId, ids))

      sub.next(itemDict)
      sub.complete()
    })
  }

  /**
   * 获取军团资源名字字典
   * @param accessToken
   * @param corporationId
   * @param itemIds
   * @returns
   */
  private getCorporationAssetNameDict(accessToken: string, corporationId: number, itemIds: number[]): Observable<Map<number, string>> {
    return ObservableHelper.createDeferred(async sub => {
      let itemDict = await this.requestAssetNames(itemIds, 50, ids => this.assetApi.corporationsAssetsNames(accessToken, corporationId, ids))

      sub.next(itemDict)
      sub.complete()
    })
  }

  /**
   * 分批请求资产的自定义名字。
   * ESI 对含"没有自定义名字"的资产的批次会整体返回 400，
   * 因此对失败的批次二分重试到单个资产，无法命名的直接跳过，不影响资产列表展示。
   * @param itemIds 待查询的资产id
   * @param chunkSize 单批数量
   * @param request 实际发请求的方法
   */
  private async requestAssetNames(
    itemIds: number[],
    chunkSize: number,
    request: (ids: number[]) => Observable<IEsiAssetsNames[]>
  ): Promise<Map<number, string>> {
    let itemDict = new Map<number, string>()
    if (itemIds.length == 0) {
      return itemDict
    }

    const run = async (ids: number[]) => {
      if (ids.length == 0) return
      try {
        let list = await firstValueFrom(request(ids))
        for (let item of list) {
          if (item.name != 'None') {
            itemDict.set(item.item_id, item.name)
          }
        }
      } catch (error) {
        if (ids.length == 1) return // 单个资产没有自定义名字，跳过
        let middle = Math.floor(ids.length / 2)
        await run(ids.slice(0, middle))
        await run(ids.slice(middle))
      }
    }

    for (let i = 0; i < itemIds.length; i += chunkSize) {
      await run(itemIds.slice(i, i + chunkSize))
    }

    return itemDict
  }

  /**
   * 根据角色获取所有军团id
   * @param characterIds
   * @returns
   */
  private getCorporationIds(characterIds: number[]): Observable<number[]> {
    return ObservableHelper.createDeferred(async sub => {
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
    })
  }

  /**
   * 获取角色对应军团的VO列表
   * @param characterIds
   * @returns
   */
  private getCharacterCorporationVos(characterIds: number[]): Observable<ICharacterCorporationVo[]> {
    return ObservableHelper.create(async(sub) => {
      // 单个角色查询失败不影响其他角色
      let vos = await Promise.all(characterIds.map(async characterId => {
        try {
          return await firstValueFrom(this.getCharacterCorporation(characterId))
        } catch (error) {
          console.error(`AssetService.getCharacterCorporationVos 角色[${characterId}]军团信息获取失败`, error)
          return { characterId: characterId, corporationId: 0, name: '' } as ICharacterCorporationVo
        }
      }))
      sub.next(vos)
      sub.complete()
    })
  }

  /**
   * 获取角色对应军团的VO
   * @param characterId
   * @returns
   */
  private getCharacterCorporation(characterId: number): Observable<ICharacterCorporationVo> {
    return ObservableHelper.create(async(sub) => {
      let character = await firstValueFrom(this.esiApi.character(characterId))
      if (character.corporation_id == null || character.corporation_id == undefined) {
        sub.next({
          characterId: characterId,
          corporationId: 0,
          name: '',
        })
        sub.complete()
        return
      }
      sub.next({
        characterId: characterId,
        corporationId: character.corporation_id,
        name: character.name,
      })
      sub.complete()
    })
  }
}
