import { http } from '@/utils/http/axios';

/**
 * @description: 根据用户id获取用户菜单
 */
export function adminMenus() {
  return http.request({
    url: '/menus',
    method: 'GET',
  });
}

/**
 * 获取tree菜单列表
 * @param params
 */
export function getMenuList(params?) {
  return http.request({
    url: '/auth/menu/list',
    method: 'GET',
    params,
  },
  {
    isTransformResponse: false,
  });
}

export function updateMenuList(params?) {
  return http.request({
    url: '/auth/menu/update',
    method: 'POST',
    params,
  },
  {
    isTransformResponse: false,
  });
}

