const { name } = require("ejs");
const mongodb=require("mongoose");
const client=require("mongodb");
const url1="mongodb+srv://tamilbillons:joseharrywillam123@cluster0.j5cef10.mongodb.net/?retryWrites=true&w=majority&Appname=Cluster0";
const url2="mongodb+srv://tamilbillons:joseharrywillam123@cluster0.j5cef10.mongodb.net/sample_students?retryWrites=true&w=majority&Appname=Cluster0"
const connect=mongodb.connect(url2)

connect.then(()=>{
    console.log("database is connected in maths");
     
})
.catch((e)=>{
    console.log("database cannot be connected in maths"+e)

})
const mongodbschema= new mongodb.Schema({
    question:{
       type:String,
      required: true
},
  choice1: {
      type:String,
       required:true
   },
   choice2: {
    type:String,
     required:true
 }, 
  choice3: {
    type:String,
     required:true
 }, 
  choice4: {
    type:String,
     required:true
 },
 ans:{
    type:String,
    required:true
 }
});
const mathexam = new mongodb.model("mathexams",mongodbschema);
module.exports=mathexam;
















