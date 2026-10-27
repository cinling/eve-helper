
/**
 * 邮件概要
 */
export interface IEsiMailHeader {
  from?: number
  is_read?: boolean
  labels?: number[]
  mail_id: number
  recipients?: IEsiMailRecipient[]
  subject?: string
  timestamp?: string
}

/**
 * 邮件收件人
 */
export interface IEsiMailRecipient {
  recipient_id: number
  recipient_type: 'alliance' | 'character' | 'corporation' | 'mailing_list'
}

/**
 * 邮件标签
 */
export interface IEsiMailLabel {
  color?: string
  label_id: number
  name: string
  unread_count?: number
}

/**
 * 邮件标签列表
 */
export interface IEsiMailLabels {
  labels?: IEsiMailLabel[]
  total_unread_count?: number
}

/**
 * 邮件
 */
export interface IEsiMail {
  body?: string
  from?: number
  labels?: number[]
  mail_id?: number
  read?: boolean
  recipients?: IEsiMailRecipient[]
  subject?: string
  timestamp?: string
}

/**
 * 发送邮件的数据
 */
export interface IEsiMailSend {
  approved_cost?: number
  body: string
  recipients: IEsiMailRecipient[]
  subject: string
}

/**
 * 发送邮件的结果
 */
export interface IEsiMailCreated {
  new_mail_id?: number
}
