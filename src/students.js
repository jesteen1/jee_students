const { name } = require("ejs");
const mongodb=require("mongoose");
const client=require("mongodb");
const url1="mongodb+srv://tamilbillons:joseharrywillam123@cluster0.j5cef10.mongodb.net/?retryWrites=true&w=majority&Appname=Cluster0";
const url2="mongodb+srv://tamilbillons:joseharrywillam123@cluster0.j5cef10.mongodb.net/sample_students?retryWrites=true&w=majority&Appname=Cluster0"
const connect=mongodb.connect(url2)

connect.then(()=>{
    console.log("database is connected in students");
     
})
.catch((e)=>{
    console.log("database cannot be connected"+e)

})
const mongodbschema= new mongodb.Schema({
    name:{
        type:String,
       required: true
},
   date: {
       type:String,
        required:true
    },
    phyicsmark:{
       type:String,
       required:true
    },
    mathsmark:{
       type:String,
       required:true
    },
    chemistrymark:{
       type:String,
       required:true
    }
});
const studentmarks = new mongodb.model("studentmarks",mongodbschema);
module.exports=studentmarks;