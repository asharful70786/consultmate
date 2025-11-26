import Patient from "../Model/patient.js";
import User from "../Model/User.js";
import bcrypt from "bcrypt";



export const register = (req, res) => {
  res.status(500).send("To Register you must contact Admin");
};



export const login = async (req, res) => {
  const { email, password } = req.body;
      console.log( email, password )

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");


    // Compare password
    const match = await bcrypt.compare(password, user.password);
    console.log(match)
    if (!match) return res.status(401).send("Incorrect password");

    // Set signed cookie
    res.cookie("sid", user._id.toString(), {
      signed: true,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.send("Login Successfully");
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};


export const logout = (req, res) => {
  try {
    res.clearCookie("sid");
    return res.send("Logout Successfully");
  } catch (error) {
    console.log("error on logout Route " , error.message );
    res.status(500).json({ error: error.message });    
  }
};


export const userDetails = async(req, res) => {
 try {
  const user = await User.findById(req.user._id).select("-password");
  return res.status(200).send(user);
 } catch (error) {
  console.log("error on userDetails Route " , error.message );
  res.status(500).json({ error: error.message });  
 }
}



export const stacks =  async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const newPatients = await Patient.countDocuments({
      createdAt: { $gte: monthStart },
    });

    // const totalNotes = await Note.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // const todayNotes = await Note.countDocuments({
    //   createdAt: { $gte: today },
    // });

    res.json({
      totalPatients,
      newPatients,
      // totalNotes,
      // todayNotes,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}