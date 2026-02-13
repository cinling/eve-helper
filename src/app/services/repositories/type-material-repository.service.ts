import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ITypeMaterial } from '../../statics/entities/TypeMaterial';
import { IWaitUntilInit, WaitUntilInitFuncImpl } from '../../statics/interfaces/IWaitUntilInit';

@Injectable({
  providedIn: 'root'
})
export class TypeMaterialRepositoryService implements IWaitUntilInit {

  constructor(
    private httpClient: HttpClient
  ) {
    this.init().subscribe(() => {
      console.log("TypeMaterialRepositoryService.init DONE")
    })
  }

  private typeMaterialDict: {[typeId: number]: ITypeMaterial} = {}
  isInit = false
  waitUntilInit(): Observable<void> { return WaitUntilInitFuncImpl(this) }



  public init(): Observable<void> {
    return new Observable<void>(sub => { setTimeout(async() => {
      this.typeMaterialDict = await firstValueFrom(this.httpClient.get<{[key: number]: ITypeMaterial}>("/assets/typeMaterials.gen.json"))
      sub.next()
      sub.complete()
      this.isInit = true
    }) })
  }

  public getTypeMaterialDict(): Observable<{[typeId: number]: ITypeMaterial} > {
    return new Observable(sub => {setTimeout(async () => {
       await firstValueFrom(this.waitUntilInit())
       sub.next(this.typeMaterialDict)
       sub.complete()
    })})
  }

  /**
   * 获取所有可以通过配方合成的 TypeIds
   */
  public getTypeIds(): Observable<number[]> {
    return new Observable<number[]>(sub => {setTimeout(async() => {
      let typeMaterialDict = await firstValueFrom(this.getTypeMaterialDict())

      let typeIds: number[] = []
      for (let typeId in typeMaterialDict) {
        typeIds.push(parseInt(typeId))
      }

      sub.next(typeIds)
      sub.complete()
    })})
  }
}
