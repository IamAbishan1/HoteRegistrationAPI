const app = require('../index')
const request = require('supertest')
const conn = require('../controller/userController')
const { default: mongoose } = require('mongoose')
// const { signJwt } = require('./utils/jwt.utils')

const userId = new mongoose.Types.ObjectId().toString();

const userPayload = {
    // _id : userId,
    name: "test1",
    email: "test1@gmail.com",
    phone: "9817100019",
    isEmployee: false
}
const loginData = {
    "email_or_phone": "tester1@gmail.com",
    "password": "password"
}

const userInput = {
    "name": "tester02",
    "email": "tester1@gmail.com",
    "password": "password",
    "phone": "9817100019",
    "confirm_password": "password"
}

describe("POST /users", () => {
    describe("GEt all users", () => {
        test("register a user", async () => {

            
            const response = await request(app)
                .post("/users/register")
                .send(userInput)

            expect(response.body.status).toBe("success")
            console.log(response.body)

        })

        test("Log in user", async () => {


            const response = await request(app)
                .post("/users/login")
                .send(loginData)

            console.log(response.body)


            expect(response.body.status).toBe("success")
            console.log(response.body)
            // expect(response.body.token).toBe()
        })

        test("should respond with a 200 status code", async () => {

            const addMock = jest.spyOn(conn, "register")

            const response = await request(app).get("/users/allUsers").send({

            })
            // console.log("USer",response.body)
            expect(response.body.status).toBe("success")
        })
    })


})

