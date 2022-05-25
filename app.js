//jshint esversion:6
 require('dotenv').config()
 const express = require("express");
 const bodyParser = require("body-parser");
 const ejs = require("ejs");
 const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { resolveInclude } = require('ejs');
const saltRounds = 10;



const app = express();

 app.use(express.static("public"));
 app.set('view engine', 'ejs');
 app.use(bodyParser.urlencoded({
     extended:true
 }));

console.log(process.env.SECRET);
 mongoose.connect("mongodb://localhost:27017/userDB");

 const userSchema = new mongoose.Schema({
     email: String,
     password: String
 });

//  const secret = "heyiamsanil";

 const User = new mongoose.model("user",userSchema);

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res)
{    
    bcrypt.hash(req.body.password, saltRounds , function(err,hash){
        const newuser = new User({
            email:req.body.username ,
            password: hash
        });
    
    

    newuser.save(function(err)
    {
        if(!err)
        { console.log("save success");
            res.render("secrets");
        }else{
            console.log(err);
        }
    });});

});


app.post("/login",function(req,res)
{  console.log("enter in login");
    
      User.findOne({email:req.body.username},function(err,founduser)
      {   
          if(err){console.log("sanil");
              console.log(err);}
          else{  
              if(founduser){
                
                  bcrypt.compare(req.body.password,founduser.password,function(err,result){
                    if(result==true){
                        res.render("secrets");
                    }
                   
                  });
            
            }else{console.log("err in founduser");}
          }
      });

});




 app.listen(3000,function(){
  console.log("successfully started server at 3000")
 })