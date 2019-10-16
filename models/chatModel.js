const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    senderName: {
        type: String,
        required: true
    },
    sender_id:{
        type:String,
        required:true
    },
    receiverName: {
        type: String,
        required: true
    },
    receiver_id:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
});
const Message =  mongoose.model('message',messageSchema);

class chatModel
{
    sendMsg(body,callback)
    {   
        const message = new Message({
            senderName:body.senderName,
            sender_id:body.senderId,
            receiverName:body.receiverName,
            receiver_id:body.receiverId,
            message:body.message
        })
        message.save((err,data)=>
        {
            if(err)
                callback(err)
            else
                callback(null,data)
        })
    }

    getMsg(body,callback)
    {
        Message.find((err,data)=>{
            if(err)
                callback(err)
            else{
                callback(null,data)
            }
                
        })
    }
}

module.exports = new chatModel();