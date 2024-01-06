import { http } from '@/utils/http/axios';

/**
 * @description: 角色列表
 */
export function getRoleList(params) {
  return http.request({
    url: '/auth/role/list',
    method: 'GET',
    params
  },
  {
    isTransformResponse: false,
  });
}

export function disableRole(params){
  return http.request({
    url: '/auth/role/disable',
    method: 'GET',
    params
  },
  {
    isTransformResponse: false,
  })
}

export function enableRole(params){
  return http.request({
    url: '/auth/role/enable',
    method: 'GET',
    params
  },
  {
    isTransformResponse: false,
  })
}

export function addRole(params){
  return http.request({
    url: '/auth/role/add',
    method: 'POST',
    params
  },
  {
    isTransformResponse: false,
  })
}

export function getIds(){
  return http.request({
    url: '/auth/role/ids',
    method: 'GET',
  },
  {
    isTransformResponse: false,
  })
}

export function getUsers(params){
  return http.request({
    url: '/auth/user',
    method: 'GET',
    params
  },
  {
    isTransformResponse: false,
  })
}

export function addUser(params){
  return http.request({
    url: '/auth/user/add',
    method: 'POST',
    params
  },
  {
    isTransformResponse: false,
  })
}