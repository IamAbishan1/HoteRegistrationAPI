import jwt from "jsonwebtoken";


export function signJwt(data,signOpt){
    return jwt.sign(data,process.env.JWTSECRET)
}

export function verifyJwt(token){
    try{
        const decode = jwt.verify(token,process.env.JWTSECRET)
        return {
            valid:true,
            decode
        }
    }
    catch(err){
        return { valid:false,decoded:null}
    }
    }
   
