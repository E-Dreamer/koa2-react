
/*
 * @Author: E-Dreamer
 * @Date: 2022-12-09 09:33:51
 * @LastEditTime: 2022-12-19 13:42:36
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import fs from 'fs'
import { Msg } from './../utils/index';
import { userModel } from "../models/index";
import { request, summary, query, security, tags, responses, formData } from 'koa-swagger-decorator'
import UploadController from '../utils/upload';
import path from 'path';
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
    UploadController.uploadfiles(ctx)
  }
  @request('post', '/uploadfilebig')
  @summary('上传大文件接口 分片')
  @tags(['用户'])
  @security([{ api_key: [] }])
  @formData({ file: { type: 'file' } })
  @responses({
    200: { description: 'success' },
    400: { description: 'error' }
  })
  static async uploadfilebig(ctx: any) {
    UploadController.uploadfilebig(ctx)
  }
  @request('post', '/uploadfilebig-merge')
  @summary('上传大文件接口 分片')
  @tags(['用户'])
  @security([{ api_key: [] }])
  @formData({ file: { type: 'file' } })
  @responses({
    200: { description: 'success' },
    400: { description: 'error' }
  })
  static async uploadfilebigMerge(ctx: any) {
    UploadController.uploadfilebigMerge(ctx)
  }
  @request('post', '/uploadfilebig-inspect')
  @summary('检查大文件')
  @tags(['用户'])
  @security([{ api_key: [] }])
  @formData({ file: { type: 'file' } })
  @responses({
    200: { description: 'success' },
    400: { description: 'error' }
  })
  static async uploadfilebigInspect(ctx: any) {
    UploadController.uploadfilebigInspect(ctx)
  }

  @request('post', '/download')
  @summary('下载接口')
  @tags(['用户'])
  @security([{ api_key: [] }])
  @responses({
    200: { description: 'success' },
    400: { description: 'error' }
  })
  static async download(ctx: any) {
    const fileArr = ctx.request.body;
    const filePath = fileArr[0]
    const filename = filePath.substring(filePath.lastIndexOf('/'), filePath.length)
    var stats = fs.statSync(path.join(__dirname, `../uploads/${filePath}`));
    ctx.set('Content-Type', 'application/octet-stream');
    ctx.set('Content-Disposition', 'attachment; filename=' + filename);
    ctx.set('Content-Length', stats.size);
    ctx.body = fs.createReadStream(path.join(__dirname, `../uploads/${filePath}`))
  }
}