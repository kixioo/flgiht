import { defineStore } from 'pinia';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_SCREENLOCKED } from '@/store/mutation-types';
import { ResultEnum } from '@/enums/httpEnum';

import { getUserInfo as getUserInfoApi, login, register ,verify, forget, forgetVerify,logout} from '@/api/system/user';
import { storage } from '@/utils/Storage';

export type UserInfoType = {
  // TODO: add your own data
  name: string;
  email: string;
};

export interface IUserState {
  token: string;
  username: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: UserInfoType;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.username;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getUserInfo(): UserInfoType {
      return this.info;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info: UserInfoType) {
      this.info = info;
    },
    // 登录
    async login(params: any) {
      const response = await login(params);
      const { data, code } = response;
      if (code === ResultEnum.SUCCESS) {
        const ex = 7 * 24 * 60 * 60;
        storage.set(ACCESS_TOKEN, data, ex);
        storage.set(CURRENT_USER, data, ex);
        storage.set(IS_SCREENLOCKED, false);
        this.setToken(data.token);
        this.setUserInfo(data);
      }
      return response;
    },

    async register(params: any){
      const response = await register(params);
      return response;

    },

    async verify(params: any){
      const response = await verify(params);
      return response;
    },

    async forget(params: any){
      const response = await forget(params);
      return response;
    },
    async forgetVerify(params: any){
      const response = await forgetVerify(params);
      return response;
    },
    // 获取用户信息
    async getInfo() {
      const result = await getUserInfoApi();
      console.log(result)
      if (result.permissions && result.permissions.length) {
        const permissionsList = result.permissions;
        this.setPermissions(permissionsList);
        this.setUserInfo(result);
      } else {
        throw new Error('getInfo: permissionsList must be a non-null array !');
      }
      this.setAvatar(result.avatar);
      return result;
    },

    // 登出
    async logout() {
      const response = await logout();
      console.log(response)
      const code = response.code;
      if(code == ResultEnum.SUCCESS){
        this.setPermissions([]);
        this.setUserInfo({ name: '', email: '' });
        storage.remove(ACCESS_TOKEN);
        storage.remove(CURRENT_USER);
        console.log("退出成功")  
      }
      return response;
    },
  },
});


// Need to be used outside the setup
export function useUser() {
  return useUserStore(store);
}
