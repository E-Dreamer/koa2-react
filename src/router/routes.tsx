
/*
 * @Author: E-Dreamer
 * @Date: 2022-12-26 09:55:08
 * @LastEditTime: 2022-12-26 15:27:19
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom'
import lazyLoad from './lazyLoad';

import Home from '@/pages/home/index'

export type RouteObj = RouteObject & {
  meta?: {
    requiresAuth: boolean,
    title: string,
    key: string
  }
}
export type RoutesArr = RouteObj[]

const routes: RoutesArr = [
  {
    meta: {
      requiresAuth: false,
      title: '登录页',
      key: 'login'
    },
    path: '/login',
    element: lazyLoad(lazy(() => import('@/pages/login/index')))
  },
  {
    meta: {
      requiresAuth: false,
      title: '首页',
      key: 'home'
    },
    path: '/',
    element: <Home />,
  },
  {
    meta: {
      requiresAuth: false,
      title: '404页面',
      key: '404'
    },
    path: '/404',
    element: lazyLoad(lazy(() => import('@/pages/404/index')))
  },
  {
    path: '*',
    element: <Navigate to='/404' />
  }
]

export default routes;

