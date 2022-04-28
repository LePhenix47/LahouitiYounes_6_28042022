const app = require("./app");

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || 3000);

app.set("port", port);

const errorHandler = (error) => {
  if (error.sycall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === "string" ? "pipe" + address : "port" + port;

  switch (error.code) {
    case "EACCESS":
      console.error(bind + " requires elevated privileges (i.e Admin)");
      process.exit(1);
      break;

    case "EAADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("./certificate/key.pem"),
  cert: fs.readFileSync("./certificate/cert.pem"),
};

const server = https.createServer(options, app);

server.on("error", errorHandler);

server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);
