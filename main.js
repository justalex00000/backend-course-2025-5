import http from "http";
import { Command } from "commander";
import fs from "fs";
import path from "path";

const { readFile, writeFile, unlink } = fs.promises;

const program = new Command();

program
  .requiredOption("-h, --host <host>", "host")
  .requiredOption("-p, --port <port>", "port")
  .requiredOption("-c, --cache <path>", "cache directory");

program.parse(process.argv);

const { host, port, cache } = program.opts();

if (!fs.existsSync(cache)) {
  fs.mkdirSync(cache);
}

//шлях до файлу
function getFilePath(code) {
  return path.join(cache, `${code}.jpg`);
}

const server = http.createServer(async (req, res) => {
  const code = req.url.slice(1);
  const filePath = getFilePath(code);

  if (req.method === "GET") {
    try {
      const data = await readFile(filePath);  
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      return res.end(data);
    } catch {
      res.writeHead(404);
      return res.end("Not Found");
    }
  }

  if (req.method === "PUT") {
    let body = [];

    req.on("data", chunk => body.push(chunk));
    req.on("end", async () => {
      body = Buffer.concat(body);
      await writeFile(filePath, body);         
      res.writeHead(201);
      res.end("Created");
    });

    return;
  }

  if (req.method === "DELETE") {
    try {
      await unlink(filePath);          
      res.writeHead(200);
      res.end("Deleted");
    } catch {
      res.writeHead(404);
      res.end("Not Found");
    }
    return;
  }

  res.writeHead(405);
  res.end("Method Not Allowed");
});

server.listen(port, host, () => {
  console.log(`Server started on http://${host}:${port}`);
});

