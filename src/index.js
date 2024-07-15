
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
const {AsyncLocalStorage}= require('async_hooks');



//var Localstore= new LocalStorage('./scratch');
const mathsexam=require('./mathsexam')

const storage=require('node-sessionstorage')
const useradd=require('./results');
const { SocketAddress } = require("net");
const cokkieparser=require('cookie-parser');
const resultdatas = require("./results");
const { log } = require("console");


app.use(cokkieparser())
app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.set('view engine','ejs');
app.use('/user',express.static("public"));

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
//    console.log(define)
  }
  if(!req.cookies.passcoded){
    define.passcoded=false;
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
    // console.log(data);
    namedata=data.name;


    // const  userdata= await collection.insertMany(data);
//    console.log("mongodb data",alluser);



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
    const alluser= await studentmarks.find({name:namedata});
    // console.log(alluser)
    namedata2=namedata

    res.render("home",{mark:alluser});
}
     else{
        res.redirect('/')
     }

})

app.get('/user/phyics' ,  async(req,res)=>{
    if(req.cookies.userenter){
     const userget=  await useradd.findOne({name:namedata});
        if(!userget){

            const phyicsexamdata=await phyicsexam.find()
            // console.log(phyicsexamdata);

            var storeddata=phyicsscorepoint
           if(req.cookies.phyicsmark){
            var encode= Buffer.from(req.cookies.phyicsmark.score,"base64url").toString('ascii')
            // console.log(encode)
             storeddata= {
                score:encode,
                istrue:req.cookies.phyicsmark.istrue
             } 

           }
           if(req.cookies.mathsmark){
            if(req.cookies.phyicsmark){
                if(req.cookies.chemistrymark){
                  //  console.log("active block")
                      await useradd.insertMany({name:namedata});
                     var date=new Date()
                     var dated=date.getMonth()+1
                     var dated=date.getDate()+"/"+dated+"/"+date.getFullYear()
                     const mathdecode= Buffer.from(req.cookies.mathsmark.score,"base64url").toString('ascii')
                     const chemistrydecode= Buffer.from(req.cookies.chemistrymark.score,"base64url").toString('ascii')
                     const phyicsdecode= Buffer.from(req.cookies.phyicsmark.score,"base64url").toString('ascii')
                     var result_data={
                        name:namedata,
                        date:dated.toString(),
                        phyicsmark:phyicsdecode,
                        mathsmark:mathdecode,
                        chemistrymark:chemistrydecode
                     }
                     res.clearCookie("mathsmark")
                     const student=await studentmarks.insertMany(result_data)

                     res.clearCookie('phyicsmark')
                     res.clearCookie("chemistrymark")
                //"mathsmark","phyicsmark","chemistrymark"
                }
        }
        }
        res.render('phyicsexam',{ques:phyicsexamdata,score:storeddata})
    }
        else{
            res.render("completed")
        
            // alert(" you have finsihed your exam")
            // window.alert("you have finsihed your exam")
            // toast("you have finsihed your exam")
        }
        // console.log(storage.getStore())
      //  scorepoint.istrue=false;
    }
   else{
    res.redirect('/')
   }
})
app.post('/user/phyics', async(req,res)=>{

    const data={
        question1:req.body.question1,
        question2:req.body.question2,
        question3:req.body.question3,
        question4:req.body.question4,
        question5:req.body.question5,
        question6:req.body.question6,
        question7:req.body.question7,
        question8:req.body.question8,
        question9:req.body.question9,
        question10:req.body.question10,
    }
    var datalist=[data.question1,data.question2,data.question3,data.question4,data.question5,data.question6,data.question7,data.question8,data.question9,data.question10]
  var marks=0
  var notwrittenmarks=0;
  var minusmark=0;
    // console.log(data.question1)
    // console.log(data.question2)
    // console.log(data.question3)
    for(let i=0 ; i<datalist.length;i++){
        const phyicsexamdata=await phyicsexam.findOne({ans:datalist[i]})
        if(phyicsexamdata){
            marks++;
        }
        else{
            minusmark++
            // console.log("minusmark",minusmark)
                    }
                    if(!datalist[i]){

                        notwrittenmarks++
                     }
    }
    namedata3=namedata2;
    namedata=namedata3;

   // phyicsscorepoint.istrue=true;

  // console.log("minus mark"+ minusmark)


    var score=(marks*4)-minusmark;
 score=score+notwrittenmarks;
score= JSON.stringify(score)
score= Buffer.from(score).toString('base64url')

    
    var phyicsmark={
        "score":score,
        "istrue":true
    }

    res.cookie('phyicsmark',phyicsmark)
    // Localstore.setItem("chemistrymark",JSON.stringify(chemistryscorepoint))
    // console.log("localstore",JSON.parse(Localstore.getItem("chemistrymark")) )

    // console.log(marks)

//    storage.enterWith(phyicsscorepoint)
if(req.cookies.mathsmark){
    if(req.cookies.phyicsmark){
        if(req.cookies.chemistrymark){
             const  registerdata= await resultdata.insertMany(namedata);
             var dateon=new Date()
             var dated=dateon.getMonth()+1
           var date=dateon.getDate()+"/"+dated+"/"+dateon.getFullYear() 
             var result_data={
                name:namedata,
                date:date,
                phyicsmark:req.cookies.phyicsmark,
                mathsmark:req.cookies.mathsmark,
                chemistrymark:req.cookies.chemistrymark
             }
             const student=await studentmarks.insertmany(result_data)
        }
    }
}
    res.redirect('/user/phyics')

    //res.send("the response have sent"+marks)
})
app.get('/user/chemistry', async(req,res)=>{
    if(req.cookies.userenter){
        const userget=  await useradd.findOne({name:namedata});
        if(!userget){
            const chemestryexamdata= await chemestryexam.find()
            // console.log(chemestryexamdata);

            var storeddata=chemistryscorepoint
        if(req.cookies.chemistrymark){
            

            var encode= Buffer.from(req.cookies.chemistrymark.score,"base64url").toString('ascii')
            // console.log(encode)
             storeddata= {
                score:encode,
                istrue:req.cookies.chemistrymark.istrue
             } 
        }
        if(req.cookies.mathsmark){
            if(req.cookies.phyicsmark){
                if(req.cookies.chemistrymark){
                   
                      await useradd.insertMany({name:namedata});
                     var date=new Date()
                    var dated=date.getMonth()+1
                     var dated=date.getDate()+"/"+dated+"/"+date.getFullYear()
                     const mathdecode= Buffer.from(req.cookies.mathsmark.score,"base64url").toString('ascii')
                     const chemistrydecode= Buffer.from(req.cookies.chemistrymark.score,"base64url").toString('ascii')
                     const phyicsdecode= Buffer.from(req.cookies.phyicsmark.score,"base64url").toString('ascii')
                     var result_data={
                        name:namedata,
                        date:dated.toString(),
                        phyicsmark:phyicsdecode,
                        mathsmark:mathdecode,
                        chemistrymark:chemistrydecode
                     }
                     res.clearCookie("mathsmark")
                     const student=await studentmarks.insertMany(result_data)

                     res.clearCookie('phyicsmark')
                     res.clearCookie("chemistrymark")
                //"mathsmark","phyicsmark","chemistrymark"
                }
            }
        }
            res.render('chemistryexam',{question:chemestryexamdata,score:storeddata})

        }
    else{
        // res.send("<h1> user already return the exam </h1> ")
        res.render("completed")

    }
    }
    else{
        res.redirect('/')
    }

})
app.post('/user/chemistry', async (req,res)=>{

    const data={
        question1:req.body.question1,
        question2:req.body.question2,
        question3:req.body.question3,
        question4:req.body.question4,
        question5:req.body.question5,
        question6:req.body.question6,
        question7:req.body.question7,
        question8:req.body.question8,
        question9:req.body.question9,
        question10:req.body.question10,
    }
    var datalist=[data.question1,data.question2,data.question3,data.question4,data.question5,data.question6,data.question7,data.question8,data.question9,data.question10]
  var marks=0
    // console.log(data.question1)
    // console.log(data.question2)
    // console.log(data.question3)
    var notwrittenmarks=0;
    var minusmark=0;
    for(let i=0 ; i<datalist.length;i++){
        const chemestryexamdata= await chemestryexam.findOne({ans:datalist[i]})
        if(chemestryexamdata){
            marks++;
          //  console.log("active")
        }
        else{
minusmark++
//console.log("minusmark",minusmark)
        }

        //console.log("marks is testing",marks)

     if(!datalist[i]){

        notwrittenmarks++
     }

    }

//    console.log("notwrittenmarks",notwrittenmarks)
    namedata3=namedata2;
    namedata=namedata3;

  //  chemistryscorepoint.istrue=true;

  // console.log("minus mark"+ minusmark)
    var score=(marks*4)-minusmark;
    score=score+notwrittenmarks;
    score= JSON.stringify(score)
    score= Buffer.from(score).toString('base64url')
    var chemistrymark={
        "score":score,
        "istrue":true
    }
    res.cookie("chemistrymark",chemistrymark)

    // console.log("marks",marks)

//    storage.enterWith(phyicsscorepoint)

    res.redirect('/user/chemistry')

})
app.get('/user/maths',async(req,res)=>{
    if(req.cookies.userenter){
        const userget=  await useradd.findOne({name:namedata});
        if(!userget){
            const mathsexamdata= await mathsexam.find()
            // console.log(mathsexamdata);

            var storeddata=mathsscorepoint
        if(req.cookies.mathsmark){
            
            var encode= Buffer.from(req.cookies.mathsmark.score,"base64url").toString('ascii')
            // console.log(encode)
             storeddata= {
                score:encode,
                istrue:req.cookies.mathsmark.istrue
             } 
        }
        if(req.cookies.mathsmark){
            if(req.cookies.phyicsmark){
                if(req.cookies.chemistrymark){
                    // console.log("active block")
                      await useradd.insertMany({name:namedata});
                     var date=new Date()
                     
                     var month=date.getMonth()+1
                     var dated=date.getDate()+"/"+month+"/"+date.getFullYear()
                     const mathdecode= Buffer.from(req.cookies.mathsmark.score,"base64url").toString('ascii')
                     const chemistrydecode= Buffer.from(req.cookies.chemistrymark.score,"base64url").toString('ascii')
                     const phyicsdecode= Buffer.from(req.cookies.phyicsmark.score,"base64url").toString('ascii')
                     var result_data={
                        name:namedata,
                        date:dated.toString(),
                        phyicsmark: phyicsdecode,
                        mathsmark:mathdecode,
                        chemistrymark:chemistrydecode
                     }
                     res.clearCookie("mathsmark")
                     const student=await studentmarks.insertMany(result_data)

                     res.clearCookie('phyicsmark')
                     res.clearCookie("chemistrymark")
                //"mathsmark","phyicsmark","chemistrymark"
                }
            }
        }
            res.render('mathsexam',{question:mathsexamdata,score:storeddata})
        }
        else{
           // res.send("<h1> you already return exam </h1>")
           res.render("completed")
        }

        // console.log(storage.getStore())
      //  scorepoint.istrue=false;

    }
    else{
        res.redirect('/')
    }
})
app.post("/user/maths", async(req,res)=>{

    const data={
        question1:req.body.question1,
        question2:req.body.question2,
        question3:req.body.question3,
        question4:req.body.question4,
        question5:req.body.question5,
        question6:req.body.question6,
        question7:req.body.question7,
        question8:req.body.question8,
        question9:req.body.question9,
        question10:req.body.question10,
    }
    var datalist=[data.question1,data.question2,data.question3,data.question4,data.question5,data.question6,data.question7,data.question8,data.question9,data.question10]
  var marks=0
    // console.log(data.question1)
    // console.log(data.question2)
    // console.log(data.question3)
    var notwrittenmarks=0;
    var minusmark=0;
    for(let i=0 ; i<datalist.length;i++){
        const mathsexamdata= await mathsexam.findOne({ans:datalist[i]})
        if(mathsexamdata){
            marks++;
          //  console.log("active")
        }
        else{
minusmark++
//console.log("minusmark",minusmark)
        }

        //console.log("marks is testing",marks)

     if(!datalist[i]){

        notwrittenmarks++
     }

    }

//    console.log("notwrittenmarks",notwrittenmarks)
    namedata3=namedata2;
    namedata=namedata3;

   // mathsscorepoint.istrue=true;

  // console.log("minus mark"+ minusmark)
   var score=(marks*4)-minusmark;
    var score=score+notwrittenmarks;
    score= JSON.stringify(score)
    score= Buffer.from(score).toString('base64url')
    var mathsmark={
        "score":score,
        "istrue":true
    }
    res.cookie("mathsmark",mathsmark)


    // console.log("marks",marks)

//    storage.enterWith(phyicsscorepoint)

    res.redirect('/user/maths')
})
const port=3000
app.listen(port,()=>{
    console.log("server is running 3000")
})







