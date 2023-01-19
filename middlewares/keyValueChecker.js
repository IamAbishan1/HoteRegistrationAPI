module.exports = function (req, res, next) {
    if (req.headers.hasOwnProperty("content-type")) {
      if (req.headers["content-type"].match(/^multipart.*/)) {
        req.body = JSON.parse(JSON.stringify(req.body));
      }
    }
  
    if (req.body) {
      if (req.body.hasKey == undefined)
        req.body.hasKey = function (key) {
          return req.body.hasOwnProperty(key);
        };
      if (req.body.hasValueFor == undefined)
        req.body.hasValueFor = function (key) {
          try {
            // return (req.body[key] !== undefined && String(req.body[key].length) > 0);
            if (req.body[key] == undefined) return false;
            if (String(req.body[key]).length > 0) return true;
          } catch {
            return false;
          }
        };
    }
    next();
  };