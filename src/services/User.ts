import {action, makeAutoObservable, observable} from 'mobx';
import {sessionService} from './Session';
import type {BasicProfile} from '@datamodels/identity-profile-basic';
import {BasicProfileService} from '@oneverse/identify/lib/services/BasicProfileService';
import {goBack} from '../core/navigation';

export class User {
  service: BasicProfileService | undefined;

  @observable
  loading = false;

  @observable
  basicProfile: BasicProfile | undefined = undefined;

  constructor() {
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });
    if (!sessionService.didService) {
      console.log('用户未登录');
      goBack();
      return;
    }
    this.service = new BasicProfileService(sessionService.didService);
  }

  @action
  async queryProfile() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      this.basicProfile = await this.service?.getProfile();
    } finally {
      this.loading = false;
    }
  }

  async updateProfile(profile: BasicProfile) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      await this.service?.updateProfile(profile);
      console.log('身份更新成功');
    } finally {
      this.loading = false;
      this.queryProfile();
    }
  }
}

export const userService = new User();
