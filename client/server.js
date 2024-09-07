const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const ngrok = require("ngrok");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(async () => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  server.listen(port, async (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);

    try {
      // Iniciar ngrok
      const url = await ngrok.connect(port);
      console.log(`> Servidor expuesto públicamente en: ${url}`);
    } catch (error) {
      console.error("Error al iniciar ngrok:", error);
    }
  });
});
