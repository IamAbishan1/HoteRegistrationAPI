const mongoose = require("mongoose")
const { pick, formattedImagePath} = require("../helpers/filter")

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    isEmployee: {
      type: Boolean,
      default: false,
    }
},{
  timestamps:true
})

userSchema.methods.formatted = function (req){
    let formattedUser = pick("name","email","phone","address","isEmployee","image")(this)
    if(formattedUser.image) formattedUser.image = formattedImagePath(req, formattedUser.image);
    return formattedUser
}

const User = mongoose.model("User", userSchema);
module.exports = User;
