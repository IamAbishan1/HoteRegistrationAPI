const User = require("../model/user")
const bcrypt = require("bcrypt");
const { customError } = require("../helpers/errorHelper");
const jwt = require("../middlewares/auth")
// const singleImageUploadValidation = require("../middlewares/singleImageUploadValidation")



module.exports = {

    register: async (req,res)=>{
        try{

           
            const hashedPassword = bcrypt.hashSync(req.body.password, 10)
            const user = new User({
              name: req.body.name,
              email: req.body.email,
              phone: req.body.phone,
              password: hashedPassword,
              address: req.body.address,
              image: req.file !== undefined ? req.file.path : undefined
            });
        
            await user.save()
    
        return res.status(200).json({
            status: "success",
            data: {
              user: user.formatted(req)
            },
          });
        }catch(error){
            res.status(400).json({
                status: "error",
                message: err.stack,
              });
        }
    
    

    },

    logIn: async(req,res,next) =>{

        
        try{
            const email_or_phone = req.body.email_or_phone
        const isEmail = req.body.email_or_phone.match(/@/);
        
        const user = await User.findOne(isEmail? {email: email_or_phone}: {phone: email_or_phone})
        if(user){
            const passwordMatch = bcrypt.compareSync(req.body.password,user.password)
        
        if(!passwordMatch){
            return res.status(400).json({
                status : "fail",
                data : "Password did match."
            })
        }
        else{
            const accessToken = jwt.generateNewToken({
                userId: user._id
            });

            return res.status(200).json({
                status: "success",
                token: accessToken
            })

        }
            
        }
        else{
            return res.status(400).json({
                status : "fail",
                data : "No user found with given email_or_phone."
            })
        }
            
        }catch(error){
            return res.status(400).json({
                status : "error",
                data : error.toString() 
            })
        }
        },


    allUsers: async(req,res,next) =>{
        try{
            const users = await User.find()
            return res.status(200).json({
                status: "success",
                data: {
                    user: users.map((user) => user.formatted(req))
                }
            })
        }
        catch(error){
            return res.status(400).json({
                status : "error",
                data : error.toString() 
            })
        }
    }

}
