
/**
 * 自动导航航点设置
 */
export interface IEsiUiWaypoint {
  add_to_beginning?: boolean
  clear_other_waypoints: boolean
  destination_id: number
}

/**
 * 打开合同窗口
 */
export interface IEsiUiOpenWindowContract {
  contract_id: number
}

/**
 * 打开信息窗口
 */
export interface IEsiUiOpenWindowInformation {
  target_id: number
}

/**
 * 打开市场详情窗口
 */
export interface IEsiUiOpenWindowMarketDetails {
  type_id: number
}

/**
 * 打开新邮件窗口
 */
export interface IEsiUiNewMail {
  body: string
  recipients: number[]
  subject: string
  to_corp_or_alliance_id?: number
}
