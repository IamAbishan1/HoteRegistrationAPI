const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const User = require("../model/user");


mongoose.set("strictQuery", false);

const conn = {
  
        test: {
          uri: process.env.TEST_DATABASE,
          options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          },
        },
        production: {
          uri: process.env.LOCAL_DATABASE,
          options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          },
        },
    
}


const admin = {
    name: "Admin",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("adminBlackTech",10),
    isEmployee: true
};

// const db = mongoose.connect('mongodb://admin:password@localhost:27072', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,

const env = process.env.NODE_ENV || 'production';
// const connString = env === 'test' ? conn.test.uri : conn.production.uri;

let db 
if(env === 'test'){
    db = mongoose.connect(conn.test.uri, conn[env].options)
        .then(()=>{
            console.log(`Connected to ${env} database.`)
        })
        .catch((err)=>{
            console.error(err)
        })
}
else{
    db = mongoose.connect(process.env.LOCAL_DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(async ()=>{
        const user = await User.find();
        if(user.length <=0){
            const user = new User(admin);
            await user.save();
            console.log("Admin user has been created.");
        }
        console.log("Database Connected");
    }).catch(err=>{
        console.log(err);
        console.log("Error connecting database!!!.");
    });
}

module.exports = db;