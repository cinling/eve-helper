/**
 *
 * 数据结构参考
duration*	integer($int32)
title: get_markets_region_id_orders_duration
duration integer
is_buy_order*	boolean
title: get_markets_region_id_orders_is_buy_order
is_buy_order boolean

issued*	string($date-time)
title: get_markets_region_id_orders_issued
issued string
location_id*	integer($int64)
title: get_markets_region_id_orders_location_id
location_id integer

min_volume*	integer($int32)
title: get_markets_region_id_orders_min_volume
min_volume integer

order_id*	integer($int64)
title: get_markets_region_id_orders_order_id
order_id integer

price*	number($double)
title: get_markets_region_id_orders_price
price number
range*	string
title: get_markets_region_id_orders_range
range string
Enum:
Array [ 12 ]
system_id*	integer($int32)
title: get_markets_region_id_orders_system_id
The solar system this order was placed
type_id*	integer($int32)
title: get_markets_region_id_orders_type_id
type_id integer

volume_remain*	integer($int32)
title: get_markets_region_id_orders_volume_remain
volume_remain integer

volume_total*	integer($int32)
title: get_markets_region_id_orders_volume_total
volume_total integer
 */

export interface IEsiOrder {
  duration: number
  is_buy_order: boolean
  issued: string
  /**
   * 空间站ID
   */
  location_id: number
  min_volume: number
  order_id: number
  price: number
  range: string
  /**
   * 星系id
   */
  system_id: number
  type_id: number
  volume_remain: number
  volume_total: number
}