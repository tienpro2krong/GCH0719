
const express = require('express');
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://tienpro2krong:tiento0962@cluster0.mosgc.mongodb.net/test';

app.get('/all',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("GCH0719");
    let results = await dbo.collection("gch0719").find({}).toArray();
    res.render('allSanPham',{sanPham:results});
})

app.get('/insert',async function(req,res){
    res.render('sanpham');
})

app.post('/doInsert',async function (req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("GCH0719");
    let name = req.body.txtName;
    let price = req.body.txtPrice;
    let amount = req.body.txtAmount;
    let description = req.body.txtDescription;
    let newProduct = {name : name, price : price, description:description,amount:amount};
    await dbo.collection("gch0719").insertOne(newProduct);
    console.log(newProduct);
    res.redirect('/all');
});

app.get('/delete',async function(req,res){
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client= await MongoClient.connect(url);
    let dbo = client.db("GCH0719");
    await dbo.collection("gch0719").deleteOne(condition);
    res.redirect('/all');
})
const PORT = process.env.PORT || 5000
var server=app.listen(PORT,function() {
    console.log("Server is running at " + PORT);
})
;