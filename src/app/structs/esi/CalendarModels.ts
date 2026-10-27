
/**
 * 日历事件概要
 */
export interface IEsiCalendarEventSummary {
  event_date: string
  event_id: number
  event_response: 'declined' | 'not_responded' | 'accepted' | 'tentative'
  importance: number
  title: string
}

/**
 * 日历事件
 */
export interface IEsiCalendarEvent {
  date: string
  duration: number
  event_id: number
  importance: number
  owner_id: number
  owner_name: string
  owner_type: string
  response: string
  text: string
  title: string
}

/**
 * 日历事件的参加者
 */
export interface IEsiCalendarAttendee {
  character_id?: number
  event_response: 'declined' | 'not_responded' | 'accepted' | 'tentative'
}

/**
 * 日历事件类型
 */
export interface IEsiCalendarEventTypes {
  event_date: string
  event_response: 'declined' | 'not_responded' | 'accepted' | 'tentative'
  importance: number
  title: string
}
