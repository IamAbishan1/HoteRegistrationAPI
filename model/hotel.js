const mongoose = require("mongoose")
const { pick, formattedImagePath} = require("../helpers/filter")


const hotelSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    stars:{
        type: Number,
    },
    images:[{
        type: String
    }],
    totalRooms:{
        type:Number,
        required:true
    },
    availabeRooms:{
        type:Number,
        required:true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{
    timestamps: true
})

hotelSchema.methods.formatted = function (req){
    let formattedhotel = pick("name","location","contact","stars","totalRooms","images","availableRooms","createdBy","createdAt","updatedAt")(this)
    if(formattedhotel.images) formattedhotel.images = formattedImagePath(req, formattedhotel.images);
    return formattedhotel
}
const Hotel = mongoose.model("Hotel",hotelSchema)
module.exports = Hotel;