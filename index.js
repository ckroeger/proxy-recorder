//const  http  = import from "http"
import * as http from "http";
import * as https from "https";
import * as url from "url";

import * as func from "./functions.cjs"; // Importiere die Funktion aus der index.js Datei

// nimm erstes argument als port oder verwende 8180
const port = process.argv[2] || 8180;

// http://localhost:8180/https/{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?s=a&z=19&x=276698&y=169444

const proxyServer = http.createServer((req, res) => {
  // log requesturl
  console.log(`Request URL: ${req.url}`);
  // Analysiere die eingehende URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`Pathname: ${pathname}`);
  // Überprüfe, ob der Pfad das Wort "echo" enthält
  if (pathname.includes("echo")) {
    let body = "";

    // Lese den request-body
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      // Gib den request-body und die request-headers als Text zurück
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`Headers: ${JSON.stringify(req.headers)}\n\nBody: ${body}`);
    });

    return;
  }

  // Extrahiere die Query-Parameter-Namen
  const queryNames = Object.keys(parsedUrl.query);
  console.log(`Query Names: ${queryNames}`);

  const queryParams = [];

  // Füge alle Query-Parameter als Objekte dem Array hinzu
  for (const [key, value] of Object.entries(parsedUrl.query)) {
    queryParams.push({ key, value });
  }

  console.log(`queryParams = ${JSON.stringify(queryParams)}`);

  // Extrahiere die Basis-URL und die Parameter
  const match = pathname.match(/^\/(https|http)\/(.*)$/);
  if (!match) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Invalid URL");
    return;
  }

  const baseUrl = func.replaceQueryParamsOnPlaceholder(
    `${match[1]}://${match[2]}`,
    queryParams
  );

  console.log(`Base URL: ${baseUrl}`);
  // Analysiere die Ziel-URL
  const parsedTargetUrl = url.parse(baseUrl);
  const protocol = baseUrl.startsWith("https:") ? https : http;

  // replace value host in req.headers with parsedTargetUrl.host
  req.headers.host = parsedTargetUrl.host;

  // Optionen für die Zielanfrage
  const options = {
    hostname: parsedTargetUrl.hostname,
    port: parsedTargetUrl.port,
    path: parsedTargetUrl.path,
    method: req.method,
    headers: req.headers,
  };

  console.log(`Options: ${JSON.stringify(options)}`);

  /*
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write(`Request URL: ${req.url}\n\n`);
  res.write(`Base URL: ${baseUrl}\n\n`);
  res.write(`Options: ${JSON.stringify(options)}\n\n`);

  return res.end;
  */

  // Leite die Anfrage an den Ziel-Server weiter
  const targetReq = protocol.request(options, (targetRes) => {
    // Leite die Antwort des Ziel-Servers an den ursprünglichen Client weiter
    //res.writeHead(targetRes.statusCode, targetRes.headers);
    targetRes.pipe(res);
  });

  // Leite den Body der ursprünglichen Anfrage an den Ziel-Server weiter
  req.pipe(targetReq);

  // Fehlerbehandlung
  targetReq.on("error", (err) => {
    console.error(err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Error");
  });

  //targetReq.end();
  /**/
});

proxyServer.listen(port, () => {
  console.log(`Proxy-Server läuft auf Port ${port}`);
});
