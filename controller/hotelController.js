const Hotel = require("../model/hotel")
const User = require("../model/user")
const bcrypt = require("bcrypt");
const { customError } = require("../helpers/errorHelper");
const jwt = require("../middlewares/auth")
// const {Parser} = require("json2csv")
const Parser = require("json2csv").Parser


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

    csvFile: async(req,res)=>{
        try{
            const allHotels = await Hotel.find({},"-images").populate({path:"createdBy",select:"-_id -password -createdAt -updatedAt"});
            console.log("HOtels",allHotels)

            // const json2csvParser = new Parser()
            // const csv = json2csvParser.parse(allHotels)

            // console.log("here",csv)
            // res.attachment("hotels.csv")
            // res.status(200).send(csv)
            let csvData = [];
            
            allHotels.forEach((hotel)=>{
                // const { name, location, contact, stars, totalRooms, availabeRooms} = hotel
                // csvData.push(name,location, contact, stars, totalRooms, availabeRooms)
                const {name,location} = hotel
                csvData.push(name,location)
            })

            // const csvFields = ["Name", "Location","Contact","Stars","TotalRooms","AvailableRooms"]
            const csvFields = ["Name","Location"]

            const json2csvParser = new Parser({csvFields})
            console.log("DD",csvData)
            
            const data = json2csvParser.parse(csvData)

            console.log("try")
            res.setHeader("Content-Type","text/csv");
            res.setHeader("Content-Disposition","attachment: filename = hotels.csv")
           
            res.status(200).end(data)
            // return res.json({
            //     status: "success",
            //     data: {
            //         message: "CSV of all hotels data has been downloaded successfully."
            //     }
            // })

            
        }catch(err){
            return res.json({
                message: err.toString()
            })
        }
    }
}