import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//import routes
import restaurantRoutes from "./restaurant_service/routes/restaurant.routes.js"

//use routes
app.use("/api/restaurants" , restaurantRoutes);

export { app }