const chatModels = require('../models/chatModel')


class ChatService{

    sendMsgService(msgData,callback){
        
        chatModels.sendMsg(msgData,(err,data)=>
        {
            if(err)
                callback(err)
            else
                callback(null,data)
        })
    }


    getMsgService(req,callback)
    {
                
        chatModels.getMsg(req,(err,data)=>
        {
            if(err)
                callback(err)
            else
                callback(null,data)
                
        });

    }


}

module.exports = new ChatService();