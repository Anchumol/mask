const path = require('path');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const ejs = require('ejs');
const { Console } = require('console');
const app = express()
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use('/images',express.static(__dirname + 'public/images'))
app.use('/css',express.static(__dirname + 'public/css'))
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'mask'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database is Connected!!!')
});

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/register',(req,res)=>{
    res.render('register')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/upload',(req,res)=>{
    res.render('upload')
});
app.get('/webcam',(req,res)=>{
    res.render('webcam')
});

app.get('/main',(req,res)=>{
     res.render('main')
});
app.get('/about',(req,res)=>{
    res.render('about')
});
app.get('/index',(req,res)=>{
    res.render('index')
});

app.post('/uploadIMG',(req,res)=>{
    if (!req.files)
    return res.status(400).send('No files were uploaded.');
    var file = req.files.uploaded_image;
    var  img_name=file.name;
    console.log(img_name);
    if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
    file.mv('public/images/upload_images/'+file.name, function(err) {
        if (err)
        return res.status(500).send(err);
        console.log(img_name);
    })};

    res.render('main',{user:img_name})
})

app.post('/reg',(req,res)=>{
    var name = req.body.uname;
    console.log(name);
    let sql = "INSERT into user SET ?"
    data = {Uname:req.body.uname,password:req.body.pass,email:req.body.mail}
    let query = connection.query(sql,data,(err,result)=>{
    if(err) console.log(err)
    })
    res.render('home')
    })

app.post('/log',(req,res)=>{
    var uid = req.body.mail;
  var pass = req.body.pass;
 connection.query("select * from user where email=? and password=?",[uid,pass],function(error,result,fields){
     if(!!error) console.log(error);
     if(result.length > 0){
     res.render('upload');
    } 
 else{
     res.render('home');
 }            
})

})    


app.listen(4040);