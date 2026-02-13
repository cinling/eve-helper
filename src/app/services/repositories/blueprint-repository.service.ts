import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { IBlueprint } from '../../statics/entities/Blueprint';
import { IWaitUntilInit, WaitUntilInitFuncImpl } from '../../statics/interfaces/IWaitUntilInit';
import { ObservableValue } from '../../structs/ObservableValue';

@Injectable({
  providedIn: 'root'
})
export class BlueprintRepositoryService {

  constructor(
    private httpClient: HttpClient
  ) {
    this.init().subscribe()
  }

  private blueprintDictOv: ObservableValue<BlueprintDict> = new ObservableValue()


  /**
   * 初始化蓝图数据
   *
   * @returns
   */
  private init(): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      let dict = await firstValueFrom(this.httpClient.get<{[key: number]: IBlueprint}>("/assets/blueprints.gen.json"))
      this.blueprintDictOv.setValue(dict)

      sub.next()
      sub.complete()
    })})
  }

  /**
   * 获取蓝图数据
   *
   * @returns
   */
  getBlueprintDict(): Observable<BlueprintDict> {
    return this.blueprintDictOv
  }

  /**
   * 获取所有可以制造的物品id列表
   *
   * @returns
   */
  public getManufacturingProductTypeIds(): Observable<number[]> {
    return new Observable(sub => {setTimeout(async() => {
      let blueprintDict = await firstValueFrom(this.getBlueprintDict())
      let typeIdSet = new Set<number>()
      for (let i in blueprintDict) {
        let blueprint = blueprintDict[i]
        let products = blueprint.activities.manufacturing?.products ?? []
        for (let j = 0; j < products.length; j++) {
          let product = products[j]
          typeIdSet.add(product.typeID)
        }
      }

      sub.next([...typeIdSet])
      sub.complete()
    })})
  }

  /**
   * 获取蓝图数据
   * @param blueprintTypeId 蓝图id（物品id） 【注意：不是产品物品id】
   * @returns
   */
  public getBlueprint(blueprintTypeId: number): Observable<IBlueprint | null> {
    return new Observable(sub => {setTimeout(async() => {
      let blueprintDict = await firstValueFrom(this.getBlueprintDict())
      sub.next(blueprintDict[blueprintTypeId] ?? null)
      sub.complete()
    })})
  }

  /**
   * 判断是不是蓝图物品
   * @param typeId 物品id
   */
  isBlueprint(typeId: number): Observable<boolean> {
    return new Observable(sub => {setTimeout(async() => {
      let blueprint = await firstValueFrom(this.getBlueprint(typeId))
      sub.next(blueprint != null)
      sub.complete()
    })})
  }
}


type BlueprintDict = {[blueprintTypeId: number]: IBlueprint}