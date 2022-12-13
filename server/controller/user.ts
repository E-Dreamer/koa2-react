/*
 * @Author: E-Dreamer
 * @Date: 2022-12-09 09:33:51
 * @LastEditTime: 2022-12-12 15:53:29
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import { Msg } from './../utils/index';
import userModel from '../models/user'
import { request, summary, query, security, tags, responses } from 'koa-swagger-decorator'
export default class UserController {
  @request('get', '/users')
  @summary('获取用户信息')
  @tags(['用户'])
  @security([{ api_key: [] }])
  @query({
    username: { type: 'string', required: true, default: 'admin', description: 'type' },
  })
  @responses({
    200: { description: 'success' },
    400: { description: 'error' }
  })
  static async getUsers(ctx: any) {
    const { username } = ctx.query;
    try {
      const users = await userModel.findAll({ where: { username } })
      ctx.status = 200;
      ctx.body = Msg.success('查询成功', users)
    } catch (error: any) {
      ctx.status = 200;
      ctx.body = Msg.error(error.message || '查询失败')
    }
  }
  @request('get', '/deleteUser')
  @summary('删除用户')
  @tags(['用户'])
  @security([{ api_key: [] }])
  @responses({
    200: { description: 'success' },
    400: { description: 'error' }
  })
  static async deleteUser(ctx: any) {
    const { id } = ctx.request.query
    try {
      // UPDATE `user` SET `status`=? WHERE `id` = ? 软删除 会将deletedAt对应的字段设置成删除时的时间戳
      const res = await userModel.destroy({ where: { id } })
      // 恢复 
      // const res = await userModel.restore({where:{id}})
      ctx.status = 200
      ctx.body = Msg.success('删除成功')
    } catch (err: any) {
      ctx.status = 200
      ctx.body = Msg.error(err.message || '删除失败')
    }
  }
}