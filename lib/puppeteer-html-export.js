import puppeteer from "puppeteer";
// 往对象中添加键
const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach((key) => {
    result[key];
  });
  return result;
};
const isUrl = (url) => {
  if (!url) return false;
  if (url.startsWith("http://") || url.startsWith("https://")) return true;
  return false;
};

export default class PuppeteerHtmlExport {
  constructor() {
    this.args = ["--no-sandbox", "--disable-setuid-sandbox"];
    this.browser = null;
    this.options = {};
    this.browserPromise = null;
    this.autoCloseBrowser = true;
  }

  async setOptions(options) {
    this.options = options;
    this.browserPromise = await this.initializeBrowser();
  }

  async getPage() {
    await this.browserPromise;
    if (!this.browser) {
      throw new Error("Browser not initialized");
    }
    const page = await this.browser.newPage();
    this.setPageHeaders(page);
    return page;
  }

  /**
   * 前往url/html 等等，等待dom加载完成
   * @param {*} page
   * @param {*} content url/html
   */
  async waitGoToDomContentLoaded(page, content) {
    const timeout = this.options.timeout ? { timeout: this.options.timeout } : {};
    if (isUrl(content)) {
      await page.goto(content, { waitUntil: ["domcontentloaded", "networkidle0"], ...timeout });
    } else {
      await page.setContent(content, { waitUntil: "networkidle0", ...timeout });
    }
  }

  /**
   * 等等模板加载完成
   * @param {*} page
   * @param {*} loadImage 是否等待加载图片
   */
  async waitTemplateLoaded(page, loadImage = true) {
    // 等待 hiprint 打印模板加载完成
    await page.waitForSelector(".hiprint-printTemplate", { visible: true, timeout: 60 * 1000 });
    // 等待 图片 加载完成
    if (loadImage) {
      await page.evaluate(() => {
        var images = document.querySelectorAll("img");
        function preLoad() {
          var promises = [];
          function loadImage(img) {
            return new Promise(function (resolve, reject) {
              if (img.complete) {
                resolve(img);
              }
              img.onload = function () {
                resolve(img);
              };
              img.onerror = function (e) {
                resolve(img);
              };
            });
          }
          for (var i = 0; i < images.length; i++) {
            promises.push(loadImage(images[i]));
          }
          return Promise.all(promises);
        }
        return preLoad();
      });
    }
  }

  async createPdf(content, options = {}) {
    await this.setOptions(options);
    const page = await this.getPage();
    await this.waitGoToDomContentLoaded(page, content);
    // 等待 hiprint 打印模板加载完成
    await this.waitTemplateLoaded(page);
    // 生成 PDF
    const pdfBuffer = await this.generatePDF(page);
    await this.closeBrowserIfNeeded();
    return pdfBuffer;
  }

  async screenshot(content, options = {}) {
    await this.setOptions(options);
    const page = await this.getPage();
    await this.waitGoToDomContentLoaded(page, content);
    // 等待 hiprint 打印模板加载完成
    await this.waitTemplateLoaded(page);
    // 生成截图
    const base64 = await this.generateScreenshot(page);
    await this.closeBrowserIfNeeded();
    return base64;
  }

  async htmlContent(content, options = {}) {
    await this.setOptions(options);
    const page = await this.getPage();
    await this.waitGoToDomContentLoaded(page, content);
    // 等待 hiprint 打印模板加载完成
    await this.waitTemplateLoaded(page, false);
    //// 获取整个html内容
    // const html = await page.content();
    //// 获取页面body的 HTML 内容
    // const html = await page.$eval("body", (body) => body.innerHTML);
    // 获取指定元素的 HTML 内容
    const html = await page.$eval(options.domId || "#hiprintTemplate", (element) => element.innerHTML);
    await this.closeBrowserIfNeeded();
    return html;
  }

  setAutoCloseBrowser(flag) {
    this.autoCloseBrowser = flag;
  }

  async closeBrowserIfNeeded() {
    if (this.browser && this.autoCloseBrowser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async initializeBrowser() {
    if (this.browser) {
      return;
    }

    try {
      if (this.options?.args) {
        this.args = this.options.args;
      }
      const headless = this.options?.headless !== undefined ? this.options.headless : "new";

      const launchOptions = {
        args: this.args,
        headless,
      };

      if (this.options?.executablePath) {
        launchOptions.executablePath = this.options.executablePath;
      }

      this.browser = await puppeteer.launch(launchOptions);

      this.browser.on("disconnected", () => {
        this.browser = null;
      });

      this.browser.on("error", (error) => {
        console.error("Browser error:", error);
      });
    } catch (error) {
      throw new Error(`Failed to connect to browser: ${error.message}`);
    }
  }

  setPageHeaders(page) {
    const headers = {
      ...(this.options?.authorization ? { Authorization: this.options.authorization } : {}),
      ...(this.options?.headers || {}),
    };

    if (Object.keys(headers).length > 0) {
      page.setExtraHTTPHeaders(headers);
    }
  }

  async generatePDF(page) {
    const data = await page.pdf({
      ...omit(this.options, ["authorization", "executablePath", "args", "headless", "headers"]),
      printBackground: this.options.printBackground ?? true,
    });
    return Buffer.from(data);
  }

  async generateScreenshot(page) {
    const havePath = this.options.path;
    const data = await page.screenshot({
      ...omit(this.options, ["authorization", "executablePath", "args", "headless", "headers"]),
      encoding: havePath ? "binary" : "base64",
    });
    // return Buffer.from(data);
    return data;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async closeBrowserTabs() {
    const pages = await this.browser.pages();
    for (let i = 1; i < pages.length; i++) {
      await pages[i].close();
    }
  }
}
