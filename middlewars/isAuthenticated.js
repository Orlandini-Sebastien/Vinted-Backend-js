const User = require("../models/User");

const isAuthenticated = async(req,res,next)=>{
  try {
    const user = await User.findOne({
    token: req.headers.authorization.replace("Bearer ", "")
  });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized ✋" });
    }
    req.user=user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized ✋" });
  }
}

module.exports = isAuthenticated;

