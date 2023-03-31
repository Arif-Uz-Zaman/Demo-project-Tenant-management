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

////<------ Reg section ------>

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
  
      // deleting tempRegDetail from session
      delete req.session.tempRegDetail;
  
      res.render("login", { successMessage: "Your email has been verified successfully."});
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  });
  
////<------ payment section ------>

app.get("/", (req, res) => {
  res.render("login")
})

app.post("/", async(req, res) => {
  try{
      const username=req.body.username
      const password=req.body.password

      req.session.username = username;
      // usermail= await RegisterdUser.findOne({email:email})
      userRecord=await Reg.findOne({username:username})
    
      if(userRecord){
          if(userRecord.password==password){
              res.status(201).redirect("/userdetail")
          }
          else{
              res.render('login', { errorMessage: 'Invalid username or password' });
          }
      }
      else {
          res.render('login',{ errorMessage: 'Invalid username or password' });
      }
  }
  catch(error){{
      res.status(400).send(error)
  }}
})

////<------ Tenant form section ------>

app.get("/userdetail", (req, res) => {
  res.render("details")
})

app.post("/userdetail", async(req, res) => {
  try{
      
      const user_Detail=new UserDetail({
          image:req.body.image,
          district:req.body.district,
          thana:req.body.thana,
          flatno:req.body.flatno,
          house_no:req.body.house_no,
          road_no:req.body.road_no,
          alaka:req.body.alaka,
          postcode:req.body.postcode,
          fname:req.body.fname,
          Father_name:req.body.Father_name,
          date_of_birth:req.body.date_of_birth,
          married_status:req.body.married_status,
          Present_address:req.body.Present_address,
          Office_address:req.body.Office_address,
          religion:req.body.religion,
          edu_Qualification:req.body.edu_Qualification,
          mobile_number:req.body.mobile_number,
          email:req.body.email,
          nid_number:req.body.nid_number,
          p_number:req.body.p_number,
          E_name:req.body.E_name,
          relation:req.body.relation,
          e_address:req.body.e_address,
          e_number:req.body.e_number,
          name:req.body.name,
          age:req.body.age,
          occupation:req.body.occupation,
          mobile_number:req.body.mobile_number,
          name1:req.body.name1,
          age1:req.body.age1,
          cupation1:req.body.occupation1,
          mobile_number1:req.body.mobile_number1,
          name2:req.body.name2,
          age2:req.body.age2,
          occupation2:req.body.occupation2,
          mobile_number2:req.body.mobile_number2,
          house_wife:req.body.house_wife,
          housewife_nid_number:req.body.housewife_nid_number,
          housewife_mobile_number:req.body.housewife_mobile_number,
          housewife_Present_address:req.body.housewife_Present_address,
          driver_name:req.body.driver_name,
          driver_nid_number:req.body.driver_nid_number,
          driver_mobile_number:req.body.driver_mobile_number,
          driver_Present_address:req.body.driver_Present_address,
          previous_houseowner_name:req.body.previous_houseowner_name,
          previous_houseowner_mobile_number:req.body.previous_houseowner_mobile_number,
          previous_houseowner_address:req.body.previous_houseowner_address,
          reason_toleave_previous_house:req.body.reason_toleave_previous_house,
          present_houseowner_name:req.body.present_houseowner_name,
          present_houseowner_mobile_number:req.body.present_houseowner_mobile_number,
          timeof_startLiving_in_newhouse:req.body.timeof_startLiving_in_newhouse,
          form_fill_date:req.body.form_fill_date,
          sign_image:req.body.sign_image

      })

      const details=await user_Detail.save()
      res.status(201).render("details")



  }
  catch(error){{
      res.status(400).send(error)
  }}
})

//<------ Logout section ------>

app.get("/logout", (req, res) => {
req.session.destroy((err) => {
  if (err) {
    console.log(err);
  } else {
    res.redirect('/');
  }
});
});

app.listen(port, () => {
    console.log(`${port} running`)
})


//<------ payment section ------>

app.get("/payment", (req, res) => {
  const username = req.session.username;
  res.render("payment",{username: username})
})


app.post("/payment", async(req, res) => {
  const username = req.session.username;
  try{
      const currentDate = new Date();

      const payment_Detail=new pay({
        amount:req.body.amount,
        username:req.body.username,
        cardusername:req.body.cardusername,
        cardNumber:req.body.cardNumber,
        expirationMonth:req.body.expirationMonth,
        expirationYear:req.body.expirationYear,
        cvv:req.body.cvv,
        date:currentDate,

      })

      const details=await payment_Detail.save()
      
      res.status(201).render("payment", { successMessage: "Payment submitted successfully!",username: username })



  }
  catch(error){{
      res.status(400).send(error)
  }}
})

app.get('/paymenthistory', async (req, res) => {
  try {
    // Retrieve payment history from the database
    const payments = await pay.find({ username: req.session.username });

    // Render the payment history page and pass in the payment data
    res.render('paymenthistory', { payments });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving payment history');
  }
});



