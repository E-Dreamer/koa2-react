/*
 * @Author: E-Dreamer
 * @Date: 2022-12-09 14:50:12
 * @LastEditTime: 2022-12-14 16:02:56
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import { request, summary, tags, security, body, responses } from "koa-swagger-decorator";
import svgCaptcha from 'svg-captcha'
import JwtAuth from '../middlewares/jwt/index'
import xss from "xss";
import { decrypt, encrypt } from "../utils/bcrypt";
import { Msg } from '../utils/index'
import sequelize from "../config/sequelizeBase";
import { addressModel, scoreModel, userModel } from "../models/index";
const loginSehema = {
  username: { type: 'string', require: true },
  password: { type: ['string', 'number'], require: true },
  code: { type: ['string', 'number'], require: true }
}

export default class Auth {
  @request('post', '/login')
  @summary('登录接口')
  @tags(['用户'])
  @security([{ api_key: [] }])
  @body(loginSehema)
  @responses({
    200: { description: 'success' },
    400: { description: 'error' }
  })
  static async login(ctx: any) {
    let { username, password, code } = ctx.request.body;
    username = xss(username)
    password = xss(password)
    const token = JwtAuth.signUserToken({ username }, { expiresIn: '1h' })
    if (code !== ctx.session.code) {
      ctx.status = 200;
      ctx.body = Msg.error('验证码错误')
    }
    try {
      const user = await userModel.findOne({ where: { username } })
      if (user && decrypt(password, user?.dataValues.password)) {
        ctx.status = 200;
        ctx.body = Msg.success('登录成功', 'Bearer ' + token)
      } else {
        ctx.status = 200;
        ctx.body = Msg.error('用户名或者密码错误')
      }

    } catch (err: any) {
      ctx.status = 200;
      ctx.body = Msg.error(err.message || '登录失败')
    }
  }
  @request('get', '/code')
  @summary('获取图片验证码')
  @tags(['用户'])
  @security([{ api_key: [] }])
  @responses({
    200: { description: 'success' },
    400: { description: 'error' }
  })
  static async code(ctx: any) {
    const cap = svgCaptcha.create({
      size: 4,   //验证码个数
      width: 160,  //宽
      height: 60,  //高
      fontSize: 50,  //验证码字体大小
      ignoreChars: "0oO1ilI",  // 验证码字符中排除 0o1i
      noise: 2,   //干扰线条的数量
      color: true,   //验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
      background: "#eee",  // 验证码图片背景颜色
    });

    let img = cap.data;//验证码
    ctx.status = 200
    if (!img) {
      ctx.body = Msg.error('获取img失败')
      return;
    }
    // ctx.session.code 验证码文字忽略大小写
    ctx.session.code = cap.text.toLowerCase();
    ctx.response.type = "image/svg+xml"; //设置返回的数据格式
    ctx.body = img;
  }
  @request('post', '/register')
  @summary('注册用户')
  @tags(['用户'])
  @security([{ api_key: [] }])
  @responses({
    200: { description: 'success' },
    400: { description: 'error' }
  })
  static async register(ctx: any) {
    let { username, password } = ctx.request.body
    password = encrypt(password)
    console.log('password: ', password);
    const has = await userModel.findAll({ where: { username } })
    if (has.length) {
      ctx.body = Msg.error('已存在用户名')
      return;
    }
    try {
      const res = await userModel.create({ username, password })
      ctx.body = Msg.success('新增成功')
    } catch (err: any) {
      ctx.body = Msg.error(err.message || '新增失败')
    }
  }
  @request('get', '/ceshiQuery')
  @summary('测试联表查询 原始查询')
  @tags(['用户'])
  @security([{ api_key: [] }])
  @responses({
    200: { description: 'success' },
    400: { description: 'error' }
  })
  static async ceshiQuery(ctx: any) {
    try {
      const [res] = await sequelize.query('select user_id,address,username,status from user right join address on user.id = address.user_id')
      ctx.status = 200;
      ctx.body = Msg.success('查询成功', res)
    } catch (err: any) {
      ctx.status = 200;
      ctx.body = Msg.error(err.message || '查询失败')
    }
  }
  @request('get', '/ceshi')
  @summary('测试联表查询 使用sequelize关联')
  @tags(['用户'])
  @security([{ api_key: [] }])
  @responses({
    200: { description: 'success' },
    400: { description: 'error' }
  })
  static async ceshi(ctx: any) {
    try {
      // user表和address表
      // const res = await userModel.findAll({
      //   include: {
      //     model: addressModel,
      //     as: 'address_content',
      //     attributes: ['address','id']
      //   }
      // })
      // user表、score表、address表
      const res = await userModel.findAll({
        include:[
          {
            model:addressModel,
            as:'address_content',
            attributes: ['address','id']
          },
          {
            model:scoreModel,
            as:'score_content',
            attributes:['c_id','s_score']
          }
        ]
      })
      // //处理数据 将address_content里面的数据 放在外层 
      // const data :any[] = []
      // res.map(i=>{
      //   let obj = {
      //     ...i.dataValues,
      //     address:i.dataValues.address_content?.address || null
      //   }
      //   delete obj['address_content']
      //   data.push(obj)
      // })
      
      ctx.status = 200;
      ctx.body = Msg.success('查询成功',res )
    } catch (err: any) {
      ctx.status = 200;
      ctx.body = Msg.error(err.message || '查询失败')
    }
  }
}