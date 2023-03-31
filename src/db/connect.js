const mongoose =require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/user",{useNewUrlParser:true,
useUnifiedTopology:true}).then(()=>{
    console.log(`connected`)
}).catch((e)=>{
    console.log(e)
})
