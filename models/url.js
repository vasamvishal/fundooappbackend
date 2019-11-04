const mongoose=require('mongoose')

const urlschema=new mongoose.Schema({
    urlCode:String,
    longUrl:String,
    shortUrl:String,
    token:String,
    date:{type:String,default:Date.now}

});
module.exports=mongoose.model('Url',urlschema);