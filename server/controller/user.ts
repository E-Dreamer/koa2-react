
/*
 * @Author: E-Dreamer
 * @Date: 2022-12-09 09:33:51
 * @LastEditTime: 2022-12-15 15:44:52
 * @LastEditors: E-Dreamer
 * @Description: 
 */

import { Msg } from './../utils/index';
import { userModel } from "../models/index";
import { request, summary, query, security, tags, responses, formData } from 'koa-swagger-decorator'
import path from 'path';
import { upload } from '../utils/index'
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
    ctx.set('Content-Type', 'multipart/form-data')
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
      ctx.status = 500
      ctx.body = Msg.error(err.message || '删除失败')
    }
  }
  @request('post', '/upload')
  @summary('上传接口')
  @tags(['用户'])
  @security([{ api_key: [] }])
  @formData({ file: { type: 'file' } })
  @responses({
    200: { description: 'success' },
    400: { description: 'error' }
  })
  static async upload(ctx: any) {
    const file = ctx.request.files.file;
    if (!file) {
      ctx.status = 500;
      ctx.body = Msg.error('上传文件为空，请重新操作')
      return
    }
    // console.log('FILE',file);
    // server/uploads
    const dir = path.resolve(__dirname, '../uploads')
    // 单文件上传
    if (!file.length) {
      upload(dir, file.filepath, file.newFilename)
      ctx.status = 200;
      ctx.body = Msg.success('上传成功', `${ctx.origin}/${file.newFilename}`)
    } else {
      let result = []
      //多文件上传
      for (let key in file) {
        upload(dir, file[key].filepath, file[key].newFilename)
        result.push(`${ctx.origin}/${file[key].newFilename}`)
      }
      ctx.status = 200;
      ctx.body = Msg.success('上传成功', result)
    }

  }
}