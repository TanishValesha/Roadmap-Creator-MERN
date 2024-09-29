const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      res.status(401).send({ message: "User Unauthorized", success: false });
    }
    jwt.verify(token, process.env.SECERET, (err, decoded) => {
      if (err) {
        res.status(401).send({ message: "User Unauthorized", success: false });
      } else {
        req.body.userId = decoded.id;
        console.log(req.body.userId);

        next();
      }
    });
  } catch (error) {
    res.status(401).send({ message: "User Unauthorized", success: false });
  }
};
