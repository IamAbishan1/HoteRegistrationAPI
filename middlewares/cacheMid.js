const nodeCache = require('node-cache')

const cache = new nodeCache();

module.exports = duration => async(req,res,next)=>{

        if(req.method !== 'GET'){
            console.error("Cannot cache non-Get method")
            return next()
        }

        const key = req.originalUrl;
        // console.log("key",key)
        const cachedResponse = cache.get(key)
        // console.log("cha",cachedResponse)
        if (cachedResponse){
            // console.log(`Cache hit for ${key}`)
            res.json(cachedResponse)
        } else{
            // console.log(`Cache miss for ${key}`);
            res.originalSend = res.send;
            res.send = body =>{
                res.originalSend(body)
                cache.set(key,body,duration)
            }
            next()
        }
}
