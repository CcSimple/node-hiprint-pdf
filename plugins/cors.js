import fp from "fastify-plugin";
import cors from "@fastify/cors";

// export default fp(async (fastify) => {
//   fastify.register(cors, {});
// });
export default fp(async (fastify) => {
  fastify.register(cors, {
    origin: true, // 允许所有来源，也可以指定具体的域名，例如 "http://example.com"
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization"],
    // credentials: true, // 如果需要支持 cookie 等凭证信息
  });
});