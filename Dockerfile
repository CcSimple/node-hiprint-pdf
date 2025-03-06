# 配置镜像
# sudo tee /etc/docker/daemon.json <<EOF
# {
#     "registry-mirrors": [
#         "https://docker.anyhub.us.kg",
#         "https://dockerhub.jobcher.com",
#         "https://dockerhub.icu",
#     ]
# }
# EOF
# sudo systemctl daemon-reload
# sudo systemctl restart docker

# docker build -t node-puppeteer .
# docker run -d --name node-puppeteer -p 3000:3000  node-puppeteer:latest
# docker stop node-puppeteer
# docker rm node-puppeteer

# 使用官方Node.js基础镜像
FROM hub.rat.dev/library/node:18-alpine3.19

# 设置工作目录
WORKDIR /app

# 复制package.json文件和package-lock.json文件（如果存在）
COPY package*.json .

# 安装项目依赖
RUN npm config set registry https://registry.npmmirror.com/

RUN npm install

# 阿里云镜像
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn \
      ttf-dejavu \
      font-droid-nonlatin \
      msttcorefonts-installer fontconfig && \
      update-ms-fonts && \
      fc-cache -f

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# 设置时区为上海
ENV TZ=Asia/Shanghai

# 设置语言为中文
ENV LANG=zh_CN.UTF-8

RUN yarn add puppeteer@13.5.0

# 复制项目文件到工作目录
COPY . .

# 暴露容器端口
EXPOSE 3000

# 运行Node.js应用
CMD ["npm", "run", "start"]