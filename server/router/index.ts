/*
 * @Author: E-Dreamer
 * @Date: 2022-12-08 16:39:15
 * @LastEditTime: 2022-12-09 14:57:23
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import * as path from 'path'
import { SwaggerRouter } from 'koa-swagger-decorator'
const router = new SwaggerRouter()

router.swagger({
  title: '商城api',
  description: 'API DOC',
  version: '0.0.1',
  prefix: '',
  // [optional] default is /swagger-html
  swaggerHtmlEndpoint: '/swagger-html',

  // [optional] default is /swagger-json
  swaggerJsonEndpoint: '/swagger-json',
  swaggerOptions: {
    securityDefinitions: {
      api_key: {
        type: 'apiKey',
        in: 'header',
        name: 'api_key',
      },
    },
  },
  // swaggerConfiguration: {
  //   display: {
  //     defaultModelsExpandDepth: 4, // The default expansion depth for models (set to -1 completely hide the models).
  //     defaultModelExpandDepth: 3, // The default expansion depth for the model on the model-example section.
  //     docExpansion: 'list', // Controls the default expansion setting for the operations and tags. 
  //     defaultModelRendering: 'model' // Controls how the model is shown when the API is first rendered. 
  //   }
  // }
})

// 查找对应目录下的controller类
router.mapDir(path.resolve(__dirname, '../controller/'));
export default router