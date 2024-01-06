import { http } from '@/utils/http/axios';

export interface BasicResponseModel<T = any> {
  code: number;
  msg: string;
  data: T;
}

export interface BasicPageParams {
  pageNumber: number;
  pageSize: number;
  total: number;
}

export function forget(params){
  return http.request<BasicResponseModel>(
    {
      url: '/account/forget',
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  )
}

export function forgetVerify(params){
  return http.request<BasicResponseModel>(
    {
      url: '/account/forgetVerify',
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  )
}

export function register(params){
  return http.request<BasicResponseModel>(
    {
      url: '/account/register',
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  )
}

export function verify(params){
  return http.request<BasicResponseModel>(
    {
      url: '/account/verify',
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  )
}
/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return http.request({
    url: '/account/admin_info',
    method: 'get',
  });
}

/**
 * @description: 用户登录
 */
export function login(params) {
  return http.request<BasicResponseModel>(
    {
      url: '/account/login',
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 用户修改密码
 */
export function changePassword(params, uid) {
  return http.request(
    {
      url: `/user/u${uid}/changepw`,
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 用户登出
 */
export function logout() {
  return http.request<BasicResponseModel>({
    url: '/account/logout',
    method: 'GET'
  },
  {
    isTransformResponse: false,
  })
}
