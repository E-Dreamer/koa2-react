/*
 * @Author: E-Dreamer
 * @Date: 2022-12-26 09:45:09
 * @LastEditTime: 2022-12-26 15:29:01
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import { useRoutes } from 'react-router-dom'
import routes from './routes';

const Router = () => {
  const router = useRoutes(routes)
  return router;
}

export default Router;