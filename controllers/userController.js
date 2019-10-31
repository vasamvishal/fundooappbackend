require('dotenv').config();
const service = require('../services/userService');
const mail = require('../util/mail');

class UserController {
    register(req, res) 
    {
        req.check('email','Invalid email').isEmail();
        req.check('password','Invalid password').isLength({ min: 6 }).isAlphanumeric();
        const errors = req.validationErrors();
        if (errors) {
            return res.status(422).json({ errors: errors })
          }

        service.register(req.body, (err, data) => {
            if (err)
            {
                res.status(422).send(err);}
            else
                console.log("register success");
                console.log("registered data",data);
                res.status(200).send(data);
        })
    }
   async isEmail(req,res)
    { 
           var promise=await service.isEmail(req.body);
           console.log("controller",promise);
      if(promise) 
           {
               res.status(200).send(promise);

           }
           else  
           {                
               res.status(422).send(err);
           }
                     
   }

          

    

    login(req,res)
    {
        //console.log(req.body);
        req.check('email','Invalid email').isEmail();
        req.check('password','Invalid password').isLength({ min: 6 }).isAlphanumeric();
        const errors = req.validationErrors();
        if (errors) {
            return res.status(422).json({ errors: errors })
          }
         // console.log(req);
          
       
            console.log(req.body);
            let result={
           
                email:req.body.email,
                password:req.body.password
            }
            console.log(result);
            service.login(result, (err, data) => {
           if(data)
            {
                res.status(200).send(data);

            }
            else
            {                
                res.status(422).send(err);
            }
                      
    })
}

//     forgot(req, res) 
//     {
//         req.check('email','Invalid email').isEmail();
//         const errors = req.validationErrors();
//         if (errors) 
//             return res.status(422).json({ errors: errors });

//         service.forgot(req.body, (err, data) => {
//             if (err)
//                 res.status(422).send(err);
//             else
//             {   
//                 let payload = {email:data.email},
//                 result = mail.generateToken(payload),
//                 req={
//                     id:data._id,
//                     verify_token:result
//                 };
//                 service.update(req,(err,data)=>
//                 {   
//                     if(err)
//                         res.status(422).send(err);
//                     else
//                     { 
//                         console.log(result);
//                         let url = 'http://localhost:3000/#!/reset/'+result;
//                         mail.sendLink(url,payload);
//                         res.status(200).send(data);
//                     }
//                 })
//             }
//         }) 
//     }

//     reset(req, res) 
//     {
//         req.check('password','Invalid password').isLength({ min: 6 }).isAlphanumeric();
//         req.check('password_new','Invalid password').isLength({ min: 6 }).isAlphanumeric();
//         const errors = req.validationErrors();
//         if (errors) 
//             return res.status(422).json({ errors: errors });

//         let result={
//             token:req.body.token,
//             password_old:req.body.password,
//             password_new:req.body.password_new
//         }
//         service.reset(result, (err, data) => {   
//             if (err){
//                 console.log("error in con 99--", err);
                
//                 res.status(422).send(err);
//             }
//             else
//                 res.status(200).send(data);
//         })
//     }
//     getallUsers(req,res)
//     {
//         service.getallUsers(req,(err,data)=>{
//          if(err)
//           res.status(422)(err);
//           else 
//           {
//              res.status(200).send(data);    
//           }
//         })
       
//     }

       
}

module.exports = new UserController();
