/*
 * @Author: E-Dreamer
 * @Date: 2022-12-26 09:45:09
 * @LastEditTime: 2022-12-26 11:34:19
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import { useRoutes } from 'react-router-dom'
import routes from './routes';
const Router = (props: any) => {
  const router = useRoutes(routes)
  return router;
}

export default Router;