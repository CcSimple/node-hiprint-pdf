# 使用官方Node.js基础镜像（这里用了镜像：国内网络环境问题...）
FROM hub.rat.dev/library/node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json文件和package-lock.json文件（如果存在）
COPY package*.json .

# 设置环境变量
ENV NODE_ENV prd

# 安装项目依赖
RUN npm config set registry https://registry.npmmirror.com/

RUN npm install --production --force

# 阿里云镜像
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装必要的依赖
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn \
      # 中文字体乱码问题
      ttf-dejavu \
      font-droid-nonlatin \
      msttcorefonts-installer fontconfig && \
      update-ms-fonts && \
      fc-cache -f

# 安装puppeteer依赖
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# 设置时区为上海
ENV TZ=Asia/Shanghai

# 设置语言为中文
ENV LANG=zh_CN.UTF-8

# 安装 puppeteer
RUN yarn config set registry https://registry.npmmirror.com
RUN yarn add puppeteer@13.5.0

# 复制项目文件到工作目录
COPY . .

# 暴露容器端口
EXPOSE 3000

# 运行Node.js应用
CMD ["npm", "run", "start"]