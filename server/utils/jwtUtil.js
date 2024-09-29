const jwt = require("jsonwebtoken");

exports.generateToken = (payload) => {
  return jwt.sign(payload, "Seceret", {
    expiresIn: "1d",
  });
};

exports.verifyJWT = (token) => {
  return jwt.verify(token, "Seceret");
};
