import fp from "fastify-plugin";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default fp(async (fastify) => {
  const root = path.join(__dirname, "..", "public");
  fastify.register(fastifyStatic, {
    root: root,
  });
});
