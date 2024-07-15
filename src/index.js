
const express=require("express");
//const path=require("path");
//const mongodb=require("bcrypt");
// const { log } = require("console");
const collection=require("./config")
const studentmarks=require('./students')
const phyicsexam=require('./phyicsexam')
const chemestryexam=require('./chemistryexam')
//const js_alert=require('js-alert')
const app=express();
const htmlsantizer=require("sanitize-html")
const {AsyncLocalStorage}= require('async_hooks');



//var Localstore= new LocalStorage('./scratch');
const mathsexam=require('./mathsexam')

const storage=require('node-sessionstorage')
const useradd=require('./results');
const { SocketAddress } = require("net");
const cokkieparser=require('cookie-parser');
const resultdatas = require("./results");
const { log } = require("console");
const mongosantization=require("express-mongo-sanitize")
const xss=require("xss-clean")
app.use(cokkieparser())
app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.set('view engine','ejs');
app.use('/user',express.static("public"));
app.use(mongosantization())
app.use(xss())
app.use(express.static("public"));

  //  app.use('/user',ensureLogin.ensureLoggedIn({redirectTo:'/'}))


//var phyics_store_score;
//const storage=new AsyncLocalStorage() ;
var check=false;

const phyicsscorepoint={
    score:0,
    istrue:false
};

const chemistryscorepoint={
    score:0,
    istrue:false
};

const mathsscorepoint={
    score:0,
    istrue:false
};

var namedata;
var namedata2;
var namedata3

app.get('/' ,(req,res)=>{
   
var define={ usercoded:false,
         passcoded:false,}

  if(req.cookies.usercoded || req.cookies.passcoded) {
   define.usercoded=req.cookies.usercoded
   define.passcoded=req.cookies.passcoded
   console.log(define)
  }
  if(!req.cookies.passcoded){
    define.passcoded=false;
  }
  if(req.cookies.subject){
    res.clearCookie("subject")
  }

    if(req.cookies.userenter){
        res.clearCookie('userenter')
    }
   
res.render("login",{define:define})



})

app.post('/' ,   async (req,res)=>{

  const   data={
        name:req.body.username,
        passcode:req.body.passcode
    }

    const extistinguser=await collection.findOne({name:data.name})
    const extistingpasscode=await collection.findOne({passcode:data.passcode})
    var alluser=await collection.find();
    console.log(data);
    namedata=data.name;


    // const  userdata= await collection.insertMany(data);
   console.log("mongodb data",alluser);



     if(extistinguser){
         if(extistingpasscode){
            res.cookie('userenter',"true",{maxAge:4 * 60 * 60 * 1000})
            res.clearCookie('usercoded')
            res.clearCookie('passcoded')
             res.redirect("/user/home");


         }
        else{


            res.cookie('passcoded',true)  
            res.clearCookie('usercoded')
// define.password=1;
// define.usercode=0;
res.redirect('/');
         }
     }
 else{
    res.cookie('usercoded',true)  
    res.clearCookie('passcoded')
//   define.password=0;
// define.usercode=1;
res.redirect('/');
 }


    })
app.get('/user/home',   async (req,res)=>{

if(req.cookies.userenter){
    const alluser= await studentmarks.find();
    console.log(alluser)
    namedata2=namedata
    var subject;
    var subjectlist=["phyics","chemistry","maths"]
    if(!req.cookies.subject)
    for(let i=0; i<subjectlist.length ; i++){
        const Teachers=await collection.findOne({name:namedata,subject:subjectlist[i]})
      
            if(Teachers){
                subject=subjectlist[i]
                res.cookie("subject",subject,{maxAge:4 * 60 * 60 * 1000})
            }

        
    }
    
    else{
subject=req.cookies.subject
    }
console.log(subject)
var teach={
    "subject":subject
}
//console.log(Teachers)
    res.render("home",{mark:alluser,head:teach});
}
     else{
        res.redirect('/')
     }

})

app.get('/user/phyics' ,  async(req,res)=>{
    if(req.cookies.userenter){
    
       

            const phyicsexamdata=await phyicsexam.find()
            console.log(phyicsexamdata);

           const question=[ "question1","question2", "question3","question4", "question5" ,"question6","question7","question8","question9","question10"]
      
   
        res.render('phyicsexam',{lock:question})
    }
        
          
        
            // alert(" you have finsihed your exam")
            // window.alert("you have finsihed your exam")
            // toast("you have finsihed your exam")
        
        // console.log(storage.getStore())
      //  scorepoint.istrue=false;
    
   else{
    res.redirect('/')
   }
})
app.post('/user/phyics', async(req,res)=>{

  htmlsantizer()
    var datalist= [{
        question:req.body.question1,
        choice1:req.body.question1_choice1,
        choice2:req.body.question1_choice2,
        choice3:req.body.question1_choice3,
        choice4:req.body.question1_choice4,
        ans:req.body.ans1,
        },
    {
        question:req.body.question2,
        choice1:req.body.question2_choice1,
        choice2:req.body.question2_choice2,
        choice3:req.body.question2_choice3,
        choice4:req.body.question2_choice4,
        ans:req.body.ans2,
        

    },
    {
        question:req.body.question3,
        choice1:req.body.question3_choice1,
        choice2:req.body.question3_choice2,
        choice3:req.body.question3_choice3,
        choice4:req.body.question3_choice4,
        ans:req.body.ans3,
    } ,
    {
        question:req.body.question4,
        choice1:req.body.question4_choice1,
        choice2:req.body.question4_choice2,
        choice3:req.body.question4_choice3,
        choice4:req.body.question4_choice4,
        ans:req.body.ans4,
    },

    {
        question:req.body.question5,
        choice1:req.body.question5_choice1,
        choice2:req.body.question5_choice2,
        choice3:req.body.question5_choice3,
        choice4:req.body.question5_choice4,
        ans:req.body.ans5,
    },{
        question:req.body.question6,
        choice1:req.body.question6_choice1,
        choice2:req.body.question6_choice2,
        choice3:req.body.question6_choice3,
        choice4:req.body.question6_choice4,
        ans:req.body.ans6,
    },
    {
        question:req.body.question7,
        choice1:req.body.question7_choice1,
        choice2:req.body.question7_choice2,
        choice3:req.body.question7_choice3,
        choice4:req.body.question7_choice4,
        ans:req.body.ans7,
    },
    {
        question:req.body.question8,
        choice1:req.body.question8_choice1,
        choice2:req.body.question8_choice2,
        choice3:req.body.question8_choice3,
        choice4:req.body.question8_choice4,
        ans:req.body.ans8,
    },
    {
        question:req.body.question9,
        choice1:req.body.question9_choice1,
        choice2:req.body.question9_choice2,
        choice3:req.body.question9_choice3,
        choice4:req.body.question9_choice4,
        ans:req.body.ans9,
    },{

        question:req.body.question10,
        choice1:req.body.question10_choice1,
        choice2:req.body.question10_choice2,
        choice3:req.body.question10_choice3,
        choice4:req.body.question10_choice4,
        ans:req.body.ans10,
    }   ]
    console.log(datalist)
  await  phyicsexam.deleteMany()
    await   phyicsexam.insertMany(datalist)
await resultdatas.deleteMany()
          
        
    


   // phyicsscorepoint.istrue=true;

  // console.log("minus mark"+ minusmark)


  

//    storage.enterWith(phyicsscorepoint)

res.render("uploadedsucessfuly")

    //res.send("the response have sent"+marks)
})
app.get('/user/chemistry', async(req,res)=>{
    if(req.cookies.userenter){
    
       

        const chemestrytest= await chemestryexam.find()
        console.log(chemestrytest);

       const question=[ "question1","question2", "question3","question4", "question5" ,"question6","question7","question8","question9","question10"]
  

    res.render('chemistryexam',{lock:question})
}
           

        
  
    
    else{
        res.redirect('/')
    }

})
app.post('/user/chemistry', async (req,res)=>{

  
    htmlsantizer()
    var datalist= [{
        question:req.body.question1,
        choice1:req.body.question1_choice1,
        choice2:req.body.question1_choice2,
        choice3:req.body.question1_choice3,
        choice4:req.body.question1_choice4,
        ans:req.body.ans1,
        },
    {
        question:req.body.question2,
        choice1:req.body.question2_choice1,
        choice2:req.body.question2_choice2,
        choice3:req.body.question2_choice3,
        choice4:req.body.question2_choice4,
        ans:req.body.ans2,
        

    },
    {
        question:req.body.question3,
        choice1:req.body.question3_choice1,
        choice2:req.body.question3_choice2,
        choice3:req.body.question3_choice3,
        choice4:req.body.question3_choice4,
        ans:req.body.ans3,
    } ,
    {
        question:req.body.question4,
        choice1:req.body.question4_choice1,
        choice2:req.body.question4_choice2,
        choice3:req.body.question4_choice3,
        choice4:req.body.question4_choice4,
        ans:req.body.ans4,
    },

    {
        question:req.body.question5,
        choice1:req.body.question5_choice1,
        choice2:req.body.question5_choice2,
        choice3:req.body.question5_choice3,
        choice4:req.body.question5_choice4,
        ans:req.body.ans5,
    },{
        question:req.body.question6,
        choice1:req.body.question6_choice1,
        choice2:req.body.question6_choice2,
        choice3:req.body.question6_choice3,
        choice4:req.body.question6_choice4,
        ans:req.body.ans6,
    },
    {
        question:req.body.question7,
        choice1:req.body.question7_choice1,
        choice2:req.body.question7_choice2,
        choice3:req.body.question7_choice3,
        choice4:req.body.question7_choice4,
        ans:req.body.ans7,
    },
    {
        question:req.body.question8,
        choice1:req.body.question8_choice1,
        choice2:req.body.question8_choice2,
        choice3:req.body.question8_choice3,
        choice4:req.body.question8_choice4,
        ans:req.body.ans8,
    },
    {
        question:req.body.question9,
        choice1:req.body.question9_choice1,
        choice2:req.body.question9_choice2,
        choice3:req.body.question9_choice3,
        choice4:req.body.question9_choice4,
        ans:req.body.ans9,
    },{

        question:req.body.question10,
        choice1:req.body.question10_choice1,
        choice2:req.body.question10_choice2,
        choice3:req.body.question10_choice3,
        choice4:req.body.question10_choice4,
        ans:req.body.ans10,
    }   ]
    console.log(datalist)
  await  chemestryexam.deleteMany()
    await   chemestryexam.insertMany(datalist)
await resultdatas.deleteMany()

   res.render("uploadedsucessfuly")

})
app.get('/user/maths',async(req,res)=>{
    if(req.cookies.userenter){
      
        const maths=await mathsexam.find()
        console.log(maths);

       const question=[ "question1","question2", "question3","question4", "question5" ,"question6","question7","question8","question9","question10"]
  

    res.render('mathsexam',{lock:question})
        }
    else{
        res.redirect('/')
    }
})
app.post("/user/maths", async(req,res)=>{

    htmlsantizer()
    var datalist= [{
        question:req.body.question1,
        choice1:req.body.question1_choice1,
        choice2:req.body.question1_choice2,
        choice3:req.body.question1_choice3,
        choice4:req.body.question1_choice4,
        ans:req.body.ans1,
        },
    {
        question:req.body.question2,
        choice1:req.body.question2_choice1,
        choice2:req.body.question2_choice2,
        choice3:req.body.question2_choice3,
        choice4:req.body.question2_choice4,
        ans:req.body.ans2,
        

    },
    {
        question:req.body.question3,
        choice1:req.body.question3_choice1,
        choice2:req.body.question3_choice2,
        choice3:req.body.question3_choice3,
        choice4:req.body.question3_choice4,
        ans:req.body.ans3,
    } ,
    {
        question:req.body.question4,
        choice1:req.body.question4_choice1,
        choice2:req.body.question4_choice2,
        choice3:req.body.question4_choice3,
        choice4:req.body.question4_choice4,
        ans:req.body.ans4,
    },

    {
        question:req.body.question5,
        choice1:req.body.question5_choice1,
        choice2:req.body.question5_choice2,
        choice3:req.body.question5_choice3,
        choice4:req.body.question5_choice4,
        ans:req.body.ans5,
    },{
        question:req.body.question6,
        choice1:req.body.question6_choice1,
        choice2:req.body.question6_choice2,
        choice3:req.body.question6_choice3,
        choice4:req.body.question6_choice4,
        ans:req.body.ans6,
    },
    {
        question:req.body.question7,
        choice1:req.body.question7_choice1,
        choice2:req.body.question7_choice2,
        choice3:req.body.question7_choice3,
        choice4:req.body.question7_choice4,
        ans:req.body.ans7,
    },
    {
        question:req.body.question8,
        choice1:req.body.question8_choice1,
        choice2:req.body.question8_choice2,
        choice3:req.body.question8_choice3,
        choice4:req.body.question8_choice4,
        ans:req.body.ans8,
    },
    {
        question:req.body.question9,
        choice1:req.body.question9_choice1,
        choice2:req.body.question9_choice2,
        choice3:req.body.question9_choice3,
        choice4:req.body.question9_choice4,
        ans:req.body.ans9,
    },{

        question:req.body.question10,
        choice1:req.body.question10_choice1,
        choice2:req.body.question10_choice2,
        choice3:req.body.question10_choice3,
        choice4:req.body.question10_choice4,
        ans:req.body.ans10,
    }   ]
    console.log(datalist)
  await  mathsexam.deleteMany()
    await   mathsexam.insertMany(datalist)
await resultdatas.deleteMany()
//storage.enterWith(phyicsscorepoint)

res.render("uploadedsucessfuly")
})
const port=3000
app.listen(port,()=>{
    console.log("server is running 3000")
})







