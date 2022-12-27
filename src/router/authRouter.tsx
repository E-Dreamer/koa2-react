/*
 * @Author: E-Dreamer
 * @Date: 2022-12-26 11:34:50
 * @LastEditTime: 2022-12-26 15:16:30
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import { searchRoute } from "@/utils";
import { useLocation } from "react-router-dom";
import routes from "./routes";
const AuthRouter = (props: any) => {
  const { pathname } = useLocation()

  const route = searchRoute(pathname, routes)

  // * 判断当前路由是否需要访问权限(不需要权限直接放行)
  if (!route.meta?.requiresAuth) return props.children;

  const staticRouter = ['/', "/404",];
  console.log('staticRouter: ', staticRouter);

  return props.children;
}

export default AuthRouter;