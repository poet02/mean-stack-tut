const  jwt = require("jsonwebtoken");

//middleware is a function
//never for get the s in exports
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];//token, splitting from bearer
    jwt.verify(token, 'this_should be longer-string');

    //if does not fail call the next method. to continue execution
    next();
  } catch (err) {
    res.status(401).json({message: "Auth Failed in middleware"})
  }
};
