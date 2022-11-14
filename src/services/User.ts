import {action, makeAutoObservable, observable} from 'mobx';
import {sessionService} from './Session';
import type {BasicProfile} from '@datamodels/identity-profile-basic';
import {BasicProfileService} from '@oneverse/identify/lib/services/BasicProfileService';
import {goBack} from '../core/navigation';
import {PhotoAlbum} from '@aomi/react-native-media-manager';
import {makeMobxState} from "../mobx/mobx-manager";

export class User {
    service: BasicProfileService | undefined;

    @observable
    loading = false;

    @observable
    basicProfile: BasicProfile | undefined = undefined;

    constructor() {
        makeMobxState(this, {resettable: true});
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

    /**
     * 更新用户信息
     * @param profile 用户信息
     */
    async updateProfile(profile: BasicProfile) {
        if (this.loading) {
            return;
        }
        this.loading = true;
        try {
            const newProfile = {
                ...this.basicProfile,
                ...profile,
            };
            await this.service?.updateProfile(newProfile);
            this.basicProfile = newProfile;
            goBack();
            console.log('身份更新成功');
        } finally {
            this.loading = false;
        }
    }

    /**
     * 更新头像
     */
    async updateAvatar(media: PhotoAlbum) {
        if (this.loading) {
            return;
        }
        this.loading = true;
        try {
            const path = media.edited?.path;
            const file = {
                uri: path,
                name: path?.substring(path?.lastIndexOf('/') + 1),
            } as any;
            const formData = new FormData();
            formData.append('file', file);
            // const reuslt = await ipfsService.add(formData as any);
            // console.log(reuslt);
        } finally {
            this.loading = false;
        }
    }
}

export const userService = new User();
