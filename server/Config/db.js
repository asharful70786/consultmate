import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();



async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("===========   DB connected Successfully  ===========");
  } catch (error) {
    console.log("DB connection Error");
    res.status(500).json({ error: error.message });
  }
  
};

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);

});


export default connectDb