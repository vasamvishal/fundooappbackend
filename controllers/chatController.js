const chatService = require('../services/chatService')

class chatController{
  
    sendMsgControl(req,callback)
    {
        try
        {
            let msgData = {
                senderId:req.senderId,
                senderName:req.senderName,
                receiverId:req.receiverId,
                receiverName:req.receiverName,
                message:req.message
            }
            let response = {}
            
            chatService.sendMsgService(msgData,(err,data)=>
            {
                if(err)
                {
                    response.success = false;
                    callback(response)
                }
                else
                {
                    response.success = true;
                    response.content = data; 
                    callback(null,response)
                }
            });      
        }
        catch(err){
            return err;
        }
    }
    
    getMsgControl(req,res)
    {
        try
        {
            let response = {};

                chatService.getMsgService(req,(err,data)=>{
                    if(err)
                    {   
                        response.success = false;
                        response.error=err;
                        res.status(422).send(response);
                    }
                    else
                    {
                        response.success = true;
                        response.result=data;
                        res.status(200).send(response);
                    }
                });
        }
        catch(err){
            return err;
        }
    }

}


module.exports = new chatController();