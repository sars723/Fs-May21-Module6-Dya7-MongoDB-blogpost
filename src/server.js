import express from "express"
import cors from "cors"
import listEndPoints from "express-list-endpoints"
import mongoose from "mongoose"
import blogsRouter from "./services/blogs/index.js"

const server=express()

const port=process.env.port||3001

server.use(cors())
server.use(express.json())

server.use("/blogs",blogsRouter)

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
