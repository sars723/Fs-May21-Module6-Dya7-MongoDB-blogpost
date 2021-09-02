import express from "express"

import commentModel from './schema.js'
const commentRouter=express.Router()

commentRouter.route("/").get(async(req,res,next)=>{
    try {
        const comments=await commentModel.find({rate:1}).limit(1).skip(1)
        res.send(comments)
    } catch (error) {
        next(error)
    }
})
.post(async(req,res,next)=>{
    try {
        const newComments=new commentModel(req.body)
        await newComments.save()
        res.status(201).send(newComments)
    } catch (error) {
        next(error)
    }
})

commentRouter.route("/:commentId").get(async(req,res,next)=>{
    try {
        const comment=await commentModel.findById(req.params.commentId)
        if(comment){
            res.send(comment)
        }
        else{
            res.status(404).send("not found")
        }
    } catch (error) {
        next(error)
    }
})
.put(async(req,res,next)=>{
    try {
        const modifiedComment=await commentModel.findByIdAndUpdate(req.params.commentId,req.body,{new:true})
        if(modifiedComment){
            res.send(modifiedComment)
        }
        else{
            res.status(404).send("not found")
        }
    } catch (error) {
        next(error)
    }
})
.delete(async(req,res,next)=>{
    try {
        const deletedComment=await commentModel.findByIdAndDelete(req.params.commentId)
        if(deletedComment){
            res.send("deleted")
        }
        else{
            res.status(404).send("deleted")
        }
    } catch (error) {
        next(error)
    }
})

export default commentRouter