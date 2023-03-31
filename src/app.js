const express=require("express")
const path=require("path")
const app=express()
const crypto = require('crypto');
const session = require("express-session");

const nodemailer = require("nodemailer");

require("./db/connect");
const UserDetail=require("./models/userDetails")
const Reg =require("./models/reg")
const pay =require("./models/payment")
const { json }=require("express")

const port =process.env.PORT || 3000;

const static_path=path.join(__dirname,"../public")
const template_path=path.join(__dirname,"../templates/views")


app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(express.static(static_path))
app.set("view engine","hbs")
app.set("views",template_path)



app.use(session({
    secret: "1234",
    resave: true,
    saveUninitialized: true,
  }));

//reg
app.get("/reg", (req, res) => {
    res.render("reg")
})



app.post("/reg", async (req, res) => {
    try {
      const verificationToken = crypto.randomBytes(20).toString("hex");
      console.log('Verification Token:', verificationToken);
      const password = req.body.password;
      const confirmpassword = req.body.confirmpassword;
      if (password != confirmpassword) {
        res.render('reg', { errorMessage:"Password not matched" });
      }
      else{

      
      // create temporary user details
      const tempRegDetail = new Reg({
        full_name: req.body.full_name,
        username: req.body.username,
        email: req.body.email,
        password: password,
        confirmpassword: confirmpassword,
        verificationToken: verificationToken,
        isVerified: false,
      });
  
      // Send the verification email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "online.hotel.reservation.system0@gmail.com",
          pass: "ueiomalbmyoqddil",
        },
      });
  
      const verificationLink = `${req.protocol}://${req.get(
        "host"
      )}/reg/verify?token=${verificationToken}`;
  
      const mailOptions = {
        from: "online.hotel.reservation.system0@gmail.com",
        to: req.body.email,
        subject: "Email Verification",
        html: `Please click on the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a>`,
      };
  
      await transporter.sendMail(mailOptions);
  
      // store temporary user details
      req.session.tempRegDetail = tempRegDetail;
      console.log(req.session.tempRegDetail)
      res.render("login", { successMessage: "Check your email to verify your account." });
    }
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  });
  
  app.get("/reg/verify", async (req, res) => {
    try {
      const token = req.query.token;
      const tempRegDetail = req.session.tempRegDetail;
      console.log(req.session.tempRegDetail)
      // check if tempRegDetail exists
      if (!tempRegDetail) {
        return res.status(404).send("Invalid or expired verification token.");
      }
      console.log('Verification Token:', tempRegDetail.verificationToken);

      // check if the token matches
      if (tempRegDetail.verificationToken !== token) {
        return res.status(404).send("Invalid or expired verification token.");
      }
  
      // set isVerified to true and save to database
      tempRegDetail.isVerified = true;
      const TempRegDetail = new Reg({
        full_name: tempRegDetail.full_name,
        username: tempRegDetail.username,
        email: tempRegDetail.email,
        password: tempRegDetail.password,
        confirmpassword: tempRegDetail.confirmpassword,
        verificationToken: tempRegDetail.verificationToken,
        isVerified: tempRegDetail.isVerified,
      });

      await TempRegDetail.save();
  
      // delete tempRegDetail from session
      delete req.session.tempRegDetail;
  
      res.render("login", { successMessage: "Your email has been verified successfully."});
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  });
  


app.listen(port, () => {
    console.log(`${port} running`)
})

