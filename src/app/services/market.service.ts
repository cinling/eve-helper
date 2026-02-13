import { Injectable } from '@angular/core';
import { OrderRepositoryService } from './repositories/order-repository.service';
import { firstValueFrom, forkJoin, interval, map, Observable, tap } from 'rxjs';
import { REGION_ID_THE_FORGE } from '../statics/contants/eve';
import { LoadingViewManagerService } from './managers/loading-view-manager.service';
import { LoadingViewItemVo } from '../structs/view/LoadingViewVo';
import { MarketGroupRepositoryService } from './repositories/market-group-repository.service';
import { KeyValueRepositoryService } from './repositories/key-value-repository.service';
import { TimeHelper } from '../statics/helpers/TimeHelper';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { TypeRepositoryService } from './repositories/type-repository.service';
import { IMarketGroup } from '../statics/entities/MarketGroup';
import { IType } from '../statics/entities/Type';
import { MarketNodeType, MarketNodeTypeConstants, MarketTreeMode, MarketTreeModeConstants } from '../statics/contants/market';
import { BlueprintRepositoryService } from './repositories/blueprint-repository.service';
import { IMarketChartsVo } from '../structs/view/MarketChartsVo';
import { EveEsiApiService } from './apis/eve-esi-api.service';
import { IEsiOrder } from '../structs/esi/Order';
import { HttpClient } from '@angular/common/http';
import { CommonMessageService } from './messages/common-message.service';
import { getMarketKeyStationId, getMarketKeySystemId, makeMarketKey } from '../structs/store/Settings';
import { UniverseRepositoryService } from './repositories/universe-repository.service';
import { ImageRepositoryService } from './repositories/image-repository.service';

/**
 * 市场服务
 */
@Injectable({
  providedIn: 'root'
})
export class MarketService {

  constructor(
    private orderRepository: OrderRepositoryService,
    private loadingViewManager: LoadingViewManagerService,
    private marketGroupRepository: MarketGroupRepositoryService,
    private keyValueRepository: KeyValueRepositoryService,
    private typeRepository: TypeRepositoryService,
    private blueprintRepository: BlueprintRepositoryService,
    private eveEsiApi: EveEsiApiService,
    private httpClient: HttpClient,
    private commonMessage: CommonMessageService,
    private universeRepository: UniverseRepositoryService,
    private imageRepository: ImageRepositoryService,
  ) {
    this.constructLoadingItem = this.loadingViewManager.register("market", "市场数据", 1)
    this.init().subscribe(() => {
      this.loadingViewManager.finished(this.constructLoadingItem)
    })
   }

  /**
   * 服务构造函数的加载项目
   */
  private constructLoadingItem: LoadingViewItemVo

  /**
   * 获取节点类型
   * @param node
   * @returns
   */
  getMarketNodeType(node: NzTreeNodeOptions): MarketNodeType {
    node = this.parseNode(node)
    if (node.key.startsWith("mg_")) {
      return MarketNodeTypeConstants.MarketGroup
    }
    return MarketNodeTypeConstants.Type
  }

  /**
   * 获取节点id
   * @param node
   * @returns
   */
  getMarketNodeId(node: NzTreeNodeOptions): number {
    node = this.parseNode(node)
    let nodeType = this.getMarketNodeType(node)
    if (nodeType == MarketNodeTypeConstants.MarketGroup) {
      return Number(node.key.replace("mg_", ""))
    } else if (nodeType == MarketNodeTypeConstants.Type) {
      return Number(node.key.replace("t_", ""))
    }
    return -1
  }

  /**
   * 是不是蓝图节点
   * @param node
   */
  isBlueprintNode(node: NzTreeNodeOptions): boolean {
    node = this.parseNode(node)
    return node['isBlueprint'] ?? false
  }

  /**
   * 解析节点
   * @param node
   * @returns
   */
  private parseNode(node: NzTreeNodeOptions | NzTreeNode): NzTreeNodeOptions {
    if (node instanceof NzTreeNode) {
      return node.origin
    }
    return node
  }

  /**
   * 构建市场分组树节点
   * @param marketGroup
   * @returns
   */
  private makeMarketGroupTreeNode(marketGroup: IMarketGroup): NzTreeNodeOptions {
    return {
      title: marketGroup.name,
      key: `mg_${marketGroup.marketGroupID}`,
      iconId: marketGroup.iconID,
      children: []
    }
  }

  /**
   * 构建物品树节点
   * @param type
   * @returns
   */
  private makeTypeTreeNode(type: IType): Observable<NzTreeNodeOptions> {
    return new Observable(sub => {setTimeout(async() => {
      let node = {
        title: type.name,
        key: `t_${type.typeID}`,
        isLeaf: true,
        isBlueprint: false,
        children: []
      }
      let blueprint = await firstValueFrom(this.blueprintRepository.getBlueprint(type.typeID))
      if (blueprint != null) {
        node.isBlueprint = true
      }
      sub.next(node)
      sub.complete()
    })})
  }

  /**
   * 获取市场树形结构数据
   * @returns
   */
  getMarketTreeNodeOptions(marketTreeMode: MarketTreeMode): Observable<NzTreeNodeOptions[]> {
    let loadingItem = this.loadingViewManager.register("MarketService.getMarketTreeNodeOptions", "市场物品结构 首次加载时间比较久，请耐心等待", 1)
    return new Observable(sub => {setTimeout(async() => {
      let options: NzTreeNodeOptions[] = []

      if (marketTreeMode == MarketTreeModeConstants.Market) {
        options = await firstValueFrom(this.keyValueRepository.getMarketTreeNodes())

        if (options.length == 0) { // 数据库中没有，从http获取已经缓存好的数据
          let result = await firstValueFrom(new Observable(sub => {
            this.httpClient.get("/assets/market-options.cache.json").subscribe({
              next: result => {
                sub.next(result)
                sub.complete()
              },
              error: () => {
                sub.next(null)
                sub.complete()
              }
            })
          }))
          if (result) {
            options = result as NzTreeNodeOptions[]
            await firstValueFrom(this.keyValueRepository.setMarketTreeNodes(options)) // 缓存数据
          }
        }
        if (options.length == 0) { // 缓存中没有，重新加载数据
          let typeDict = await firstValueFrom(this.typeRepository.getTypeDictWhereHasMarketGroupId())
          let typeIds = Object.keys(typeDict).map(key => Number(key))
          options = await firstValueFrom(this.getMarketTreeNodeOptionsByTypeIds(typeIds))
          await firstValueFrom(this.keyValueRepository.setMarketTreeNodes(options)) // 缓存数据
        }
      } else if (marketTreeMode == MarketTreeModeConstants.Blueprint) {
        options = await firstValueFrom(this.keyValueRepository.getMarketBlueprintTreeNodes())
        if (options.length == 0) { // 数据库中没有，从http获取已经缓存好的数据
          let result = await firstValueFrom(new Observable(sub => {
            this.httpClient.get("/assets/market-blueprint-options.cache.json").subscribe({
              next: result => {
                sub.next(result)
                sub.complete()
              },
              error: () => {
                sub.next(null)
                sub.complete()
              }
            })
          }))
          if (result) {
            options = result as NzTreeNodeOptions[]
            await firstValueFrom(this.keyValueRepository.setMarketBlueprintTreeNodes(options)) // 缓存数据
          }
        }
        if (options.length == 0) { // 缓存中没有，重新加载数据
          let typeIds = await firstValueFrom(this.blueprintRepository.getManufacturingProductTypeIds())
          options = await firstValueFrom(this.getMarketTreeNodeOptionsByTypeIds(typeIds))
          await firstValueFrom(this.keyValueRepository.setMarketBlueprintTreeNodes(options)) // 缓存数据
        }
      } else {
        let error = `MarketService.getMarketTreeNodeOptions unknown marketTreeMode: ${marketTreeMode}`
        console.error(error)
        sub.error(error)
      }

      sub.next(options)
      sub.complete()
      this.loadingViewManager.finished(loadingItem)
    })})
  }

  /**
   * 通过物品id列表，组件市场树状数据结构数据
   * @param typeIds
   */
  private getMarketTreeNodeOptionsByTypeIds(typeIds: number[]): Observable<NzTreeNodeOptions[]> {
    return new Observable(sub => {setTimeout(async() => {
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

      // 从第一层开始构建树
      let nodes: NzTreeNodeOptions[] = []
      let topMarketGroups = parentMarketGroupDict[0]
      for (let i in topMarketGroups) {
        let marketGroup = topMarketGroups[i]
        let node = this.makeMarketGroupTreeNode(marketGroup)
        node.children = await firstValueFrom(this.getMarketTreeNodeOptionsChildren(marketGroup, parentMarketGroupDict, marketGroupTypesDict))
        nodes.push(node)
      }

      sub.next(nodes)
      sub.complete()
    })})
  }

  /**
   * 获取市场分组的子项列表，并转为 NzTreeNodeOptions
   * @param marketGroup
   * @param parentMarketGroupDict
   * @returns
   */
  private getMarketTreeNodeOptionsChildren(
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

        let node = this.makeMarketGroupTreeNode(subMarketGroup)
        node.children = await firstValueFrom(this.getMarketTreeNodeOptionsChildren(subMarketGroup, parentMarketGroupDict, marketGroupTypesDict))
        children.push(node)
      }

      // 加入分类所有的物品
      let types = marketGroupTypesDict[marketGroup.marketGroupID] ?? []
      for (let i in types) {
        let type = types[i]
        let typeNode = await firstValueFrom(this.makeTypeTreeNode(type))
        children.push(typeNode)
      }
      sub.next(children)
      sub.complete()
    }) })
  }

  private init(): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      // 定时加载区域订单数据
      interval(5 * 60 * 1000).pipe(tap(async () => {
        await this.autoLoadRegionOrderBySettingsAsync()
      })).subscribe()
      this.autoLoadRegionOrderBySettingsAsync().then()

      let requests = [
        this.initMarketGroupOptions().pipe(map(() => {this.constructLoadingItem.doneStep++})),
        this.getMarketTreeNodeOptions(MarketTreeModeConstants.Market).pipe(map(() => {this.constructLoadingItem.doneStep++})),
        this.getMarketTreeNodeOptions(MarketTreeModeConstants.Blueprint).pipe(map(() => {this.constructLoadingItem.doneStep++})),
      ]
      this.constructLoadingItem.totalStep += requests.length

      await firstValueFrom(forkJoin(requests))
      sub.next()
      sub.complete()
    })})
  }

  private async autoLoadRegionOrderBySettingsAsync(): Promise<void> {
      let settings = await firstValueFrom(this.commonMessage.settings)

      let expireMs = settings.market.expireMin * 60 * 1000
      let now = TimeHelper.timestampMS()


      for (let i in settings.market.stations) {
        let station = settings.market.stations[i]
        let regionId = await firstValueFrom(this.getRegionIdBySystemId(station.systemId))
        let regionOrder = await firstValueFrom(this.orderRepository.getRegionOrder(regionId))
        if (regionOrder == null || regionOrder.mtime + expireMs < now) {
          this.orderRepository.reloadOrdersByRegionId(regionId).subscribe()
        }
      }
  }

  /**
   * 初始化市场分组数据
   * @returns
   */
  private initMarketGroupOptions(): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {

      sub.next()
      sub.complete()
    })})
  }


  /**
   * 自动重新加载地区所有订单的数据
   * @param regionId
   * @param reloadNow
   * @returns
   */
  private autoReloadOrdersByRegionId(regionId: number, reloadNow: boolean = false): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      let needReload = false
      if (reloadNow) {
        needReload = true
      } else {
        // 查询上次更新的时间
        let regionOrder = await firstValueFrom(this.orderRepository.getRegionOrder(regionId))
        if (regionOrder == null || (TimeHelper.timestampMS() - regionOrder.mtime) > 1000 * 60 * 60) { // 没有数据或者1小时前的数据，则重新加载
            needReload = true
        }
      }

      if (!needReload) {
        sub.next()
        sub.complete()
        return
      }

      await firstValueFrom(this.orderRepository.reloadOrdersByRegionId(regionId))
    })})
  }

  /**
   * 获取历史价格信息
   */
  private getHistory(marketKey: string, itemId: number): Observable<IMarketChartsVo> {
    return new Observable(sub => {setTimeout(async() => {
      let regionId = await firstValueFrom(this.getRegionIdByMarketKey(marketKey))
      let historys = await firstValueFrom(this.eveEsiApi.marketsRegionHistory(regionId, itemId))
      let vo: IMarketChartsVo = {
        date: [],
        average: [],
         average_20d: [],
        highest: [],
        lowest: [],
        order_count: [],
        volume: [],
      }

      let computeValue: IComputeAverage20dValue = {
        averages: [],
        volumes: [],
      }

      for (let i in historys) {
        let history = historys[i]
        vo.date.push(history.date)
        vo.average.push(history.average)
        vo.highest.push(history.highest)
        vo.lowest.push(history.lowest)
        vo.order_count.push(history.order_count)
        vo.volume.push(history.volume)

        // 计算20天平均价格
        computeValue.averages.push(history.average)
        computeValue.volumes.push(history.volume)
        if (computeValue.averages.length > 20) {
          computeValue.averages.shift()
          computeValue.volumes.shift()
        }
        let totalSum = 0 // 总售价
        let totalVolume = 0 // 总成交量
        for (let i in computeValue.averages) {
          let average = computeValue.averages[i]
          let volume = computeValue.volumes[i]

          totalSum += average * volume
          totalVolume += volume
        }

        vo.average_20d.push(Number(totalSum / totalVolume))
      }

      sub.next(vo)
      sub.complete()
    })})
  }

  /**
   * 获取市场历史数据
   */
  getHistoryByNode(node: NzTreeNodeOptions, marketKey: string = ''): Observable<IMarketChartsVo> {
    return new Observable(sub =>{setTimeout(async() => {
      node = this.parseNode(node)
      let typeId = this.getMarketNodeId(node)

      let vo = await firstValueFrom(this.getHistory(marketKey, typeId))
      sub.next(vo)
      sub.complete()
    })})
  }

  /**
   * 获取节点的图片
   * @param node
   */
  getNodeImgsrc(node: NzTreeNodeOptions, size: ImgSrcSize = 32): string {
    node = this.parseNode(node)

    if (this.getMarketNodeType(node) == MarketNodeTypeConstants.Type) {
      let typeId = this.getMarketNodeId(node)
      if (this.isBlueprintNode(node)) {
        return this.imageRepository.blueprint(typeId, size)
      }
      return this.imageRepository.typeIcon(typeId, size)
    } else if (this.getMarketNodeType(node) == MarketNodeTypeConstants.MarketGroup) {
      let iconId = node["iconId"] ?? 0
      return this.imageRepository.marketGroupIcon(iconId)
    }

    return ""
  }

  getImgSrcByTypeId(typeId: number, size: 32 | 64 | 128 = 32): Observable<string> {
    return new Observable(sub => {setTimeout(async() => {
      let src: string
      if (await firstValueFrom(this.blueprintRepository.isBlueprint(typeId))) {
        src = this.imageRepository.blueprint(typeId, size)
      } else {
        src = this.imageRepository.typeIcon(typeId, size)
      }
      sub.next(src)
      sub.complete()
    })})
  }

  /**
   * 获取节点的订单数据
   * @param node
   * @returns
   */
  getOrderByNode(node: NzTreeNodeOptions, marketKey: string = ''): Observable<IEsiOrder[]> {
    let typeId = this.getMarketNodeId(node)
    let stationId = getMarketKeyStationId(marketKey)

    return new Observable(sub => {setTimeout(async() => {
      let regionId = await firstValueFrom(this.getRegionIdByMarketKey(marketKey))

      let orders = await firstValueFrom(this.orderRepository.getOrdersByTypeId(regionId, typeId))
      // 空间站数据筛选（如果有）
      orders = orders.filter(order => {
        if (stationId) {
          return order.location_id == stationId
        } else {
          return true
        }
      })
      sub.next(orders)
      sub.complete()
    })})
  }

  private getRegionIdByMarketKey(marketKey: string): Observable<number> {
    return new Observable(sub => {setTimeout(async() => {


      if (marketKey == '') {
        let settings = await firstValueFrom(this.commonMessage.settings)
        marketKey = settings.market.defaultMarketKey
      }

      let systemId = getMarketKeySystemId(marketKey)
      let regionId = await firstValueFrom(this.getRegionIdBySystemId(systemId))
      sub.next(regionId)
      sub.complete
    })})
  }

  private getRegionIdBySystemId(systemId: number): Observable<number> {
    return new Observable(sub => {setTimeout(async() => {
      let regionId = REGION_ID_THE_FORGE
      let system = await firstValueFrom(this.universeRepository.getSystem(systemId))
      if (system == null) {
        console.error(`不存在的星系[systemId: ${systemId}]`)
      } else {
        let constellationId = system.constellation_id
        let constellation = await firstValueFrom(this.universeRepository.getConstellation(constellationId))
        if (constellation != null) {
          regionId = constellation.region_id
        }
      }
      sub.next(regionId)
      sub.complete()
    })})
  }

  /**
   * 获取市场的更新时间
   */
  getMarketKeyUpdateTimestamp(marketKey: string): Observable<number> {
    return new Observable(() => {setTimeout(async() => {
      let regionId = await firstValueFrom(this.getRegionIdByMarketKey(marketKey))
      let regionOrder = await firstValueFrom(this.orderRepository.getRegionOrder(regionId))
      if (regionOrder == null) {

      }
    })})
  }

  /**
   * 获取蓝图默认数据来源的更新时间
   */
  getMarketUpdateTimeArr(): Observable<{label: string, time: string}[]> {
    return new Observable(sub => {this.commonMessage.settings.subscribe(settings => {setTimeout(async() => {
      let results: {label: string, time: string}[] = []
      let marketKeys = [settings.industry.material.marketKey]
      if (settings.industry.product.marketKey != settings.industry.material.marketKey) { // 如果不同市场
        marketKeys.push(settings.industry.product.marketKey)
      }

      let marketKeyDict: {[marketKey: string]: string} = {}
      for (let i in settings.market.stations) {
        let station = settings.market.stations[i]
        let marketKey = makeMarketKey(station)
        marketKeyDict[marketKey] = station.alias
      }


      for (let i in settings.market.stations) {
        let station = settings.market.stations[i]
        let marketKey = makeMarketKey(station)
        let regionId = await firstValueFrom(this.getRegionIdBySystemId(station.systemId))
        let regionOrder = await firstValueFrom(this.orderRepository.getRegionOrder(regionId))
        if (regionOrder == null) {
          console.error(`MarketService.getDefaultBlueprintUpdateTimeArr not found RegionOrder [regionId: ${regionId}]`)
          continue
        }

        results.push({
          label: marketKeyDict[marketKey],
          time: TimeHelper.formatDate(regionOrder.mtime, "MM-DD HH:mm"),
        })
      }

      sub.next(results)
    })})})
  }
}


/**
 * 用于计算20天平均的临时数据
 */
interface IComputeAverage20dValue {
  /**
   * 过往&今日的数据
   */
  averages: number[]

  /**
   * 过往&今日的数据
   */
  volumes: number[]
}

type ImgSrcSize = 32 | 64 | 128