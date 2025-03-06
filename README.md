# node hiprint pdf/image server

Node server for generating [vue-plugin-hiprint](https://github.com/ccsimple/vue-plugin-hiprint) print templates in HTML, PDF, image . .

## framework

- [node](https://nodejs.cn/) ^18.x
- [puppeteer](https://pptr.nodejs.cn/) ^23.x
- [fastify](https://fastify.dev/) ^4.x
- [vue-plugin-hiprint](https://github.com/CcSimple/vue-plugin-hiprint)

## run

```bash
# 1
git clone https://github.com/CcSimple/node-hiprint-pdf.git
# 2
cd node-hiprint-pdf
# 3
npm i --registry https://registry.npmmirror.com
# 4
npm run start
```

## docker

```bash
docker compose up -d
```

## api

| type | api   | desc  | options                                                        |
| ---- | ----- | ----- | -------------------------------------------------------------- |
| POST | /img  | image | {template:{}, printData:{}, options:{}, url:'', noFile: false} |
| POST | /pdf  | pdf   | {template:{}, printData:{}, options:{}, url:'',noFile: false}  |
| POST | /html | html  | {template:{}, printData:{}, options:{}, url:'',noFile: false}  |

## options

- template: [vue-plugin-hiprint](https://github.com/CcSimple/vue-plugin-hiprint) 模板 json
- printData: 打印数据 json
- options: api 对应 puppeteer 配置
  - /img [https://pptr.dev/api/puppeteer.screenshotoptions](https://pptr.dev/api/puppeteer.screenshotoptions)
  - /pdf [https://pptr.dev/api/puppeteer.pdfoptions](https://pptr.dev/api/puppeteer.pdfoptions)
  - /html [nothing]()
- url: 自定义渲染页面（替换内置的 public\vue-plugin-hiprint\index.html）
- noFile: 是否不生成文件(img,pdf,html)，默认 false 不生成文件

## example

```js
import axios from "axios";
import template from "./template";
import printData from "./printData";

// pdf
axios.post("/pdf", {
  template,
  printData,
});

// img
axios.post("/img", {
  template,
  printData,
});

// html
axios.post("/html", {
  template,
  printData,
});
```

#### 都看到这里了，点个 star 吧！

## di~

![ww.png](./images/ww.png)
