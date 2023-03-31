const mongoose = require("mongoose");

const regSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  username: { type: String, required: true, unique:true  },
  email: { type: String, required: true, unique:true },
  password: { type: String, required: true },
  confirmpassword: { type: String, required: true },
  verificationToken: { type: String, required: true },
  isVerified: { type: Boolean, required: true }
});

const Reg = new mongoose.model("RegisterdUser", regSchema);

module.exports = Reg;
