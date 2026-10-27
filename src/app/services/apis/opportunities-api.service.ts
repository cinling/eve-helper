import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { IEsiOpportunityCompleted, IEsiOpportunityGroup, IEsiOpportunityTask } from '../../structs/esi/OpportunityModels';

@Injectable({
  providedIn: 'root'
})
export class OpportunitiesApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取所有机遇任务组的id
   * @returns
   */
  opportunityGroups(): Observable<number[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/opportunities/groups/`)
      .pipe(map(response => response as number[]))
  }

  /**
   * 获取机遇任务组
   * @param groupId
   * @returns
   */
  opportunityGroup(groupId: number): Observable<IEsiOpportunityGroup> {
    return this.httpClient.get(`${ESI_BASE_URL}/opportunities/groups/${groupId}/`)
      .pipe(map(response => response as IEsiOpportunityGroup))
  }

  /**
   * 获取所有机遇任务的id
   * @returns
   */
  opportunityTasks(): Observable<number[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/opportunities/tasks/`)
      .pipe(map(response => response as number[]))
  }

  /**
   * 获取机遇任务
   * @param taskId
   * @returns
   */
  opportunityTask(taskId: number): Observable<IEsiOpportunityTask> {
    return this.httpClient.get(`${ESI_BASE_URL}/opportunities/tasks/${taskId}/`)
      .pipe(map(response => response as IEsiOpportunityTask))
  }

  /**
   * 获取角色已完成的任务列表
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersOpportunities(accessToken: string, characterId: number): Observable<IEsiOpportunityCompleted[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/opportunities/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiOpportunityCompleted[]))
  }
}
