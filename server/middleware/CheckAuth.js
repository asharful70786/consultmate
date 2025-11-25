import User from "../Model/User.js";



async function CheckAuth(req, res, next) {
  const sid = req.signedCookies.sid;
  // if (!sid)     return res.redirect("/login");
  if(!sid) return res.status(401).send("Sid not found , user not logged in");
  
  const user = await User.findById(sid);
  
  if (!user) return res.send("Not logged in User");

  req.user = user;

  next();

}

export default CheckAuth