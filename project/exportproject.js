var express=require('express');
var router=express.Router();
const mongoose = require('mongoose');
var router=express.Router();
var datas=[];
var dataslogin=[];
var flag=0;
var flaglogin;
const Person=require('./model/personschema');
const topicuser=require('./model/topicschms');
const Articleuser=require('./model/articleschema')
const comment=require('./model/commentschema')
var aftercommentsubmitarticle,aftercommentsubmitsubject;






//get home page

 router.get('/',function(req,res)
 {
  topicuser.find(function(err, response){
    subject=response;
      if(err)
        res.send(err);

      else{
        console.log(subject);
        res.render('home',{topic:subject});
  
      }
    });  
 });
 router.get('/gohome/:id/:subject',function(req,res)
 {

  console.log(4);
  var data;
   const id=req.params.id;
    const subject=req.params.subject;
    
      
      
       Articleuser.find({$and:[{subject:id},{approved:1}]},function(err, response){
      
      //res.json(response);
       data=response;
       console.log(4);
       console.log("corresponding data"+ data);
      

      // res.render('sportsarticleallpost.pug',{article:data});
        res.render('homearticlesee',{article:data,heading:subject});
       
       });
      
      
  })

 
//user sign up

router.get('/signup', function(req, res){
    res.render('Registration');
 });
 router.get('/login', function(req, res){
    let err;
    if(flaglogin==1)
    {
    res.render('login',{message:"Unauthorized access please login"
    })
    flaglogin=0;
    }
    else{
        res.render('login');

    }
 });
 


//First User

 router.post('/signup', function(req, res){

    /*var personInfo = req.body; //Get the parsed information
    console.log(personInfo);
    if(!personInfo.email || !personInfo.password || !personInfo.name || !personInfo.address || !personInfo.phoneno) {
      res.render('showmessage', {
        message: "Sorry, you provided worng info",
        type: "error"
      });
    } else {
      flag = 0;
      Person.find(function(err, response) {
        datas = response;
        console.log(datas);
        const loguser = datas.map(function(value) {
          console.log("hi");
          console.log(value.email);
          if(value.email == req.body.email) {
            flag = 1;
          }
        });
        var current_date = Date.now();
        var newPerson = new Person({
          email: personInfo.email,
          password: personInfo.password,
          name: personInfo.name,
          address: personInfo.address,
          phoneno: personInfo.phoneno,
          current_date: current_date,
          approved: 1
        });
        if(flag == 0) {
          newPerson.save(function(err, Person) {
            if(err) res.render('showmessage', {
              message: "Database error",
              type: "error"
            });
            else {
              req.session.user = newPerson
              res.redirect('/dashboard');
            }
          });
        } else res.send('User already exist');
      });
    }*/



    var personInfo = req.body; //Get the parsed information
     console.log(personInfo);
     if(!personInfo.email ||!personInfo.password || !personInfo.name || !personInfo.address || !personInfo.phoneno)
    {
       res.render('Registration',{
        message2: "Sorry, you must enter all fields", type:"error"});
    } 
    else
     {
        Person.find(function(err, response)
        {
             datas=response;
             console.log(datas);
             const signuser=datas.filter(function(value)
             {
              
               if(value.email==req.body.email)
               {
                  
                   return value.email;
                }
               
              });
               console.log("same user"+ signuser);
         
            if(!signuser[0])
            {
               var  current_date=Date.now();
               var newPerson = new Person
               ({
                   email:personInfo.email,
                   password:personInfo.password,
                   name: personInfo.name,
                   address: personInfo.address,
                   phoneno: personInfo.phoneno,
                   current_date:current_date,
                   user:"premiumuser",
                   approved:1
          
               });
               newPerson.save(function(err, Person)
               {
                  if(err)
                     res.render('showmessage', {message: "Database error", type:"error"});
                  else
                  { 
                     req.session.user = newPerson
                     res.redirect('/dashboard');
                   }
                });
     
              } 
              else
                 res.render("registration",{message1:" Sorry, USER ALREADY EXIST WTH SAME MAIL ID"})
          });
        } 

});
//after login submit

router.post('/login',function(req,res)
{
    if(!req.body.email || !req.body.password)
    {
        res.render('login',
        {
          message:"Please enter UserId and password"
         });
    }
     else
     {
         Person.find(function(err, response)
         {
           dataslogin=response;
           console.log(dataslogin);

           const login=dataslogin.filter(function(user)
           {
             if(user.email== req.body.email && user.password == req.body.password && user.approved==1)
             {
                 return true;
             }
            });
          if(!login[0])
          {
            res.render("login", { message: "Sorry,User not found or admin ban you" });
          }
         else
         {
            req.session.user = login[0];
            console.log(login[0]);
            console.log("session" + req.session.user);
            res.redirect('/dashboard'); 
         }
        
         });
    }

  });






//check session


 router.use('/dashboard', function( req, res, next)
 {
    if(req.session.user){
        next(); 
            //If session exists, proceed to page
     } 
     else
      {
        var err ={message:"Not logged Please Login"}
        console.log(1);
        flaglogin=1;
        console.log(err);
        next(err);
     }
    });
    router.use('/dashboard', function(err, req, res, next){
        console.log(1);
        //let st=err.message;
        //console.log(st);
        res.redirect('/login');
        });
router.get('/dashboard',function(req,res)
{

  topicuser.find(function(err, response){

    subject=response;
    console.log(subject);
    res.render('afterlogin1',{
      email:req.session.user.email,topic:subject});
    });

    

})


//logout

router.get('/logout',function(req,res)
{
    req.session.destroy(function(){
        console.log("user logged out.")
        
    });
    res.redirect('/login');

});
/*//after clicking hhomepage in sports

router.get('/sportsget',function(req,res)
{
    res.render('sportspost');


})*/






//admin see this all peoples

router.get('/managepeople', function(req, res){
  Person.find(function(err, response){
     
   //res.json(response);
   const data=response;
   //console.log(data);
   res.render('showadmin',{person:data})
      
   });
});
 

//admin edit people



router.get('/Edit/:id',function(req,res)
{
    console.log(1);
    console.log(req.params.id);
     Person.findById(req.params.id,function(err,response)
    
    {
        
           console.log(response);
           const editpersondetails=response;
           console.log(editpersondetails);
           if(err)
            res.render('editadminform',{message:"Database error"});

            else{
                
            
            res.render('editadminform',
            {id:req.params.id,email:editpersondetails.email,name:editpersondetails.name,password:editpersondetails.password,address:editpersondetails.address,phoneno:editpersondetails.phoneno}
            );


            }


    })

    
})
//after editing change db also and show edited db
router.post('/Edit/:id',function(req,res)
{
   console.log(2);
   console.log(req.params.id);
   console.log(req.body);
    Person.findByIdAndUpdate(req.params.id, req.body, function(err, response){
       if(err) 
       res.send(err);
       else
       {
         console.log(response);
       res.redirect('/managepeople');
       }
    });
 });
//admin accept or reject people
 router.get('/Reject/:id',function(req,res){
  const approved=1;
   console.log(4);
    Person.findByIdAndUpdate(req.params.id, {$set:{approved:0}}, function(err, response)
    {
     const data=response;
     console.log(data);
     res.redirect('/managepeople');
    });
 })


 router.get('/Accept/:id',function(req,res){
  const approved=1;
   console.log(4);
    Person.findByIdAndUpdate(req.params.id, {$set:{approved:1}}, function(err, response)
    {
     const data=response;
     console.log(data);
     res.redirect('/managepeople');
    });
 })



 //admi delete people


 router.get('/Delete/:id',function(req,res)
 {
     console.log(1);
     console.log(req.params.id);
      Person.findByIdAndRemove(req.params.id,function(err,response)
     
     {
         
            console.log(response);
            const deletepersondetails=response;
            console.log(deletepersondetails);
            if(err)
             res.send('error')
             else
               res.redirect('/managepeople');
            
 
     })
 
     
 })
 //go all post

 router.get('/go/:id/:subject',function(req,res)
 {
  var data;
   const id=req.params.id;
    const subject=req.params.subject;
    aftercommentsubmitsubject=subject;
      
      if(req.session.user)
      {
       Articleuser.find({$and:[{subject:id},{approved:1}]},function(err, response){
      

        comment.find(function (err,response2)
        {
          //res.json(response);
          data=response;
          var comments1=response2;
          console.log(4);
          console.log("corresponding data"+ data);
          console.log("corresponding comment"+ comments1);
          aftercommentsubmitarticle=data;
         
      // res.render('sportsarticleallpost.pug',{article:data});
        res.render('articlepost',{article:data,heading:subject,typeuser:req.session.user.user,email:req.session.user.email,usercomments:comments1});
      
        });
       });
      }
      
  })

 //comments submit
 router.post('/commentsubmit/:id/:email',function(req,res)
 {
  console.log("rating fromscripta"+ req.body.rating);
  const datacomment=req.body;
  id=req.params.id;
  email=req.params.email;
     var newcomment = new comment
     ({
       articleid:id,
      articleuseremail:email,
      commentby: req.session.user.email,
      comment:  datacomment.comments,
      });
     newcomment.save(function(err, response)
     {
       
        if(err)
          res.send(err);
      else
      {
        console.log(1);
        Articleuser.find({_id:id},function(err,response)
        {
          console.log("forrating"+ response);
          ratingfind=response;
          ratingvalue=parseInt(ratingfind[0].rating);
          ratingvalue  = ratingvalue + parseInt(datacomment.rating);
          console.log("totalrating" + ratingvalue)
          if(err)
            res.send(err);
          else{  
                Articleuser.findByIdAndUpdate(req.params.id, {$set:{rating:ratingvalue}},function(err, response){
                if(err) 
                  res.send(err);
                else
               {
                 console.log(2);
                 console.log(response);

                 Articleuser.find({$and:[{email:email},{approved:1}]},function(err, response){
                  ratingsum=response;
                  console.log("ratingsum" + ratingsum)
                    if(err)
                      res.send(err);
                    else 
                    {  
                      var ratesum=0;
                       for(i=0;i<ratingsum.length;i++)
                         {
                           ratesum=ratesum+ratingsum[i].rating;
                         }
                         console.log("totlaratesum" + ratesum);
                      if(ratesum>20)
                       {
                       console.log(3);
                        Person.findOneAndUpdate({email:email},{$set:{user:"premiumuser"}}, function(err, response)
                        {
                        if(err)
                         res.send(err)
                        else
                        {
                          comment.find(function (err,response2)
                          {
                            if(err)
                             res.send(err)
                             else{
                              var comments1=response2;
                          
                              res.render("articlepost",{article:aftercommentsubmitarticle,heading:aftercommentsubmitsubject,typeuser:req.session.user.user,email:req.session.user.email,usercomments:comments1}) ;
                             }
                          });
                        } 
                       });
                      }
                      else
                      {
                        comment.find(function (err,response2)
                          {
                            if(err)
                             res.send(err)
                             else{
                              var comments1=response2;
                          
                              res.render("articlepost",{article:aftercommentsubmitarticle,heading:aftercommentsubmitsubject,typeuser:req.session.user.user,email:req.session.user.email,usercomments:comments1}) ;
                             }
                          });

                      }
                    }
                    });
                 }
              });
            }
        });
     
      }
  
    });

 });











/*//uplaod sportsmanager files
var storage1 = multer.diskStorage({  
    destination: function (req, file, cb)

   {    
     cb(null, './Uploadssports')  
    },  
    filename: function (req, file, cb)

    {     
   cb(null, Date.now() + Math.random() + path.extname(file.originalname)) 
    }
    }) 

var upload = multer({ storage: storage1 }); 
router.post('/uploadsports', upload.array('upload') , (req, res) =>
{    
try {      
   console.log(req.files); 
  // res.send(req.files);    
   res.render('imgsports',{path:req.files});  
  } catch(error) 
  {          
    console.log(error);       
    res.send(400);  
  } })

  //file uplading sports pug come
 router.get('/uploadsports', function(req, res)
  {
      res.render('uploadmanagersports');
    })*/




         
      
   


 module.exports=router;

