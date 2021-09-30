import express from "express"
import cors from "cors"
import listEndPoints from "express-list-endpoints"
import mongoose from "mongoose"
import blogsRouter from "./services/blogs/index.js"
import commentsRouter from "./services/comments/index.js"
import authorsRouter from "./services/authors/index.js"
import { unauthorizedHandler, forbiddenHandler, catchAllHandler } from "./errorHandlers.js"
import GoogleStrategy from "./auth/oauth.js"
import passport from "passport"

const server=express()
const port=process.env.port||3001
passport.use("google", GoogleStrategy)

server.use(cors())
server.use(express.json())
server.use(passport.initialize())

server.use("/blogs",blogsRouter)
server.use("/comments",commentsRouter)
server.use("/authors", authorsRouter)

server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(catchAllHandler)

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected",()=>{
    console.log("Sucessfully connected to mongo!")
    server.listen(port,()=>{
        console.table(listEndPoints(server))
        console.log("server is running on port: " , port)
    })
})

mongoose.connection.on("error",err=>{
    console.log("Mongo ERROR", err)
})
