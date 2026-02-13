import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzStatusType, NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { EsiService } from '../../services/esi.service';
import { firstValueFrom } from 'rxjs';
import { ImageRepositoryService } from '../../services/repositories/image-repository.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthCharacterVo } from '../../structs/view/AuthCharacterVo';
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzPopconfirmModule } from "ng-zorro-antd/popconfirm";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    NzStepsModule,
    NzTagModule,
    NzSpinModule,
    NzCardModule,
    NzButtonModule,
    NzToolTipModule,
    NzIconModule,
    NzButtonModule,
    NzDividerModule,
    NzPopconfirmModule,
],
  template: `
<nz-steps [nzCurrent]="stepCurrent" [nzStatus]="stepStatus" nzDirection="vertical">
  <nz-step nzTitle="登录授权" [nzDescription]="loginStepTpl"></nz-step>
  <ng-template #loginStepTpl>
    <a style="cursor: pointer" (click)="onEveSsoLoginClick()">
      <img src="https://web.ccpgamescdn.com/eveonlineassets/developers/eve-sso-login-black-large.png" />
    </a>
  </ng-template>
  <nz-step nzTitle="完成授权" [nzDescription]="successStepTpl"></nz-step>
  <ng-template #successStepTpl>
    <p>声明：授权码（以及网站上一切数据）只保留在本地浏览器中，网站不设有数据服务器，仅通过 github.io 免费托管</p>
    @if (errorMsg) {
      <p>Note: {{ errorMsg }}</p>
    }
    <div class="eh-flow-start-container">
      @for (characterVo of characterVos; track characterVo) {
        <nz-card
          style="width: 256px; margin-right: 8px;"
          [nzCover]="coverTpl"
        >
          <nz-card-meta [nzTitle]="characterVo.characterName" [nzDescription]="descriptionTpl"></nz-card-meta>
        </nz-card>

        <ng-template #coverTpl>
          <img
            [src]="characterVo.imgsrc"
            alt=""
          />
        </ng-template>
        <ng-template #descriptionTpl>
          角色id：{{ characterVo.characterId }}
          <br/>授权状态：{{ accessCheckedDict[characterVo.characterId] ? '可用' : '不可用' }}
          <nz-divider></nz-divider>
          <button
            nz-button
            nzDanger
            nz-popconfirm
            nzPopconfirmTitle="是否确认移除角色ESI授权？"
            (nzOnConfirm)="onRemoveClick(characterVo.characterId)"
          >移除</button>
        </ng-template>
      }
    </div>
  </ng-template>
</nz-steps>
  `,
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  constructor(
    private route: ActivatedRoute,
    private esiService: EsiService,
    private imageRepository: ImageRepositoryService,
  ) {
    this.init()
  }

  stepCurrent = 1

  stepStatus: NzStatusType = "wait"

  errorMsg: String = ''

  /**
   * 授权角色信息
   */
  characterVos: AuthCharacterVo[] = []

  accessCheckedDict: {[characterId: number]: boolean} = {}

  private init() {
    // 重定向回来带 authCode 的处理
    this.route.queryParams.subscribe(params => {setTimeout(async() => {
      if (!params['code']) {
        // 检查是否有可用的授权（如已经授权）
        if (await firstValueFrom(this.esiService.hasAccessToken())) {
          this.stepCurrent = 2
          this.stepStatus = "finish"
        }
        return // 当前不是跳转回来的登录页面
      }
      let authCode = params['code']
      this.stepStatus = "process"
      this.esiService.loginByAuthCode(authCode).subscribe({
        next: () => {
          this.stepCurrent = 2
          this.stepStatus = "finish"
        },
        error: async(err) => {
          // 检查是否有可用的授权（如已经授权）
          if (await firstValueFrom(this.esiService.hasAccessToken())) {
            this.stepCurrent = 2
            this.stepStatus = "finish"
          } else {
            this.stepStatus = "error"
            this.errorMsg = JSON.stringify(err)
          }
        }
      })
    })})


    this.esiService.getChartacterIds().subscribe(async(characterIds) => {
      let vos: AuthCharacterVo[] = []

      for (let i in characterIds) {
        let characterId = characterIds[i]

        let vo: AuthCharacterVo = {
          characterId,
          imgsrc: this.imageRepository.character(characterId, 256),
          characterName: await firstValueFrom(this.esiService.getCharacterName(characterId)),
        }
        vos.push(vo)
      }
      this.characterVos = vos

      for (let characterId of characterIds) {
        this.esiService.check(characterId).subscribe(ok => {
          this.accessCheckedDict[characterId] = ok
        })
      }
    })
  }

  onEveSsoLoginClick() {
    // 设置 ESI 授权的链接地址
    this.esiService.getEsiAuthUrl().subscribe(url => {
      window.location.href = url
    })
  }

  onRemoveClick(characterId: number) {
    this.esiService.removeCharacter(characterId).subscribe(() => {

    })
  }
}
