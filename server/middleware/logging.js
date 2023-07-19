const crypto = require("crypto");
const fs = require("fs");

const stealData = (req, res, next) => {
  const log = {
    id: `${crypto.randomUUID()}`,
    req: {
      headers: req.headers,
      method: req.method,
      url: req.url,
      httpVersion: req.httpVersion,
      body: req.body,
      cookies: req.cookies,
      path: req.path,
      protocol: req.protocol,
      query: req.query,
      hostname: req.hostname,
      ip: req.ip,
      originalUrl: req.originalUrl,
      params: req.params,
    },
  };
  fs.writeFileSync(__dirname + "/../logs/recipe/requestLogs.json", JSON.stringify(log));
  console.log(log);
  next();
};

module.exports = stealData;
