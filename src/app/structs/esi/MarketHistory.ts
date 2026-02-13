/**
 *
 average*	number($double)
title: get_markets_region_id_history_average
average number
date*	string($date)
title: get_markets_region_id_history_date
The date of this historical statistic entry
highest*	number($double)
title: get_markets_region_id_history_highest
highest number
lowest*	number($double)
title: get_markets_region_id_history_lowest
lowest number
order_count*	integer($int64)
title: get_markets_region_id_history_order_count
Total number of orders happened that day
volume*	integer($int64)
title: get_markets_region_id_history_volume
Total
 */
export interface IEsiMarketHistory {
  average: number
  date: string
  highest: number
  lowest: number
  order_count: number
  volume: number
}