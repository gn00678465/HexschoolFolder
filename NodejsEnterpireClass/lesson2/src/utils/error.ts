(function() {
  const { ServerResponse } = require('http');

  module.exports = function(
    res: typeof ServerResponse,
    headers: Record<string, string>,
    statusCode: number,
    message: string
  ) {
    res.writeHead(statusCode, headers);
    res.write(JSON.stringify({
      "status": "error",
      "message": message,
    }));
  }
})()