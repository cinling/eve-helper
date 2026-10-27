
/**
 * 书签
 */
export interface IEsiBookmark {
  bookmark_id: number
  coordinates?: IEsiBookmarkCoordinates
  created: string
  creator_id: number
  folder_id?: number
  item?: IEsiBookmarkItem
  label: string
  location_id: number
  notes?: string
}

/**
 * 书签坐标
 */
export interface IEsiBookmarkCoordinates {
  x: number
  y: number
  z: number
}

/**
 * 书签物品
 */
export interface IEsiBookmarkItem {
  item_id: number
  type_id: number
}

/**
 * 书签文件夹
 */
export interface IEsiBookmarkFolder {
  folder_id: number
  name: string
}
