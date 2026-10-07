  const { name } = require("ejs");
  const mongodb=require("mongoose");
  const client=require("mongodb");

  const connect=mongodb.connect(process.env.mongodb)

  connect.then(()=>{
      console.log("database is connected ");
       
  })
  .catch((e)=>{
      console.log("database cannot be connected"+e)

  })
  const mongodbschema= new mongodb.Schema({
      name:{
         type:String,
        required: true
 },
    passcode: {
        type:String,
         required:true
     }
  });
  const collection = new mongodb.model("students",mongodbschema);
  module.exports=collection;













  
  

