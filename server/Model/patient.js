import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email : { type: String, required: true , unique: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  dob: { type: String, required: true },
  patientId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
 
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;