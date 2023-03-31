const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  username: { type: String, required: false },
  cardusername: { type: String, required: true },
  cardNumber: { type: String, required: true},
  expirationMonth: { type: Number, required: true },
  expirationYear: { type: Number, required: true },
  cvv: { type: String, required: true },
  date: { type: Date, required: true },
  
});

const pay = new mongoose.model("paymentinfo", paymentSchema);

module.exports = pay;
