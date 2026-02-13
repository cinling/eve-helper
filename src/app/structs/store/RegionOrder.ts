
import { TimeHelper } from "../../statics/helpers/TimeHelper"
import { IEsiOrder } from "../esi/Order"


export interface IStoreRegionOrder {
  regionId: number
  orders: IEsiOrder[]
  mtime: number
}

export function createRegionOrder(retionId: number, orders: IEsiOrder[]): IStoreRegionOrder {
  return {
    regionId: retionId,
    orders: orders,
    mtime: TimeHelper.timestampMS()
  }
}
