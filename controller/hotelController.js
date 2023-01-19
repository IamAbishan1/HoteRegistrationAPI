const Hotel = require("../model/hotel")
const User = require("../model/user")
const bcrypt = require("bcrypt");
const { customError } = require("../helpers/errorHelper");
const jwt = require("../middlewares/auth")


module.exports = {
    allHotels: async (req,res)=>{
        try{

            const hotels = await Hotel.find();
            if(hotels){
                return res.json({
                    status: "success",
                    data: {
                        hotels: hotels.map((hotel)=>hotel.formatted(req))
                    }
                })
            }
            else{
                return res.json({
                    status: "fail",
                    data: {
                        message: "Something went wrong while fetching hotels."
                    }
                })
            }

        }catch(error){
            return res.json({
                status: "error",
                data: error.toString()
            })
        }
    },

    registerHotel: async(req,res) =>{
        try{

            if(req.jwt.user.isEmployee){


                const hotel = new Hotel({
                    name : req.body.name,
                    location : req.body.location,
                    contact : req.body.contact,
                    stars : req.body.stars ? req.body.stars : 3,
                    totalRooms : req.body.totalRooms,
                    availabeRooms : req.body.totalRooms,
                    images : req.file !== undefined ? req.file.path : undefined,
                    createdBy: req.jwt.user._id
    
                })

                await hotel.save();
    
                return res.status(200).json({
                    status: "success",
                    data: {
                      hotel : hotel.formatted(req)
                    },
                  });
            }
            else{
                return res.status(200).json({
                    status: "fail",
                    data: {
                      message: "Only employee can create a room."
                    },
                  });

            }
            

        }catch(error){
            return res.json({
                status: "error",
                data: error.toString()
            })
        }

    },

}