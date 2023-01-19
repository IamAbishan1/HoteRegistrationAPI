const jwt = require("jsonwebtoken");
const User = require("../model/user");

const JWT = {
  capturer: async function (req, res, next) {
    //non blocking middleware.. just runs on every request to see if jwt exists, and captures it if it does
    try {
      if (req.jwt === undefined) {
        req.jwt = {
          errors: [],
          hasUser: function () {
            try {
              if (req.jwt.user._id) {
                return true;
              }
            } catch (err) {}
            return false;
          },
          // assign this role by default, any logged in user will have higher roles
          userRole: "anonymous",
        };
      } else {
        //if req.jwt has already been set, just skip this middleware. it should run only once
        let e = "JWT instance already exists in request.";
        req.jwt.errors.push(e);
        throw new Error(e);
      }
      
      try {
        req.jwt.token = req.headers.authorization.split(" ")[1];
      } catch (err) {
        req.jwt.errors.push(
          "Error getting auth token from request header.\n" + err
        );
        throw err;
      }
    
      try {
        req.jwt.payload = jwt.verify(req.jwt.token, process.env.JWTSECRET);
      } catch (err) {
        req.jwt.errors.push(
          "Error getting payload from token '" + req.jwt.token + "'.''" + err
        );
        throw err;
      }
      try {
        req.jwt.user = await User.findById(req.jwt.payload.userId).exec();
    
      } catch (err) {
        req.jwt.errors.push(
          "Error fetching user from payload '" +
            req.jwt.payload.toString() +
            "'.\n" +
            err
        );
        throw err;
      }
    } catch (err) {
      req.jwt.errors.push(err);
      
    }
    next();
  },

  //middleware.. to verify jwt session
  isLoggedIn: function (req, res, next) {
    try {
      if (req.jwt.user._id) {
        next();
      }
    } catch (err) {
     
      res.status(403).json({ status: "fail", message: "Login Required" });

    }
  },
  generateNewToken: function (payload) {
    return jwt.sign(payload, process.env.JWTSECRET);
  },
};

module.exports = JWT;
