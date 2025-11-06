import http from "http";
import { Command } from "commander";
import fs from "fs";
const program = new Command();

program
  .requiredOption("-h, --host <host>", "host")
  .requiredOption("-p, --port <port>", "port")
  .requiredOption("-c, --cache <path>", "cache directory");

program.parse(process.argv);

const { host, port, cache } = program.opts();

//створення директорії кешу
if (!fs.existsSync(cache)) {
  fs.mkdirSync(cache);
}

//створення сервера
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Server is running");
});

server.listen(port, host, () => {
  console.log(`Server started on http://${host}:${port}`);
});
