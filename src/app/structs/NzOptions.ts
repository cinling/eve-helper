import {TemplateRef} from '@angular/core';

export interface NzOption {
  label: string | number | TemplateRef<any>
  value: any
  key?: string | number
  disabled?: boolean
  hide?: boolean
  groupLabel?: string | TemplateRef<any>
}