/*
 * @Author: E-Dreamer
 * @Date: 2022-12-26 11:36:49
 * @LastEditTime: 2022-12-26 11:39:30
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import { RoutesArr,RouteObj } from '@/router/routes';
/**
 * @description: 递归查询对应的路由
 * @param {string} path 当前访问地址
 * @param {RoutesArr} routes 路由列表
 * @return {*} array
 */
export function searchRoute(path:string,routes:RoutesArr = []):RouteObj {
  let result :RouteObj = {}
  for(let item of routes){
    if (item.path === path) return item;
    if (item.children) {
      const res = searchRoute(path, item.children);
      if (Object.keys(res).length) result = res;
    }
  }
  return result;
}