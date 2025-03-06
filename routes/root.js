import PuppeteerHtmlExport from "../lib/puppeteer-html-export.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "..", "public");

const todayDir = () => {
  // yyyy-mm-dd
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const today = `${year}-${month}-${day}`;
  const dir = path.join(publicPath, "files", today);
  console.log(dir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return `files/${today}`;
};
const randomId = () => {
  return Date.now() + "-" + Math.random().toString(36).slice(2);
};

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    return "微信公众号: 不简说" + todayDir();
  });
  fastify.get("/template", async function (request, reply) {
    const cacheId = request.query.id;
    const value = await new Promise((resolve, reject) => {
      fastify.cacheman.get(cacheId, (err, value) => {
        if (err) throw err;
        resolve(value);
      });
    });
    if (value) {
      reply.send({ code: 1, msg: "ok", data: value });
    } else {
      reply.send({ code: 0, msg: "no cache", data: null });
    }
  });
  fastify.post("/img", async function (request, reply) {
    try {
      const cacheId = randomId();
      const cacheTime = request.query.time || 1 * 60; // 60s
      const data = request.body;
      console.log("cacheId", cacheId);
      console.log("query", request.query);
      console.log("data", data);
      const host = `${request.protocol}://${request.hostname}`;
      const url = data.url || `${host}/vue-plugin-hiprint/index.html`;
      fastify.cacheman.set(cacheId, data, cacheTime, (err, value) => {
        if (err) throw err;
      });
      // 更多参数见: https://pptr.dev/api/puppeteer.screenshotoptions
      const name = `/${todayDir()}/${cacheId}.png`;
      const options = {
        fullPage: true,
        path: `${publicPath}${name}`, // 保存路径, 没有则不会保存文件, 保存文件 存在 io 异步问题
        ...data.options,
      };
      if (data.noFile) {
        delete options.path;
      }
      console.log(options);
      const phe = new PuppeteerHtmlExport();
      const base64 = await phe.screenshot(`${url}?id=${cacheId}`, options);
      const res = {
        code: 1,
        msg: "success",
        data: `${host}${name}`, // 返回保存的路径
        // data: `data:image/png;base64,${base64}`,
      };
      if (data.noFile) {
        res.data = `data:image/png;base64,${base64}`;
      }
      reply.send(res);
    } catch (error) {
      console.log("createImage error", error);
      reply.send({
        code: 0,
        msg: error,
        data: null,
      });
    }
    return;
  });
  fastify.post("/pdf", async function (request, reply) {
    try {
      const cacheId = randomId();
      const cacheTime = request.query.time || 1 * 60; // 60s
      const data = request.body;
      console.log("cacheId", cacheId);
      console.log("query", request.query);
      console.log("data", data);
      const host = `${request.protocol}://${request.hostname}`;
      const url = data.url || `${host}/vue-plugin-hiprint/index.html`;
      fastify.cacheman.set(cacheId, data, cacheTime, (err, value) => {
        if (err) throw err;
      });
      // 更多参数见: https://pptr.dev/api/puppeteer.pdfoptions
      const name = `/${todayDir()}/${cacheId}.pdf`;
      const options = {
        // width: "240mm",
        // height: "140mm",
        path: `${publicPath}${name}`, // 保存路径, 没有则不会保存文件, 保存文件 存在 io 异步问题
        ...data.options,
      };
      if (data.noFile) {
        delete options.path;
      }
      console.log(options);
      const phe = new PuppeteerHtmlExport();
      const buffer = await phe.createPdf(`${url}?id=${cacheId}`, options);
      const res = {
        code: 1,
        msg: "success",
        data: `${host}${name}`, // 保存文件的路径
        // data: buffer, // 返回 buffer
      };
      if (data.noFile) {
        res.data = buffer;
      }
      reply.send(res);
    } catch (error) {
      console.log("createPdf error", error);
      reply.send({
        code: 0,
        msg: error,
        data: null,
      });
    }
  });
  fastify.post("/html", async function (request, reply) {
    try {
      const cacheId = randomId();
      const cacheTime = request.query.time || 1 * 60; // 60s
      const data = request.body;
      console.log("cacheId", cacheId);
      console.log("query", request.query);
      console.log("data", data);
      const host = `${request.protocol}://${request.hostname}`;
      const url = data.url || `${host}/vue-plugin-hiprint/index.html`;
      fastify.cacheman.set(cacheId, data, cacheTime, (err, value) => {
        if (err) throw err;
      });
      // 更多参数见: https://pptr.dev/api/puppeteer.pdfoptions
      const name = `/${todayDir()}/${cacheId}.html`;
      const options = {
        ...data.options,
      };
      console.log(options);
      const phe = new PuppeteerHtmlExport();
      const htmlContent = await phe.htmlContent(`${url}?id=${cacheId}`, options);
      if (!data.noFile) {
        fs.writeFileSync(`${publicPath}${name}`, htmlContent);
      }
      const res = {
        code: 1,
        msg: "success",
        data: `${htmlContent}`,
      };
      if (data.noFile) {
        res.data = buffer;
      }
      reply.send(res);
    } catch (error) {
      console.log("createHtml error", error);
      reply.send({
        code: 0,
        msg: error,
        data: null,
      });
    }
  });
}
