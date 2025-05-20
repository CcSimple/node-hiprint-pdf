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

| type | api   | desc  | options                                                                                   |
| ---- | ----- | ----- | ----------------------------------------------------------------------------------------- |
| POST | /img  | image | {template:{}, printData:{}, options:{}, url:'', noFile: false}                            |
| POST | /pdf  | pdf   | {template:{}, printData:{}, options:{}, url:'', noFile: false}                            |
| POST | /html | html  | {template:{}, printData:{}, options:{}, url:'', domId: '#hiprintTemplate', noFile: false} |

## options

- template: [vue-plugin-hiprint](https://github.com/CcSimple/vue-plugin-hiprint) 模板 json
- printData: 打印数据 json
- options: api 对应 puppeteer 配置
  - /img [https://pptr.dev/api/puppeteer.screenshotoptions](https://pptr.dev/api/puppeteer.screenshotoptions)
  - /pdf [https://pptr.dev/api/puppeteer.pdfoptions](https://pptr.dev/api/puppeteer.pdfoptions)
  - /html [nothing]()
- url: 自定义渲染页面（替换内置的 public\vue-plugin-hiprint\index.html）
- domId: 获取 html 时 指定的 节点. 默认: '#hiprintTemplate'
- noFile: 是否不生成文件(img,pdf,html)，true:不生成,false:生成. 默认 false

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
  domId: "#hiprintTemplate", // 获取指定节点的 html
});
```

## 在线体验

> 2C4G 服务器,性能较弱.若无法正常访问,可以查看文章,获取 demo 源码.

[https://mp.weixin.qq.com/s/a5JnxKnA7a4QVAyeCmBKbA](https://mp.weixin.qq.com/s/a5JnxKnA7a4QVAyeCmBKbA)

![i不简](imp.jpg)

#### 都看到这里了，点个 star 吧！

## di~

![ww.png](./images/ww.png)
