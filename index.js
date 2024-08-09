//const  http  = import from "http"
import * as http from "http";
import * as https from "https";
import * as url from "url";

//const { url } = import("url");
import { replacePlaceholders } from "./functions.js"; // Importiere die Funktion aus der index.js Datei

// nimm erstes argument als port oder verwende 8180
const port = process.argv[2] || 8180;

// http://localhost:8180/https/{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?s=a&z=19&x=276698&y=169444

const proxyServer = http.createServer((req, res) => {
  // log requesturl
  console.log(`Request URL: ${req.url}`);
  // Analysiere die eingehende URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Extrahiere die Query-Parameter-Namen
  const queryNames = Object.keys(parsedUrl.query);
  console.log(`Query Names: ${queryNames}`);

  const queryParams = [];

  // Füge alle Query-Parameter als Objekte dem Array hinzu
  for (const [key, value] of Object.entries(parsedUrl.query)) {
    queryParams.push({ key, value });
  }

  console.log(`queryParams = ${queryParams}`);

  // Extrahiere die Basis-URL und die Parameter
  const match = pathname.match(/^\/(https|http)\/(.*)$/);
  if (!match) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Invalid URL");
    return;
  }

  const baseUrl = `${match[1]}://${match[2]}`;
  const params = parsedUrl.query;

  // Erstelle die Ziel-URL basierend auf dem Template und den Parametern
  let targetUrl = replacePlaceholders(baseUrl, params);
  console.log(`targetUrl = ${targetUrl}`);

  /*
  // write response ok as text and status 200
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("OK");
  return;
  */

  // Leite die Anfrage an den Ziel-Server weiter

  const targetReq = https.request(targetUrl, (targetRes) => {
    targetRes.pipe(res);
  });
  req.pipe(targetReq);
  targetReq.on("error", (err) => {
    console.error(err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Error");
  });
});

proxyServer.listen(port, () => {
  console.log(`Proxy-Server läuft auf Port ${port}`);
});
