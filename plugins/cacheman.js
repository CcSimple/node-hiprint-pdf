import fp from "fastify-plugin";
import fastifyCacheman from "fastify-cacheman";

export default fp(async (fastify) => {
  fastify.register(fastifyCacheman, {
    // 使用文件缓存
    // engine: "file",

    // 使用内存缓存
    engine: "memory",

    // 使用 redis 缓存
    // engine: 'redis',
    // port: 6379,
    // host: '127.0.0.1',
    // password: 'my-p@ssw0rd',
    // database: 1,
  });
});
